import {bgIcon} from './../utils/bgIcon.js'

import soldiers88K_8MIcons from '@/assets/img/icon/2-1103.png'

import soldiers10MIcon from '@/assets/img/icon/2-1048.png'
import soldiers1MIcon from '@/assets/img/icon/2-1047.png'
import soldiers100KIcon from '@/assets/img/icon/2-1046.png'

import soldiers2hIcon from '@/assets/img/icon/2-1045.png'
import soldiers1hIcon from '@/assets/img/icon/2-1044.png'
import soldiers30mIcon from '@/assets/img/icon/2-1043.png'
import soldiers15mIcon from '@/assets/img/icon/2-1042.png'
import soldiers5mIcon from '@/assets/img/icon/2-1041.png'

import medalIcon from '@/assets/img/icon/2-0000.png'
import chestIcon from '@/assets/img/icon/2-1001.png'

export const soldiersItemsConfig = [
    {
        id: 'soldiers88K_8M',
        name: 'Набор удачи - Солдаты',
        description: 'При открытии можно случ. получить Солдаты (88К-8M)<br><span style="font-weight: bold; color: #9b0505">Внимание! Расчет зависит от рандома. В расчете берется среднее число</span>',
        icon: soldiers88K_8MIcons,
        bgColor: bgIcon.violet,
        approximately: true
    },
    {
        id: 'soldiers10M',
        name: 'Печать генерала III',
        description: 'Содержит 10 млн. солдат',
        icon: soldiers10MIcon,
        bgColor: bgIcon.orange,
        approximately: false
    },
    {
        id: 'soldiers1M',
        name: 'Печать генерала II',
        description: 'Содержит 1 млн. солдат',
        icon: soldiers1MIcon,
        bgColor: bgIcon.violet,
        approximately: false
    },
    {
        id: 'soldiers100K',
        name: 'Печать генерала I',
        description: 'Содержит 100К солдат',
        icon: soldiers100KIcon,
        bgColor: bgIcon.green,
        approximately: false
    },
    {
        id: 'soldiers2h',
        name: 'Колчан стрел V',
        description: 'Моментальное получение дохода солдат за 2 ч.',
        icon: soldiers2hIcon,
        bgColor: bgIcon.orange,
        approximately: false
    },
    {
        id: 'soldiers1h',
        name: 'Колчан стрел IV',
        description: 'Моментальное получение дохода солдат за 1 ч.',
        icon: soldiers1hIcon,
        bgColor: bgIcon.violet,
        approximately: false
    },
    {
        id: 'soldiers30m',
        name: 'Колчан стрел III',
        description: 'Моментальное получение дохода солдат за 30 мин.',
        icon: soldiers30mIcon,
        bgColor: bgIcon.blue,
        approximately: false
    },
    {
        id: 'soldiers15m',
        name: 'Колчан стрел II',
        description: 'Моментальное получение дохода солдат за 15 мин.',
        icon: soldiers15mIcon,
        bgColor: bgIcon.blue,
        approximately: false
    },
    {
        id: 'soldiers5m',
        name: 'Колчан стрел I',
        description: 'Моментальное получение дохода солдат за 5 мин.',
        icon: soldiers5mIcon,
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
        description: 'Есть шанс получить серебро, мясо, солдат (1ч., 2ч., 6ч.) или медаль таланта<br><span style="font-weight: bold; color: #9b0505">Внимание! Расчет зависит от рандома, т.о. чем больше количество, тем точнее будет расчет. Рекомендуется считать от 10шт</span>',
        icon: chestIcon,
        bgColor: bgIcon.orange,
        approximately: true,
    }
]