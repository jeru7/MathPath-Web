import { type ReactElement } from "react";
import ModalOverlay from "../../modal/ModalOverlay";
import { ProfilePicture } from "../../../types/user.type";
import { getProfilePicture } from "../../../utils/profile-picture.util";
import { FaTimes } from "react-icons/fa";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

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
      <Card className="max-w-sm mx-4">
        <CardContent className="p-3">
          <div className="flex flex-col gap-2 items-center">
            <Button
              variant="ghost"
              size="icon"
              className="self-end hover:cursor-pointer"
              onClick={onClose}
            >
              <FaTimes className="h-4 w-4" />
            </Button>
            <img
              src={getProfilePicture((picture as ProfilePicture) ?? "Default")}
              alt="Profile Preview"
              className="w-full h-auto object-contain rounded-sm"
            />
          </div>
        </CardContent>
      </Card>
    </ModalOverlay>
  );
}
