"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Item = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const mongoose_intl_1 = __importDefault(require("mongoose-intl"));
const Schema = mongoose_1.default.Schema;
const itemSchema = new Schema({
    title: { type: String, intl: true, required: true },
    user: { type: Schema.Types.ObjectId, ref: 'User' },
    album: { type: Schema.Types.ObjectId, ref: 'Albums' },
    category: { type: Schema.Types.ObjectId, ref: 'Category' },
    contract: { type: Schema.Types.ObjectId, ref: 'Contract' },
    vues: [{ type: Schema.Types.ObjectId, ref: "Vue" }],
    hovers: [{ type: Schema.Types.ObjectId, ref: "Hover" }],
    vente: {
        isEnchere: { type: Boolean, default: false },
        encheres: [{ type: Schema.Types.ObjectId, ref: "Enchere" }],
        prixBase: { type: Number, default: 0 },
        currency: {
            base: { type: String, default: "EUR" },
            contrepartie: { type: String, default: "ETH" },
            value: { type: Number, default: 1 },
            dateValue: { type: Date, default: Date.now }
        },
        selled: { type: Boolean, default: false },
        tax: { type: Number, default: 0 },
        dateFin: { type: Date, default: null }
    },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});
itemSchema.virtual('id').get(function () {
    return this._id.toHexString();
});
itemSchema.virtual('dateFin').get(function () {
    return this.vente.dateFin;
});
itemSchema.virtual('vente.currency.contreValue').get(function () {
    return 1 / this.vente.currency.value;
});
itemSchema.virtual('nbVue').get(function () {
    return this.vues.length;
});
itemSchema.virtual('prix').get(function () {
    if (!this.vente.isEnchere)
        return this.vente.prixBase;
    else {
        this.encheres = this.vente.encheres;
        if (this.vente.encheres.length == 0)
            return this.vente.prixBase;
        else {
            this.encheres.sort((a, b) => {
                let keyA = new Date(a.createdAt), keyB = new Date(b.createdAt);
                if (keyA < keyB)
                    return -1;
                if (keyA > keyB)
                    return 1;
                return 0;
            });
            let enchereFirst = this.encheres[0];
            return enchereFirst.prix;
        }
    }
});
itemSchema.set('toObject', { virtuals: true, transform: function (doc, item, options) {
        delete item.__v;
        return item;
    } });
itemSchema.set('toJSON', { virtuals: true, transform: function (doc, item, options) {
        delete item.vues;
        delete item.hovers;
        delete item.vente;
        delete item._id;
        delete item.__v;
        return item;
    } });
itemSchema.plugin(mongoose_intl_1.default, { languages: ['en', 'de', 'fr'], defaultLanguage: 'en' });
itemSchema.pre(/^(updateOne|save|findOneAndUpdate)/, function () {
    this.set({ updatedAt: new Date() });
});
itemSchema.pre("validate", function () {
    this.populate("user");
    this.populate("album");
    this.populate("category");
    this.populate("vente.encheres");
});
exports.Item = mongoose_1.default.model('Item', itemSchema);
//# sourceMappingURL=item.js.map