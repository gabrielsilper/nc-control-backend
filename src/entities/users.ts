import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";

@Entity("users")
export default class User {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column({ type: "varchar", nullable: false })
  name!: string;

  @Column({ type: "text", nullable: false })
  password!: string;

  @Column({ type: "text", nullable: false })
  email!: string;

  @Column({ type: "enum", nullable: false, enum: Profile, default: Profile.VISITANTE })
  profile!: Profile;

  @CreateDateColumn()
  createDate!: Date;

  @UpdateDateColumn()
  updateDate!: Date;
}
