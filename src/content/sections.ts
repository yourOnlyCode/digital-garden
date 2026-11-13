/**
 * The sections of the garden, in the order they sit on the line.
 * To add a section: add an entry here and drop a square image in public/prints.
 */
export type Section = {
  slug: string;
  label: string;
  description: string;
  /** Square crop shown on the line. The prints are deliberately unrelated to the section. */
  print: { src: string; credit: string };
  /** Degrees the block leans when the pointer is on it. */
  lean: number;
};

export const sections: Section[] = [
  {
    slug: "books",
    label: "Books & Stories",
    description: "Novels, short fiction and drafts in the open.",
    print: {
      src: "/prints/carp.jpg",
      credit: "Katsushika Hokusai, Carp Swimming by Water Weeds, 1831",
    },
    lean: -5,
  },
  {
    slug: "projects",
    label: "Projects",
    description: "Lorec, Writers Pass and Honne Press.",
    print: {
      src: "/prints/prisons.jpg",
      credit: "Giovanni Battista Piranesi, The Prisons, 1745–50",
    },
    lean: 4,
  },
  {
    slug: "artwork",
    label: "Artwork & Shows",
    description: "Pieces, prints and shows, past and next.",
    print: {
      src: "/prints/crow.jpg",
      credit: "Kawanabe Kyōsai, Full Moon with Crow on Plum Branch, 1880s",
    },
    lean: -3,
  },
  {
    slug: "journal",
    label: "Journal",
    description: "Every blog post, from here, Substack and Patreon.",
    print: {
      src: "/prints/promontory.jpg",
      credit: "Utagawa Hiroshige, The Moon-Viewing Promontory, 1857",
    },
    lean: 3,
  },
  {
    slug: "experiments",
    label: "Experiments",
    description: "Miscellaneous. Unsorted on purpose.",
    print: {
      src: "/prints/moon-carriage.jpg",
      credit: "Filippo Morghen, The Carriages Used on the Moon, c. 1769",
    },
    lean: -8,
  },
  {
    slug: "community",
    label: "Community",
    description: "The rooms I host: Lorec, Discord and more.",
    print: {
      src: "/prints/pond.jpg",
      credit: "Yoshida Hiroshi, Carp and Tortoises, after 1940",
    },
    lean: 3,
  },
  {
    slug: "contact",
    label: "Contact",
    description: "Say something. I read it.",
    print: {
      src: "/prints/letter.jpg",
      credit: "Alexandre Lunois, The Letter, 1894",
    },
    lean: -7,
  },
];

export const site = {
  title: "matthew mullin — capsule garden & sketchbook",
  statement: "Author, developer, and creator of worlds.",
  imageSource: {
    label: "Images: Cleveland Museum of Art, Open Access (CC0)",
    href: "https://www.clevelandart.org/open-access",
  },
};
