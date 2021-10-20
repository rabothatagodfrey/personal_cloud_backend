import { Module } from '@nestjs/common';

//auth
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';

// Mongoose
import { MongooseModule } from '@nestjs/mongoose';

// JWT
import { JwtModule } from '@nestjs/jwt';

// User
import { UserSchema } from 'src/user/user-model-schema';
import { UserService } from 'src/user/user.service';

@Module({

  imports: [
		MongooseModule.forFeature([
			{ name: "User", schema: UserSchema }
		]),
		JwtModule.register({
			secret: 'secretKey',
			signOptions: { expiresIn: '60min' },
		}),
	],

  providers: [AuthService,UserService],
  controllers: [AuthController]
})
export class AuthModule {}
