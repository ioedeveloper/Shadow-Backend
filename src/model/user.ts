import { Entity, ObjectID, ObjectIdColumn, Column, OneToOne } from 'typeorm';

@Entity()
export class UserModel{
    @ObjectIdColumn()
    _id: ObjectID

    @Column()
    email: string;

    @Column()
    extensionId: string;

    @Column()
    jwtRefreshToken: string

    @Column()
    createdAt: Date = new Date

    @Column()
    lastActive: Date = new Date

    @Column()
    deleted: boolean = false;

    @OneToOne(type => UserModel, user => user._id)
    deletedBy: UserModel
}
