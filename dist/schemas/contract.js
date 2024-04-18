"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Contract = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const Schema = mongoose_1.default.Schema;
const contractSchema = new Schema({
    user: { type: Schema.Types.ObjectId, ref: 'User' },
    item: { type: Schema.Types.ObjectId, ref: 'Item' },
    transaction: { type: Schema.Types.ObjectId, ref: 'Transaction' },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});
contractSchema.pre(/^(updateOne|save|findOneAndUpdate)/, function () {
    this.set({ updatedAt: new Date() });
});
exports.Contract = mongoose_1.default.model('Contract', contractSchema);
//# sourceMappingURL=contract.js.map