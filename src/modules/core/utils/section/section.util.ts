import { SectionBanner } from "../../types/section/section.type";
import Banner1 from "../../../../assets/images/section-banners/Banner_1.jpg";
import Banner2 from "../../../../assets/images/section-banners/Banner_2.jpg";
import Banner3 from "../../../../assets/images/section-banners/Banner_3.jpg";

export const getSectionBanner = (banner: SectionBanner): string => {
  switch (banner) {
    case "SBanner_1":
      return Banner1;
    case "SBanner_2":
      return Banner2;
    case "SBanner_3":
      return Banner3;
    default:
      return Banner1;
  }
};
