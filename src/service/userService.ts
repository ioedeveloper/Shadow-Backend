import { IUser } from '../config/types/user';
import { UserDataService } from './userDataService';
import * as bcrypt from 'bcrypt';
import { v1 } from 'uuid';
import axios from 'axios';
import appConfig from '../config';
import * as  dotenv from 'dotenv';
dotenv.config();

class UserService {

    private _data: UserDataService;

    constructor() {
        this._data = new UserDataService();
    }

    public async addUser(): Promise<IUser> {
        const user: IUser = {};
        const randomString = Math.random().toString(36).substring(7);
        const hash = await bcrypt.hash(randomString, 10);
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
            extensionId: user.extensionId,
        });
        if (existingUser) return true;
        else return false;
    }

    public async login(user: IUser): Promise<IUser> {
        try {
            const existingUser = await this._data.findOneBy({
                extensionId: user.extensionId,
            });
            if (!existingUser) {
                const error = new Error();
                error.message = 'User does not exist.';
                throw error;
            }
            return existingUser;
        } catch (error) {
            throw error;
        }
    }

    public async authorize(code: string, extensionId: string): Promise<IUser> {
        const requestOptions = {
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            },
        };
        return axios.post(`https://github.com/login/oauth/access_token`, {
            code,
            client_id: process.env.CLIENT_ID,
            client_secret: process.env.CLIENT_SECRET,
        },
        requestOptions).then(async ({ data }) => {
            const user = await this._data.findOneBy({ extensionId });

            if (user !== undefined) {
                user.accessCode = data.access_token;
                await this._data.update(user);
                return user;
            }
            throw new Error('Authorization Failed For Unknown User');
        }).catch(() => {
            throw new Error('Authorization Failed!');
        });
    }

    public async getAccessCode(extensionId: string) {
        try {
            const user = await this._data.findOneBy({
                extensionId,
            });

            if (user && user.accessCode) {
                return user.accessCode;
            }
            throw new Error('Access Code Not Found!');
        } catch (error) {
            throw error;
        }
    }
}

export { UserService };
