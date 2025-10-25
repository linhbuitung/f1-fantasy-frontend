
export interface CircuitGetDto {
  id?: number | null;
  circuitName: string;
  code: string;
  latitude: number;
  longitude: number;
  locality: string;
  countryId: string;
  imgUrl?: string | null;
}

export interface CircuitSearchResultDto {
  items: CircuitGetDto[];
  total: number;
  pageNum: number;
  pageSize: number;
}
