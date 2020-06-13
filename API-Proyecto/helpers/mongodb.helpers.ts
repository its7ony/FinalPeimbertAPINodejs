//MONGODB Import
import {MongoClient} from 'mongodb';

export default class MongoDB{
    public db:any;
    private cnn:any;
    private port:number;
    private dbUri:string;
    private static _instance:MongoDB;

    constructor(SETTINGS:any){
        this.port = SETTINGS.PORT;
        this.dbUri = "mongodb://"+SETTINGS.USERNAME+":"+SETTINGS.PASSWORD+"@"+SETTINGS.HOST+"/"+SETTINGS.DEFAULT_DATABASE;
    }
    public static getInstance(settings:any){
        return this._instance || (this._instance = new this(settings))
    }
    async connect(){
        MongoClient.connect(this.dbUri,{useNewUrlParser:true,useUnifiedTopology:true}).then(connection =>{
            this.cnn = connection;
            this.db = this.cnn.db();
            console.log('Success connection to MongoDB')
        })
        .catch((err:any)=>{
            console.log('Error when try to connect to MongoDB: ', err)
        })
    }
    setDatabase(dbName:string){
        this.db = this.cnn.db(dbName);
    }
    async close(){
        await this.cnn.close();
    }
}