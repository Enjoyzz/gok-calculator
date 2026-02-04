import {formatLargeNumber} from '@/utils/formatNumbers.js';

export function useGenerateBadge(total, approximately = false) {
  if (total > 0) {
    return (approximately === true ? '~' : '') + formatLargeNumber(total, {removeZero: true})
  }
  return null
}
