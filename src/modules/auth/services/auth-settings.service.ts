import axios from "axios";
import { URL } from "../../core/constants/api.constant.js";
import { ChangeAccountSettingsRequest } from "../types/auth-settings.type.js";

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
    `${URL}/api/web/auth/settings/password/${userId}`,
    { payload: data },
    { withCredentials: true },
  );
};

export const changeAccountSettingsService = async (
  userId: string,
  data: ChangeAccountSettingsRequest,
) => {
  await axios.post(
    `${URL}/api/web/auth/settings/account-information/${userId}`,
    { payload: data },
    { withCredentials: true },
  );
};
