export interface UserResetPasswordDto {
  email: string;
  resetCode: string;
  newPassword: string;
}
