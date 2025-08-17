import Boy_1 from "../../../assets/images/profile-pictures/BOY_1.png";
import Boy_2 from "../../../assets/images/profile-pictures/BOY_2.png";
import Boy_3 from "../../../assets/images/profile-pictures/BOY_3.png";
import Girl_1 from "../../../assets/images/profile-pictures/GIRL_1.png";
import Girl_2 from "../../../assets/images/profile-pictures/GIRL_1.png";
import Girl_3 from "../../../assets/images/profile-pictures/GIRL_1.png";
import { ProfilePicture } from "../types/user.type";

export const getProfilePictures = (profilePicture: ProfilePicture) => {
  switch (profilePicture) {
    case "Boy_1":
      return Boy_1;
    case "Boy_2":
      return Boy_2;
    case "Boy_3":
      return Boy_3;
    case "Girl_1":
      return Girl_1;
    case "Girl_2":
      return Girl_2;
    case "Girl_3":
      return Girl_3;
    default:
    // TODO: default profile
  }
};
