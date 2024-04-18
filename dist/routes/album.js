"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
const album_1 = require("../controllers/album");
const userMiddleware_1 = require("../middleware/userMiddleware");
const albumMiddleware_1 = require("../middleware/albumMiddleware");
router.post("/create", userMiddleware_1.UserMiddleware.connected, albumMiddleware_1.AlbumMiddleware.notExist, album_1.AlbumController.create);
router.post("/update", userMiddleware_1.UserMiddleware.connected, albumMiddleware_1.AlbumMiddleware.exist, albumMiddleware_1.AlbumMiddleware.isOwner, album_1.AlbumController.update);
router.post("/delete", userMiddleware_1.UserMiddleware.connected, albumMiddleware_1.AlbumMiddleware.exist, albumMiddleware_1.AlbumMiddleware.isOwner, album_1.AlbumController.delete);
exports.default = router;
//# sourceMappingURL=album.js.map