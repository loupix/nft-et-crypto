import mongoose from 'mongoose';
const Schema = mongoose.Schema;

import {Visitor, VisitorModel} from "./visitor";
import {Item, ItemModel} from "./item";
import {Album, AlbumModel} from "./album";

/**
* Interface et objet BDD pour les views et hover des items
* @author Loïc Daniel <loicdaniel.fr>
* 
* @param {VisitorModel} visitor - quel visiteur à vue l'article
* @param {ItemModel} item - quel article a été vue
* @param {Date} createdAt - date de la vue
* 
**/


export interface VueModel{
	_id?: ObjectID;
	visitor: VisitorModel;
	item: ItemModel | undefined;
	album: AlbumModel | undefined;
	createdAt: Date;
	endDate: Date;
}


const vueSchema = new Schema({
	visitor: {type: Schema.Types.ObjectId, ref: "Visitor"},
	item: {type: Schema.Types.ObjectId, ref:"Item", default: null, required: false},
	album: {type: Schema.Types.ObjectId, ref:"*Album", default: null, required: false},
	createdAt: {type: Date, default: Date.now},
	endDate: {type: Date, default: Date.now}
});


vueSchema.virtual("duree").get(function(this: VueModel){
	return this.endDate.getTime() - this.createdAt.getTime();
});

vueSchema.set('toObject', {virtuals: true, transform: function(doc, vue, options) {
    delete vue.__v;
    return vue;
}});

export const Vue = mongoose.model<VueModel>('Vue', vueSchema);








export interface HoverModel{
	visitor: VisitorModel;
	item: ItemModel;
	createdAt: Date;
	endDate: Date;
}


const hoverSchema = new Schema({
	visitor: {type: Schema.Types.ObjectId, ref: "Visitor"},
	item: {type: Schema.Types.ObjectId, ref:"Item"},
	createdAt: {type: Date, default: Date.now},
	endDate: {type: Date, default: Date.now}
});

hoverSchema.virtual("duree").get(function(this: VueModel){
	return this.endDate.getTime() - this.createdAt.getTime();
});

hoverSchema.set('toObject', {virtuals: true, transform: function(doc, hover, options) {
    delete hover.__v;
    return hover;
}});

export const Hover = mongoose.model<HoverModel>('Hover', hoverSchema);