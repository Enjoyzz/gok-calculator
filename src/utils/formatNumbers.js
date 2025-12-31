/**
 * Форматирует большие числа с сокращениями (K, M, B, T, Q)
 * @param {number} num - Число для форматирования
 * @param {Object} options - Настройки форматирования
 * @param {number} [options.decimals=1] - Количество знаков после запятой
 * @param {number} [options.removeZero=false] - Убираем лишние нули после запятой
 * @param {string} [options.locale='ru-RU'] - Локаль для разделителей
 * @param {boolean} [options.withCurrency=false] - Добавить символ валюты
 * @param {string} [options.currency='₽'] - Символ валюты
 * @param {'before'|'after'} [options.currencyPosition='after'] - Позиция валюты
 * @param {string} [options.fallback='0'] - Значение при некорректных данных
 * @returns {string} Отформатированная строка
 */
export const formatLargeNumber = (num, options = {}) => {
  const {
    decimals = 3,
    removeZero = false,
    locale = 'ru-RU',
    withCurrency = false,
    currency = '₽',
    currencyPosition = 'after',
    fallback = '0',
  } = options;

  // Обработка некорректных значений
  if (num === null || num === undefined || isNaN(num)) {
    return fallback;
  }

  // Преобразуем в число если передана строка
  const numericValue = typeof num === 'string' ? parseFloat(num) : num;

  if (isNaN(numericValue)) {
    return fallback;
  }

  const absNum = Math.abs(numericValue);
  const sign = numericValue < 0 ? '-' : '';

  // Определяем нужный суффикс
  let formattedNum;
  let suffix = '';

  if (absNum >= 1e15) { // Квадриллионы
    formattedNum = (absNum / 1e15).toFixed(decimals);
    suffix = 'Q';
  } else if (absNum >= 1e12) { // Триллионы
    formattedNum = (absNum / 1e12).toFixed(decimals);
    suffix = 'T';
  } else if (absNum >= 1e9) { // Миллиарды
    formattedNum = (absNum / 1e9).toFixed(decimals);
    suffix = 'B';
  } else if (absNum >= 1e6) { // Миллионы
    formattedNum = (absNum / 1e6).toFixed(decimals);
    suffix = 'M';
  } else if (absNum >= 1e3) { // Тысячи
    formattedNum = (absNum / 1e3).toFixed(decimals);
    suffix = 'K';
  } else {
    // Меньше 1000 - форматируем с разделителями тысяч
    return formatSmallNumber(numericValue, locale, withCurrency, currency,
        currencyPosition);
  }

  // Убираем лишние нули после запятой
  if (removeZero && decimals > 0) {
    formattedNum = formattedNum.replace(/\.?0+$/, '');
  }

  let result = `${sign}${formattedNum}${suffix}`;

  // Добавляем валюту если нужно
  if (withCurrency) {
    result = currencyPosition === 'before'
        ? `${currency}${result}`
        : `${result}${currency}`;
  }

  return result;
};

/**
 * Вспомогательная функция для форматирования чисел < 1000
 * @private
 */
const formatSmallNumber = (
    num, locale, withCurrency, currency, currencyPosition) => {
  const formatter = new Intl.NumberFormat(locale, {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  });

  let result = formatter.format(num);

  if (withCurrency) {
    result = currencyPosition === 'before'
        ? `${currency}${result}`
        : `${result}${currency}`;
  }

  return result;
};

/**
 * Упрощенная версия форматирования чисел с сокращениями
 * @param {number} num - Число для форматирования
 * @returns {string} Отформатированная строка
 */
export const formatNumberShort = (num) => {
  if (num === null || num === undefined || isNaN(num)) return '0';

  const absNum = Math.abs(num);
  const sign = num < 0 ? '-' : '';

  if (absNum >= 1e15) return `${sign}${(absNum / 1e15).toFixed(1).
      replace(/\.0$/, '')}Q`;
  if (absNum >= 1e12) return `${sign}${(absNum / 1e12).toFixed(1).
      replace(/\.0$/, '')}T`;
  if (absNum >= 1e9) return `${sign}${(absNum / 1e9).toFixed(1).
      replace(/\.0$/, '')}B`;
  if (absNum >= 1e6) return `${sign}${(absNum / 1e6).toFixed(1).
      replace(/\.0$/, '')}M`;
  if (absNum >= 1e3) return `${sign}${(absNum / 1e3).toFixed(1).
      replace(/\.0$/, '')}K`;

  return Math.floor(absNum).toString();
};

