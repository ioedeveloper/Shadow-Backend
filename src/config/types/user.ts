import { ObjectID } from 'typeorm';
import { UserModel } from '../../model/user';
interface IUser {
    _id: ObjectID;
    email: string;
    extensionId: string;
    jwtRefreshToken: string;
    createdAt: Date;
    lastActive: Date;
    deleted: boolean;
    deletedBy: UserModel;
}

export { IUser };
