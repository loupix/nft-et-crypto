"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Enchere = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const Schema = mongoose_1.default.Schema;
const enchereSchema = new Schema({
    user: { type: Schema.Types.ObjectId, ref: 'User' },
    item: { type: Schema.Types.ObjectId, ref: 'Item' },
    prix: { type: Number, default: 0 },
    currency: {
        base: { type: String, default: "EUR" },
        contrepartie: { type: String, default: "ETH" },
        value: { type: Number, default: 1 },
        dateValue: { type: Date, default: Date.now },
    },
    createdAt: { type: Date, default: Date.now },
});
enchereSchema.virtual('id').get(function () {
    return this._id.toHexString();
});
enchereSchema.set('toObject', { virtuals: true, transform: function (doc, enc, options) {
        delete enc._id;
        delete enc.__v;
        return enc;
    } });
enchereSchema.set('toJSON', { virtuals: true, transform: function (doc, enc, options) {
        delete enc.currency;
        delete enc._id;
        delete enc.__v;
        return enc;
    } });
enchereSchema.pre("validate", function () {
    this.populate("user");
    this.populate("item");
});
exports.Enchere = mongoose_1.default.model('Enchere', enchereSchema);
//# sourceMappingURL=enchere.js.map