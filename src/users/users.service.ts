// src/users/users.service.ts
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { User } from './users.interface';
import { CreateUserDto } from './users.dto';
import { UpdateUserDto } from './users.dto';

@Injectable()
export class UsersService {
  constructor(@InjectModel('User') private readonly userModel: Model<User>) {}

  // Create a new user with hashed password
  async createUser(createUserDto: CreateUserDto): Promise<User> {
    const hashedPassword = await this.hashPassword(createUserDto.password);
    const newUser = new this.userModel({
      ...createUserDto,
      password: hashedPassword,
    });
    return newUser.save();
  }

  // Find user by username (for local strategy login)
  async findByUsername(username: string): Promise<User> {
    return this.userModel.findOne({ username });
  }

  // Find user by email (for password recovery)
  async findByEmail(email: string): Promise<User> {
    return this.userModel.findOne({ email });
  }

  // Find user by ID
  async findById(id: string): Promise<User> {
    return this.userModel.findById(id);
  }

  // Update user (e.g., for password reset)
  async updateUser(id: string, updateUserDto: UpdateUserDto): Promise<User> {
    if (updateUserDto.password) {
      updateUserDto.password = await this.hashPassword(updateUserDto.password);
    }
    return this.userModel.findByIdAndUpdate(id, updateUserDto, { new: true });
  }

  async updateEmail(userId: string, newEmail: string): Promise<User> {
    const user = await this.userModel.findByIdAndUpdate(userId, { email: newEmail }, { new: true });
    return user;
  }

  // Change password method
  async updatePassword(userId: string, newPassword: string): Promise<User> {
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    const user = await this.userModel.findByIdAndUpdate(
      userId,
      { password: hashedPassword },
      { new: true },
    );
    return user;
  }

  // Hash the password with bcrypt
  private async hashPassword(password: string): Promise<string> {
    const saltRounds = 10;
    return bcrypt.hash(password, saltRounds);
  }

  // Validate password (used in auth service)
  async validatePassword(plainPassword: string, hashedPassword: string): Promise<boolean> {
    return bcrypt.compare(plainPassword, hashedPassword);
  }
}
