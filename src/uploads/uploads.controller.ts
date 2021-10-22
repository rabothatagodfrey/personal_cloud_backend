import { BadRequestException, Body, Controller, Get, NotFoundException, Param, Post, Res, UploadedFile, UseInterceptors } from '@nestjs/common';
import { Response } from 'express';
import { diskStorage } from 'multer';
import { FileInterceptor } from '@nestjs/platform-express';
import { UploadsService } from './uploads.service';
import { editFileName, imageFileFilter } from './uploads.utils';


@Controller('uploads')
export class UploadsController {

    constructor(private __uploads: UploadsService){}

    @Post('profile-picture')
	@UseInterceptors(FileInterceptor('avatar', { storage: diskStorage({ destination: './uploads/profile-pictures', filename: editFileName }), fileFilter: imageFileFilter }))
	async uploadUserProfilePicture(@UploadedFile() file, @Body('user') user: string) {
		if (!user) throw new BadRequestException('Avatar has to belong to a user');
		return await this.__uploads.uploadProfilePictureToTheDatabase({ ...file, user: user });
	}

    // Upload backup Image
	@Post('backup-picture')
	@UseInterceptors(FileInterceptor('image', { storage: diskStorage({ destination: './uploads/device-pictures', filename: editFileName }), fileFilter: imageFileFilter }))
	async uploadDeviceImage(@UploadedFile() file, @Body('backupfile') backupfile: string) {
		if (!backupfile) throw new BadRequestException('Avatar has to belong to a device');
		return await this.__uploads.uploadFileToTheDatabase({ ...file, backupfile: backupfile });
	}

	// Get User Profile Picture
	@Get('profile-picture/:userId')
	async getUserProfilePicture(@Param('userId') userId: string, @Res() res: Response) {
		return await this.__uploads.getUserProfilePictureFromTheDatabase(userId, res);
	}

	// Get uploaded Image
	@Get('backup-picture/:backupId')
	async getDeviceImage(@Param('deviceId') deviceId: string, @Res() res: Response) {
		return await this.__uploads.getBackUpFromTheDatabase(deviceId, res);
	}



}
