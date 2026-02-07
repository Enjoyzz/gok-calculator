import {
  blueHadakIcon,
  chestIcon,
  chestsIcon,
  forageIcon,
  gemRingIcon,
  goldEarringsIcon,
  goldHairpinIcon,
  jadeBraceletIcon, loveLetterIcon,
  meat100KIcon,
  meat10MIcon,
  meat15mIcon,
  meat1hIcon,
  meat1MIcon,
  meat2hIcon,
  meat30mIcon,
  meat5mIcon,
  meat88K_8MIcon,
  medalIcon,
  ordosIcon,
  perfumeIcon,
  sandalwoodBraceletIcon,
  silver100KIcon,
  silver10MIcon,
  silver15mIcon,
  silver1hIcon,
  silver1MIcon,
  silver2hIcon,
  silver30mIcon,
  silver5mIcon,
  silver88K_8MIcon,
  silverHairpinIcon,
  soldiers100KIcon,
  soldiers10MIcon,
  soldiers15mIcon,
  soldiers1hIcon,
  soldiers1MIcon,
  soldiers2hIcon,
  soldiers30mIcon,
  soldiers5mIcon,
  soldiers88K_8MIcon,
  takyaIcon,
  whiteHadakIcon
} from "@/config/gok-item-icon-set.js";

export const Ordos = {
  id: 'ordos',
  name: 'Ордос',
  description: 'Добавляет всем вашим наложницам 1-3 ед. близости',
  icon: ordosIcon,
  approximately: true,
}

export const Takya = {
  id: 'takya',
  name: 'Такъя',
  description: 'Добавляет всем наложницам 1 ед. близости',
  icon: takyaIcon,
  approximately: false,
}

export const jadeBracelet = {
  id: 'jadeBracelet',
  name: 'Нефритовый браслет',
  description: 'Даёт близость (5 ед.) одной случайной наложнице',
  icon: jadeBraceletIcon,
  approximately: false,
}

export const sandalwoodBracelet = {
  id: 'sandalwoodBracelet',
  name: 'Сандаловый браслет',
  description: 'Даёт близость (2-5 ед.) одной случайной наложнице',
  icon: sandalwoodBraceletIcon,
  approximately: true,
}

export const goldEarrings = {
  id: 'goldEarrings',
  name: 'Золотые серьги',
  description: 'Близость наложницы +2 ед.',
  icon: goldEarringsIcon,
  approximately: false,
}

export const gemRing = {
  id: 'gemRing',
  name: 'Самоцветное кольцо',
  description: 'Близость наложницы +1 ед.',
  icon: gemRingIcon,
  approximately: false,
}

export const forage = {
  id: 'forage',
  name: 'Фураж',
  description: 'Внимание! Расчет по этому предмету может быть не корректен, зависит не только от количества и рандома',
  icon: forageIcon,
  approximately: true,
}

export const blueHadak = {
  id: 'blueHadak',
  name: 'Синий хадак',
  description: 'Добавляет всем вашим наложницам по 1-3 ед. обаяния',
  icon: blueHadakIcon,
  approximately: true,
}

export const whiteHadak = {
  id: 'whiteHadak',
  name: 'Белый хадак',
  description: 'Добавляет всем наложницам 1 ед. обаяния',
  icon: whiteHadakIcon,
  approximately: false,
}

export const goldHairpin = {
  id: 'goldHairpin',
  name: 'Золотая шпилька',
  description: 'Даёт обаяние (5 ед.) одной случайной наложнице',
  icon: goldHairpinIcon,
  approximately: false,
}

export const silverHairpin = {
  id: 'silverHairpin',
  name: 'Серебряная шпилька',
  description: 'Даёт обаяние (2-5 ед.) одной случайной наложнице',
  icon: silverHairpinIcon,
  approximately: true,
}

export const perfume = {
  id: 'perfume',
  name: 'Османтусовые духи',
  description: 'Обаяние наложницы +1 ед.',
  icon: perfumeIcon,
  approximately: false,
}

export const chests = {
  id: 'chests',
  name: 'Сундук странствий',
  description: 'Внимание! Расчет по этому предмету может быть не корректен, зависит не только от количества и рандома',
  icon: chestsIcon,
  approximately: true,
}

export const meat88K_8M = {
  id: 'meat88K_8M',
  name: 'Набор удачи - Мясо',
  description: 'При открытии можно случ. получить Мясо (88К-8M)<br><span class="text-error font-weight-bold">Внимание! Расчет зависит от рандома. В расчете берется среднее число</span>',
  icon: meat88K_8MIcon,
  approximately: true,
}

export const meat10M = {
  id: 'meat10M',
  name: 'Купон мяса III',
  description: 'Содержит 10 млн. мяса',
  icon: meat10MIcon,
  approximately: false,
}

export const meat1M = {
  id: 'meat1M',
  name: 'Купон мяса II',
  description: 'Содержит 1 млн. мяса',
  icon: meat1MIcon,
  approximately: false,
}

export const meat100K = {
  id: 'meat100K',
  name: 'Купон мяса I',
  description: 'Содержит 100К мяса',
  icon: meat100KIcon,
  approximately: false,
}

export const meat2h = {
  id: 'meat2h',
  name: 'Бочка мяса',
  description: 'Моментальное получение дохода мяса за 2 ч.',
  icon: meat2hIcon,
  approximately: false,
}

export const meat1h = {
  id: 'meat1h',
  name: 'Кадка мяса',
  description: 'Моментальное получение дохода мяса за 1 ч.',
  icon: meat1hIcon,
  approximately: false,
}
export const meat30m = {
  id: 'meat30m',
  name: 'Мешок мяса',
  description: 'Моментальное получение дохода мяса за 30 мин.',
  icon: meat30mIcon,
  approximately: false,
}

export const meat15m = {
  id: 'meat15m',
  name: 'Кулёк мяса',
  description: 'Моментальное получение дохода мяса за 15 мин.',
  icon: meat15mIcon,
  approximately: false,
}

export const meat5m = {
  id: 'meat5m',
  name: 'Порция мяса',
  description: 'Моментальное получение дохода мяса за 5 мин.',
  icon: meat5mIcon,
  approximately: false,
}
export const medal = {
  id: 'medal',
  name: 'Медаль сбора',
  description: 'Моментальное получение дохода с поселений за 30 мин.',
  icon: medalIcon,
  approximately: false,
}

export const chest = {
  id: 'chest',
  name: 'Сундук ресурсов',
  description: 'Есть шанс получить серебро, мясо, солдат (1ч., 2ч., 6ч.) или медаль таланта<br><span class="text-error font-weight-bold">Внимание! Расчет зависит от рандома, т.о. чем больше количество, тем точнее будет расчет. Рекомендуется считать от 10шт</span>',
  icon: chestIcon,
  approximately: true,
}

export const silver88K_8M = {
  id: 'silver88K_8M',
  name: 'Набор удачи - Серебро',
  description: 'При открытии можно случ. получить Серебро (88К-8M)<br><span style="font-weight: bold; color: #9b0505">Внимание! Расчет зависит от рандома. В расчете берется среднее число</span>',
  icon: silver88K_8MIcon,
  approximately: true,
}

export const silver10M = {
  id: 'silver10M',
  name: 'Эпичный купон серебра',
  description: 'Содержит 10 млн. серебра',
  icon: silver10MIcon,
  approximately: false,
}

export const silver1M = {
  id: 'silver1M',
  name: 'Редкий купон серебра',
  description: 'Содержит 1 млн. серебра',
  icon: silver1MIcon,
  approximately: false,
}

export const silver100K = {
  id: 'silver100K',
  name: 'Купон серебра',
  description: 'Содержит 100К серебра',
  icon: silver100KIcon,
  approximately: false,
}

export const silver2h = {
  id: 'silver2h',
  name: 'Сундук серебра',
  description: 'Моментальное получение дохода серебра за 2 ч.',
  icon: silver2hIcon,
  approximately: false,
}

export const silver1h = {
  id: 'silver1h',
  name: 'Ящик серебра',
  description: 'Моментальное получение дохода серебра за 1 ч.',
  icon: silver1hIcon,
  approximately: false,
}

export const silver30m = {
  id: 'silver30m',
  name: 'Сумка серебра',
  description: 'Моментальное получение дохода серебра за 30 мин.',
  icon: silver30mIcon,
  approximately: false,
}

export const silver15m = {
  id: 'silver15m',
  name: 'Мешочек серебра',
  description: 'Моментальное получение дохода серебра за 15 мин.',
  icon: silver15mIcon,
  approximately: false,
}

export const silver5m = {
  id: 'silver5m',
  name: 'Горсть серебра',
  description: 'Моментальное получение дохода серебра за 5 мин.',
  icon: silver5mIcon,
  approximately: false,
}

export const soldiers88K_8M = {
  id: 'soldiers88K_8M',
  name: 'Набор удачи - Солдаты',
  description: 'При открытии можно случ. получить Солдаты (88К-8M)<br><span style="font-weight: bold; color: #9b0505">Внимание! Расчет зависит от рандома. В расчете берется среднее число</span>',
  icon: soldiers88K_8MIcon,
  approximately: true,
}

export const soldiers10M = {
  id: 'soldiers10M',
  name: 'Печать генерала III',
  description: 'Содержит 10 млн. солдат',
  icon: soldiers10MIcon,
  approximately: false,
}

export const soldiers1M = {
  id: 'soldiers1M',
  name: 'Печать генерала II',
  description: 'Содержит 1 млн. солдат',
  icon: soldiers1MIcon,
  approximately: false,
}

export const soldiers100K = {
  id: 'soldiers100K',
  name: 'Печать генерала I',
  description: 'Содержит 100К солдат',
  icon: soldiers100KIcon,
  approximately: false,
}

export const soldiers2h = {
  id: 'soldiers2h',
  name: 'Колчан стрел V',
  description: 'Моментальное получение дохода солдат за 2 ч.',
  icon: soldiers2hIcon,
  approximately: false,
}

export const soldiers1h = {
  id: 'soldiers1h',
  name: 'Колчан стрел IV',
  description: 'Моментальное получение дохода солдат за 1 ч.',
  icon: soldiers1hIcon,
  approximately: false,
}

export const soldiers30m = {
  id: 'soldiers30m',
  name: 'Колчан стрел III',
  description: 'Моментальное получение дохода солдат за 30 мин.',
  icon: soldiers30mIcon,
  approximately: false,
}

export const soldiers15m = {
  id: 'soldiers15m',
  name: 'Колчан стрел II',
  description: 'Моментальное получение дохода солдат за 15 мин.',
  icon: soldiers15mIcon,
  approximately: false,
}

export const soldiers5m = {
  id: 'soldiers5m',
  name: 'Колчан стрел I',
  description: 'Моментальное получение дохода солдат за 5 мин.',
  icon: soldiers5mIcon,
  approximately: false,
}

export const loveLetter = {
  id: 'loveLetter',
  name: 'Любовное письмо',
  description: 'Посещение выбранной наложницы, близость +1 ед.',
  icon: loveLetterIcon,
  approximately: false,
}

