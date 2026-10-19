export const petTypes = {
  // a: {
  //   quality: 'A',
  //   icon: null,
  //   'min-level': 1,
  //   'summon-points': 0,
  //   levels: {},
  // },
  // s: {
  //   quality: 'S',
  //   icon: null,
  //   'min-level': 1,
  //   'summon-points': 0,
  //   levels: {},
  // },
  ss: {
    quality: 'SS',
    icon: null,
    'min-level': 1,
    'max-level': 50,
    'summon-points': 225,
    levels: {},
  },
  'ss+': {
    quality: 'SS+',
    icon: null,
    'min-level': 10,
    'max-level': 100,
    'summon-points': 1130,
    levels: {},
  },
  sss: {
    quality: 'SSS',
    icon: null,
    'min-level': 20,
    'max-level': 100,
    'summon-points': 3075,
    levels: {
      21: { parts: 2, berries: 16, points: 160 },
      22: { parts: 2, berries: 16, points: 170 },
      // ...
    },
  },
}

// Опционально: список ключей в нужном порядке (если порядок в объекте не гарантирован)
//export const petTypeKeys = ['ss', 'ss+', 'sss']
export const petTypeKeys = Object.keys(petTypes)
