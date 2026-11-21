import {
  StaminaPill,
  HuntingNet,
  FishingNet,
  Rope,
  BlackGranite,
  CedarWood,
  RadiantStripes,
} from "@/config/items.js";

export const defaultValues = {
  staminaPill: 0,
  huntingNet: 0,
  fishingNet: 0,
  rope: 0,
  blackGranite: 0,
  cedarWood: 0,
  radiantStripes: 0,
};

export const petTypeBoonGeneralItems = [
  BlackGranite,
  CedarWood,
  RadiantStripes,
];

export const petTypeBoonSecondItems = [
  StaminaPill,
  HuntingNet,
  FishingNet,
  Rope,
];


export const SHARE  = { orange: 0.15, violet: 0.35, blue: 0.5, green: 0 }
export const POINTS = { orange: 210,  violet: 150,  blue: 90, green: 60}

export const CLASS_ORDER = ['orange', 'violet', 'blue', 'green']          // от лучшего к худшему
export const TOOL_ORDER  = ['huntingNet', 'fishingNet', 'rope']  // от лучшего к худшему

// шанс успеха: RATE[средство][класс]
export const RATE = {
  hands:      { orange: 0.005, violet: 0.2,  blue: 0.3, green: 0.9 },
  rope:       { orange: 0.1,  violet: 0.4,  blue: 0.7, green: 1},
  fishingNet: { orange: 0.3,  violet: 0.9, blue: 1, green: 1 },
  huntingNet: { orange: 0.8,  violet: 1, blue: 1, green: 1},
}

