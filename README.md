# Fuego+ 🔥

**Cursos bíblicos interactivos para jóvenes, al estilo Duolingo.**

<!-- ⚠️ PENDIENTE: descripción en tus palabras -->
Fuego+ es una app de cursos bíblicos para jóvenes: lecciones cortas con actividades, un recorrido por cada curso, insignias por avanzar y un panel para que los líderes den seguimiento.

> «¿No ardía nuestro corazón…?» — Lucas 24:32

<!-- ⚠️ PENDIENTE: reemplazar por el enlace publicado (Publish en Lovable) y una cuenta de prueba -->
**[Ver la app en vivo](https://ENLACE-PUBLICADO)** · Cuenta de demostración: `correo@demo` / `contraseña`

<!-- ⚠️ PENDIENTE: agregar capturas o un GIF en docs/ y descomentar
![Mapa del curso](docs/mapa-curso.png)
-->

---

## Qué incluye

- **Inicio** con estadísticas del progreso, anuncios y notificaciones.
- **Cursos** con un mapa de recorrido: cada lección se desbloquea al completar la anterior.
- **Lecciones interactivas** (ver abajo), con progreso que se registra en el curso.
- **Insignias** como premio por metas cumplidas.
- **Ajustes**: perfil, contraseña, modo oscuro y preferencias.
- **Panel de administración** para dar seguimiento a estudiantes y cursos.

## Las lecciones

El curso **Fundamentos de la fe** tiene 8 lecciones. La primera ya está desarrollada como experiencia completa:

### Religiones del mundo
Comparación entre el cristianismo y otras religiones mediante tarjetas que se voltean, una pila de tarjetas para deslizar y una actividad de «descartar» la afirmación que no corresponde.

## Detalles de diseño

- **Identidad visual propia:** paleta Fuego+ (violeta, coral, rosa, amarillo, verde y crema) e íconos vectoriales hechos para la app.
- **Arrastrar y soltar real** con mouse y pantallas táctiles (Pointer Events), sin bibliotecas adicionales.
- **Pensado primero para celular.**

## Tecnologías

- **React 19** con **TanStack Start / Router** y **TypeScript**
- **Tailwind CSS 4** y componentes **Radix UI**
- **Supabase**: autenticación, base de datos y progreso de los cursos
- Animaciones con CSS y SVG
- **Vitest** para pruebas
- Construida con **[Lovable](https://lovable.dev)** y desarrollo asistido con IA (Claude)

## Mi rol

<!-- ⚠️ PENDIENTE: ajustar con tu nombre y lo que hiciste -->
**[Tu nombre]**: idea y concepto del producto, contenido bíblico de las lecciones, dirección visual y de experiencia de usuario, definición de cada interacción, pruebas y revisión. El código se generó y se iteró con Lovable y con asistencia de IA, a partir de mis especificaciones.

## Próximos pasos

- [x] Plataforma base, mapa del curso, insignias y administración
- [x] Lección «Religiones del mundo»
- [ ] Las 7 lecciones restantes de *Fundamentos de la fe*: Jesús, Dios, Espíritu Santo, Pecado, Salvación, Oración e Iglesia
- [ ] Más cursos

## Ejecutar en local

Necesitas Node.js y npm.

```sh
git clone https://github.com/jpicadocorrales-png/fuego-youth-path.git
cd fuego-youth-path
npm install
npm run dev
```

El proyecto también se puede editar desde el [editor de Lovable](https://lovable.dev/projects/60ed0432-2e22-47b7-9510-a167f256003d); los cambios se sincronizan con este repositorio.
