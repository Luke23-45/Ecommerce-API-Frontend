

import { isEqual } from 'lodash'; 

/**
 * Compares two objects and returns a new object containing only the keys
 * where the values have changed. It performs a deep comparison, making it
 * suitable for nested objects and arrays.
 *
 * @param {T} original - The original object to compare against.
 * @param {T} current - The current object with potential changes.
 * @returns {Partial<T>} An object containing only the changed key-value pairs.
 */
export const getChangedFields = <T extends Record<string, any>>(
  original: T,
  current: T
): Partial<T> => {
  const changes: Partial<T> = {};

  if (!original) {
    return current; 
  }

  
  for (const key in current) {
    if (Object.prototype.hasOwnProperty.call(current, key)) {
      const originalValue = original[key];
      const currentValue = current[key];

      
      
      if (!isEqual(originalValue, currentValue)) {
        changes[key as keyof T] = currentValue;
      }
    }
  }

  return changes;
};



