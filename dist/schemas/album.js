"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Album = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const mongoose_intl_1 = __importDefault(require("mongoose-intl"));
const Schema = mongoose_1.default.Schema;
const item_1 = require("./item");
const albumSchema = new Schema({
    title: { type: String, intl: true, required: true },
    user: { type: Schema.Types.ObjectId, ref: 'User' },
    items: [{ type: Schema.Types.ObjectId, ref: 'Item' }],
    category: { type: Schema.Types.ObjectId, ref: 'Category' },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});
albumSchema.pre(/^(updateOne|save|findOneAndUpdate)/, function () {
    this.set({ updatedAt: new Date() });
});
// Suppression en cascade
albumSchema.pre(/^(deleteOne|remove)/, function (next) {
    item_1.Item.deleteMany(this.items).then(() => {
        next();
    });
});
albumSchema.virtual('id').get(function () {
    return this._id.toHexString();
});
albumSchema.virtual('nbItems').get(function () {
    return this.items.length;
});
albumSchema.set('toObject', { virtuals: true, transform: function (doc, alb, options) {
        delete alb.__v;
        return alb;
    } });
albumSchema.set('toJSON', { virtuals: true, transform: function (doc, alb, options) {
        delete alb._id;
        delete alb.__v;
        return alb;
    } });
albumSchema.plugin(mongoose_intl_1.default, { languages: ['en', 'de', 'fr'], defaultLanguage: 'en' });
albumSchema.pre("validate", function () {
    this.populate("user");
    this.populate("items");
    this.populate("category");
});
exports.Album = mongoose_1.default.model('Albums', albumSchema);
//# sourceMappingURL=album.js.map