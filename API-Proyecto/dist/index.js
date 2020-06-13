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
//Import packages
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const env_production_1 = __importDefault(require("./env/env.production"));
const mongodb_helpers_1 = __importDefault(require("./helpers/mongodb.helpers"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
//Constants declarations
const app = express_1.default();
const mongodb = mongodb_helpers_1.default.getInstance(env_production_1.default.MONGODB);
app.use(express_1.default.urlencoded({ extended: true }));
app.use(express_1.default.json());
app.use(cors_1.default({ origin: true, credentials: true }));
app.get('/api/auth/test', (req, res) => {
    res.status(200).json({ ok: true, msg: "Hi from my method." });
});
app.post('/api/auth/login', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { username, password } = req.body;
    const user = yield mongodb.db.collection('users').findOne({ email: username });
    console.log('user: ', user);
    if (!bcryptjs_1.default.compareSync(password, user.password)) {
        return res.status(404).json({ ok: false, msg: "Invalid Username or Password. Try again" });
    }
    const userValid = {
        id: user._id,
        email: user.email,
        fullname: user.fullname,
        urlPhoto: user.urlPhoto,
        rol: user.rol
    };
    jsonwebtoken_1.default.sign(userValid, 'secretkeyword', { expiresIn: '180s' }, (err, token) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                msg: 'An error ocurred',
                err
            });
        }
        res.status(200).json({
            ok: true,
            msg: "Welcome.",
            payload: {
                id: userValid.id,
                urlPhoto: userValid.urlPhoto,
                role: userValid.rol
            },
            token
        });
    });
}));
app.post('/api/auth/createUser', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password, fullname, urlPhoto, rol } = req.body;
    const newUser = { email, password: bcryptjs_1.default.hashSync(password, 10), fullname, urlPhoto, rol };
    const insert = yield mongodb.db.collection('users').insertOne(newUser);
    res.status(200).json({ ok: true, msg: 'User Created Successfully!', result: insert.insertedId });
}));
app.listen(env_production_1.default.API.PORT, () => __awaiter(void 0, void 0, void 0, function* () {
    console.log(`Server running on port ${env_production_1.default.API.PORT}`);
    //connect to MongoDB
    yield mongodb.connect();
}));
//handle errors
process.on('unhandledRejection', (err) => __awaiter(void 0, void 0, void 0, function* () {
    //close MongoDB connnection
    mongodb.close();
    process.exit();
}));
