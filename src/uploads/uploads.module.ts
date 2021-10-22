import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UploadsSchema } from './uploads.model-and-schema';
import { UploadsService } from './uploads.service';
import { UploadsController } from './uploads.controller';

@Module({

  imports: [
		MongooseModule.forFeature([
			{ name: "Uploads", schema: UploadsSchema }
		]),
	],

  providers: [UploadsService],
  controllers: [UploadsController]
})
export class UploadsModule {}
