import { Entity, ObjectID, ObjectIdColumn, Column, OneToOne, JoinColumn } from 'typeorm';

@Entity()
export class UserModel {
    @ObjectIdColumn()
    _id: ObjectID

    @Column()
    email: string;

    @Column()
    extensionId: string;

    @Column()
    jwtRefreshToken: string

    @Column()
    createdAt: Date

    @Column()
    lastActive: Date

    @Column()
    deleted: boolean = false;

    @OneToOne(type => UserModel)
    @JoinColumn()
    deletedBy: UserModel
}
