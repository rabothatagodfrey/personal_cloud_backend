import { BadRequestException, Injectable, Logger, NotFoundException } from '@nestjs/common';

// Mongoose
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

// Schema
import { User } from './user-model-schema';


@Injectable()
export class UserService {

    logger: Logger;

    constructor(@InjectModel('User') private readonly __userModel: Model<User>){
        this.logger = new Logger(UserService.name)
    }

    // Add New User To The Database
	async addNewUserToTheDatabase(new_user: any){
        try {
			const model_user = new this.__userModel(new_user);
			const user = await model_user.save();
			
			const results = { id: user.id, name: user.name, email: user.email, password: user.password, phone: user.phone};

			return results;

		} catch (error) {
			this.logger.error(error);
			if (error.code === 11000 && error.keyValue.email) throw new BadRequestException(`Email already taken, please sign in or sign up`);

			throw new BadRequestException(error);
		}

    }

    // Get All Users From The Database
	async getAllUsersFromTheDatabase(){
		const users = await this.__userModel.find().exec();

		return users;
	}

    // Get One User From The Database
	async getOneUserFromTheDatabase(userId: string){
		const user = await this.findOneUserFromTheDatabase(userId);
		const results = { id: user.id, name: user.name, email: user.email,password: user.password,phone: user.phone };

		return results;
	}

    // Check If One User From The Database Exists
	async findOneUserFromTheDatabase(id: string){
		let user: User;

		try {
			user = await this.__userModel.findOne({ _id: id }).exec();
			
		} catch (error) {
			throw new NotFoundException('Cannot find the user you are looking for');
		}

		if (!user) throw new NotFoundException('Cannot find user you are looking for');

		return user;
	}


    // Get User By Email From The Database
	async getUserByEmailFromTheDatabase(email: string){
		return await this.__userModel.findOne({ email: email });
	}

    // Update One User From The Database
	async updateOneUserFromTheDatabase(userId: string, new_user: any){
        
		let current_user = await this.findOneUserFromTheDatabase(userId);

		
		new_user.password ? current_user.password = new_user.password : current_user.password;
		new_user.email ? current_user.email = new_user.email : current_user.email;
		new_user.phone ? current_user.phone = new_user.phone : current_user.phone;
		new_user.name ? current_user.name = new_user.name : current_user.name;
		// current_user.updated_at = Date.now().toString();

		try {
			const model_user = new this.__userModel(current_user);
			const user = await model_user.save();
			
			const results = { id: user.id, name: user.name, email: user.email,password: user.password,phone: user.phone };

			return results;

		} catch (error) {
			this.logger.error(error);
			if (error.code === 11000 && error.keyValue.email) throw new BadRequestException(`Email already taken, please sign in or sign up`);
		}
	}

     // Delete One User From The Database
	async deleteOneUserFromTheDatabase(userId: any){
		if (await this.findOneUserFromTheDatabase(userId)) {
			await this.__userModel.findOneAndDelete({ _id: userId });
			
		}

		return await this.getAllUsersFromTheDatabase();
	}


}
