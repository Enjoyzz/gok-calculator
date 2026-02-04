import silver88K_8MIcons from '@/assets/img/icon/2-1101.png'

import silver10MIcon from '@/assets/img/icon/2-1028.png'
import silver1MIcon from '@/assets/img/icon/2-1027.png'
import silver100KIcon from '@/assets/img/icon/2-1026.png'

import silver2hIcon from '@/assets/img/icon/2-1025.png'
import silver1hIcon from '@/assets/img/icon/2-1024.png'
import silver30mIcon from '@/assets/img/icon/2-1023.png'
import silver15mIcon from '@/assets/img/icon/2-1022.png'
import silver5mIcon from '@/assets/img/icon/2-1021.png'

import medalIcon from '@/assets/img/icon/2-0000.png'
import chestIcon from '@/assets/img/icon/2-1001.png'
import meat88K_8MIcon from '@/assets/img/icon/2-1102.png';

export const defaultValues = {
  silver: 0,
  silver88K_8M: 0,
  silver10M: 0,
  silver1M: 0,
  silver100K: 0,
  silver2h: 0,
  silver1h: 0,
  silver30m: 0,
  silver15m: 0,
  silver5m: 0,
  medal: 0,
  chest: 0,
};

export const silverItems = [
  {
    id: 'silver88K_8M',
    name: 'Набор удачи - Серебро',
    description: 'При открытии можно случ. получить Серебро (88К-8M)<br><span style="font-weight: bold; color: #9b0505">Внимание! Расчет зависит от рандома. В расчете берется среднее число</span>',
    icon: {
      bg: 'violet',
      src: silver88K_8MIcons,
    },
    approximately: true
  },
  {
    id: 'silver10M',
    name: 'Эпичный купон серебра',
    description: 'Содержит 10 млн. серебра',
    icon: {
      bg: 'orange',
      src: silver10MIcon,
    },
    approximately: false
  },
  {
    id: 'silver1M',
    name: 'Редкий купон серебра',
    description: 'Содержит 1 млн. серебра',
    icon: {
      bg: 'violet',
      src: silver1MIcon,
    },
    approximately: false
  },
  {
    id: 'silver100K',
    name: 'Купон серебра',
    description: 'Содержит 100К серебра',
    icon: {
      bg: 'green',
      src: silver100KIcon,
    },
    approximately: false
  },
  {
    id: 'silver2h',
    name: 'Сундук серебра',
    description: 'Моментальное получение дохода серебра за 2 ч.',
    icon: {
      bg: 'orange',
      src: silver2hIcon,
    },
    approximately: false
  },
  {
    id: 'silver1h',
    name: 'Ящик серебра',
    description: 'Моментальное получение дохода серебра за 1 ч.',
    icon: {
      bg: 'violet',
      src: silver1hIcon,
    },
    approximately: false
  },
  {
    id: 'silver30m',
    name: 'Сумка серебра',
    description: 'Моментальное получение дохода серебра за 30 мин.',
    icon: {
      bg: 'blue',
      src: silver30mIcon,
    },
    approximately: false
  },
  {
    id: 'silver15m',
    name: 'Мешочек серебра',
    description: 'Моментальное получение дохода серебра за 15 мин.',
    icon: {
      bg: 'blue',
      src: silver15mIcon,
    },
    approximately: false
  },
  {
    id: 'silver5m',
    name: 'Горсть серебра',
    description: 'Моментальное получение дохода серебра за 5 мин.',
    icon: {
      bg: 'green',
      src: silver5mIcon,
    },
    approximately: false
  },
  {
    id: 'medal',
    name: 'Медаль сбора',
    description: 'Моментальное получение дохода с поселений за 30 мин.',
    icon: {
      bg: 'violet',
      src: medalIcon,
    },
    approximately: false
  },
  {
    id: 'chest',
    name: 'Сундук ресурсов',
    description: 'Есть шанс получить серебро, мясо, солдат (1ч., 2ч., 6ч.) или медаль таланта<br><span style="font-weight: bold; color: #9b0505">Внимание! Расчет зависит от рандома, т.о. чем больше количество, тем точнее будет расчет. Рекомендуется считать от 10шт</span>',
    icon: {
      bg: 'orange',
      src: chestIcon,
    },
    approximately: true
  }
];

