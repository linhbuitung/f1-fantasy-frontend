export type JoinRequestGetDto = {
  leagueId: number;
  userId: number;
  userDisplayName?: string | null;
  userEmail: string;
  isAccepted: boolean;
};
