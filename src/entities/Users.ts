import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity('users')
export default class User{
    @PrimaryGeneratedColumn("uuid")
    id!: string;

    @Column({type: "varchar", nullable:false})
    name!: string;

    @Column({type:"text", nullable:false})
    password!: string

    @Column({type:"text", nullable:false})
    email!: string

    @Column({type:"enum", nullable:false})
    profile!: string

    @CreateDateColumn ({ type: "date", nullable: false })
    createDate!: Date;

    @UpdateDateColumn ({ type: "date", nullable: false })
    updateDate!: Date;

}
