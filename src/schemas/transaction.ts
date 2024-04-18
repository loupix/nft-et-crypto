import mongoose from 'mongoose';
const Schema = mongoose.Schema;

import {UserModel} from "./user";
import {ContractModel} from "./contract";


/**
* Interface et objet BDD des transactions d'un contrat 
* créer par web3 & l'interface graphique
* @author Loïc Daniel <loicdaniel.fr>
* 
* @param {ContractModel} contract - contrat auxquel s'applique le prix
* @param {UserModel} user.from - utilisateur ayant émis un contrat
* @param {UserModel} user.to - utilisateur ayant reçu un contrat
* @param {number} value - valeur
* @param {Date} createdAt - date de création
**/


export interface TransactionModel{
	_id?: ObjectID;
	contract: ContractModel;
	user: {
		from: UserModel;
		to: UserModel;
	}
	value: number;
	createdAt: Date;
}



const transactionSchema = new Schema({
    contract: {type: Schema.Types.ObjectId, ref: 'Contract'},

    user: {
    	from : {type: Schema.Types.ObjectId, ref: 'User'},
    	to : {type: Schema.Types.ObjectId, ref: 'User'},
    },

    value: {type: Number, required: true},

    createdAt: {type: Date, default: Date.now}
})


transactionSchema.pre('save', function (next) {
	this.updatedAt = new Date();
	next();
});

export const Transaction = mongoose.model('Transaction', transactionSchema);