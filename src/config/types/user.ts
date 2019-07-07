import { ObjectID } from 'typeorm';
import { User } from '../../model/user';
interface IUser {
    _id ?: ObjectID;
    email ?: string;
    extensionId ?: string;
    jwtRefreshToken ?: string;
    createdAt ?: Date;
    lastActive ?: Date;
    deleted ?: boolean;
    deletedBy ?: User;
}

export { IUser };
