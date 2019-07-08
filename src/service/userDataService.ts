import { MongoRepository, getMongoRepository, UpdateWriteOpResult } from 'typeorm';
import { User } from '../model/user';

/**
 * UserDataService
 * @description Handles all user data access operations (CRUD)
 */
export class UserDataService {
    private _db: MongoRepository<User>;

    public async create(newUser: User): Promise<User> {
        const userModel: User = new User();
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

    public async findBy(query: User, skip: number, take: number): Promise<User[]> {
        if (!skip) skip = 0;
        if (!take) take = 10;
        query.deleted = false;
        try {
            if (!this._db) await this._init();
            const users: User[] = await this._db.find({
                where: query,
                skip,
                take,
            });
            return users;
        } catch (error) {
            throw error;
        }
    }

    public async findOneBy(query: User): Promise<User | undefined> {
        query.deleted = false;
        try {
            if (!this._db) await this._init();
            const user: User | undefined = await this._db.findOne(query);
            return user;
        } catch (error) {
            throw error;
        }
    }

    public async update(user: User): Promise<User> {
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

    public async countBy(query: User): Promise<number> {
        query.deleted = false;
        try {
            if (!this._db) await this._init();
            const count = await this._db.count(query);
            return count;
        } catch (error) {
            throw error;
        }
    }

    public async deleteBy(query: User, userId: number): Promise<UpdateWriteOpResult> {
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
        this._db = getMongoRepository(User);
    }
}
