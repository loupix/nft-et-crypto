import { Injectable } from '@angular/core';
import { UserModel, UserSchema } from "./user.model";

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
    id: string;
    user: UserModel;
/*    item: ItemModel;
*/    prix: number;

    currency: {
        base: string,
        contrepartie: string,
        value: Number,
        dateValue: Date,
    },

    createdAt: Date;
}

@Injectable({
  providedIn: 'root'
})
export class EnchereSchema implements EnchereModel{
    public id: string = "";
    public user: UserModel = new UserSchema();
    public prix: number = 0;
    public currency = {
        base : "EUR",
        contrepartie : "ETH",
        value : 0,
        dateValue : new Date()
    };
    public createdAt = new Date();
}