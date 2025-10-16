import { bgIcon } from './../utils/bgIcon.js'
import blueHadakIcon from '@/assets/img/icon/2-4214.png'
import whiteHadakIcon from '@/assets/img/icon/2-4213.png'
import forageIcon from "@/assets/img/icon/2-3026.png";
import goldHairpinIcon from "@/assets/img/icon/2-4216.png";
import silverHairpinIcon from "@/assets/img/icon/2-4215.png";
import perfumeIcon from "@/assets/img/icon/2-4211.png";
import chestsIcon from "@/assets/img/icon/2-6001.png";

export const charmItemsConfig = [
    {
        id: 'blueHadak',
        name: 'Синий хадак',
        description: 'Добавляет всем вашим наложницам по 1-3 ед. обаяния',
        icon: blueHadakIcon,
        bgColor: bgIcon.red
    },
    {
        id: 'whiteHadak',
        name: 'Белый хадак',
        description: 'Добавляет всем наложницам 1 ед. обаяния',
        icon: whiteHadakIcon,
        bgColor: bgIcon.orange
    },
    {
        id: 'goldHairpin',
        name: 'Золотая шпилька',
        description: 'Даёт обаяние (5 ед.) одной случайной наложнице',
        icon: goldHairpinIcon,
        bgColor: bgIcon.orange
    },
    {
        id: 'silverHairpin',
        name: 'Серебряная шпилька',
        description: 'Даёт обаяние (2-5 ед.) одной случайной наложнице',
        icon: silverHairpinIcon,
        bgColor: bgIcon.violet
    },
    {
        id: 'perfume',
        name: 'Османтусовые духи',
        description: 'Обаяние наложницы +1 ед.',
        icon: perfumeIcon,
        bgColor: bgIcon.blue
    },
    {
        id: 'chests',
        name: 'Сундук странствий',
        description: 'Внимание! Расчет по этому предмету может быть не корректен',
        icon: chestsIcon,
        bgColor: bgIcon.violet
    },
    {
        id: 'forage',
        name: 'Фураж',
        description: 'Внимание! Расчет по этому предмету может быть не корректен',
        icon: forageIcon,
        bgColor: bgIcon.violet
    }
]