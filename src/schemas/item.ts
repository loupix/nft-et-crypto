import mongoose from 'mongoose';
import mongooseIntl from "mongoose-intl";
const Schema = mongoose.Schema;

import {UserModel} from "./user";
import {AlbumModel} from "./album";
import {CategoryModel} from "./category";
import {ContractModel} from "./contract";
import {EnchereModel} from "./enchere";
import {VueModel, HoverModel} from "./VueHover";


/**
* Interface et objet BDD de l'item
* @author Loïc Daniel <loicdaniel.fr>
* 
* @param {string} title - nom de l'item
* @param {UserModel} user - Relation One2One à l'utilisateur
* @param {AlbumModel} album - Relation One2One à la album
* @param {CategoryModel} category - Relation One2One à la catégorie
* @param {ContractModel} contrat - Relation One2One au contrat
* @param {VueModel} vues - Tout les click sur l'item
* @param {HoverModel} hovers - Tout les survol sur l'item
* @param {EnchereModel} encheres - Toutes les encheres SI il y en a
* @param {Number} prix - valeurs actuel avec le dernier enchere SI il y en a
* @param {Number} nbVue - nombre de vue
* @param {Date} dateFin - date finale des transactions
* @param {Date} createdAt - date de création de l'item
* @param {Date} updatedAt - date de la dernière modification de l'item 
**/


export interface ItemModel{
    _id?: ObjectID;
    id: string;
    title: string;
    user: UserModel;
    album: AlbumModel;
    category: CategoryModel;
    contract: ContractModel;

    vues: VueModel[];
    hovers: HoverModel[];

    encheres: EnchereModel[] | undefined;
    prix: number;
    dateFin: Date;

    vente: {
        isEnchere: boolean;
        encheres: EnchereModel[];
        prixBase: number;
        currency: {
            base: string;
            contrepartie: string;
            value: number;
            dateValue: Date;
        }
        selled: boolean;
        tax: number;
        dateFin: Date;
    }

    nbVue?: number;

    createdAt?: Date;
    updatedAt?: Date;

}

const itemSchema = new Schema({
	title:{type: String, intl: true, required: true},

    
    user: {type: Schema.Types.ObjectId, ref: 'User'},
    album: {type: Schema.Types.ObjectId, ref: 'Albums'},
    category: {type: Schema.Types.ObjectId, ref: 'Category'},
    contract: {type: Schema.Types.ObjectId, ref: 'Contract'},

    vues: [{type: Schema.Types.ObjectId, ref:"Vue"}],
    hovers: [{type: Schema.Types.ObjectId, ref:"Hover"}],

    vente: {
        isEnchere: {type: Boolean, default: false},
        encheres: [{type: Schema.Types.ObjectId, ref: "Enchere"}],
        prixBase: {type: Number, default: 0},
        currency: {
            base: {type: String, default: "EUR"},
            contrepartie: {type: String, default: "ETH"},
            value: {type: Number, default: 1},
            dateValue: {type: Date, default: Date.now}
        },
        selled: {type: Boolean, default: false},
        tax: {type: Number, default: 0},
        dateFin: {type: Date, default: null}
    },

    createdAt: {type: Date, default: Date.now},
    updatedAt: {type: Date, default: Date.now}
});


itemSchema.virtual('id').get(function(this: ItemModel){
    return this._id.toHexString();
});

itemSchema.virtual('dateFin').get(function(this: ItemModel){
    return this.vente.dateFin;
});

itemSchema.virtual('vente.currency.contreValue').get(function(this: ItemModel){
    return 1/this.vente.currency.value;
});

itemSchema.virtual('nbVue').get(function(this: ItemModel){
    return this.vues.length;
});

itemSchema.virtual('prix').get(function(this: ItemModel){
    if(!this.vente.isEnchere)
        return this.vente.prixBase;
    else{
        this.encheres = this.vente.encheres;

        if(this.vente.encheres.length==0)
            return this.vente.prixBase;
        else{
            this.encheres.sort( (a, b) => {
                let keyA = new Date(a.createdAt),
                    keyB = new Date(b.createdAt);
                if (keyA < keyB) return -1;
                if (keyA > keyB) return 1;
                return 0;
            });
            let enchereFirst = this.encheres[0];
            return enchereFirst.prix;
        }

    }
});



itemSchema.set('toObject', {virtuals: true, transform: function(doc, item, options) {
    delete item.__v;
    return item;
}});

itemSchema.set('toJSON', {virtuals: true, transform: function(doc, item, options) {
    delete item.vues;
    delete item.hovers;
    delete item.vente;
    delete item._id;
    delete item.__v;
    return item;
}});

itemSchema.plugin(mongooseIntl, { languages: ['en', 'de', 'fr'], defaultLanguage: 'en' });




itemSchema.pre(/^(updateOne|save|findOneAndUpdate)/, function() {
    this.set({updatedAt: new Date()});
});

itemSchema.pre("validate", function(){
    this.populate("user");
    this.populate("album");
    this.populate("category");
    this.populate("vente.encheres");
})



export const Item = mongoose.model<ItemModel>('Item', itemSchema);