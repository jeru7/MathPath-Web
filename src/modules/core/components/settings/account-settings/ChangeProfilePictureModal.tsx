import { useState, type ReactElement } from "react";
import { ProfilePicture } from "../../../types/user.type";
import { getProfilePicture } from "../../../utils/profile-picture.util";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FaTimes, FaCheck } from "react-icons/fa";

const AVAILABLE_PROFILE_PICTURES: ProfilePicture[] = [
  "Boy_1",
  "Boy_2",
  "Boy_3",
  "Girl_1",
  "Girl_2",
  "Girl_3",
  "Default",
];

type ChangeProfilePictureModalProps = {
  onClose: () => void;
  currentProfilePicture: ProfilePicture | null;
  onSelectProfilePicture: (picture: ProfilePicture) => void;
  onSave: () => void;
};

export default function ChangeProfilePictureModal({
  onClose,
  currentProfilePicture,
  onSelectProfilePicture,
  onSave,
}: ChangeProfilePictureModalProps): ReactElement {
  const [selectedPicture, setSelectedPicture] = useState<ProfilePicture | null>(
    currentProfilePicture,
  );

  const handlePictureSelect = (picture: ProfilePicture) => {
    setSelectedPicture(picture);
  };

  const handleSave = () => {
    if (selectedPicture) {
      onSelectProfilePicture(selectedPicture);
    }
    onSave();
  };

  const handleClose = () => {
    setSelectedPicture(currentProfilePicture);
    onClose();
  };

  return (
    <div className="fixed h-full w-full inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="max-w-md w-full">
        <CardHeader className="flex-row items-center justify-between">
          <CardTitle>Choose Profile Picture</CardTitle>
          <Button variant="ghost" size="icon" onClick={handleClose}>
            <FaTimes className="w-5 h-5" />
          </Button>
        </CardHeader>

        <CardContent>
          <div className="grid grid-cols-4 gap-3 mb-6">
            {AVAILABLE_PROFILE_PICTURES.map((picture) => (
              <div
                key={picture}
                className={`relative cursor-pointer rounded-lg transition-all transform hover:scale-105 ${selectedPicture === picture
                    ? "ring-2 ring-primary ring-offset-2"
                    : "hover:ring-2 hover:ring-muted"
                  }`}
                onClick={() => handlePictureSelect(picture)}
              >
                <img
                  src={getProfilePicture(picture)}
                  alt="Profile option"
                  className="w-full h-16 object-cover rounded-lg"
                />
                {selectedPicture === picture && (
                  <div className="absolute inset-0 bg-primary bg-opacity-20 rounded-lg flex items-center justify-center">
                    <FaCheck className="w-6 h-6 text-primary" />
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="flex justify-end gap-3">
            <Button variant="outline" onClick={handleClose}>
              Cancel
            </Button>
            <Button onClick={handleSave} disabled={!selectedPicture}>
              Save
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
