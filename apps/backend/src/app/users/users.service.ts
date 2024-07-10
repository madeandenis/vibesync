import { Injectable, Logger } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';

import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class UsersService {
  
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}
  
  async create(createUserDto: CreateUserDto): Promise<User | null> {
    const user = this.userRepository.create(createUserDto);
    try {
      return await this.userRepository.save(user);
    } catch (error) {
      Logger.error('Failed to create user:', error);
      return null;
    }
  }

  async findAll(): Promise<User[]> {
    try {
      return await this.userRepository.find();
    } catch (error) {
      Logger.error('Failed to find users:', error);
      return [];
    }
  }

  async findOne(id: number): Promise<User | null> {
    try {
      let user = await this.userRepository.findOne({
        where: {
          id: id
        }
      });
      if (!user) {
        Logger.log(`User with id ${id} not found`);
      }
      return user;
    } catch (error) {
      Logger.error(`Failed to find user with id ${id}:`, error);
      return null;
    }
  }

  async update(id: number, updateUserDto: UpdateUserDto): Promise<User | null> {
    try {
      let user = await this.userRepository.findOne({
        where: {
          id: id
        }
      });
      if (!user) {
        Logger.log(`User with id ${id} not found`);
        return null;
      }

      user = { ...user, ...updateUserDto };
      return await this.userRepository.save(user);
    } catch (error) {
      Logger.error(`Failed to update user with id ${id}:`, error);
      return null;
    }
  } 

  async remove(id: number): Promise<void> {
    try {
      const user = await this.userRepository.findOne({
        where: {
          id: id
        }
      });
      if (!user) {
        Logger.log(`User with id ${id} not found`);
        return;
      }
      
      await this.userRepository.remove(user);
    } catch (error) {
      Logger.error(`Failed to remove user with id ${id}:`, error);
    }
  }

}
