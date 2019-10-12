import { IUser } from '../config/types/user';
import { UserDataService } from './userDataService';
import * as bcrypt from 'bcrypt';
import { v1 } from 'uuid';
import axios from 'axios';
import * as  dotenv from 'dotenv';
dotenv.config();

// tslint:disable-next-line: no-var-requires
const open = require('opn');

class UserService {

    private _data: UserDataService;

    constructor() {
        this._data = new UserDataService();
    }

    public async addUser(user: IUser): Promise<IUser> {
        const randomString = Math.random().toString(36).substring(7);
        const hash = await bcrypt.hash(randomString, 10);
        const jwtRefreshToken = v1();

        user.extensionId = hash;
        user.jwtRefreshToken = jwtRefreshToken;
        try {
            const newUser = await this._data.create(user);

            // tslint:disable-next-line: max-line-length
            open(`https://github.com/login/oauth/authorize?client_id=${process.env.CLIENT_ID}&state=${newUser.extensionId}&redirect_uri=${process.env.REDIRECT_URI}`);

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

    public async login(user: IUser, numberOfAttempts?: number): Promise<IUser> {
        try {
            const existingUser = await this._data.findOneBy({
                extensionId: user.extensionId,
            });
            if (!existingUser) {
                const error = new Error();
                error.message = 'User does not exist.';
                throw error;
            }
            if (!existingUser.accessCode && !numberOfAttempts) {
                // tslint:disable-next-line: max-line-length
                open(`https://github.com/login/oauth/authorize?client_id=${process.env.CLIENT_ID}&state=${existingUser.extensionId}&redirect_uri=${process.env.REDIRECT_URI}`);
            }
            return existingUser;
        } catch (error) {
            throw error;
        }
    }

    public async authorize(code: string, extensionId: string): Promise<IUser> {
        // tslint:disable-next-line: no-console
        console.log('state: ', extensionId);
        const requestOptions = {
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            },
        };
        return axios.post(`https://github.com/login/oauth/access_token`, {
            code,
            client_id: 'b922e165541efc3d09e7',
            client_secret: 'f98e048aef043788f798d490fa75cf02d82de7f4',
        },
        requestOptions).then(async ({ data }) => {
            const user = await this._data.findOneBy({ extensionId });
            // tslint:disable-next-line: no-console
            console.log('user: ', user);

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
}

export { UserService };
