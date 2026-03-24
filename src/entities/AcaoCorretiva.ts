import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import User from "./users";
import NonConformity from "./non-conformity";

@Entity('acoes_corretivas')
export default class AcaoCorretiva {
    @PrimaryGeneratedColumn("uuid")
    id!: string;

    @Column({ type: "text", nullable: false })
    description!: string;

    @Column({ 
        type: "enum",
        enum: Status, 
        default: Status.PENDENTE,
        nullable: false 
    })
    status!: string;

    @Column({ type: "timestamp", nullable: false })
    deadline!: Date;

    @Column({ type: "timestamp", nullable: true })
    finished_at!: Date | null;

    @Column({ type: "text", nullable: true })
    evidence!: string | null;

    @ManyToOne(() => NonConformity, { onDelete: 'CASCADE' })
    nao_conformidade!: NonConformity;

    @ManyToOne(() => User, { nullable: false })
    responsavel!: User;

    @CreateDateColumn({ type: "timestamp", nullable: false })
    created_at!: Date;

    @UpdateDateColumn({ type: "timestamp", nullable: false })
    updated_at!: Date;
}