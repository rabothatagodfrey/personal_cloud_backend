
import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { UserService } from './user.service';

@Controller('user')
export class UserController {

    constructor(private __user: UserService) {}

  // Add New User
	@Post()
	async addNewUser(@Body() user: {name: string, email: string, phone: string, password: string }){
		return await this.__user.addNewUserToTheDatabase(user);
	}

  // Get All Users
	@Get()
	async getAllUsers(){
		return await this.__user.getAllUsersFromTheDatabase();
	}

  // Get One User
	@Get('/:id')
	async getOneUser(@Param('id') userId: string){
		return await this.__user.getOneUserFromTheDatabase(userId);
	}

  // Update One User
	@Patch('/:id')
	async updateUser(@Param('id') userId: string, @Body() user: { name: string, email: string, phone: string, password: string  }){
		return await this.__user.updateOneUserFromTheDatabase(userId, user);
	}

  // Delete One User
	@Delete('/:id')
	async deleteUser(@Param('id') userId: string){
		return await this.__user.deleteOneUserFromTheDatabase(userId);
	}

   
}
