import {
    AfterLoad,
    BeforeInsert,
    BeforeUpdate,
    Column,
    CreateDateColumn,
    Entity,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from 'typeorm';
import * as bcrypt from 'bcrypt';
import { Exclude } from 'class-transformer';

const bcryptRegex = /^\$(?:2a|2x|2y|2b)\$\d+\$/u;

@Entity()
export class User {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ unique: true })
    email: string;

    @Column()
    @Exclude({ toPlainOnly: true })
    password: string;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;

    #salt: string | undefined;

    @BeforeInsert()
    @BeforeUpdate()
    async hashPassword() {
        if (!bcryptRegex.test(this.password)) {
            this.password = await bcrypt.hash(this.password, this.#salt ?? 10);
        }
    }

    checkPassword(plainPassword: string) {
        return bcrypt.compare(plainPassword, this.password);
    }

    @AfterLoad()
    protected setOldPassword() {
        this.#salt = this.password.slice(0, 29);
    }
}
