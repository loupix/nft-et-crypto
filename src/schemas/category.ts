import mongoose from 'mongoose';
import mongooseIntl from "mongoose-intl";
const Schema = mongoose.Schema;

import {Enchere, EnchereModel} from "./enchere";
import {Item, ItemModel} from "./item";
import {Album, AlbumModel} from "./album";

const logger = require("../logger")(module);


/**
* Interface et objet BDD de Categorie
* Ainsi que sa structure en arbre
* @author Loïc Daniel <loicdaniel.fr>
* 
* @param {string} name - nom de la catégorie
* @param {array<Item>} items - liste de tout les contrats / objet de la catégorie
* @param {array<Album>} Albums - liste de tout les albums de la catégorie
* @param {CategoryModel} Parent - Catégorie parente, perut être nulle
* @param {array<CategoryModel} Children - Liste des catégories enfants
* 
* 
**/




export interface CategoryModel{
    _id?: ObjectID;
    id: string
	name: string;
    items: ItemModel[];
    albums: AlbumModel[];

    nbItems: number;
    nbAlbums: number;

    parent: CategoryModel | undefined;
    childrens: CategoryModel[];
    ancestors: CategoryModel[];

    createdAt?: Date;
    updatedAt?: Date;
}

const categorySchema = new Schema<CategoryModel>({
	name:{type: String, intl: true, required: true},

    items:[{type: Schema.Types.ObjectId, ref: 'Item'}],
    albums:[{type: Schema.Types.ObjectId, ref: 'Album'}],

    parent: {type: Schema.Types.ObjectId, ref: "Category", default: null},
    ancestors: [{type: Schema.Types.ObjectId, ref: "Category"}],
    childrens: [{type: Schema.Types.ObjectId, ref: "Category"}],

    createdAt: {type: Date, default: Date.now},
    updatedAt: {type: Date, default: Date.now}
});


categorySchema.virtual('id').get(function(this: CategoryModel){
    return this._id.toHexString();
});


categorySchema.virtual("nbAlbum").get(function(this: CategoryModel){
    let nb = this.albums.length;
    nb += this.childrens.map( (c) => { return c.nbAlbums;})
                    .reduce((partialSum, a) => partialSum + a, 0);
    return nb;
})


categorySchema.virtual("nbItems").get(function(this: CategoryModel){
    let nb = this.items.length;
    nb += this.childrens.map( (c) => { return c.nbItems;})
                    .reduce((partialSum, a) => partialSum + a, 0);
    return nb;
})


categorySchema.set('toObject', {virtuals: true, transform: function(doc, cat, options) {
    delete cat.__v;
    return cat;
}});

categorySchema.set('toJSON', {virtuals: true, transform: function(doc, cat, options) {
    delete cat.parent;
    delete cat.ancestors;
    delete cat.childrens;
    delete cat.albums;
    delete cat.items;
    delete cat.createdAt;
    delete cat.updatedAt;
    delete cat.__v;
    delete cat._id;
    return cat;
}});


// Suppression en cascade
categorySchema.pre(/^(deleteOne|remove)/, function(next){
    Album.deleteMany(this.albums).then( () => {
        Category.deleteMany(this.childrens).then( () => {
            next();
        })
    });
});


categorySchema.pre(/^(updateOne|save|findOneAndUpdate)/, function() {
    this.set({updatedAt: new Date()});
});



categorySchema.pre("validate", function(){
    this.populate("parent");
    this.populate("childrens");
    this.populate("ancestors");
    this.populate("albums");
    this.populate("items");
});


categorySchema.plugin(mongooseIntl, { languages: ['en', 'de', 'fr'], defaultLanguage: 'en' });

export const Category = mongoose.model<CategoryModel>('Category', categorySchema);
