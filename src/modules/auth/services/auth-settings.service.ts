import axios from "axios";

export type ChangePasswordRequest = {
  currentPassword: string;
  newPassword: string;
  confirmNewPassword: string;
};

export const changePasswordService = async (
  userId: string,
  data: ChangePasswordRequest,
) => {
  await axios.post(
    `${URL}/api/web/auth/change-password/${userId}`,
    { payload: data },
    { withCredentials: true },
  );
};
