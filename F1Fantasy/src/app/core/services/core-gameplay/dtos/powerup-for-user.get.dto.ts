export interface PowerupForUserDto {
  id: number;
  type: string;
  description: string;
  status: 'Available' | 'Used' | 'Using';
  imgUrl?: string;
}
