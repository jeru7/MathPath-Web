import { type ReactElement } from "react";
import ModalOverlay from "../../modal/ModalOverlay";
import { ProfilePicture } from "../../../types/user.type";
import { getProfilePicture } from "../../../utils/profile-picture.util";
import { FaTimes } from "react-icons/fa";

type ProfilePictureModalProps = {
  isOpen: boolean;
  onClose: () => void;
  picture: ProfilePicture | string | null;
};

export default function ProfilePictureModal({
  isOpen,
  onClose,
  picture,
}: ProfilePictureModalProps): ReactElement {
  return (
    <ModalOverlay isOpen={isOpen} onClose={onClose}>
      <div className="flex flex-col gap-2 items-end bg-white p-3 dark:bg-gray-800 rounded-sm overflow-hidden shadow-2xl max-w-sm w-full mx-4 border border-gray-200 dark:border-gray-700">
        <button
          type="button"
          className="hover:cursor-pointer"
          onClick={onClose}
        >
          <FaTimes className="h-4 w-4 text-gray-900 dark:text-gray-300" />
        </button>
        <img
          src={getProfilePicture((picture as ProfilePicture) ?? "Default")}
          alt="Profile Preview"
          className="w-full h-auto object-contain rounded-sm"
        />
      </div>
    </ModalOverlay>
  );
}
