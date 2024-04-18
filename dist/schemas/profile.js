"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Profile = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const Schema = mongoose_1.default.Schema;
const profileSchema = new Schema({
    firstName: { type: String, default: null, required: false },
    lastName: { type: String, default: null, required: false },
    photo: { type: String, default: null, required: false },
    gender: { type: String, default: null, required: false },
    user: { type: Schema.Types.ObjectId, ref: 'User' },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});
profileSchema.virtual('id').get(function () {
    return this._id.toHexString();
});
profileSchema.set('toObject', { virtuals: true, transform: function (doc, profile, options) {
        delete profile.__v;
        delete profile._id;
        return profile;
    } });
profileSchema.set('toJSON', { virtuals: true, transform: function (doc, profile, options) {
        delete profile.__v;
        delete profile._id;
        return profile;
    } });
profileSchema.pre(/^(updateOne|save|findOneAndUpdate)/, function () {
    this.set({ updatedAt: new Date() });
});
exports.Profile = mongoose_1.default.model('Profile', profileSchema);
//# sourceMappingURL=profile.js.map