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

export type IAmStatement = {
  id: string;
  statement: string;
  ref: string;
  meaning: string;
  reflection: string;
};

export const I_AM_STATEMENTS: IAmStatement[] = [
  {
    id: "pan",
    statement: "Yo soy el pan de vida",
    ref: "Juan 6:35",
    meaning: "Como el pan sostiene el cuerpo, Jesús sostiene la vida espiritual.",
    reflection: "¿De qué dependes hoy para sentirte con vida por dentro?",
  },
  {
    id: "luz",
    statement: "Yo soy la luz del mundo",
    ref: "Juan 8:12",
    meaning: "La luz revela el camino y disipa la oscuridad.",
    reflection: "¿En qué área de tu vida necesitas claridad?",
  },
  {
    id: "puerta",
    statement: "Yo soy la puerta",
    ref: "Juan 10:7, 9",
    meaning: "Jesús es el acceso a la salvación y a una vida protegida.",
    reflection: "¿Qué te impide entrar por esa puerta?",
  },
  {
    id: "pastor",
    statement: "Yo soy el buen pastor",
    ref: "Juan 10:11, 14",
    meaning: "El pastor cuida y da su vida por las ovejas, y conoce a cada una.",
    reflection: "¿Cómo se ve, en tu día a día, que Jesús te conoce?",
  },
  {
    id: "resurreccion",
    statement: "Yo soy la resurrección y la vida",
    ref: "Juan 11:25",
    meaning: "Jesús vence la muerte y ofrece una vida que no termina.",
    reflection: "¿Qué esperanza te da saber que la muerte no tiene la última palabra?",
  },
  {
    id: "camino",
    statement: "Yo soy el camino, la verdad y la vida",
    ref: "Juan 14:6",
    meaning: "Jesús es el único camino para llegar al Padre.",
    reflection: "¿Qué decisión necesitas tomar siguiendo su camino?",
  },
  {
    id: "vid",
    statement: "Yo soy la vid verdadera",
    ref: "Juan 15:1, 5",
    meaning: "Las ramas dan fruto solo si permanecen unidas a la vid.",
    reflection: "¿Qué tan unido estás a Jesús en tu rutina diaria?",
  },
];

export const I_AM_REVELATION = {
  ref: "Juan 8:58",
  text: "Antes que Abraham fuese, yo soy.",
};
