import ordosIcon from '@/assets/img/icon/2-4224.png'
import takyaIcon from '@/assets/img/icon/2-4223.png'
import jadeBraceletIcon from '@/assets/img/icon/2-4226.png'
import sandalwoodBraceletIcon from '@/assets/img/icon/2-4225.png'
import goldEarringsIcon from '@/assets/img/icon/2-4222.png'
import gemRingIcon from '@/assets/img/icon/2-4221.png'
import loveLetterIcon from '@/assets/img/icon/2-3007.png'
import forageIcon from '@/assets/img/icon/2-3026.png'

import {bgIcon} from './../utils/bgIcon.js'

export const intimacyItemsConfig = [
    {
        id: 'ordos',
        name: 'Ордос',
        description: 'Добавляет всем вашим наложницам 1-3 ед. близости',
        icon: ordosIcon,
        bgColor: bgIcon.red,
        approximately: true
    },
    {
        id: 'takya',
        name: 'Такъя',
        description: 'Добавляет всем наложницам 1 ед. близости',
        icon: takyaIcon,
        bgColor: bgIcon.orange,
        approximately: false
    },
    {
        id: 'jadeBracelet',
        name: 'Нефритовый браслет',
        description: 'Даёт близость (5 ед.) одной случайной наложнице',
        icon: jadeBraceletIcon,
        bgColor: bgIcon.orange,
        approximately: false
    },
    {
        id: 'sandalwoodBracelet',
        name: 'Сандаловый браслет',
        description: 'Даёт близость (2-5 ед.) одной случайной наложнице',
        icon: sandalwoodBraceletIcon,
        bgColor: bgIcon.violet,
        approximately: true
    },
    {
        id: 'goldEarrings',
        name: 'Золотые серьги',
        description: 'Близость наложницы +2 ед.',
        icon: goldEarringsIcon,
        bgColor: bgIcon.violet,
        approximately: false
    },
    {
        id: 'gemRing',
        name: 'Самоцветное кольцо',
        description: 'Близость наложницы +1 ед.',
        icon: gemRingIcon,
        bgColor: bgIcon.blue,
        approximately: false
    },
    {
        id: 'loveLetter',
        name: 'Любовное письмо',
        description: 'Посещение выбранной наложницы, близость +1 ед.',
        icon: loveLetterIcon,
        bgColor: bgIcon.red,
        approximately: false
    },
    {
        id: 'forage',
        name: 'Фураж',
        description: 'Внимание! Расчет по этому предмету может быть не корректен, зависит не только от количества и рандома',
        icon: forageIcon,
        bgColor: bgIcon.violet,
        approximately: true
    }
]