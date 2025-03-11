export class ChartDataResponseDto {
  data: ChartDataType[] = [];
}

export class ChartDataType {
  key!: string;
  value!: number;
}
