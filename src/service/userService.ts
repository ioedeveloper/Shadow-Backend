import { IUser } from '../config/types/user';
import { UserDataService } from './userDataService';
import * as bcrypt from 'bcrypt';
import { v1 } from 'uuid';

class UserService {

    private _data: UserDataService;

    constructor() {
        this._data = new UserDataService();
    }

    public async addUser(user: IUser): Promise<IUser> {
        const hash = await bcrypt.hash(user.extensionId, 10);
        const jwtRefreshToken = v1();
        user.extensionId = hash;
        user.jwtRefreshToken = jwtRefreshToken;
        try {
            const newUser = await this._data.create(user);
            return newUser;
        } catch (error) {
            throw error;
        }
    }

    public async checkUserExist(user: IUser): Promise<boolean> {
        const existingUser = await this._data.findOneBy(user);
        if (existingUser) return true;
        else return false;
    }

    public async login(user: IUser): Promise<IUser | undefined> {
        try {
            const existingUser = await this._data.findOneBy(user);
            if (!existingUser) {
                const error = new Error('User does not exist.');
                throw error;
            }
            return existingUser;
        } catch (error) {
            throw error;
        }
    }
}

export { UserService };
