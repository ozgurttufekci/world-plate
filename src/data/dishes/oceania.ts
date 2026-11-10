import type { DishEntry } from "../schema";

export const oceania: DishEntry[] = [
  {
    code: "AU",
    dish: "Lamington",
    description:
      "Squares of sponge cake dipped in chocolate icing and rolled in desiccated coconut.",
    whyUnique:
      "Named after Lord Lamington, a governor of Queensland around 1900. Picked over pavlova, which New Zealand also claims.",
    method: "baking",
    course: "dessert",
    difficulty: "medium",
    minutes: 120,
    wiki: "Lamington",
  },
  {
    code: "NZ",
    dish: "Afghan biscuit",
    description:
      "A chocolate biscuit made with cornflakes, topped with chocolate icing and half a walnut.",
    whyUnique:
      "A New Zealand home-baking classic. Nobody is sure where the name comes from.",
    method: "baking",
    course: "dessert",
    difficulty: "easy",
    minutes: 40,
    wiki: "Afghan (biscuit)",
  },
  {
    code: "FJ",
    dish: "Kokoda",
    description:
      "Raw fish cured in citrus juice, then mixed with coconut cream, onion, tomato and chili.",
    whyUnique:
      "Fiji's version of the Pacific cured-fish salad; the coconut cream is what separates the family from ceviche. Other islands have close relatives, and the link goes to their shared article.",
    method: "no-cook",
    course: "main",
    difficulty: "easy",
    minutes: 150,
    wiki: "'Ota 'ika",
  },
  {
    code: "PG",
    dish: "Mumu",
    description:
      "Pork, sweet potato, taro and greens layered with banana leaves and cooked over hot stones in a pit. At home, a covered dish in the oven stands in for the pit.",
    whyUnique:
      "Papua New Guinea's national dish, named after the earth oven. The link goes to Papua New Guinean cuisine.",
    method: "baking",
    course: "main",
    difficulty: "hard",
    minutes: 240,
    wiki: "Papua New Guinean cuisine",
    photo: false,
  },
  {
    code: "VU",
    dish: "Laplap",
    description:
      "Grated yam, taro or banana spread on leaves, soaked in coconut cream, topped with meat or fish, wrapped and baked on hot stones.",
    whyUnique: "Vanuatu's national dish.",
    method: "baking",
    course: "main",
    difficulty: "hard",
    minutes: 150,
    wiki: "Laplap",
  },
  {
    code: "WS",
    dish: "Pani popo",
    description: "Soft sweet yeast buns baked in a pool of coconut milk sauce.",
    whyUnique:
      "A Samoan favourite. Picked over palusami, whose family is listed under Tonga. It has no Wikipedia article.",
    method: "baking",
    course: "bread",
    difficulty: "medium",
    minutes: 150,
    wiki: null,
  },
  {
    code: "TO",
    dish: "Lu pulu",
    description:
      "Taro leaves wrapped around corned beef, onion and coconut cream and baked.",
    whyUnique:
      "A Tongan Sunday dish, traditionally cooked in an underground oven. The link goes to the article on Polynesian taro-leaf dishes.",
    method: "baking",
    course: "main",
    difficulty: "easy",
    minutes: 90,
    wiki: "Lūʻau (food)",
    photo: false,
  },
];
