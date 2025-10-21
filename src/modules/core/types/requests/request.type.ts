import { ProfilePicture } from "../user.type";

export type RequestType = "account-information";
export type RequestStatus = "pending" | "approved" | "rejected";

export type SenderModel = "Teacher" | "Student";
export type ReceiverModel = "Teacher" | "Admin";

export type AccountInformationRequestType = {
  firstName?: string;
  lastName?: string;
  middleName?: string;
  email?: string;
  profilePicture?: ProfilePicture;
  originalData?: {
    firstName?: string;
    lastName?: string;
    middleName?: string;
    email?: string;
    profilePicture?: ProfilePicture;
  };
};

export type Request = {
  id: string;
  senderId: string;
  senderModel: SenderModel;
  receiverId: string;
  receiverModel: ReceiverModel;
  type: RequestType;
  accountInfo?: AccountInformationRequestType;
  status: RequestStatus;
  createdAt: string;
  updatedAt: string;
};
