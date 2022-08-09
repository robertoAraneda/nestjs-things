import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly _usersRepository: Repository<User>,
  ) {}
  async create(createUserDto: CreateUserDto): Promise<User> {
    const salt = await bcrypt.genSalt(10);

    const user = new User({
      ...createUserDto,
      password: await bcrypt.hash(createUserDto.password, salt),
    });

    return this._usersRepository.save(user);
  }

  findAll(): Promise<User[]> {
    return this._usersRepository.find({
      withDeleted: true,
    });
  }

  async findOneByUsername(username: string): Promise<User> {
    return this._usersRepository.findOne({
      where: { given: username },
      relations: {
        role: true,
      },
    });
  }

  async findOne(id: string) {
    const user = await this._usersRepository.findOne({
      where: { id },
      relations: {
        role: true,
      },
    });

    if (!user) throw new NotFoundException('User not found');
    return user;
  }

  async update(id: string, updateUserDto: UpdateUserDto): Promise<User> {
    const user = await this._usersRepository.findOne({ where: { id } });

    if (!user) throw new NotFoundException('User not found');

    this._usersRepository.merge(user, updateUserDto);

    return this._usersRepository.save(user);
  }

  async remove(id: string): Promise<void> {
    const user = await this._usersRepository.findOne({ where: { id } });

    if (!user) throw new NotFoundException('User not found');

    this._usersRepository.softRemove(user);
  }
}
