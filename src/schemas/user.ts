import mongoose from 'mongoose';
const Schema = mongoose.Schema;
import session from 'express-session';
import passwordHash from "password-hash";
import jwt from "jwt-simple";
import config from '../config/environment';
import {v4 as uuidv4} from 'uuid';

import {Profile, ProfileModel} from "./profile";
import {Visitor, VisitorModel} from "./visitor";
import {Item, ItemModel} from "./item";
import {Album, AlbumModel} from "./album";
import {Enchere, EnchereModel} from "./enchere";


/**
* Interface et objet BDD de User
* @author Loïc Daniel <loicdaniel.fr>
* 
* @param {string} address - adress du compte sur la blockchain
* @param {string} email
* @param {string} password - mot de pass crypté
* @param {Profile} profile - objet Profile
* @param {Visitor} visitor - objet Visitor atant des informations compléte
* @param {array<ItemModel>} items - liste de tout les contrats / objet du compte
* @param {array<AlbumModel>} Albums - liste de toute les albums du compte
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
    _id?: ObjectID;
    id: string;
    account: string;
    email: string;
    password: string;

    profile: ProfileModel | undefined;
    visitor: VisitorModel;
    items: ItemModel[] | undefined;
    albums: AlbumModel[] | undefined;
    encheres: EnchereModel[] | undefined;

    options: {
        verified: boolean | undefined;
        banned: boolean | undefined;
        admin: boolean | undefined;
    }

    mail: {
        token: string | undefined;
        verified: boolean | undefined;
        sended: boolean | undefined;
    }

    parrainage: {
        parrain: UserModel | undefined;
        filleuls: UserModel[] | undefined;
        commission: number | undefined;
        commissionTotal: number | undefined;
    }

    createdAt?: Date;
    updatedAt?: Date;
}




const userSchema = new Schema<UserModel>({
	account:{type: String, required: true},

    email:{
        type: String,
        lowercase: true,
        trim: true,
        unique: true,
        required: true
    },

    password:{type:String,required:true},

    profile: {type: Schema.Types.ObjectId, ref: 'Profile', default: new Profile()},
    visitor: {type: Schema.Types.ObjectId, ref: 'Visitor'},
    items:[{type: Schema.Types.ObjectId, ref: 'Item'}],
    albums:[{type: Schema.Types.ObjectId, ref: 'Album'}],
    encheres:[{type: Schema.Types.ObjectId, ref: 'Enchere'}],

    options: {
        verified:{type:Boolean,default:false},
        banned:{type:Boolean,default:false},
        admin:{type:Boolean,default:false},
    },

    mail: {
        token: {type: String, default: uuidv4().replace(/-/g, '')},
        verified:{type:Boolean,default:false},
        sended: {type: Boolean, default: false}
    },

    parrainage: {
        parrain: {type: Schema.Types.ObjectId, ref: 'User', default: null},
    },

    createdAt: {type: Date, default: Date.now},
    updatedAt: {type: Date, default: Date.now}
});


userSchema.virtual('id').get(function(this: UserModel){
    return this._id.toHexString();
});

userSchema.virtual('parrainage.filleuls').get(function(this: UserModel){
    User.find({'parrainage.parrain': this._id}).then( (users) => {
        this.parrainage.filleuls = users;
    });
});

userSchema.set('toObject', {virtuals: true, transform: function(doc, user, options) {
    delete user.__v;
    return user;
}});


userSchema.set('toJSON', {virtuals: true, transform: function(doc, user, options) {
    delete user.visitor;
    delete user.email;
    delete user.password;
    delete user.items;
    delete user.albums;
    delete user.mail;
    delete user.parrainage;
    delete user._id;
    delete user.__v;
    return user;
}});


userSchema.pre(/^(updateOne|save|findOneAndUpdate)/, function() {
    this.set({updatedAt: new Date()});
});

userSchema.pre("validate", function(){
    this.populate("items");
    this.populate("albums");
    this.populate("encheres");
    this.populate("visitor");
    this.populate("profile");
    this.populate("parrainage.parrain");
})


// Suppression en cascade
userSchema.pre(/^(deleteOne|remove)/, function(next){
    Album.deleteMany(this.albums).then( () => {
        next();
    });
});


/*userSchema.post<UserModel>("init", function(){
    let user = this;
    Visitor.findOne({_id:this.visitor}).then( (visitor: VisitorModel) => {
        user.visitor = visitor;
        Profile.findOne({_id:this.profile}).then( (profile: ProfileModel) => {
            user.profile = profile;
        });
    });
});*/


userSchema.methods = {
    authenticate: function(password: string) {
        return passwordHash.verify(password, this.password);
    },
    getToken: function() {
        return jwt.encode(this, config.secrets.session);
    }
}



export const User = mongoose.model<UserModel>('User', userSchema);