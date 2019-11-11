import { Entity, ObjectID, ObjectIdColumn, Column, OneToOne } from 'typeorm';

@Entity()
export class User{
    @ObjectIdColumn()
    _id ?: ObjectID

    @Column()
    email ?: string;

    @Column()
    extensionId ?: string;

    @Column()
    accessCode ?: string;

    @Column()
    jwtRefreshToken ?: string

    @Column()
    createdAt ?: Date = new Date

    @Column()
    lastActive ?: Date = new Date

    @Column()
    deleted  ?: boolean = false;

    @OneToOne(type => User, user => user._id)
    deletedBy ?: User
}
