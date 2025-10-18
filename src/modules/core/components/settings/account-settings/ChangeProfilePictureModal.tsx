import { useState, type ReactElement } from "react";
import { ProfilePicture } from "../../../types/user.type";
import { CiCamera } from "react-icons/ci";
import { getProfilePicture } from "../../../utils/profile-picture.util";

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
  onUploadPicture: () => void;
  onSave: () => void;
};

export default function ChangeProfilePictureModal({
  onClose,
  currentProfilePicture,
  onSelectProfilePicture,
  onUploadPicture,
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
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-md w-full">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Choose Profile Picture
          </h3>
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* TODO: upload picture */}
        <div className="mb-6">
          <button
            onClick={onUploadPicture}
            className="w-full py-3 px-4 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg hover:border-green-500 dark:hover:border-green-400 transition-colors flex items-center justify-center gap-2 text-gray-600 dark:text-gray-400 hover:text-green-600 dark:hover:text-green-400"
          >
            <CiCamera className="w-5 h-5" />
            <span className="font-medium">Upload Custom Picture</span>
          </button>
          <p className="text-xs text-gray-500 dark:text-gray-400 text-center mt-2">
            Coming soon - you'll be able to upload your own photo
          </p>
        </div>

        <div className="relative mb-4">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300 dark:border-gray-600" />
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-400">
              Or choose from our selection
            </span>
          </div>
        </div>

        <div className="grid grid-cols-4 gap-3 mb-6">
          {AVAILABLE_PROFILE_PICTURES.map((picture) => (
            <div
              key={picture}
              className={`relative cursor-pointer rounded-lg transition-all transform hover:scale-105 ${
                selectedPicture === picture
                  ? "ring-2 ring-green-500 dark:ring-green-400 ring-offset-2"
                  : "hover:ring-2 hover:ring-gray-300 dark:hover:ring-gray-600"
              }`}
              onClick={() => handlePictureSelect(picture)}
            >
              <img
                src={getProfilePicture(picture)}
                alt="Profile option"
                className="w-full h-16 object-cover rounded-lg"
              />
              {selectedPicture === picture && (
                <div className="absolute inset-0 bg-green-500 bg-opacity-20 rounded-lg flex items-center justify-center">
                  <svg
                    className="w-6 h-6 text-green-600 dark:text-green-400"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="flex justify-end gap-3">
          <button
            onClick={handleClose}
            className="px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors text-sm font-medium"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={!selectedPicture}
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors text-sm font-medium"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
}
