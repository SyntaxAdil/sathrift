import { ObjectId } from "mongodb";

interface IUser {
  _id: string | ObjectId;
  name: string;
  image?: string | null;
  email: string;
  createdAt?: Date;
  phoneNumber: number | string;

  university: string;
}

export default IUser;
