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
Object.defineProperty(exports, "__esModule", { value: true });
//MONGODB Import
const mongodb_1 = require("mongodb");
class MongoDB {
    constructor(SETTINGS) {
        this.port = SETTINGS.PORT;
        this.dbUri = "mongodb://" + SETTINGS.USERNAME + ":" + SETTINGS.PASSWORD + "@" + SETTINGS.HOST + "/" + SETTINGS.DEFAULT_DATABASE;
    }
    static getInstance(settings) {
        return this._instance || (this._instance = new this(settings));
    }
    connect() {
        return __awaiter(this, void 0, void 0, function* () {
            mongodb_1.MongoClient.connect(this.dbUri, { useNewUrlParser: true, useUnifiedTopology: true }).then(connection => {
                this.cnn = connection;
                this.db = this.cnn.db();
                console.log('Success connection to MongoDB');
            })
                .catch((err) => {
                console.log('Error when try to connect to MongoDB: ', err);
            });
        });
    }
    setDatabase(dbName) {
        this.db = this.cnn.db(dbName);
    }
    close() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.cnn.close();
        });
    }
}
exports.default = MongoDB;
