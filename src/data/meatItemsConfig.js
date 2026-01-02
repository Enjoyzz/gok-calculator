import { bgIcon } from './../utils/bgIcon.js'

import meat1MIcon from '@/assets/img/icon/2-1037.png'
import meat100KIcon from '@/assets/img/icon/2-1036.png'
import meat2hIcon from '@/assets/img/icon/2-1035.png'
import meat1hIcon from '@/assets/img/icon/2-1034.png'
import meat30mIcon from '@/assets/img/icon/2-1033.png'
import meat15mIcon from '@/assets/img/icon/2-1032.png'
import meat5mIcon from '@/assets/img/icon/2-1031.png'

import medalIcon from '@/assets/img/icon/2-3001.png'
import chestIcon from '@/assets/img/icon/2-1001.png'

export const meatItemsConfig = [
    {
        id: 'meat1M',
        name: 'Купон мяса II',
        description: 'Содержит 1 млн. мяса',
        icon: meat1MIcon,
        bgColor: bgIcon.violet,
        approximately: false
    },
    {
        id: 'meat100K',
        name: 'Купон мяса I',
        description: 'Содержит 100К мяса',
        icon: meat100KIcon,
        bgColor: bgIcon.green,
        approximately: false
    },
    {
        id: 'meat2h',
        name: 'Бочка мяса',
        description: 'Моментальное получение дохода мяса за 2 ч.',
        icon: meat2hIcon,
        bgColor: bgIcon.orange,
        approximately: false
    },
    {
        id: 'meat1h',
        name: 'Кадка мяса',
        description: 'Моментальное получение дохода мяса за 1 ч.',
        icon: meat1hIcon,
        bgColor: bgIcon.violet,
        approximately: false
    },
    {
        id: 'meat30m',
        name: 'Мешок мяса',
        description: 'Моментальное получение дохода мяса за 30 мин.',
        icon: meat30mIcon,
        bgColor: bgIcon.blue,
        approximately: false
    },
    {
        id: 'meat15m',
        name: 'Кулёк мяса',
        description: 'Моментальное получение дохода мяса за 15 мин.',
        icon: meat15mIcon,
        bgColor: bgIcon.blue,
        approximately: false
    },
    {
        id: 'meat5m',
        name: 'Порция мяса',
        description: 'Моментальное получение дохода мяса за 5 мин.',
        icon: meat5mIcon,
        bgColor: bgIcon.green,
        approximately: false
    },
    {
        id: 'medal',
        name: 'Медаль сбора',
        description: 'Моментальное получение дохода с поселений за 30 мин.',
        icon: medalIcon,
        bgColor: bgIcon.violet,
        approximately: false
    },
    {
        id: 'chest',
        name: 'Сундук ресурсов',
        description: 'Есть шанс получить серебро, мясо, солдат (1ч., 2ч., 6ч.) или медаль таланта',
        icon: chestIcon,
        bgColor: bgIcon.orange,
        approximately: true
    }
]