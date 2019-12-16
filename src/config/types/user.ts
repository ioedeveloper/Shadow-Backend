import { ObjectID } from 'typeorm';
import { User } from '../../model/user';
interface IUser {
    _id ?: ObjectID;
    email ?: string;
    extensionId ?: string;
    accessCode ?: string;
    jwtRefreshToken ?: string;
    createdAt ?: Date;
    lastActive ?: Date;
    deleted ?: boolean;
    deletedBy ?: User;
}

interface IUserJWTSignature {
    id: ObjectID;
}

export { IUser, IUserJWTSignature };
