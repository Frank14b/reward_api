import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model, QueryOptions, UpdateQuery } from 'mongoose';

import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './schemas/users.schema';
import { PatchUserDto } from './dto/patch-user.dto';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}

  create(createUserDto: CreateUserDto) {
    return new this.userModel({
      name: createUserDto.name,
      email: createUserDto.email,
      password: createUserDto.password,
    }).save();
  }

  findAll() {
    return this.userModel.find();
  }

  findOne(id: string) {
    return this.userModel.findById(id);
  }

  update(id: string, updateUserDto: UpdateUserDto) {
    const filter: FilterQuery<User> = { _id: id };
    const update: UpdateQuery<User> = {
      $set: {
        name: updateUserDto.name,
        email: updateUserDto.email,
        password: updateUserDto.password,
      },
    };
    const option: QueryOptions<User> = { new: true, lean: true };

    return this.userModel.findOneAndUpdate(filter, update, option);
  }

  patch(id: string, updateUserDto: PatchUserDto) {
    const filter: FilterQuery<User> = { _id: id };
    const update: UpdateQuery<User> = { $set: updateUserDto };
    const option: QueryOptions<User> = { new: true, lean: true };

    return this.userModel.findOneAndUpdate(filter, update, option);
  }

  remove(id: number) {
    const filter: FilterQuery<User> = { _id: id };

    return this.userModel.findOneAndDelete(filter);
  }
}
