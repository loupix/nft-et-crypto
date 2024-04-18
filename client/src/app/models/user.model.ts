import { Injectable } from '@angular/core';
import { ProfileModel } from "./profile.model";
import { EnchereModel } from "./enchere.model";

/**
* Interface de User
* @author Loïc Daniel <loicdaniel.fr>
* 
* @param {string} address - adress du compte sur la blockchain
* @param {string} email
* @param {string} password - mot de pass crypté
* @param {Profile} profile - objet Profile
* @param {Visitor} visitor - objet Visitor atant des informations compléte
* @param {array<ItemModel>} items - liste de tout les contrats / objet du compte
* @param {array<CollectionModel>} Collections - liste de toute les collections du compte
* @param {array<EnchereModel>} encheres - Toutes ses encheres
* @param {boolean} options.validated - si l'utilisateur a répondu à l'email
* @param {boolean} options.banned - si l'utilisateur est bannis
* @param {boolean} options.admin - si l'utilisateur est un administrateur
* @param {string} mail.token - jeton envoyer par l'email si il est verifié 
* @param {boolean} mail.verified - si l'utilisateur est vérifié
* @param {boolean} mail.sended - si l'email est envoyé
* @param {User} parrainage.parrain
* @param {Array<User>} parrainage.filleuls
* @param {number} parrainage.commission - montant de commission
* @param {number} parrainage.commissionTotal - somme des commissions
* @param {Date} createdAt - date de création du compte
* @param {Date} updatedAt - date de la dernière connexion du compte
* 
**/



export interface UserModel{
    id: string;
    account: string;
    email: string;
    password?: string;

    profile?: ProfileModel | undefined;
/*    visitor: VisitorModel;
    items: ItemModel[] | undefined;
    collections: CollectionModel[] | undefined;
*/    encheres: EnchereModel[] | undefined;

    options: {
        verified: boolean | undefined;
        banned: boolean | undefined;
        admin: boolean | undefined;
    }

    mail?: {
        token: string | undefined;
        verified: boolean | undefined;
        sended: boolean | undefined;
    }

    parrainage?: {
        parrain: UserModel | undefined;
        filleuls: UserModel[] | undefined;
        commission: number | undefined;
        commissionTotal: number | undefined;
    }

    createdAt: Date;
    updatedAt: Date;
}

@Injectable()
export class UserSchema implements UserModel{
    public id: string = "";
    public account: string = "";
    public email: string = "";
    public encheres = [];
    public options = {
        verified : false,
        banned : false,
        admin : false,
    };
    public createdAt: Date = new Date();
    public updatedAt: Date = new Date();

}