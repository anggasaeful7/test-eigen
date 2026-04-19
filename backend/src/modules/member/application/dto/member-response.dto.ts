export interface MemberResponseDto {
  code: string;
  name: string;
  penaltyEndDate: Date | null;
  borrowedBooksCount: number;
}
