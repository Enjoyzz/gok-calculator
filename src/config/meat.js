import meat88K_8MIcon from '@/assets/img/icon/2-1102.png';

import meat10MIcon from '@/assets/img/icon/2-1038.png';
import meat1MIcon from '@/assets/img/icon/2-1037.png';
import meat100KIcon from '@/assets/img/icon/2-1036.png';

import meat2hIcon from '@/assets/img/icon/2-1035.png';
import meat1hIcon from '@/assets/img/icon/2-1034.png';
import meat30mIcon from '@/assets/img/icon/2-1033.png';
import meat15mIcon from '@/assets/img/icon/2-1032.png';
import meat5mIcon from '@/assets/img/icon/2-1031.png';

import medalIcon from '@/assets/img/icon/2-0000.png';
import chestIcon from '@/assets/img/icon/2-1001.png';

export const defaultValues = {
  meat: 0,
  meat88K_8M: 0,
  meat10M: 0,
  meat1M: 0,
  meat100K: 0,
  meat2h: 0,
  meat1h: 0,
  meat30m: 0,
  meat15m: 0,
  meat5m: 0,
  medal: 0,
  chest: 0,
};

export const meatItems = [
  {
    id: 'meat88K_8M',
    name: 'Набор удачи - Мясо',
    description: 'При открытии можно случ. получить Мясо (88К-8M)<br><span style="font-weight: bold; color: #9b0505">Внимание! Расчет зависит от рандома. В расчете берется среднее число</span>',
    icon: {
      bg: 'violet',
      src: meat88K_8MIcon,
    },
    approximately: true,
  },
  {
    id: 'meat10M',
    name: 'Купон мяса III',
    description: 'Содержит 10 млн. мяса',
    icon: {
      bg: 'orange',
      src: meat10MIcon,
    },
    approximately: false,
  },
  {
    id: 'meat1M',
    name: 'Купон мяса II',
    description: 'Содержит 1 млн. мяса',
    icon: {
      bg: 'violet',
      src: meat1MIcon,
    },
    approximately: false,
  },
  {
    id: 'meat100K',
    name: 'Купон мяса I',
    description: 'Содержит 100К мяса',
    icon: {
      bg: 'green',
      src: meat100KIcon,
    },
    approximately: false,
  },
  {
    id: 'meat2h',
    name: 'Бочка мяса',
    description: 'Моментальное получение дохода мяса за 2 ч.',
    icon: {
      bg: 'orange',
      src: meat2hIcon,
    },
    approximately: false,
  },
  {
    id: 'meat1h',
    name: 'Кадка мяса',
    description: 'Моментальное получение дохода мяса за 1 ч.',
    icon: {
      bg: 'violet',
      src: meat1hIcon,
    },
    approximately: false,
  },
  {
    id: 'meat30m',
    name: 'Мешок мяса',
    description: 'Моментальное получение дохода мяса за 30 мин.',
    icon: {
      bg: 'blue',
      src: meat30mIcon,
    },
    approximately: false,
  },
  {
    id: 'meat15m',
    name: 'Кулёк мяса',
    description: 'Моментальное получение дохода мяса за 15 мин.',
    icon: {
      bg: 'blue',
      src: meat15mIcon,
    },
    approximately: false,
  },
  {
    id: 'meat5m',
    name: 'Порция мяса',
    description: 'Моментальное получение дохода мяса за 5 мин.',
    icon: {
      bg: 'green',
      src: meat5mIcon,
    },
    approximately: false,
  },
  {
    id: 'medal',
    name: 'Медаль сбора',
    description: 'Моментальное получение дохода с поселений за 30 мин.',
    icon: {
      bg: 'violet',
      src: medalIcon,
    },
    approximately: false,
  },
  {
    id: 'chest',
    name: 'Сундук ресурсов',
    description: 'Есть шанс получить серебро, мясо, солдат (1ч., 2ч., 6ч.) или медаль таланта<br><span style="font-weight: bold; color: #9b0505">Внимание! Расчет зависит от рандома, т.о. чем больше количество, тем точнее будет расчет. Рекомендуется считать от 10шт</span>',
    icon: {
      bg: 'orange',
      src: chestIcon,
    },
    approximately: true,
  },
];

