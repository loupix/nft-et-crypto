import mongoose from 'mongoose';
const Schema = mongoose.Schema;

import {UserModel} from "./user";
import {ItemModel} from "./item";
import {TransactionModel} from "./transaction";


/**
* Interface et objet BDD des contracts 
* créer par web3 & l'interface graphique
* @author Loïc Daniel <loicdaniel.fr>import {ObjectID} from 'mongodb';

* 
* @param {UserModel} user - propriétaire du contrat
* @param {ItemModel} item - propriété auxquel s'applique le contrat
* @param {TransactionModel} transaction - prix du contrat
* @param {Date} createdAt - date de création de l'album
* @param {Date} updatedAt - date de la dernière modification de l'album 

**/


export interface ContractModel{
	_id?: ObjectID;
	user: UserModel;
	item: ItemModel;
	transaction: TransactionModel;
    createdAt?: Date;
    updatedAt?: Date;
}


const contractSchema = new Schema({
    user: {type: Schema.Types.ObjectId, ref: 'User'},
    item: {type: Schema.Types.ObjectId, ref: 'Item'},
    transaction: {type: Schema.Types.ObjectId, ref: 'Transaction'},

    createdAt: {type: Date, default: Date.now},
    updatedAt: {type: Date, default: Date.now}
})


contractSchema.pre(/^(updateOne|save|findOneAndUpdate)/, function() {
    this.set({updatedAt: new Date()});
});

export const Contract = mongoose.model('Contract', contractSchema);