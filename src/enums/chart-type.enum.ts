export enum ChartType {
  MONTHS = "MONTHS",
  WEEKS = "WEEKS",
  DAYS = "DAYS",
}

export function convertToChartTypeEnum(str: string): ChartType | undefined {
  const colorValue = ChartType[str as keyof typeof ChartType];
  return colorValue;
}

export function convertStringToEnum<T extends object>(
  str: string,
  enumObj: T,
): T[keyof T] {
  const values = Object.values(enumObj) as T[keyof T][];
  return values.find((value) => value === str) as T[keyof T];
}
