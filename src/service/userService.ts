import { IUser } from '../config/types/user';
import { UserDataService } from './userDataService';

class UserService {

    private _data: UserDataService;

    constructor() {
        this._data = new UserDataService();
    }

    public async addUser(newUser: IUser): Promise<IUser> {
        try {
            newUser = await this._data.create(newUser);
            return newUser;
        } catch (error) {
            throw error;
        }
    }
}

export { UserService };
