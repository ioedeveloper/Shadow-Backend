import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class UserModel {
    @PrimaryGeneratedColumn
    id: number | null;

    @Column
    email: string | null;

    @Column
    extensionId: string | null;

    @Column
    deleted: boolean = false;
}
