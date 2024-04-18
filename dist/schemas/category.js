"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Category = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const mongoose_intl_1 = __importDefault(require("mongoose-intl"));
const Schema = mongoose_1.default.Schema;
const album_1 = require("./album");
const logger = require("../logger")(module);
const categorySchema = new Schema({
    name: { type: String, intl: true, required: true },
    items: [{ type: Schema.Types.ObjectId, ref: 'Item' }],
    albums: [{ type: Schema.Types.ObjectId, ref: 'Album' }],
    parent: { type: Schema.Types.ObjectId, ref: "Category", default: null },
    ancestors: [{ type: Schema.Types.ObjectId, ref: "Category" }],
    childrens: [{ type: Schema.Types.ObjectId, ref: "Category" }],
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});
categorySchema.virtual('id').get(function () {
    return this._id.toHexString();
});
categorySchema.virtual("nbAlbum").get(function () {
    let nb = this.albums.length;
    nb += this.childrens.map((c) => { return c.nbAlbums; })
        .reduce((partialSum, a) => partialSum + a, 0);
    return nb;
});
categorySchema.virtual("nbItems").get(function () {
    let nb = this.items.length;
    nb += this.childrens.map((c) => { return c.nbItems; })
        .reduce((partialSum, a) => partialSum + a, 0);
    return nb;
});
categorySchema.set('toObject', { virtuals: true, transform: function (doc, cat, options) {
        delete cat.__v;
        return cat;
    } });
categorySchema.set('toJSON', { virtuals: true, transform: function (doc, cat, options) {
        delete cat.parent;
        delete cat.ancestors;
        delete cat.childrens;
        delete cat.albums;
        delete cat.items;
        delete cat.createdAt;
        delete cat.updatedAt;
        delete cat.__v;
        delete cat._id;
        return cat;
    } });
// Suppression en cascade
categorySchema.pre(/^(deleteOne|remove)/, function (next) {
    album_1.Album.deleteMany(this.albums).then(() => {
        exports.Category.deleteMany(this.childrens).then(() => {
            next();
        });
    });
});
categorySchema.pre(/^(updateOne|save|findOneAndUpdate)/, function () {
    this.set({ updatedAt: new Date() });
});
categorySchema.pre("validate", function () {
    this.populate("parent");
    this.populate("childrens");
    this.populate("ancestors");
    this.populate("albums");
    this.populate("items");
});
categorySchema.plugin(mongoose_intl_1.default, { languages: ['en', 'de', 'fr'], defaultLanguage: 'en' });
exports.Category = mongoose_1.default.model('Category', categorySchema);
//# sourceMappingURL=category.js.map