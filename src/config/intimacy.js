import ordosIcon from '@/assets/img/icon/2-4224.png'
import takyaIcon from '@/assets/img/icon/2-4223.png'
import jadeBraceletIcon from '@/assets/img/icon/2-4226.png'
import sandalwoodBraceletIcon from '@/assets/img/icon/2-4225.png'
import goldEarringsIcon from '@/assets/img/icon/2-4222.png'
import gemRingIcon from '@/assets/img/icon/2-4221.png'
import loveLetterIcon from '@/assets/img/icon/2-3007.png'
import forageIcon from '@/assets/img/icon/2-3026.png'

export const intimacyItems = [
  {
    id: 'ordos',
    name: 'Ордос',
    description: 'Добавляет всем вашим наложницам 1-3 ед. близости',
    icon: {
      bg: 'red',
      src: ordosIcon
    },
    approximately: true
  },
  {
    id: 'takya',
    name: 'Такъя',
    description: 'Добавляет всем наложницам 1 ед. близости',
    icon: {
      bg: 'orange',
      src: takyaIcon
    },
    approximately: false
  },
  {
    id: 'jadeBracelet',
    name: 'Нефритовый браслет',
    description: 'Даёт близость (5 ед.) одной случайной наложнице',
    icon: {
      bg: 'orange',
      src: jadeBraceletIcon
    },
    approximately: false
  },
  {
    id: 'sandalwoodBracelet',
    name: 'Сандаловый браслет',
    description: 'Даёт близость (2-5 ед.) одной случайной наложнице',
    icon: {
      bg: 'violet',
      src: sandalwoodBraceletIcon
    },
    approximately: true
  },
  {
    id: 'goldEarrings',
    name: 'Золотые серьги',
    description: 'Близость наложницы +2 ед.',
    icon: {
      bg: 'violet',
      src: goldEarringsIcon
    },
    approximately: false
  },
  {
    id: 'gemRing',
    name: 'Самоцветное кольцо',
    description: 'Близость наложницы +1 ед.',
    icon: {
      bg: 'blue',
      src: gemRingIcon
    },
    approximately: false
  },
  {
    id: 'loveLetter',
    name: 'Любовное письмо',
    description: 'Посещение выбранной наложницы, близость +1 ед.',
    icon: {
      bg: 'red',
      src: loveLetterIcon
    },
    approximately: false
  },
  {
    id: 'forage',
    name: 'Фураж',
    description: 'Внимание! Расчет по этому предмету может быть не корректен, зависит не только от количества и рандома',
    icon: {
      bg: 'violet',
      src: forageIcon
    },
    approximately: true
  }
]
