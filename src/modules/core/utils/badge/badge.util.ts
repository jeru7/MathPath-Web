import dieIcon from "../../../../assets/images/badges/dice.png";
import compassIcon from "../../../../assets/images/badges/compass.png";
import scrollIcon from "../../../../assets/images/badges/scroll.png";
import lensIcon from "../../../../assets/images/badges/lens.png";
import { BadgeType } from "../../types/badge/badge.type";

export const getBadgeIcon = (type: BadgeType) => {
  switch (type) {
    case "lens":
      return lensIcon;
    case "scroll":
      return scrollIcon;
    case "die":
      return dieIcon;
    case "compass":
      return compassIcon;
  }
};
