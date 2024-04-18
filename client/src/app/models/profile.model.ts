import { Injectable } from '@angular/core';
import { UserModel, UserSchema } from "./user.model";

/**
* Interface et objet BDD de User
* @author Loïc Daniel <loicdaniel.fr>
* 
* @param {string} firstname - prénom de l'utilisateur
* @param {string} lastname - nom de l'utilisateur
* @param {string} photo - photo de l'utilisateur
* @param {string} gender - genre / sex de l'utilisateur
* @param {UserModel} user - lien One To One à l'utilisateur
* @param {Date} createdAt - date de création du profile
* @param {Date} updatedAt - date de la dernière modification du profile
**/

export interface ProfileModel{
    id: string;
    firstName: string | undefined;
    lastName: string | undefined;
    photo: string | undefined;
    gender: string | undefined;

    user: UserModel;

    createdAt: Date;
    updatedAt: Date;
}


@Injectable({
  providedIn: 'root'
})
export class ProfileSchema implements ProfileModel{
    public id: string = "";
    public firstName: string = "";
    public lastName: string = "";
    public photo: string = "";
    public gender: string = "";
    public user: UserModel = new UserSchema();
    public createdAt: Date = new Date();
    public updatedAt: Date = new Date();
}