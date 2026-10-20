import iconA from '@/assets/pet/quality/spt_601_301.png'
import iconS from '@/assets/pet/quality/spt_601_302.png'
import iconSS from '@/assets/pet/quality/spt_601_303.png'
import iconSSPlus from '@/assets/pet/quality/spt_601_304.png'
import iconSSS from '@/assets/pet/quality/spt_601_305.png'

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
    icon: iconSS,
    'min-level': 1,
    'max-level': 50,
    'summon-points': 225,
    levels: {},
  },
  'ss+': {
    quality: 'SS+',
    icon: iconSSPlus,
    'min-level': 10,
    'max-level': 100,
    'summon-points': 1130,
    levels: {},
  },
  sss: {
    quality: 'SSS',
    icon: iconSSS,
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
