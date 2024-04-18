"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Hover = exports.Vue = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const Schema = mongoose_1.default.Schema;
const vueSchema = new Schema({
    visitor: { type: Schema.Types.ObjectId, ref: "Visitor" },
    item: { type: Schema.Types.ObjectId, ref: "Item" },
    createdAt: { type: Date, default: Date.now }
});
exports.Vue = mongoose_1.default.model('Vue', vueSchema);
const hoverSchema = new Schema({
    visitor: { type: Schema.Types.ObjectId, ref: "Visitor" },
    item: { type: Schema.Types.ObjectId, ref: "Item" },
    createdAt: { type: Date, default: Date.now }
});
exports.Hover = mongoose_1.default.model('Hover', hoverSchema);
//# sourceMappingURL=VueHover.js.map