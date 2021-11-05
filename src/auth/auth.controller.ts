import { Body, Controller, Param, Patch, Post } from '@nestjs/common';
import { AuthService } from './auth.service';


@Controller('auth')
export class AuthController {

    constructor(private __auth: AuthService){}

    @Post('register')
	async registerUser(@Body() user: {name: string, email: string, password: string, phone:string }){
		return await this.__auth.registerUserIntoDatabase(user);
	}

    @Post('login')
	async loginUser(@Body() credentials: { email: String, password: String }){
		return await this.__auth.authenticateUserWithUsersInDatabase(credentials);
	}

    // Change User Password From The Database
	@Patch('change-password/:userId')
	async changeUserPassword(@Param('userId') userId: string, @Body() passwords: { old_password: string, new_password: string }){
		return this.__auth.changeUserPasswordFromTheDatabase(userId, passwords);
	}


}
