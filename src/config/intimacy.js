import {
  forageIcon,
  gemRingIcon,
  goldEarringsIcon,
  jadeBraceletIcon,
  loveLetterIcon,
  ordosIcon,
  sandalwoodBraceletIcon,
  takyaIcon,
} from '@/config/gok-item-icon-set.js';

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
  {
    id: 'ordos',
    name: 'Ордос',
    description: 'Добавляет всем вашим наложницам 1-3 ед. близости',
    icon: ordosIcon,
    approximately: true,
  },
  {
    id: 'takya',
    name: 'Такъя',
    description: 'Добавляет всем наложницам 1 ед. близости',
    icon: takyaIcon,
    approximately: false,
  },
  {
    id: 'jadeBracelet',
    name: 'Нефритовый браслет',
    description: 'Даёт близость (5 ед.) одной случайной наложнице',
    icon: jadeBraceletIcon,
    approximately: false,
  },
  {
    id: 'sandalwoodBracelet',
    name: 'Сандаловый браслет',
    description: 'Даёт близость (2-5 ед.) одной случайной наложнице',
    icon: sandalwoodBraceletIcon,
    approximately: true,
  },
  {
    id: 'goldEarrings',
    name: 'Золотые серьги',
    description: 'Близость наложницы +2 ед.',
    icon: goldEarringsIcon,
    approximately: false,
  },
  {
    id: 'gemRing',
    name: 'Самоцветное кольцо',
    description: 'Близость наложницы +1 ед.',
    icon: gemRingIcon,
    approximately: false,
  },
  {
    id: 'loveLetter',
    name: 'Любовное письмо',
    description: 'Посещение выбранной наложницы, близость +1 ед.',
    icon: loveLetterIcon,
    approximately: false,
  },
  {
    id: 'forage',
    name: 'Фураж',
    description: 'Внимание! Расчет по этому предмету может быть не корректен, зависит не только от количества и рандома',
    icon: forageIcon,
    approximately: true,
  },
];
