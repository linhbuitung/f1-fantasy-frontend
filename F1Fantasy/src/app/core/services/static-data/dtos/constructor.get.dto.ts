
export interface ConstructorGetDto {
  id: number;
  name: string;
  countryId: string;
  code: string;
  imgUrl?: string;
  price: number;
}

export interface ConstructorSearchResultDto {
  items:  ConstructorGetDto[];
  total: number;
  pageNum: number;
  pageSize: number;
}
