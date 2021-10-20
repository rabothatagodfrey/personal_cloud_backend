import { Injectable,BadRequestException, Logger, NotFoundException  } from '@nestjs/common';

// Mongoose
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

// User
import { User } from 'src/user/user-model-schema';
import { UserService } from 'src/user/user.service';

// For Encryption and Security
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';



@Injectable()
export class AuthService {

    logger: Logger;

    constructor(@InjectModel('User') private readonly __userModel: Model<User>, private __user: UserService,private __jwt: JwtService){
        this.logger = new Logger(AuthService.name)
    }

    // Register User To The Database
    async registerUserIntoDatabase(user : any ){

        if (!user.password) throw new BadRequestException('Please provide a password');
        if (!user.email) throw new BadRequestException('Please provide an email');

        const hashedPassword = await bcrypt.hash(user.password, 10);
        user = { ...user, password: hashedPassword }

        try{

        const new_user = await this.__user.addNewUserToTheDatabase(user);
        
        return { message: 'Successfully Registered ' }

        }catch (error){
        if (error.code === 11000 && error.keyValue.email) throw new BadRequestException(`Email already taken, please sign in or sign up`);
        
        if (error.response.errors){

                    const err = error.response.errors;
                    if (err.name) throw new BadRequestException(err.name.message);
                    throw new BadRequestException(err);
                }

                throw new BadRequestException(error.message);

        }
    }

    async authenticateUserWithUsersInDatabase(credentials :any){
        const user = await this.__userModel.findOne({ email: credentials.email });
            if (!user) throw new BadRequestException('Invalid credentials!');
            if (!await bcrypt.compare(credentials.password, user.password)) throw new BadRequestException('Invalid credentials!');
    
        try {
            const token = await this.__jwt.signAsync({ id: user.id });
            return token;

        } catch (error) {

            this.logger.error(error);

        }
    
      }
    
      // Change User Password From The Database
        async changeUserPasswordFromTheDatabase(userId: string, passwords: any){
        const user = await this.__userModel.findOne({ _id: userId });
    
        if (!user) throw new BadRequestException('Not Allowed To Change password for someone else!');
        if (!await bcrypt.compare(passwords.old_password, user.password)) throw new BadRequestException('Incorrect Password!');
        if (await bcrypt.compare(passwords.new_password, user.password)) throw new BadRequestException('Sorry can\'t set the same password!');
    
        // return await this.__userModel.findByIdAndUpdate(userId, { password: await bcrypt.hash(passwords.new_password, 10) });
        return await this.__user.updateOneUserFromTheDatabase(userId, { password: await bcrypt.hash(passwords.new_password, 10) });
      }



    //   // Send Password Reset Link
	// async sendPasswordResetLinkToUserFromTheDatabase(email: string){
	// 	let user: any = {};

	// 	try {
	// 		user = await this.__user.getUserByEmailFromTheDatabase(email);
	// 		const token = await this.__token.getUserTokenFromTheDatabase(user.id);

	// 		// create reusable transporter object using the default SMTP transport
	// 		const transporter = nodemailer.createTransport({
	// 			host: "smtp.gmail.com",
	// 			port: 587,
	// 			secure: false, // true for 465, false for other ports
	// 			auth: {
	// 				user: 'insuregadget@gmail.com	',
	// 				pass: 'gqyqgijkrnorgwls'
	// 			},
	// 		});

	// 		// send mail with defined transport object
	// 		const send = await transporter.sendMail({
	// 			from: "insuregadget@gmail.com", // sender address
	// 			to: email, // list of receivers
	// 			subject: "E-Gudget Password Reset", // Subject line
	// 			text: "Hello follow the the link below to reset your password", // plain text body
	// 			html: ` <br>To reset your password click <a href="http://10.1.0.200:4200/reset-password/${token.token}">Reset</a><br> or copy and paste the following into your url http://10.1.0.200:4200/reset-password/${token.token}`, // html body
	// 		});

	// 	} catch (error) {
	// 		throw new NotFoundException(`Please make sure to provide the email you registered with`);
	// 	}

	// 	if (!user) throw new NotFoundException(`Please make sure to provide the email you registered with`);

	// 	return user;
	// }

}