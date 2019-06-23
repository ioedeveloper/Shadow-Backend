import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class UserModel {
    @PrimaryGeneratedColumn
    id: number;

    @Column
    email: string;

    @Column
    extensionId: string;

    @Column
    deleted: boolean = false;
}
