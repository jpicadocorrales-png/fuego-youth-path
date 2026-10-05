
create type public.app_role as enum ('admin','user');

create table public.profiles (
  id uuid primary key,
  display_name text not null default 'Joven',
  avatar_emoji text not null default '🦁',
  xp int not null default 0,
  streak int not null default 0,
  last_activity_date date,
  daily_goal int not null default 1,
  sound_enabled boolean not null default true,
  email_notifications boolean not null default true,
  created_at timestamptz not null default now()
);
grant select on public.profiles to authenticated;
grant update (display_name, avatar_emoji, daily_goal, sound_enabled, email_notifications) on public.profiles to authenticated;
grant all on public.profiles to service_role;
alter table public.profiles enable row level security;

create table public.user_roles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null,
  role app_role not null,
  unique(user_id, role)
);
grant select on public.user_roles to authenticated;
grant all on public.user_roles to service_role;
alter table public.user_roles enable row level security;

create or replace function public.has_role(_user_id uuid, _role app_role)
returns boolean language sql stable security definer set search_path = public as $$
  select exists (select 1 from public.user_roles where user_id = _user_id and role = _role)
$$;

create policy "own roles" on public.user_roles for select to authenticated using (user_id = auth.uid() or public.has_role(auth.uid(),'admin'));
create policy "own profile" on public.profiles for select to authenticated using (id = auth.uid() or public.has_role(auth.uid(),'admin'));
create policy "update own profile" on public.profiles for update to authenticated using (id = auth.uid()) with check (id = auth.uid());

create table public.courses (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text not null default '',
  emoji text not null default '📖',
  color text not null default 'sky',
  level text not null default 'Principiante',
  order_index int not null default 0,
  created_at timestamptz not null default now()
);
create table public.lessons (
  id uuid primary key default gen_random_uuid(),
  course_id uuid not null references public.courses(id) on delete cascade,
  title text not null,
  passage text not null default '',
  reference text not null default '',
  xp int not null default 10,
  order_index int not null default 0
);
create table public.questions (
  id uuid primary key default gen_random_uuid(),
  lesson_id uuid not null references public.lessons(id) on delete cascade,
  kind text not null default 'multiple',
  prompt text not null,
  options jsonb not null default '[]',
  correct_index int not null default 0,
  order_index int not null default 0
);
create table public.badges (
  id uuid primary key default gen_random_uuid(),
  code text not null unique,
  name text not null,
  description text not null,
  emoji text not null,
  kind text not null,
  threshold int not null
);
create table public.announcements (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  body text not null,
  created_at timestamptz not null default now()
);
do $$ declare t text; begin
  foreach t in array array['courses','lessons','questions','badges','announcements'] loop
    execute format('grant select, insert, update, delete on public.%I to authenticated', t);
    execute format('grant all on public.%I to service_role', t);
    execute format('alter table public.%I enable row level security', t);
    execute format('create policy "read %1$s" on public.%1$I for select to authenticated using (true)', t);
    execute format('create policy "admin write %1$s" on public.%1$I for all to authenticated using (public.has_role(auth.uid(),''admin'')) with check (public.has_role(auth.uid(),''admin''))', t);
  end loop;
end $$;

create table public.lesson_completions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null default auth.uid(),
  lesson_id uuid not null references public.lessons(id) on delete cascade,
  course_id uuid not null references public.courses(id) on delete cascade,
  score int not null default 0,
  completed_at timestamptz not null default now(),
  unique(user_id, lesson_id)
);
grant select, insert on public.lesson_completions to authenticated;
grant all on public.lesson_completions to service_role;
alter table public.lesson_completions enable row level security;
create policy "read completions" on public.lesson_completions for select to authenticated using (user_id = auth.uid() or public.has_role(auth.uid(),'admin'));
create policy "insert own completion" on public.lesson_completions for insert to authenticated with check (user_id = auth.uid());

create table public.user_badges (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null,
  badge_id uuid not null references public.badges(id) on delete cascade,
  earned_at timestamptz not null default now(),
  unique(user_id, badge_id)
);
grant select on public.user_badges to authenticated;
grant all on public.user_badges to service_role;
alter table public.user_badges enable row level security;
create policy "read badges" on public.user_badges for select to authenticated using (user_id = auth.uid() or public.has_role(auth.uid(),'admin'));

create table public.notifications (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null,
  title text not null,
  body text not null default '',
  read boolean not null default false,
  created_at timestamptz not null default now()
);
grant select on public.notifications to authenticated;
grant update (read) on public.notifications to authenticated;
grant all on public.notifications to service_role;
alter table public.notifications enable row level security;
create policy "own notifs" on public.notifications for select to authenticated using (user_id = auth.uid());
create policy "update own notifs" on public.notifications for update to authenticated using (user_id = auth.uid()) with check (user_id = auth.uid());

-- New user: profile, role (first user = admin), welcome notification
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (id, display_name)
  values (new.id, coalesce(new.raw_user_meta_data->>'display_name', new.raw_user_meta_data->>'full_name', split_part(new.email,'@',1)));
  if not exists (select 1 from public.user_roles where role = 'admin') then
    insert into public.user_roles (user_id, role) values (new.id, 'admin');
  end if;
  insert into public.user_roles (user_id, role) values (new.id, 'user');
  insert into public.notifications (user_id, title, body) values (new.id, '¡Bienvenido! 🎉', 'Empieza tu primer curso y gana tu primera insignia.');
  return new;
end $$;
create trigger on_auth_user_created after insert on auth.users for each row execute function public.handle_new_user();

-- Completion: xp, streak, badges, notifications
create or replace function public.handle_completion()
returns trigger language plpgsql security definer set search_path = public as $$
declare
  p public.profiles%rowtype;
  lesson_xp int;
  total_lessons int;
  courses_done int;
  b record;
  metric int;
begin
  select xp into lesson_xp from public.lessons where id = new.lesson_id;
  select * into p from public.profiles where id = new.user_id;
  update public.profiles set
    xp = xp + coalesce(lesson_xp,10),
    streak = case
      when last_activity_date = current_date then streak
      when last_activity_date = current_date - 1 then streak + 1
      else 1 end,
    last_activity_date = current_date
  where id = new.user_id
  returning * into p;

  select count(*) into total_lessons from public.lesson_completions where user_id = new.user_id;
  select count(*) into courses_done from public.courses c
   where exists (select 1 from public.lessons l where l.course_id = c.id)
     and not exists (select 1 from public.lessons l where l.course_id = c.id
       and not exists (select 1 from public.lesson_completions lc where lc.lesson_id = l.id and lc.user_id = new.user_id));

  for b in select * from public.badges where id not in (select badge_id from public.user_badges where user_id = new.user_id) loop
    metric := case b.kind when 'lessons' then total_lessons when 'xp' then p.xp when 'streak' then p.streak when 'courses' then courses_done when 'perfect' then (case when new.score >= 100 then 1 else 0 end) else 0 end;
    if metric >= b.threshold then
      insert into public.user_badges (user_id, badge_id) values (new.user_id, b.id) on conflict do nothing;
      insert into public.notifications (user_id, title, body) values (new.user_id, 'Nueva insignia: ' || b.name || ' ' || b.emoji, b.description);
    end if;
  end loop;
  return new;
end $$;
create trigger on_completion after insert on public.lesson_completions for each row execute function public.handle_completion();

-- Seed badges
insert into public.badges (code,name,description,emoji,kind,threshold) values
('first','Primer paso','Completaste tu primera lección','🌱','lessons',1),
('five','Lector constante','Completaste 5 lecciones','📚','lessons',5),
('ten','Discípulo','Completaste 10 lecciones','🕊️','lessons',10),
('xp100','100 XP','Alcanzaste 100 puntos de experiencia','⚡','xp',100),
('xp300','Llama encendida','Alcanzaste 300 XP','🔥','xp',300),
('streak3','Racha de 3 días','Estudiaste 3 días seguidos','🌟','streak',3),
('streak7','Semana fiel','Estudiaste 7 días seguidos','👑','streak',7),
('course1','Curso completo','Terminaste un curso entero','🏆','courses',1),
('perfect','Perfecto','Lección sin errores','💎','perfect',1);

insert into public.announcements (title, body) values
('¡Bienvenidos a la app!', 'Cada semana publicaremos nuevos cursos. ¡Mantén tu racha!'),
('Reto del mes', 'Completa el curso "Vida de Jesús" este mes y gana una sorpresa en el grupo de jóvenes.');

-- Seed courses, lessons, questions
do $$
declare c1 uuid; c2 uuid; c3 uuid; c4 uuid; l uuid;
begin
  insert into public.courses (title,description,emoji,color,level,order_index) values
   ('Creación y Génesis','Descubre cómo empezó todo: la creación, Adán y Eva, Noé y Abraham.','🌍','green','Principiante',1) returning id into c1;
  insert into public.courses (title,description,emoji,color,level,order_index) values
   ('Vida de Jesús','Nacimiento, milagros, enseñanzas y resurrección de Jesús.','✝️','sky','Principiante',2) returning id into c2;
  insert into public.courses (title,description,emoji,color,level,order_index) values
   ('Héroes de la fe','David, Ester, Daniel y otros que confiaron en Dios.','🛡️','orange','Intermedio',3) returning id into c3;
  insert into public.courses (title,description,emoji,color,level,order_index) values
   ('Frutos del Espíritu','Amor, gozo, paz y más: cómo vivirlos hoy.','🍇','pink','Intermedio',4) returning id into c4;

  -- c1
  insert into public.lessons (course_id,title,passage,reference,order_index) values (c1,'En el principio','En el principio creó Dios los cielos y la tierra.','Génesis 1:1',1) returning id into l;
  insert into public.questions (lesson_id,kind,prompt,options,correct_index,order_index) values
   (l,'multiple','¿Qué creó Dios en el principio?','["Los cielos y la tierra","Solo el mar","Los animales"]',0,1),
   (l,'fill','En el principio creó Dios los ___ y la tierra.','["mares","cielos","árboles"]',1,2),
   (l,'truefalse','Dios descansó el séptimo día.','["Verdadero","Falso"]',0,3);
  insert into public.lessons (course_id,title,passage,reference,order_index) values (c1,'Noé y el arca','Noé halló gracia ante los ojos de Dios.','Génesis 6:8',2) returning id into l;
  insert into public.questions (lesson_id,kind,prompt,options,correct_index,order_index) values
   (l,'multiple','¿Qué construyó Noé?','["Una torre","Un arca","Un templo"]',1,1),
   (l,'truefalse','Dios puso un arcoíris como señal de su pacto.','["Verdadero","Falso"]',0,2),
   (l,'fill','Noé halló ___ ante los ojos de Dios.','["gracia","oro","fuerza"]',0,3);
  insert into public.lessons (course_id,title,passage,reference,order_index) values (c1,'El llamado de Abraham','Vete de tu tierra... y haré de ti una nación grande.','Génesis 12:1-2',3) returning id into l;
  insert into public.questions (lesson_id,kind,prompt,options,correct_index,order_index) values
   (l,'multiple','¿Qué le prometió Dios a Abraham?','["Riquezas","Una nación grande","Un palacio"]',1,1),
   (l,'truefalse','Abraham obedeció y salió de su tierra.','["Verdadero","Falso"]',0,2);

  -- c2
  insert into public.lessons (course_id,title,passage,reference,order_index) values (c2,'Nacimiento en Belén','Os ha nacido hoy, en la ciudad de David, un Salvador.','Lucas 2:11',1) returning id into l;
  insert into public.questions (lesson_id,kind,prompt,options,correct_index,order_index) values
   (l,'multiple','¿Dónde nació Jesús?','["Nazaret","Jerusalén","Belén"]',2,1),
   (l,'fill','Os ha nacido hoy un ___.','["Rey","Salvador","Profeta"]',1,2),
   (l,'truefalse','Los pastores visitaron a Jesús.','["Verdadero","Falso"]',0,3);
  insert into public.lessons (course_id,title,passage,reference,order_index) values (c2,'Milagros','Jesús tomó los cinco panes y los dos peces.','Juan 6:11',2) returning id into l;
  insert into public.questions (lesson_id,kind,prompt,options,correct_index,order_index) values
   (l,'multiple','¿Cuántos panes multiplicó Jesús?','["Tres","Cinco","Siete"]',1,1),
   (l,'truefalse','Jesús convirtió el agua en vino en Caná.','["Verdadero","Falso"]',0,2);
  insert into public.lessons (course_id,title,passage,reference,order_index) values (c2,'El Sermón del Monte','Bienaventurados los de limpio corazón, porque ellos verán a Dios.','Mateo 5:8',3) returning id into l;
  insert into public.questions (lesson_id,kind,prompt,options,correct_index,order_index) values
   (l,'fill','Bienaventurados los de limpio ___.','["corazón","camino","pensamiento"]',0,1),
   (l,'multiple','¿Qué verán los de limpio corazón?','["El cielo","A Dios","Ángeles"]',1,2);
  insert into public.lessons (course_id,title,passage,reference,order_index) values (c2,'¡Resucitó!','No está aquí, pues ha resucitado, como dijo.','Mateo 28:6',4) returning id into l;
  insert into public.questions (lesson_id,kind,prompt,options,correct_index,order_index) values
   (l,'multiple','¿Al cuántos días resucitó Jesús?','["Al primero","Al tercero","Al séptimo"]',1,1),
   (l,'truefalse','La tumba estaba vacía.','["Verdadero","Falso"]',0,2);

  -- c3
  insert into public.lessons (course_id,title,passage,reference,order_index) values (c3,'David y Goliat','Tú vienes a mí con espada... mas yo vengo a ti en el nombre del Señor.','1 Samuel 17:45',1) returning id into l;
  insert into public.questions (lesson_id,kind,prompt,options,correct_index,order_index) values
   (l,'multiple','¿Con qué venció David a Goliat?','["Una espada","Una honda y piedra","Una lanza"]',1,1),
   (l,'truefalse','David era el hermano mayor.','["Verdadero","Falso"]',1,2);
  insert into public.lessons (course_id,title,passage,reference,order_index) values (c3,'Daniel en el foso','Mi Dios envió su ángel, el cual cerró la boca de los leones.','Daniel 6:22',2) returning id into l;
  insert into public.questions (lesson_id,kind,prompt,options,correct_index,order_index) values
   (l,'fill','Dios cerró la boca de los ___.','["osos","leones","lobos"]',1,1),
   (l,'truefalse','Daniel dejó de orar por miedo.','["Verdadero","Falso"]',1,2);

  -- c4
  insert into public.lessons (course_id,title,passage,reference,order_index) values (c4,'Amor, gozo y paz','Mas el fruto del Espíritu es amor, gozo, paz...','Gálatas 5:22',1) returning id into l;
  insert into public.questions (lesson_id,kind,prompt,options,correct_index,order_index) values
   (l,'multiple','¿Cuál es el primer fruto mencionado?','["Paz","Amor","Paciencia"]',1,1),
   (l,'fill','El fruto del Espíritu es amor, ___, paz.','["gozo","fe","poder"]',0,2);
  insert into public.lessons (course_id,title,passage,reference,order_index) values (c4,'Paciencia y bondad','El amor es sufrido, es benigno.','1 Corintios 13:4',2) returning id into l;
  insert into public.questions (lesson_id,kind,prompt,options,correct_index,order_index) values
   (l,'truefalse','El amor es sufrido y benigno.','["Verdadero","Falso"]',0,1),
   (l,'multiple','¿Dónde está el capítulo del amor?','["Juan 3","1 Corintios 13","Salmo 23"]',1,2);
end $$;
