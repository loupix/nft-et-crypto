"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Visitor = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const Schema = mongoose_1.default.Schema;
const uuid_1 = require("uuid");
const ip = require("ip");
const visitorSchema = new Schema({
    uid: {
        type: String,
        default: (0, uuid_1.v4)().replace(/-/g, ''),
        unique: true
    },
    adresseIp: { type: String, default: ip.address() },
    userAgent: {
        browser: { type: String, default: null, required: false },
        version: { type: String, default: null, required: false },
        os: { type: String, default: null, required: false },
        platform: { type: String, default: null, required: false },
        geoIp: { type: String, default: null, required: false },
        source: { type: String, default: null, required: false },
        is: [{ type: String, default: null, required: false }],
    },
    vues: [{ type: Schema.Types.ObjectId, ref: "Vue" }],
    hovers: [{ type: Schema.Types.ObjectId, ref: "Hover" }],
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});
visitorSchema.virtual('id').get(function () {
    return this._id.toHexString();
});
visitorSchema.set('toObject', { virtuals: true, transform: function (doc, visitor, options) {
        delete visitor.__v;
        return visitor;
    } });
visitorSchema.set('toJSON', { virtuals: true, transform: function (doc, visitor, options) {
        delete visitor._id;
        delete visitor.__v;
        delete visitor.userAgent;
        delete visitor.addresseIp;
        delete visitor.uid;
        return visitor;
    } });
visitorSchema.pre(/^(updateOne|save|findOneAndUpdate)/, function () {
    this.set({ updatedAt: new Date() });
});
exports.Visitor = mongoose_1.default.model('Visitor', visitorSchema);
//# sourceMappingURL=visitor.js.map