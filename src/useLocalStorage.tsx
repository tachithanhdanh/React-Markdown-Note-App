import { useEffect, useState } from "react";

export default function useLocalStorage<T>(key: string, initialValue: T | (() => T)) {
  const [storedValue, setStoredValue] = useState<T>(() => {
    const item = localStorage.getItem(key);
    if (item) {
      return JSON.parse(item);
    }
    return initialValue instanceof Function ? initialValue() : initialValue;
  });
  useEffect(() => {
    localStorage.setItem(key, JSON.stringify(storedValue));
  }, [key, storedValue]);
  return [storedValue, setStoredValue] as [T, (value: T) => void];
}