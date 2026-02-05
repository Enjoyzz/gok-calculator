//удалить через пару месяцев

import {useIntimacyStore} from '@/stores/intimacy.js';
import {useCharmStore} from "@/stores/charm.js";
import {useMeatStore} from "@/stores/meat.js";
import {useSilverStore} from "@/stores/silver.js";
import {useSoldiersStore} from "@/stores/soldiers.js";


const OLD_STORAGE_KEY = 'calculatorData';
const OLD_STORAGE_SETTINGS_KEY = 'formulaSettings';
export const MIGRATION_VERSION_KEY = 'app_data_version';
export const CURRENT_VERSION = '2.0';

const NEW_STORAGE_KEYS = [
  'charm',
  'charm-setting',
  'intimacy',
  'intimacy-setting',
  'meat',
  'silver',
  'soldiers',
];

function hasNewData() {
  return NEW_STORAGE_KEYS.some(key =>
    localStorage.getItem(key) !== null
  );
}


// Функция для полной миграции всех данных
export function migrateAllData() {
  // Если уже есть новые данные, миграция не нужна
  if (hasNewData()) {
    console.log('Новые данные уже существуют, миграция пропущена');
    localStorage.setItem(MIGRATION_VERSION_KEY, CURRENT_VERSION);
    return false;
  }


  const intimacyStore = useIntimacyStore();
  const charmStore = useCharmStore();
  const meatStore = useMeatStore();
  const silverStore = useSilverStore();
  const soldiersStore = useSoldiersStore();

  const oldDataStr = localStorage.getItem(OLD_STORAGE_KEY);
  if (!oldDataStr) {
    // Нет старых данных - просто ставим версию
    localStorage.setItem(MIGRATION_VERSION_KEY, CURRENT_VERSION);
    return false;
  }

  try {
    const oldData = JSON.parse(oldDataStr);
    const oldSettings = JSON.parse(localStorage.getItem(OLD_STORAGE_SETTINGS_KEY));

    console.log('Выполняется миграция данных из старого формата...');

    const charmData = {
      concubines: String(oldData.concubines || "0"),
      blueHadak: String(oldData.blueHadak || "0"),
      whiteHadak: String(oldData.whiteHadak || "0"),
      goldHairpin: String(oldData.goldHairpin || "0"),
      silverHairpin: String(oldData.silverHairpin || "0"),
      perfume: String(oldData.perfume || "0"),
      chests: String(oldData.chests || "0"),
      forage: String(oldData.forage || "0")
    };

    const charmSettings = {
      blueHadak: String(oldSettings?.charm.blueHadak || 1.5),
      silverHairpin: String(oldSettings?.charm.silverHairpin || 3),
      chests: String(oldSettings?.charm.chests || 2.2),
      forage: String(oldSettings?.charm.forage || 1.5),
    };

    const intimacyData = {
      concubines: String(oldData.concubines || "0"),
      ordos: String(oldData.ordos || "0"),
      takya: String(oldData.takya || "0"),
      jadeBracelet: String(oldData.jadeBracelet || "0"),
      sandalwoodBracelet: String(oldData.sandalwoodBracelet || "0"),
      goldEarrings: String(oldData.goldEarrings || "0"),
      gemRing: String(oldData.gemRing || "0"),
      loveLetter: String(oldData.loveLetter || "0"),
      forage: String(oldData.forage || "0")
    };

    const intimacySettings = {
      ordos: String(oldSettings?.intimacy.ordos || 1.5),
      sandalwoodBracelet: String(oldSettings?.intimacy.sandalwoodBracelet || 3),
      forage: String(oldSettings?.intimacy.forage || 1.2),
    };

    // Meat
    const meatData = {
      meat: String(oldData.meat || "0"),
      meat88K_8M: String(oldData.meat88K_8M || "0"),
      meat10M: String(oldData.meat10M || "0"),
      meat1M: String(oldData.meat1M || "0"),
      meat100K: String(oldData.meat100K || "0"),
      meat2h: String(oldData.meat2h || "0"),
      meat1h: String(oldData.meat1h || "0"),
      meat30m: String(oldData.meat30m || "0"),
      meat15m: String(oldData.meat15m || "0"),
      meat5m: String(oldData.meat5m || "0"),
      medal: String(oldData.medal || "0"),
      chest: String(oldData.chest || "0")
    };

    // Silver
    const silverData = {
      silver: String(oldData.silver || "0"),
      silver88K_8M: String(oldData.silver88K_8M || "0"),
      silver10M: String(oldData.silver10M || "0"),
      silver1M: String(oldData.silver1M || "0"),
      silver100K: String(oldData.silver100K || "0"),
      silver2h: String(oldData.silver2h || "0"),
      silver1h: String(oldData.silver1h || "0"),
      silver30m: String(oldData.silver30m || "0"),
      silver15m: String(oldData.silver15m || "0"),
      silver5m: String(oldData.silver5m || "0")
    };

    // Soldiers
    const soldiersData = {
      soldiers: String(oldData.soldiers || "0"),
      soldiers88K_8M: String(oldData.soldiers88K_8M || "0"),
      soldiers10M: String(oldData.soldiers10M || "0"),
      soldiers1M: String(oldData.soldiers1M || "0"),
      soldiers100K: String(oldData.soldiers100K || "0"),
      soldiers2h: String(oldData.soldiers2h || "0"),
      soldiers1h: String(oldData.soldiers1h || "0"),
      soldiers30m: String(oldData.soldiers30m || "0"),
      soldiers15m: String(oldData.soldiers15m || "0"),
      soldiers5m: String(oldData.soldiers5m || "0")
    };

    // Сохраняем все данные
    charmStore.setCharmValues(charmData)
    charmStore.setCharmSettings(charmSettings)
    intimacyStore.setIntimacyValues(intimacyData)
    intimacyStore.setIntimacySettings(intimacySettings)
    meatStore.setMeatValues(meatData)
    silverStore.setSilverValues(silverData)
    soldiersStore.setSoldiersValues(soldiersData)

    // Удаляем старые данные (опционально)
    localStorage.removeItem(OLD_STORAGE_KEY);
    localStorage.removeItem(OLD_STORAGE_SETTINGS_KEY);

    // Сохраняем версию
    localStorage.setItem(MIGRATION_VERSION_KEY, CURRENT_VERSION);

    console.log('Миграция всех данных выполнена успешно');
    return true;

  } catch (error) {
    console.warn('Ошибка миграции:', error);
    // Даже при ошибке ставим версию, чтобы не пытаться мигрировать снова
    localStorage.setItem(MIGRATION_VERSION_KEY, CURRENT_VERSION);
    return false;
  }
}

// Проверяем необходимость миграции
export function checkMigrationNeeded() {
  const currentVersion = localStorage.getItem(MIGRATION_VERSION_KEY);
  const hasOldData = localStorage.getItem(OLD_STORAGE_KEY) !== null;

  // Если нет версии или версия старая
  return hasOldData && (!currentVersion || currentVersion !== CURRENT_VERSION);

}

// Безопасная миграция (не перезаписывает существующие данные)
export function safeMigrateAllData() {
  if (hasNewData()) {
    console.log('Новые данные уже существуют, миграция не требуется');
    localStorage.setItem(MIGRATION_VERSION_KEY, CURRENT_VERSION);
    return false;
  }

  return migrateAllData();
}
