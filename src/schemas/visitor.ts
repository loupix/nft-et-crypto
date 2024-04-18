import mongoose from 'mongoose';
const Schema = mongoose.Schema;

import {v4 as uuidv4} from 'uuid';
import {VueModel, HoverModel} from "./VueHover";
const ip = require("ip");
/**
* Interface et objet BDD pour tout les visiteurs
* @author Loïc Daniel <loicdaniel.fr>
* 
* @param {string} uid - unique id
* @param {string} addresseIp 
* @param {Date} createdAt - date de création du visiteur
* @param {Date} updatedAt - date de modification du visiteur
* 
**/

export interface VisitorModel{
	_id: ObjectID;
	id: string;
	uid: string;
	adresseIp: string;
	userAgent: {
		browser: string | undefined;
		version: string | undefined;
		os: string | undefined;
		platform: string | undefined;
		geoIp: string | undefined;
		source: string | undefined;
		is: string[] | undefined;
	}

	hovers: HoverModel[];
	vues: VueModel[];

	createdAt?: Date;
	updatedAt?: Date;
}




const visitorSchema = new Schema<VisitorModel>({
	uid: {
		type: String,
		default: uuidv4().replace(/-/g, ''),
		unique: true 
	},
	adresseIp: {type: String, default: ip.address()},
	userAgent: {
		browser: {type: String, default: null, required: false},
		version: {type: String, default: null, required: false},
		os: {type: String, default: null, required: false},
		platform: {type: String, default: null, required: false},
		geoIp: {type: String, default: null, required: false},
		source: {type: String, default: null, required: false},
		is: [{type: String, default: null, required: false}],
	},

	vues: [{type: Schema.Types.ObjectId, ref:"Vue"}],
    hovers: [{type: Schema.Types.ObjectId, ref:"Hover"}],

	createdAt: {type: Date, default: Date.now},
    updatedAt: {type: Date, default: Date.now}
});

visitorSchema.virtual('id').get(function(this: VisitorModel){
    return this._id.toHexString();
});


visitorSchema.set('toObject', {virtuals: true, transform: function(doc, visitor, options) {
    delete visitor.__v;
    return visitor;
}});

visitorSchema.set('toJSON', {virtuals: true, transform: function(doc, visitor, options) {
    delete visitor._id;
    delete visitor.__v;
    delete visitor.userAgent;
    delete visitor.addresseIp;
    delete visitor.uid;
    return visitor;
}});

visitorSchema.pre(/^(updateOne|save|findOneAndUpdate)/, function() {
    this.set({updatedAt: new Date()});
});


export const Visitor = mongoose.model<VisitorModel>('Visitor', visitorSchema);