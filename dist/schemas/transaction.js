"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Transaction = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const Schema = mongoose_1.default.Schema;
const transactionSchema = new Schema({
    contract: { type: Schema.Types.ObjectId, ref: 'Contract' },
    user: {
        from: { type: Schema.Types.ObjectId, ref: 'User' },
        to: { type: Schema.Types.ObjectId, ref: 'User' },
    },
    value: { type: Number, required: true },
    createdAt: { type: Date, default: Date.now }
});
transactionSchema.pre('save', function (next) {
    this.updatedAt = new Date();
    next();
});
exports.Transaction = mongoose_1.default.model('Transaction', transactionSchema);
//# sourceMappingURL=transaction.js.map