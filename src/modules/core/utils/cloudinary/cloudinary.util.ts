import axios from "axios";
import { URL } from "../../constants/api.constant.js";

export const uploadImage = async (file: File) => {
  const signatureRes = await axios.get(`${URL}/api/shared/cloudinary`);

  const { timestamp, signature, cloudName, apiKey, folder } =
    signatureRes.data.data;

  const formData = new FormData();
  formData.append("file", file);
  formData.append("api_key", apiKey);
  formData.append("timestamp", timestamp);
  formData.append("signature", signature);
  formData.append("folder", folder);

  const cloudRes = await axios.post(
    `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
    formData,
  );

  return {
    secureUrl: cloudRes.data.secure_url,
    publicId: cloudRes.data.public_id,
  };
};

export const deleteImage = async (publicId: string) => {
  await axios.delete(`${URL}/api/shared/cloudinary`, { data: { publicId } });
};
