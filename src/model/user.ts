import { Entity, ObjectID, ObjectIdColumn, Column } from 'typeorm';

@Entity()
export class UserModel {
    @ObjectIdColumn()
    _id: ObjectID

    @Column()
    email: string;

    @Column()
    extensionId: string;

    @Column()
    deleted: boolean = false;
}
