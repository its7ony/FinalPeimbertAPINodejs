"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
exports.default = () => {
    return {
        verify: (req, res, next) => {
            //Get Auth Header Value
            const bearerHeader = req.headers['authorization'];
            if (typeof bearerHeader !== 'undefined') {
                const bearer = bearerHeader.split(' ');
                const bearerToken = bearer[1];
                jsonwebtoken_1.default.verify(bearerToken, 'secretkeyword', (err, tokenDecoded) => {
                    if (err) {
                        return res.status(403).json({ ok: false, msg: 'Invalid Token' });
                    }
                    req.body.authUser = tokenDecoded;
                    next();
                });
            }
            else {
                //Unauthorized
                return res.status(401).json({ ok: false, msg: 'Method Not Allowed. Please Login Again' });
            }
        }
    };
};
