import mongoose from 'mongoose';
const Schema = mongoose.Schema;

import {UserModel} from "./user";
import {ItemModel} from "./item";


/**
* Interface et objet BDD de l'item
* @author Loïc Daniel <loicdaniel.fr>
* 
* @param {User} user - Relation One2One à l'utilisateur
* @param {Item} user - Relation One2One à l'item
* @param {Number} prix - Prix
* @param {Date} createdAt
**/

export interface EnchereModel{
	_id?: ObjectID;
    id: string;
    user: UserModel;
    item: ItemModel;
    prix: number;

    currency: {
        base: string,
        contrepartie: string,
        value: Number,
        dateValue: Date,
    },

    createdAt: Date;
}


const enchereSchema = new Schema({
	user: {type: Schema.Types.ObjectId, ref: 'User'},
	item: {type: Schema.Types.ObjectId, ref: 'Item'},
	prix: {type: Number, default:0},

    currency: {
        base: {type: String, default: "EUR"},
        contrepartie: {type: String, default: "ETH"},
        value: {type: Number, default: 1},
        dateValue: {type: Date, default: Date.now},
    },

	createdAt: {type: Date, default: Date.now},
});


enchereSchema.virtual('id').get(function(this: EnchereModel){
    return this._id.toHexString();
});

enchereSchema.set('toObject', {virtuals: true, transform: function(doc, enc, options) {
    delete enc._id;
    delete enc.__v;
    return enc;
}});

enchereSchema.set('toJSON', {virtuals: true, transform: function(doc, enc, options) {
    delete enc.currency;
    delete enc._id;
    delete enc.__v;
    return enc;
}});




enchereSchema.pre("validate", function(){
    this.populate("user");
    this.populate("item");
})


export const Enchere = mongoose.model<EnchereModel>('Enchere', enchereSchema);