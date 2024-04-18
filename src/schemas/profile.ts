import mongoose from 'mongoose';
const Schema = mongoose.Schema;

import {UserModel} from "./user";


/**
* Interface et objet BDD de User
* @author Loïc Daniel <loicdaniel.fr>
* 
* @param {string} firstname - prénom de l'utilisateur
* @param {string} lastname - nom de l'utilisateur
* @param {string} photo - photo de l'utilisateur
* @param {string} gender - genre / sex de l'utilisateur
* @param {UserModel} user - lien One To One à l'utilisateur
* @param {Date} createdAt - date de création du profile
* @param {Date} updatedAt - date de la dernière modification du profile
**/  



export interface ProfileModel{
    _id?: ObjectID;
    id: string;
    firstName: string | undefined;
    lastName: string | undefined;
    photo: string | undefined;
    gender: string | undefined;

    user: UserModel;

    createdAt?: Date;
    updatedAt?: Date;
}

const profileSchema = new Schema<ProfileModel>({
	firstName:{type: String,default: null,required: false},
    lastName:{type: String,default: null,required: false},
    photo:{type: String,default: null,required: false},
    gender:{type: String,default: null,required: false},

    user: {type: Schema.Types.ObjectId, ref: 'User'},

    createdAt: {type: Date, default: Date.now},
    updatedAt: {type: Date, default: Date.now}
});

profileSchema.virtual('id').get(function(this: ProfileModel){
    return this._id.toHexString();
});

profileSchema.set('toObject', {virtuals: true, transform: function(doc, profile, options) {
    delete profile.__v;
    delete profile._id;
    return profile;
}});

profileSchema.set('toJSON', {virtuals: true, transform: function(doc, profile, options) {
    delete profile.__v;
    delete profile._id;
    return profile;
}});

profileSchema.pre(/^(updateOne|save|findOneAndUpdate)/, function() {
    this.set({updatedAt: new Date()});
});


export const Profile = mongoose.model<ProfileModel>('Profile', profileSchema);