export enum ChartType {
  MONTHS = 'MONTHS',
  WEEKS = 'WEEKS',
  DAYS = 'DAYS',
}

export function convertToChartTypeEnum(str: string): ChartType | undefined {
  const colorValue = ChartType[str as keyof typeof ChartType];
  return colorValue;
}
