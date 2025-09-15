export type RegistrationCode = {
  id: string;
  code: string;
  teacherId: string;
  sectionId: string;
  maxUses: number;
  uses: number;
  expiresAt: string;
  createdAt: string;
};
