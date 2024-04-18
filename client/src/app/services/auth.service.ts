import { Injectable, Inject } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import {environment} from "../../environments/environment"
import { UserModel, UserSchema } from "../models/user.model";


/**
* Service d'authentification
* Liaison avec l'API Node
* @author Loïc Daniel <loicdaniel.fr>
**/



@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private _url = environment.backend.protocol+"://"+environment.backend.host+":"+environment.backend.port;
  private _headers = new HttpHeaders();
  public user: UserModel = new UserSchema();

  constructor(private http: HttpClient) {
    this._headers.set('Content-Type', 'application/json');

  }





  /**
   * fonction d'inscription
   * @param {string} email - obligatiore
   * @param {string} password - obligatiore
   * @param {string} parrain - non obligatiore
   * @return {Promise} - UserModel
  **/

  register(email: string, password: string, parrain: UserModel | undefined): Promise<UserModel> {
    let data = {email: email, password: password, parrain: parrain};
    return new Promise( (res, rej) => {
      this.http.post<UserModel>(this._url+"/user/register", JSON.stringify(data), { headers: this._headers })
        .subscribe(
          (user) => {
            if(user){
              sessionStorage.setItem("user", JSON.stringify(this.user));
              this.user = user;
            }
            res(user);
          },
          (err: HttpErrorResponse) => {
            rej(err);
          });
    });
  }





  /**
   * fonction de connection
   * @param {string} email - non obligatiore
   * @param {string} account - non obligatiore
   * @param {string} password - obligatiore
   * @return {Promise} - UserModel
  **/

  logIn(email:string | undefined, account: string | undefined, password: string): Promise<UserModel> {
    let data = {email: email, account: account, password: password};
    return new Promise( (res, rej) => {
      this.http.post<UserModel>(this._url+"/user/login", JSON.stringify(data), { headers: this._headers })
        .subscribe(
          (user) => {
            if(user){
              sessionStorage.setItem("user", JSON.stringify(this.user));
              this.user = user;
            }
            res(user);
          },
          (err: HttpErrorResponse) => {
            rej(err);
          }
        );
    });
  }





  /**
   * fonction de déconnection
   * @return {Promise} - boolean
  **/

  logOut(): Promise<boolean> {
    return new Promise( (res, rej) => {
      this.http.get(this._url+"/user/unlogin", { headers: this._headers })
        .subscribe( (resp) => {
          res(resp as boolean);
        }, (err: HttpErrorResponse) => {
            rej(err);
        });
    });
  }





  /**
   * vérifie si l'utilisateur est connecté
   * @return {Promise} - boolean
  **/

  isLoggedIn(): Promise<boolean> {
    if(sessionStorage.getItem("user"))
      return Promise.resolve(true);
    else{
      return new Promise( (res, rej) => {
        this.http.get<UserModel>(this._url+"/user/isLoggedIn", { headers: this._headers })
          .subscribe(
          (user) => {
            if(user){
              this.user = user;
              sessionStorage.setItem("user", JSON.stringify(user));
              res(true);
            }else
              res(false);
          },
          (err: HttpErrorResponse) => {
            rej(err);
          });
      });
    }
  }







  /**
   * retourne les données utilisateur
   * @return {Promise} - UserModel
  **/

  getMe(): Promise<UserModel> {
    if(sessionStorage.getItem("user") !== null){
      let user: UserModel = JSON.parse(sessionStorage.getItem("user") as string);
      this.user = user;
      return Promise.resolve(user);
    }else{
      return new Promise( (res, rej) => {
        this.http.get<UserModel>(this._url+"/user/getMe", { headers: this._headers })
          .subscribe(
          (user) => {
            if(user){
              this.user = user;
              sessionStorage.setItem("user", JSON.stringify(user));
              res(user);
            }else
              res(this.user);
          },
          (err: HttpErrorResponse) => {
            rej(err);
          });
      });
    }
  }


}
