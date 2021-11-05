import * as mongoose from 'mongoose';

export const UserSchema = new mongoose.Schema({

    email: { type: String, required: [true, 'Please provide an email address'], unique: [true, 'Email already exists, please sign in or sign up'], match: [/\S+@\S+\.\S+/, 'Please provide a valid email address'] },
	password: { type: String, required: [ true, 'Please provide a password'] },
	name: { type: String, required: [ true, 'Please provide your name'] },
    phone: { type: String },
    profile_Picture: { type: String },

});

export interface User extends mongoose.Document{

    password: string;
    profile_Picture: string;
    email: string;
	phone: string;
	name: string;
	id: string;

}