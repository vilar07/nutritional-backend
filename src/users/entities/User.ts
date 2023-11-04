import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity({name: 'users'}) //name of the table
export class User {

    @PrimaryGeneratedColumn({ type: 'bigint' }) // id auto increment
    id: number;

    @Column() 
    username: string;

    @Column()
    createdAt: Date;
}