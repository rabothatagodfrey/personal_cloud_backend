import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';

// Mongoose
import { MongooseModule } from "@nestjs/mongoose";
import { UploadsModule } from './uploads/uploads.module';
import { FileModule } from './file/file.module';


@Module({
  imports: [

    MongooseModule.forRoot("mongodb://localhost:27017/cloud_app", { autoCreate: true }),

    AuthModule, 
    UserModule, UploadsModule, FileModule],

  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
