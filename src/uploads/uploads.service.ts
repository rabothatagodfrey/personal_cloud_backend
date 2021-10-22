import { BadRequestException, Injectable, Logger } from '@nestjs/common';

// Mongoose
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

// Schema
import { Uploads } from './uploads.model-and-schema';


@Injectable()

export class UploadsService {

    logger: Logger;

    constructor(@InjectModel('Uploads') private readonly __uploadsModel: Model<Uploads> ){
		this.logger = new Logger(UploadsService.name)
	}

    // Add New Profile Picture To The Database

    async uploadProfilePictureToTheDatabase(new_avatar: any){

    }

    // Add New file To The Database
    async uploadFileToTheDatabase(new_file: any){
        const current_file = await this.__uploadsModel.find({ device: new_file.file });

        if (current_file && current_file.length && current_file.length > 0) return this.updateMediaFromTheDatabase(current_file[0], new_file);

		new_file = { ...new_file, created_at: Date.now().toString(), updated_at: Date.now()};

    }

    // Update Media From The Database
	async updateMediaFromTheDatabase(current_media: any, new_media: any){
		current_media.originalname = new_media.originalname;
		current_media.destination = new_media.destination;
		current_media.updated_at = Date.now().toString();
		current_media.fieldname = new_media.fieldname;
		current_media.encoding = new_media.encoding;
		current_media.mimetype = new_media.mimetype;
		current_media.filename = new_media.filename;
		current_media.path = new_media.path;
		current_media.size = new_media.size;

		try {

			const model_upload = new this.__uploadsModel(current_media);
			const upload = await model_upload.save();
			const results = { id: upload.id, user: upload.user, device: upload.device, fieldname: upload.fieldname, originalname: upload.originalname, encoding: upload.encoding, mimetype: upload.mimetype, destination: upload.destination, filename: upload.filename, path: upload.path, size: upload.size, created_at: upload.created_at, updated_at: upload.updated_at };

			if (results.user && !results.device) delete results.device;
			if (results.device && !results.user) delete results.user;

			return results;

		} catch (error) {

			throw new BadRequestException(error);

		}
	}

    // Get User Profile Picture From The Database
	async getUserProfilePictureFromTheDatabase(userId: string, response: any){
		const upload = await this.__uploadsModel.findOne({ user: userId }).exec();
		if (upload) return response.sendFile(upload.filename, { root: upload.destination });
	}

    // Get uploaded backup From The Database
	async getBackUpFromTheDatabase(productId: string, response: any){
		const upload = await this.__uploadsModel.findOne({ device: productId }).exec();
		if (upload) return response.sendFile(upload.filename, { root: upload.destination });
	}

}
