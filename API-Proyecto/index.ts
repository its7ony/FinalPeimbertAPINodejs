//Import packages
import express, {Request, Response, json} from 'express';
import cors from 'cors';
import jwt from 'jsonwebtoken'
import ENV from './env/env.production';
import MongoDBHelper from './helpers/mongodb.helpers';
import bcrypt from 'bcryptjs';

//Constants declarations
const app = express();
const mongodb = MongoDBHelper.getInstance(ENV.MONGODB);

app.use(express.urlencoded({extended: true}));
app.use(express.json());
app.use(cors({origin: true, credentials: true}));

app.get('/api/auth/test', (req: Request, res: Response) => {
    res.status(200).json({ ok: true, msg: "Hi from my method." })
});

app.post('/api/auth/login', async (req: Request, res: Response) => {
    const { username, password } = req.body;

    const user = await mongodb.db.collection('users').findOne({email: username});

    console.log('user: ',user);
    
    if(!bcrypt.compareSync(password, user.password)){
       return  res.status(404).json({ ok: false, msg: "Invalid Username or Password. Try again" })
    }

    const  userValid = {
        id: user._id,
        email: user.email,
        fullname: user.fullname,
        urlPhoto: user.urlPhoto,
        rol: user.rol
    }

        jwt.sign(userValid, 'secretkeyword', { expiresIn: '180s' }, (err: any , token) => {

            if(err){
                return res.status(500).json({
                    ok: false,
                    msg: 'An error ocurred',
                    err
                })
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
});


app.post('/api/auth/createUser', async (req: Request, res: Response) => {
    const { email, password, fullname, urlPhoto, rol } = req.body;
  
    const newUser = {email, password:bcrypt.hashSync(password,10), fullname, urlPhoto, rol};  
  
    const insert = await mongodb.db.collection('users').insertOne(newUser)

    res.status(200).json({ok:true, msg: 'User Created Successfully!', result: insert.insertedId});
    
});


app.listen(ENV.API.PORT,  async () => {
    console.log(`Server running on port ${ENV.API.PORT}`);
    //connect to MongoDB
    await mongodb.connect();
});

//handle errors
process.on('unhandledRejection', async(err:any)=>{
    //close MongoDB connnection
    mongodb.close();
    process.exit();
});
