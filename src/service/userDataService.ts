import { MongoRepository, getMongoRepository, UpdateWriteOpResult } from 'typeorm';
import { UserModel } from '../model/user';

export class UserDataService {
    private _db: MongoRepository<UserModel>;

    public async create(newUser: UserModel): Promise<UserModel> {
        const userModel: UserModel = new UserModel();
        userModel.email = newUser.email;
        userModel.extensionId = newUser.extensionId;
        userModel.jwtRefreshToken = newUser.jwtRefreshToken;
        try {
            if (!this._db) await this._init();
            const user = await this._db.save(userModel);
            return user;
        } catch (error) {
            throw error;
        }
    }

    public async findBy(query: UserModel, skip: number, take: number): Promise<UserModel[]> {
        if (!skip) skip = 0;
        if (!take) take = 10;
        query.deleted = false;
        try {
            if (!this._db) await this._init();
            const users: UserModel[] = await this._db.find({
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
            if (!this._db) await this._init();
            const user: UserModel | undefined = await this._db.findOne(query);
            return user;
        } catch (error) {
            throw error;
        }
    }

    public async update(user: UserModel): Promise<UserModel> {
        if (!user._id) {
            try {
                if (!this._db) await this._init();
                const newUser = this.create(user);
                return newUser;
            } catch (error) {
                throw error;
            }
        } else {
            user.deleted = false;
            try {
                if (!this._db) await this._init();
                await this._db.findOneAndUpdate({id: user._id}, {
                    $set: {
                        email: user.email,
                        extensionId: user.extensionId,
                    },
                });
                return user;
            } catch (error) {
                throw error;
            }
        }
    }

    public async countBy(query: UserModel): Promise<number> {
        query.deleted = false;
        try {
            if (!this._db) await this._init();
            const count = await this._db.count(query);
            return count;
        } catch (error) {
            throw error;
        }
    }

    public async deleteBy(query: UserModel, userId: number): Promise<UpdateWriteOpResult> {
        query.deleted = false;
        try {
            if (!this._db) await this._init();
            const result: UpdateWriteOpResult = await this._db.updateMany(query, {
                $set: {
                    deleted: true,
                    deleteBy: userId,
                },
            });
            return result;
        } catch (error) {
            throw error;
        }
    }

    private async _init() {
        this._db = getMongoRepository(UserModel);
    }
}
