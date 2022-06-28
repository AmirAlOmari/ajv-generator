export function getFromMap<Key = string, Value = unknown>(
  keys: Key[],
  map: Map<Key, Value>,
): Value | null {
  for (const key of keys) {
    const value = map.get(key);

    if (value) {
      return value;
    }
  }

  return null;
}
