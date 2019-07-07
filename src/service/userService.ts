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
        const existingUser = await this._data.findOneBy({
            email: user.email,
        });
        if (existingUser) return true;
        else return false;
    }

    public async login(user: IUser): Promise<IUser> {
        try {
            const existingUser = await this._data.findOneBy({
                email: user.email,
            });
            if (!existingUser) {
                const error = new Error();
                error.message = 'User does not exist.';
                throw error;
            }
            if (!existingUser.extensionId) {
                const error = new Error();
                error.message = 'Invalid user. Please sign up.';
                throw error;
            }
            const result = await bcrypt.compare(user.extensionId, existingUser.extensionId);
            if (result) {
                return existingUser;
            }
            return existingUser;
        } catch (error) {
            throw error;
        }
    }
}

export { UserService };
