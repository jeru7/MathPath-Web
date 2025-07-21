export type QuestType =
  | "Level"
  | "Shop"
  | "Skill"
  | "Stage"
  | "Monster"
  | "Item"
  | "Sunny"
  | "MagicBook";

export type QuestList = {
  percentage: number;
  chests: QuestChests;
  quests: QuestListItem[];
};

export type QuestListItem = {
  name: string;
  type: QuestType;
  claimed: boolean;
  reqCompleted: number;
  req: number;
};

export type QuestChests = {
  quest25: {
    completed: boolean;
    rewards: QuestChestReward;
    claimed: boolean;
  };
  quest50: {
    completed: boolean;
    rewards: QuestChestReward;
    claimed: boolean;
  };
  quest100: {
    completed: boolean;
    rewards: QuestChestReward;
    claimed: boolean;
  };
};

export type QuestChestReward = {
  exp: number;
  coins: number;
};
