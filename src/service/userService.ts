import { INewUser } from '../config/types/user';
import { UserModel } from '../model/user';

export default class UserService {
    public async addUser(newUser: INewUser): Promise<UserModel> {
        
    }
}