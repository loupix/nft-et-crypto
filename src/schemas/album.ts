import mongoose from 'mongoose';
import mongooseIntl from "mongoose-intl";
const Schema = mongoose.Schema;

import {UserModel} from "./user";
import {CategoryModel} from "./category";
import {Item, ItemModel} from "./item";


/**
* Interface et objet BDD de Album
* @author Loïc Daniel <loicdaniel.fr>
* 
* @param {string} name - nom de la catégorie
* @param {UserModel} user - propriétaire de l'album
* @param {array<ItemModel>} items - liste de tout les items de l'album
* @param {CategoryModel} Category - category de l'album
* @param {Date} createdAt - date de création de l'album
* @param {Date} updatedAt - date de la dernière modification de l'album 
* 
**/

export interface AlbumModel{
    _id?: ObjectID;
    id: string;
    title: string;
    user: UserModel;
    items: ItemModel[];
    category: CategoryModel;

    createdAt?: Date;
    updatedAt?: Date;

}

const albumSchema = new Schema({
	title:{type: String, intl: true, required: true},

    user: {type: Schema.Types.ObjectId, ref: 'User'},
    items:[{type: Schema.Types.ObjectId, ref: 'Item'}],
    category: {type: Schema.Types.ObjectId, ref: 'Category'},

    createdAt: {type: Date, default: Date.now},
    updatedAt: {type: Date, default: Date.now}
});

albumSchema.pre(/^(updateOne|save|findOneAndUpdate)/, function() {
    this.set({updatedAt: new Date()});
});


// Suppression en cascade
albumSchema.pre(/^(deleteOne|remove)/, function(next){
    Item.deleteMany(this.items).then( () => {
        next();
    });
});



albumSchema.virtual('id').get(function(this: AlbumModel){
    return this._id.toHexString();
});

albumSchema.virtual('nbItems').get(function(this: AlbumModel){
    return this.items.length;
});

albumSchema.set('toObject', {virtuals: true, transform: function(doc, alb, options) {
    delete alb.__v;
    return alb;
}});

albumSchema.set('toJSON', {virtuals: true, transform: function(doc, alb, options) {
    delete alb._id;
    delete alb.__v;
    return alb;
}});

albumSchema.plugin(mongooseIntl, { languages: ['en', 'de', 'fr'], defaultLanguage: 'en' });

albumSchema.pre("validate", function(){
    this.populate("user");
    this.populate("items");
    this.populate("category");
})

export const Album = mongoose.model<AlbumModel>('Albums', albumSchema);