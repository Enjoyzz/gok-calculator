import blueHadakIcon from '@/assets/img/icon/2-4214.png';
import whiteHadakIcon from '@/assets/img/icon/2-4213.png';
import forageIcon from '@/assets/img/icon/2-3026.png';
import goldHairpinIcon from '@/assets/img/icon/2-4216.png';
import silverHairpinIcon from '@/assets/img/icon/2-4215.png';
import perfumeIcon from '@/assets/img/icon/2-4211.png';
import chestsIcon from '@/assets/img/icon/2-6001.png';

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
    max: 3
  },
  silverHairpin: {
    min: 2,
    max: 5
  },
  chests: {
    min: 1,
    max: null
  },
  forage: {
    min: 1,
    max: null
  }
}

export const charmItems = [
  {
    id: 'blueHadak',
    name: 'Синий хадак',
    description: 'Добавляет всем вашим наложницам по 1-3 ед. обаяния',
    icon: {
      bg: 'red',
      src: blueHadakIcon,
    },
    approximately: true,
  },
  {
    id: 'whiteHadak',
    name: 'Белый хадак',
    description: 'Добавляет всем наложницам 1 ед. обаяния',
    icon: {
      bg: 'orange',
      src: whiteHadakIcon,
    },
    approximately: false,
  },
  {
    id: 'goldHairpin',
    name: 'Золотая шпилька',
    description: 'Даёт обаяние (5 ед.) одной случайной наложнице',
    icon: {
      bg: 'orange',
      src: goldHairpinIcon,
    },
    approximately: false,
  },
  {
    id: 'silverHairpin',
    name: 'Серебряная шпилька',
    description: 'Даёт обаяние (2-5 ед.) одной случайной наложнице',
    icon: {
      bg: 'violet',
      src: silverHairpinIcon,
    },
    approximately: true,
  },
  {
    id: 'perfume',
    name: 'Османтусовые духи',
    description: 'Обаяние наложницы +1 ед.',
    icon: {
      bg: 'blue',
      src: perfumeIcon,
    },
    approximately: false,
  },
  {
    id: 'chests',
    name: 'Сундук странствий',
    description: 'Внимание! Расчет по этому предмету может быть не корректен, зависит не только от количества и рандома',
    icon: {
      bg: 'violet',
      src: chestsIcon,
    },
    approximately: true,
  },
  {
    id: 'forage',
    name: 'Фураж',
    description: 'Внимание! Расчет по этому предмету может быть не корректен, зависит не только от количества и рандома',
    icon: {
      bg: 'violet',
      src: forageIcon,
    },
    approximately: true,
  },
];
