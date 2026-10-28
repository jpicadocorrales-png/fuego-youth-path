// Contenido de la lección de Jesús (experiencias 1 y 2).

export type SymbolId =
  | "city-star" | "crown-throne" | "boat"
  | "mother-baby" | "man-sword" | "temple"
  | "horse" | "donkey" | "camel"
  | "coins" | "gold-crown" | "chest"
  | "cross" | "throne" | "sword"
  | "tunic" | "scroll" | "jar"
  | "open-tomb" | "closed-tomb" | "hourglass";

export type Prophecy = {
  id: string;
  title: string;
  ot: { ref: string; text: string; highlight?: string };
  prompt: string;
  options: { id: SymbolId; label: string }[];
  correct: SymbolId;
  nt: { ref: string; text: string };
  button: string;
};

// Experiencia 1: «El rollo de las profecías». Textos y referencias tal como fueron definidos.
export const PROPHECIES: Prophecy[] = [
  {
    id: "belen",
    title: "El lugar prometido",
    ot: {
      ref: "Miqueas 5:2",
      text: "Pero tú, Belén Efrata, pequeña para estar entre las familias de Judá, de ti me saldrá el que será Señor en Israel.",
      highlight: "Belén",
    },
    prompt: "¿Qué símbolo representa el lugar donde nacería el Mesías?",
    options: [
      { id: "city-star", label: "Ciudad con estrella" },
      { id: "crown-throne", label: "Corona y trono" },
      { id: "boat", label: "Barco" },
    ],
    correct: "city-star",
    nt: {
      ref: "Lucas 2:4–7",
      text: "Siglos después, Jesús nació en Belén, exactamente en la ciudad anunciada por el profeta Miqueas.",
    },
    button: "Siguiente profecía",
  },
  {
    id: "virgen",
    title: "El nacimiento anunciado",
    ot: {
      ref: "Isaías 7:14",
      text: "He aquí que la virgen concebirá, y dará a luz un hijo, y llamará su nombre Emanuel.",
    },
    prompt: "¿Qué señal anunció el profeta?",
    options: [
      { id: "mother-baby", label: "Madre con su bebé" },
      { id: "man-sword", label: "Hombre con espada" },
      { id: "temple", label: "Templo" },
    ],
    correct: "mother-baby",
    nt: {
      ref: "Mateo 1:22–23",
      text: "Mateo presenta el nacimiento de Jesús de María, por obra del Espíritu Santo, como el cumplimiento de esta señal. Emanuel significa: Dios con nosotros.",
    },
    button: "Siguiente profecía",
  },
  {
    id: "rey",
    title: "El Rey que llegaría humildemente",
    ot: {
      ref: "Zacarías 9:9",
      text: "He aquí tu rey vendrá a ti, justo y salvador, humilde, y cabalgando sobre un asno.",
    },
    prompt: "¿Sobre qué animal entraría el Rey prometido?",
    options: [
      { id: "horse", label: "Caballo" },
      { id: "donkey", label: "Burro" },
      { id: "camel", label: "Camello" },
    ],
    correct: "donkey",
    nt: {
      ref: "Mateo 21:4–9",
      text: "Jesús entró a Jerusalén montado sobre un burro, cumpliendo la imagen del Rey humilde anunciada por Zacarías.",
    },
    button: "Siguiente profecía",
  },
  {
    id: "monedas",
    title: "El precio de la traición",
    ot: {
      ref: "Zacarías 11:12–13",
      text: "Y pesaron por mi salario treinta piezas de plata.",
    },
    prompt: "¿Qué símbolo representa el precio mencionado en la profecía?",
    options: [
      { id: "coins", label: "30 monedas de plata" },
      { id: "gold-crown", label: "Corona de oro" },
      { id: "chest", label: "Cofre con joyas" },
    ],
    correct: "coins",
    nt: {
      ref: "Mateo 26:14–16; 27:3–10",
      text: "Judas acordó entregar a Jesús por treinta piezas de plata. Mateo también relaciona el destino posterior de ese dinero con el testimonio profético.",
    },
    button: "Siguiente profecía",
  },
  {
    id: "siervo",
    title: "El siervo que sufrió por nosotros",
    ot: {
      ref: "Isaías 53:5",
      text: "Mas él herido fue por nuestras rebeliones, molido por nuestros pecados; el castigo de nuestra paz fue sobre él.",
    },
    prompt: "¿Qué símbolo representa el sacrificio del Siervo anunciado?",
    options: [
      { id: "cross", label: "Cruz" },
      { id: "throne", label: "Trono" },
      { id: "sword", label: "Espada" },
    ],
    correct: "cross",
    nt: {
      ref: "1 Pedro 2:24",
      text: "Jesús llevó nuestros pecados en su cuerpo sobre el madero. El Nuevo Testamento presenta su sufrimiento como cumplimiento de lo anunciado por Isaías.",
    },
    button: "Siguiente profecía",
  },
  {
    id: "vestidos",
    title: "Sus vestiduras serían repartidas",
    ot: {
      ref: "Salmo 22:18",
      text: "Repartieron entre sí mis vestidos, y sobre mi ropa echaron suertes.",
    },
    prompt: "¿Qué objeto aparece en esta profecía?",
    options: [
      { id: "tunic", label: "Túnica" },
      { id: "scroll", label: "Rollo de escritura" },
      { id: "jar", label: "Vasija" },
    ],
    correct: "tunic",
    nt: {
      ref: "Juan 19:23–24",
      text: "Los soldados repartieron las vestiduras de Jesús y echaron suertes sobre su túnica. Juan señala expresamente el cumplimiento de la Escritura.",
    },
    button: "Siguiente profecía",
  },
  {
    id: "resurreccion",
    title: "La muerte no tendría la última palabra",
    ot: {
      ref: "Salmo 16:10",
      text: "Porque no dejarás mi alma en el Seol, ni permitirás que tu santo vea corrupción.",
    },
    prompt: "¿Qué símbolo representa la victoria sobre la muerte?",
    options: [
      { id: "open-tomb", label: "Tumba abierta con luz" },
      { id: "closed-tomb", label: "Tumba cerrada" },
      { id: "hourglass", label: "Reloj de arena" },
    ],
    correct: "open-tomb",
    nt: {
      ref: "Hechos 2:25–32",
      text: "Pedro explica que David habló proféticamente de la resurrección de Cristo. Jesús no permaneció en la muerte: Dios lo resucitó.",
    },
    button: "Descubrir el significado",
  },
];

export type IAmId = "pan" | "luz" | "puerta" | "pastor" | "resurreccion" | "camino" | "vid";

export type IAmDeclaration = {
  id: IAmId;
  instruction: string;
  statement: string;
  quote: string;
  ref: string;
  explanation: string;
  button: string;
};

// Experiencia 2: «¿Qué dijo Jesús de sí mismo?». Textos y referencias tal como fueron definidos.
export const I_AM_DECLARATIONS: IAmDeclaration[] = [
  {
    id: "pan",
    instruction: "Hay un lugar vacío en la mesa. ¿Puedes llenarlo?",
    statement: "YO SOY EL PAN DE VIDA",
    quote: "El que a mí viene, nunca tendrá hambre; y el que en mí cree, no tendrá sed jamás.",
    ref: "Juan 6:35",
    explanation:
      "Así como el pan alimenta nuestro cuerpo, Jesús es quien satisface nuestra necesidad espiritual. Él no ofrece una satisfacción temporal, sino vida verdadera.",
    button: "Continuar",
  },
  {
    id: "luz",
    instruction: "Hay un camino frente a ti, pero no puedes verlo. Ilumina el camino.",
    statement: "YO SOY LA LUZ DEL MUNDO",
    quote: "El que me sigue, no andará en tinieblas, sino que tendrá la luz de la vida.",
    ref: "Juan 8:12",
    explanation:
      "Jesús no solamente nos muestra por dónde caminar. Él mismo es la luz que vence las tinieblas y nos guía hacia la vida.",
    button: "Continuar",
  },
  {
    id: "puerta",
    instruction: "Hay una puerta frente a ti. Descubre qué hay al otro lado.",
    statement: "YO SOY LA PUERTA",
    quote: "El que por mí entrare, será salvo; y entrará, y saldrá, y hallará pastos.",
    ref: "Juan 10:9",
    explanation:
      "Jesús se presenta como la puerta de salvación. Por medio de Él encontramos acceso a la vida y a la seguridad de pertenecer a su rebaño.",
    button: "Continuar",
  },
  {
    id: "pastor",
    instruction: "Una oveja se ha separado del rebaño. Ayúdala a regresar.",
    statement: "YO SOY EL BUEN PASTOR",
    quote: "El buen pastor su vida da por las ovejas.",
    ref: "Juan 10:11",
    explanation:
      "Jesús no es un pastor distante. Conoce a sus ovejas, las cuida y las ama hasta el punto de entregar su propia vida por ellas.",
    button: "Continuar",
  },
  {
    id: "resurreccion",
    instruction: "Una piedra cubre la entrada. Muévela para descubrir lo que hay detrás.",
    statement: "YO SOY LA RESURRECCIÓN Y LA VIDA",
    quote: "El que cree en mí, aunque esté muerto, vivirá.",
    ref: "Juan 11:25",
    explanation:
      "Jesús tiene autoridad sobre la muerte. Estas palabras fueron pronunciadas antes de resucitar a Lázaro y anticipan la victoria definitiva que se manifiesta en su propia resurrección.",
    button: "Continuar",
  },
  {
    id: "camino",
    instruction: "El camino está incompleto. Reconstrúyelo para poder avanzar.",
    statement: "YO SOY EL CAMINO, Y LA VERDAD, Y LA VIDA",
    quote: "Nadie viene al Padre, sino por mí.",
    ref: "Juan 14:6",
    explanation:
      "Jesús no dijo que conocía uno de los caminos hacia Dios. Declaró que Él mismo es el camino, la verdad y la vida. Por medio de Él tenemos acceso al Padre.",
    button: "Continuar",
  },
  {
    id: "vid",
    instruction: "Estas ramas están separadas de la vid. Conéctalas para que puedan dar fruto.",
    statement: "YO SOY LA VID VERDADERA",
    quote:
      "El que permanece en mí, y yo en él, éste lleva mucho fruto; porque separados de mí nada podéis hacer.",
    ref: "Juan 15:5",
    explanation:
      "Así como una rama no puede producir fruto separada de la vid, nuestra vida espiritual depende de permanecer unidos a Jesús. Él es la fuente de nuestra vida y crecimiento.",
    button: "Descubrir el significado",
  },
];

export const I_AM_REVELATION = {
  ref: "Juan 8:58",
  text: "Antes que Abraham fuese, yo soy.",
};

export const I_AM_EXODUS = {
  ref: "Éxodo 3:14",
  text: "YO SOY EL QUE SOY.",
};
