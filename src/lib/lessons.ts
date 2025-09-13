export type Exercise = {
  id: number;
  type: 'phrase' | 'syllable';
  content: string;
};

export type Lesson = {
  id: number;
  title: string;
  exercises: Exercise[];
};

export const lessons: Lesson[] = [
  {
    id: 1,
    title: 'Lição 1: Saudações',
    exercises: [
      { id: 1, type: 'phrase', content: 'Olá, como vai você?' },
      { id: 2, type: 'phrase', content: 'Bom dia' },
      { id: 3, type: 'phrase', content: 'Boa tarde' },
      { id: 4, type: 'phrase', content: 'Boa noite' },
      { id: 5, type: 'phrase', content: 'Até logo' },
    ],
  },
  {
    id: 2,
    title: 'Lição 2: Comida',
    exercises: [
        { id: 1, type: 'phrase', content: 'Maçã' },
        { id: 2, type: 'phrase', content: 'Banana' },
        { id: 3, type: 'phrase', content: 'Arroz com feijão' },
        { id: 4, type: 'phrase', content: 'Eu estou com fome' },
        { id: 5, type: 'phrase', content: 'A conta, por favor' },
    ]
  },
    {
    id: 3,
    title: 'Lição 3: Vogais',
    exercises: [
        { id: 1, type: 'syllable', content: 'A' },
        { id: 2, type: 'syllable', content: 'E' },
        { id: 3, type: 'syllable', content: 'I' },
        { id: 4, type: 'syllable', content: 'O' },
        { id: 5, type: 'syllable', content: 'U' },
    ]
  }
];
