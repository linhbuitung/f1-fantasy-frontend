import { Role } from '../../user/dtos/user.get.dto';

export interface ApplicationUserForAdminGetDto {
  id: number;
  displayName?: string | null;
  email: string;
  roles: Role[];
}
