"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const multer_1 = __importDefault(require("multer"));
const cors_1 = __importDefault(require("cors"));
const client_1 = require("@prisma/client");
const app = (0, express_1.default)();
const prisma = new client_1.PrismaClient();
app.use(express_1.default.json());
app.use((0, cors_1.default)());
const storage = multer_1.default.diskStorage({
    destination: function (req, file, cb) {
        return cb(null, './uploads');
    },
    filename: function (req, file, cb) {
        return cb(null, `${Date.now()}-${file.originalname}`);
    }
});
const upload = (0, multer_1.default)({ storage });
// Upload endpoint
app.post("/api/upload", upload.array("images"), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, handle } = req.body;
    const imageUrls = req.files.map((file) => `http://localhost:4000/uploads/${file.filename}`);
    const user = yield prisma.user.create({
        data: { name, handle, images: imageUrls },
    });
    res.json(user);
}));
// Admin endpoint
app.get("/api/admin", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const users = yield prisma.user.findMany();
    res.json(users);
}));
app.post("/api/admin", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { username, password } = req.body;
    const admin = yield prisma.admin.create({
        data: {
            username, password
        }
    });
    res.json(admin);
}));
// Static files for uploaded images
app.use("/uploads", express_1.default.static("uploads"));
app.listen(4000, () => console.log("Server running on http://localhost:4000"));
