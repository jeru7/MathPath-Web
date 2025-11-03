export type BadgeType = "scroll" | "compass" | "die" | "lens";

export type Badge = {
  id: string;
  name: string;
  req: number;
  description: string;
  guide: string;
  type: BadgeType;
};
