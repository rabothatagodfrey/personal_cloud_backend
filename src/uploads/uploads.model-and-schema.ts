import * as mongoose from 'mongoose';

export const UploadsSchema = new mongoose.Schema({

    user: { type: mongoose.SchemaTypes.ObjectId, ref: 'User' },
    originalname: { type: String },
	destination: { type: String },
	fieldname: { type: String },
	encoding: { type: String },
	mimetype: { type: String },
	filename: { type: String },
	created_at: { type: Date },
	updated_at: { type: Date },
	path: { type: String },
	size: { type: Number },

})

export interface Uploads extends mongoose.Document{

    originalname: string;
	destination: string;
	created_at: string;
	updated_at: string;
	fieldname: string;
	encoding: string;
	mimetype: string;
	filename: string;
	device: string;
	user: string;
	path: string;
	size: number;
	id: string;

}