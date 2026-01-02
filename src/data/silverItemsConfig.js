import { bgIcon } from './../utils/bgIcon.js'

import silver1MIcon from '@/assets/img/icon/2-1027.png'
import silver100KIcon from '@/assets/img/icon/2-1026.png'
import silver88K_8MIcons from '@/assets/img/icon/2-1101.png'
import silver1hIcon from '@/assets/img/icon/2-1024.png'
import silver30mIcon from '@/assets/img/icon/2-1023.png'
import silver15mIcon from '@/assets/img/icon/2-1022.png'
import silver5mIcon from '@/assets/img/icon/2-1021.png'

import medalIcon from '@/assets/img/icon/2-3001.png'
import chestIcon from '@/assets/img/icon/2-1001.png'

export const silverItemsConfig = [
    {
        id: 'silver1M',
        name: 'Редкий купон серебра',
        description: 'Содержит 1 млн. серебра',
        icon: silver1MIcon,
        bgColor: bgIcon.violet,
        approximately: false
    },
    {
        id: 'silver100K',
        name: 'Купон серебра',
        description: 'Содержит 100К серебра',
        icon: silver100KIcon,
        bgColor: bgIcon.green,
        approximately: false
    },
    {
        id: 'silver88K_8M',
        name: 'Набор удачи - Серебро',
        description: 'При открытии можно случ. получить Серебро (88К-8M)',
        icon: silver88K_8MIcons,
        bgColor: bgIcon.violet,
        approximately: true
    },
    {
        id: 'silver1h',
        name: 'Ящик серебра',
        description: 'Моментальное получение дохода серебра за 1 ч.',
        icon: silver1hIcon,
        bgColor: bgIcon.violet,
        approximately: false
    },
    {
        id: 'silver30m',
        name: 'Сумка серебра',
        description: 'Моментальное получение дохода серебра за 30 мин.',
        icon: silver30mIcon,
        bgColor: bgIcon.blue,
        approximately: false
    },
    {
        id: 'silver15m',
        name: 'Мешочек серебра',
        description: 'Моментальное получение дохода серебра за 15 мин.',
        icon: silver15mIcon,
        bgColor: bgIcon.blue,
        approximately: false
    },
    {
        id: 'silver5m',
        name: 'Горсть серебра',
        description: 'Моментальное получение дохода серебра за 5 мин.',
        icon: silver5mIcon,
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