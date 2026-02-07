import {
  forage,
  gemRing,
  goldEarrings,
  jadeBracelet,
  loveLetter,
  Ordos,
  sandalwoodBracelet,
  Takya
} from "@/config/items.js";

export const defaultValues = {
  concubines: 0,
  ordos: 0,
  takya: 0,
  jadeBracelet: 0,
  sandalwoodBracelet: 0,
  goldEarrings: 0,
  gemRing: 0,
  loveLetter: 0,
  forage: 0,
};

export const defaultIntimacySettings = {
  ordos: 1.5,
  sandalwoodBracelet: 3,
  forage: 1.2,
};

export const multiplierConstraints = {
  ordos: {
    min: 1,
    max: 3,
  },
  sandalwoodBracelet: {
    min: 2,
    max: 5,
  },
  forage: {
    min: 1,
    max: null,
  },
};

export const intimacyItems = [
  Ordos,
  Takya,
  jadeBracelet,
  sandalwoodBracelet,
  goldEarrings,
  gemRing,
  loveLetter,
  forage,
];
