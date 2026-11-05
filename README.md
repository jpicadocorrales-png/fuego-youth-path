# Fuego+ 🔥

**Cursos bíblicos interactivos para jóvenes, al estilo Duolingo.**

Fuego+ acompaña a los jóvenes en sus primeros pasos en la fe con lecciones cortas, visuales y participativas, donde cada enseñanza bíblica se vive antes de leerse. Los líderes pueden acompañar el avance de cada joven a lo largo del camino.

> «¿No ardía nuestro corazón…?» — Lucas 24:32

<!-- ⚠️ PENDIENTE: reemplazar por el enlace publicado (Publish en Lovable) y una cuenta de prueba -->
**[Ver la app en vivo](https://ENLACE-PUBLICADO)** · Cuenta de demostración: `correo@demo` / `contraseña`

<!-- ⚠️ PENDIENTE: agregar capturas o un GIF en docs/ y descomentar
![Mapa del curso](docs/mapa-curso.png)
![Lección de Jesús: la piedra de la tumba](docs/leccion-jesus.gif)
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

El curso **Fundamentos de la fe** tiene 8 lecciones. Dos ya están desarrolladas como experiencias completas:

### Religiones del mundo
Comparación entre el cristianismo y otras religiones mediante tarjetas que se voltean, una pila de tarjetas para deslizar y una actividad de «descartar» la afirmación que no corresponde.

### Jesús
Dos experiencias, cada una de siete pantallas:

- **El rollo de las profecías.** Un pergamino se despliega con una profecía del Antiguo Testamento; el usuario arrastra el símbolo correcto (ciudad con estrella, burro, treinta monedas…) y el rollo se transforma en la ilustración de su cumplimiento en el Nuevo Testamento.
- **¿Qué dijo Jesús de sí mismo?** Las siete declaraciones «YO SOY», cada una con una mecánica distinta:

  | Declaración | Interacción |
  |---|---|
  | El pan de vida | Llevar tres piezas de pan a un plato vacío |
  | La luz del mundo | Iluminar un sendero oscuro con una lámpara |
  | La puerta | Deslizar el cerrojo y abrir la puerta |
  | El buen pastor | Guiar a la oveja perdida de vuelta al rebaño |
  | La resurrección y la vida | Rodar la piedra de la tumba |
  | El camino, la verdad y la vida | Reconstruir el camino pieza por pieza |
  | La vid verdadera | Conectar ramas que florecen y dan uvas |

Las declaraciones bíblicas aparecen solo después de completar cada escena, y se puede avanzar, retroceder y repetir cualquier experiencia.

## Detalles de diseño y accesibilidad

- **Identidad visual propia:** paleta Fuego+ (violeta, coral, rosa, amarillo, verde y crema) e ilustraciones vectoriales hechas para la app, sin emojis ni imágenes de stock en las lecciones.
- **Arrastrar y soltar real** con mouse y pantallas táctiles (Pointer Events), sin bibliotecas adicionales.
- **Alternativa sin arrastrar:** todo se puede resolver tocando o con el teclado.
- **Movimiento reducido:** si el sistema lo pide, las animaciones se omiten y cada escena muestra su estado final.
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
- [x] Lección «Jesús»: profecías cumplidas y declaraciones «YO SOY»
- [ ] Las 6 lecciones restantes de *Fundamentos de la fe*: Dios, Espíritu Santo, Pecado, Salvación, Oración e Iglesia
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
