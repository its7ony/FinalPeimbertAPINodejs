import {Request, Response, NextFunction} from 'express'
import jwt from 'jsonwebtoken'

export default () => {
    return {
        verify: (req: Request, res: Response, next: NextFunction) => {
            //Get Auth Header Value
            const bearerHeader = req.headers['authorization']
            if(typeof bearerHeader !== 'undefined'){
                const bearer = bearerHeader.split(' ');
                const bearerToken = bearer[1]
                jwt.verify(bearerToken, 'secretkeyword', (err: any, tokenDecoded: any) => {
                    if(err){
                        return res.status(403).json({ ok: false, msg: 'Invalid Token' })
                    }
                    req.body.authUser = tokenDecoded;
                    next();
                });

            } else {
                //Unauthorized
                return res.status(401).json({ ok: false, msg: 'Method Not Allowed. Please Login Again' })
            }
        }
    }
}