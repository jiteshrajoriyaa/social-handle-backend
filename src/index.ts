import express from "express";
import multer from "multer";
import cors from 'cors'
import { PrismaClient } from "@prisma/client";

const app = express();
const prisma = new PrismaClient();

app.use(express.json());
app.use(cors());

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        return cb(null, './uploads')
    },
    filename: function (req, file, cb) {
        return cb(null, `${Date.now()}-${file.originalname}`)
    }
})

const upload = multer({ storage })
app.post("/api/upload", upload.array("images"), async (req, res) => {
    const { name, handle } = req.body;
    const imageUrls = (req.files as Express.Multer.File[]).map((file) => `https://social-handle-backend.onrender.com/uploads/${file.filename}`);

    const user = await prisma.user.create({
        data: { name, handle, images: imageUrls },
    });

    res.json(user);
});

app.get("/api/admin", async (req, res) => {
    const users = await prisma.user.findMany();
    res.json(users);
});

app.post("/api/admin", async (req, res) => {
    const { username, password } = req.body
    const admin = await prisma.admin.create({
        data: {
            username, password
        }
    })
    res.json(admin)
});

app.use("/uploads", express.static("uploads"));

app.listen(4000, () => console.log("Server running on http://localhost:4000"));
