import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity('usuarios')
export default class Usuario{
    @PrimaryGeneratedColumn("uuid")
    id_usuario!: string;

    @Column({type: "varchar", nullable:false})
    nome!: string;

    @Column({ type: "text", nullable: true })
    descricao?: string;

    @CreateDateColumn ({ type: "date", nullable: false })
    dataCriacao!: Date;

    @UpdateDateColumn ({ type: "date", nullable: false })
    dataAtualizacao!: Date;

}
