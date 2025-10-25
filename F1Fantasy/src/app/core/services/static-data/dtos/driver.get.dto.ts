
export interface DriverGetDto {
  id: number;
  givenName: string;
  familyName: string;
  dateOfBirth: string; // ISO string format
  countryId: string;
  code: string;
  price: number;
  imgUrl?: string;
}

export interface DriverSearchResultDto {
  items:  DriverGetDto[];
  total: number;
  pageNum: number;
  pageSize: number;
}
