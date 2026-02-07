import {blueHadak, chests, forage, goldHairpin, perfume, silverHairpin, whiteHadak} from "@/config/items.js";

export const defaultValues = {
  concubines: 0,
  blueHadak: 0,
  whiteHadak: 0,
  goldHairpin: 0,
  silverHairpin: 0,
  perfume: 0,
  chests: 0,
  forage: 0,
};

export const defaultCharmSettings = {
  blueHadak: 1.5,
  silverHairpin: 3,
  chests: 2.2,
  forage: 1.5,
};

export const multiplierConstraints = {
  blueHadak: {
    min: 1,
    max: 3,
  },
  silverHairpin: {
    min: 2,
    max: 5,
  },
  chests: {
    min: 1,
    max: null,
  },
  forage: {
    min: 1,
    max: null,
  },
};

export const charmItems = [
  blueHadak,
  whiteHadak,
  goldHairpin,
  silverHairpin,
  perfume,
  chests,
  forage,
];
