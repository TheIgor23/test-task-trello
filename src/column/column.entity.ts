import { Exclude } from 'class-transformer';
import { User } from 'src/user/user.entity';
import {
    Entity,
    PrimaryGeneratedColumn,
    ManyToOne,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
} from 'typeorm';

@Entity()
export class Col {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column()
    title!: string;

    @CreateDateColumn()
    createdAt!: Date;

    @UpdateDateColumn()
    updatedAt!: Date;

    @ManyToOne(() => User, {
        eager: true,
        nullable: false,
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
    })
    @Exclude()
    owner!: User;
}
