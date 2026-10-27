// Contenido de la lección de Jesús (experiencias 1 y 2).

export type Prophecy = {
  id: string;
  ot: { ref: string; text: string };
  nt: { ref: string; text: string };
};

export const PROPHECIES: Prophecy[] = [
  {
    id: "belen",
    ot: { ref: "Miqueas 5:2", text: "Un gobernante de Israel saldría de Belén." },
    nt: { ref: "Lucas 2:4-7", text: "Jesús nace en Belén, la ciudad de David." },
  },
  {
    id: "virgen",
    ot: { ref: "Isaías 7:14", text: "Una virgen concebirá y dará a luz un hijo." },
    nt: { ref: "Mateo 1:22-23", text: "María concibe por obra del Espíritu Santo." },
  },
  {
    id: "asno",
    ot: { ref: "Zacarías 9:9", text: "Un rey humilde entraría montado en un asno." },
    nt: { ref: "Mateo 21:4-5", text: "Jesús entra a Jerusalén montado en un asno." },
  },
  {
    id: "monedas",
    ot: { ref: "Zacarías 11:12", text: "Su precio sería de treinta monedas de plata." },
    nt: { ref: "Mateo 26:15", text: "Judas acuerda entregarlo por treinta monedas de plata." },
  },
  {
    id: "vestidos",
    ot: { ref: "Salmo 22:18", text: "Repartirían sus vestidos y echarían suertes sobre su ropa." },
    nt: { ref: "Juan 19:23-24", text: "Los soldados echan suertes sobre su túnica." },
  },
  {
    id: "huesos",
    ot: { ref: "Salmo 34:20", text: "Ninguno de sus huesos sería quebrado." },
    nt: { ref: "Juan 19:33-36", text: "Al morir Jesús, no le quiebran los huesos." },
  },
  {
    id: "resurreccion",
    ot: { ref: "Salmo 16:10", text: "Dios no dejaría a su santo ver corrupción." },
    nt: { ref: "Hechos 2:31", text: "Pedro proclama la resurrección de Jesús." },
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
