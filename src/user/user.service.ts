import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './user.entity';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import { UpdateUserDto } from './dto/update-user.dto';
import { CreateUserDto } from './dto/create-user.dto';

@Injectable()
export class UserService {
    constructor(
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
        private readonly jwtService: JwtService,
    ) {}
    getUser(id: number) {
        return this.userRepository.findOne({ where: { id } });
    }

    async createUser(createUserDto: CreateUserDto) {
        const { email, password } = createUserDto;

        if ((await this.getUserByEmail(email)) !== null)
            throw new BadRequestException('User already exist');
        const newUser = this.userRepository.create({ email, password });
        const dbUser = await this.userRepository.save(newUser);
        return {
            token: await this.generateAccessToken(dbUser),
        };
    }

    async updateUser(id: number, userDto: UpdateUserDto) {
        const { email } = userDto;

        if (email && (await this.getUserByEmail(email)) !== null)
            throw new BadRequestException('User already exist');
        const user = await this.getUser(id);
        this.userRepository.merge(user, userDto);
        return this.userRepository.save(user);
    }

    async login(userDto: CreateUserDto) {
        const { email, password } = userDto;
        const user = await this.getUserByEmail(email);
        if (!user) throw new BadRequestException('Invalid email');

        if (!(await user.checkPassword(password)))
            throw new BadRequestException('Invalid password');

        return {
            token: await this.generateAccessToken(user),
        };
    }

    async deleteUser(id: number) {
        const user = await this.userRepository.findOne({ where: { id } });
        return this.userRepository.remove(user);
    }

    getUserByEmail(email: string) {
        return this.userRepository.findOne({ where: { email } });
    }

    async generateAccessToken(user: User) {
        return this.jwtService.signAsync({
            id: user.id,
            email: user.email,
        });
    }
}
