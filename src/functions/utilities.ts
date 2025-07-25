export function parseIntWithDefaultValue(
  param: any,
  defaultValue: number
): number {
  const result = Number.parseInt(param);
  if (isNaN(result)) return defaultValue;
  else return result;
}
