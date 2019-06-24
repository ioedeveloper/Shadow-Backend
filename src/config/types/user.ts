import { ObjectID } from 'typeorm';
interface IUser {
    _id: ObjectID;
    email: string;
    extensionId: string;
    deleted: boolean;
}

export { IUser };
