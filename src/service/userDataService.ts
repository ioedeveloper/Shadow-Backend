import { MongoRepository, getConnection, UpdateWriteOpResult } from 'typeorm';
import { UserModel } from '../model/user';

export class UserDataService {
    private _db: MongoRepository<UserModel>;

    constructor() {
        this._db = getConnection().getMongoRepository(UserModel);
    }

    public async findBy(query: UserModel, skip: number, take: number): Promise<UserModel[]> {
        if (!skip) skip = 0;
        if (!take) take = 10;
        query.deleted = false;
        try {
            const users: Array<UserModel> = await this._db.find({
                where: query,
                skip,
                take,
            });
            return users;
        } catch (error) {
            throw error;
        }
    }

    public async findOneBy(query: UserModel): Promise<UserModel | undefined> {
        query.deleted = false;
        try {
            const user: UserModel | undefined = await this._db.findOne(query);
            return user;
        } catch (error) {
            throw error;
        }
    }

    public async create(newUser: UserModel): Promise<UserModel>{
        const userModel: UserModel = new UserModel();
        userModel.id = newUser.id;
        userModel.email = newUser.email;
        userModel.extensionId = newUser.extensionId;
        try{
            const user = await this._db.save(userModel);
            return user;
        } catch (error){
            throw error;
        }
    }

    public async deleteBy(query: UserModel, userId: number): Promise<UpdateWriteOpResult>{
        try{
            const result: UpdateWriteOpResult = await this._db.updateMany(query, {
                $set: {
                    deleted: true,
                    deleteBy: userId
                }
            });
            return result;
        } catch (error){
            throw error;
        }
    }
}