import {
  blueHadakIcon,
  chestsIcon,
  forageIcon,
  goldHairpinIcon,
  perfumeIcon,
  silverHairpinIcon,
  whiteHadakIcon,
} from '@/config/gok-item-icon-set.js';

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
  {
    id: 'blueHadak',
    name: 'Синий хадак',
    description: 'Добавляет всем вашим наложницам по 1-3 ед. обаяния',
    icon: blueHadakIcon,
    approximately: true,
  },
  {
    id: 'whiteHadak',
    name: 'Белый хадак',
    description: 'Добавляет всем наложницам 1 ед. обаяния',
    icon: whiteHadakIcon,
    approximately: false,
  },
  {
    id: 'goldHairpin',
    name: 'Золотая шпилька',
    description: 'Даёт обаяние (5 ед.) одной случайной наложнице',
    icon: goldHairpinIcon,
    approximately: false,
  },
  {
    id: 'silverHairpin',
    name: 'Серебряная шпилька',
    description: 'Даёт обаяние (2-5 ед.) одной случайной наложнице',
    icon: silverHairpinIcon,
    approximately: true,
  },
  {
    id: 'perfume',
    name: 'Османтусовые духи',
    description: 'Обаяние наложницы +1 ед.',
    icon: perfumeIcon,
    approximately: false,
  },
  {
    id: 'chests',
    name: 'Сундук странствий',
    description: 'Внимание! Расчет по этому предмету может быть не корректен, зависит не только от количества и рандома',
    icon: chestsIcon,
    approximately: true,
  },
  {
    id: 'forage',
    name: 'Фураж',
    description: 'Внимание! Расчет по этому предмету может быть не корректен, зависит не только от количества и рандома',
    icon: forageIcon,
    approximately: true,
  },
];
