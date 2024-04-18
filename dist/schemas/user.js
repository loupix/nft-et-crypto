"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.User = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const Schema = mongoose_1.default.Schema;
const password_hash_1 = __importDefault(require("password-hash"));
const jwt_simple_1 = __importDefault(require("jwt-simple"));
const environment_1 = __importDefault(require("../config/environment"));
const uuid_1 = require("uuid");
const profile_1 = require("./profile");
const album_1 = require("./album");
const userSchema = new Schema({
    account: { type: String, required: true },
    email: {
        type: String,
        lowercase: true,
        trim: true,
        unique: true,
        required: true
    },
    password: { type: String, required: true },
    profile: { type: Schema.Types.ObjectId, ref: 'Profile', default: new profile_1.Profile() },
    visitor: { type: Schema.Types.ObjectId, ref: 'Visitor' },
    items: [{ type: Schema.Types.ObjectId, ref: 'Item' }],
    albums: [{ type: Schema.Types.ObjectId, ref: 'Album' }],
    encheres: [{ type: Schema.Types.ObjectId, ref: 'Enchere' }],
    options: {
        verified: { type: Boolean, default: false },
        banned: { type: Boolean, default: false },
        admin: { type: Boolean, default: false },
    },
    mail: {
        token: { type: String, default: (0, uuid_1.v4)().replace(/-/g, '') },
        verified: { type: Boolean, default: false },
        sended: { type: Boolean, default: false }
    },
    parrainage: {
        parrain: { type: Schema.Types.ObjectId, ref: 'User', default: null },
    },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});
userSchema.virtual('id').get(function () {
    return this._id.toHexString();
});
userSchema.virtual('parrainage.filleuls').get(function () {
    exports.User.find({ 'parrainage.parrain': this._id }).then((users) => {
        this.parrainage.filleuls = users;
    });
});
userSchema.set('toObject', { virtuals: true, transform: function (doc, user, options) {
        delete user.__v;
        return user;
    } });
userSchema.set('toJSON', { virtuals: true, transform: function (doc, user, options) {
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
    } });
userSchema.pre(/^(updateOne|save|findOneAndUpdate)/, function () {
    this.set({ updatedAt: new Date() });
});
userSchema.pre("validate", function () {
    this.populate("items");
    this.populate("albums");
    this.populate("encheres");
    this.populate("visitor");
    this.populate("profile");
    this.populate("parrainage.parrain");
});
// Suppression en cascade
userSchema.pre(/^(deleteOne|remove)/, function (next) {
    album_1.Album.deleteMany(this.albums).then(() => {
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
    authenticate: function (password) {
        return password_hash_1.default.verify(password, this.password);
    },
    getToken: function () {
        return jwt_simple_1.default.encode(this, environment_1.default.secrets.session);
    }
};
exports.User = mongoose_1.default.model('User', userSchema);
//# sourceMappingURL=user.js.map