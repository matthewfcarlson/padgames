import { Express } from "express";
import { DataBase, DbUser, getDateStr } from "../db/types";
import { sign as JwtSign, verify as JwtVerify, decode as JwtDecode, JsonWebTokenError } from 'jsonwebtoken';
import { compareSync } from 'bcrypt';
import { JwtUser } from '../../common/types';
const JWT_SECRET = "SeminaryGamesSecretKey2022";

export function DecodeJwtToken(token:string): JwtUser|null  {
    try {
        const results = (JwtVerify(token, JWT_SECRET) as any);
        if (results == null) return null;
        const user: JwtUser = {
            name: results.name,
            _id: results._id,
            isHost: results.isHost,
            isSpectator: results.isSpectator,
            groupId: results.groupId,
        };
        return user;
    }
    catch (e) {
        console.error("Invalid token")
        return null;
    }
}

async function LoginUser(db: DataBase, user: DbUser, plain_text: string): Promise<DbUser | null> {
    try {
        if (user.hashedPassword == undefined && user.admin == true) {
            console.error("User " + user.name + user._id + " is an admin but doens't have a password set");
            return null;
        }
        if (user.hashedPassword == undefined && plain_text.length > 0) {
            console.error("User " + user.name + user._id + " doesn't have a password but one was provided");
            return null;
        }
        if (user.hashedPassword != undefined) {
            if (plain_text.length == 0) return null;
            // authenticate with a 
            if (!compareSync(plain_text, user.hashedPassword)) {
                console.error("Invalid password for " + user._id);
                return null;
            }
        }
        // next check if our last login was today, if so fail.
        // otherwise, update our last login to be recently
        else if (user.lastLogin != undefined && user.lastLogin == getDateStr()) {
            console.error("User " + user.name + user._id + " has already tried to login in today");
            return null;
        }
        const updated_user = await db.updateLoginTime(user);
        return updated_user;
    }
    catch (e) {
        console.error("LoginUser error:" + e);
        throw e;
        return null;
    }
}

export default function RegisterEndPoints(app: Express, db: DataBase) {
    app.post('/api/login', async (req, res) => {
        const password = (req.body['password'] == undefined) ? '' : req.body['password'];
        if (req.body['user_id'] == undefined) {
            res.status(300).send("User ID missing");
            return;
        }
        if (req.body['group_id'] == undefined) {
            res.status(300).send("Group ID missing");
            return;
        }
        // Group
        const group_id = parseInt(req.body['group_id']);
        const group = await db.findGroup(null, group_id);
        let token_user:JwtUser|null = null;
        if (group == null) {
            res.sendStatus(404);
            return;
        }
        // User
        const user_id = parseInt(req.body['user_id']);
        if (user_id == -1) {
            // we're trying to do a spectator
            const spec_id = Math.floor(Math.random()*-10000000); // give them a random id
            token_user = { 
                groupId: group_id,
                isHost: false,
                isSpectator: true,
                _id:spec_id,
                name: 'Spectator'+spec_id,
            };
        }
        else {
            const user = await db.findUser(null, user_id);
            const loggedin_user = await LoginUser(db, user, password);
            if (loggedin_user == null) {
                res.sendStatus(403);
                return;
            }
            const { hashedPassword, ...simplified_user } = user;
            token_user = { 
                _id: user._id,
                name: user.name,
                groupId: group_id,
                isHost: simplified_user.admin || false,
                isSpectator: false,
            };
        }
        if (token_user == null) {
            res.sendStatus(500);
            return;
        }
        const expireTime = (token_user.isHost || token_user.isSpectator) ? "7d" : "24h";
        
        const token = JwtSign(token_user, JWT_SECRET , {
            expiresIn: expireTime
        });
        res.cookie('token', token, {maxAge: 1000* 60 * 60 * 24});
        res.json({
            token,
            message: "create user successfully"
        });
    });

    // check if we're logged in
    app.use(async (req, res, next) => {
        const path = req.path;
        if (path == '/favicon.ico' || path.startsWith('/js/') || path.startsWith('/img/') || path.startsWith('/css/')|| path == '/login' || path.indexOf('.') != -1) {
            return next();
        }
        try {
            //console.error("Checking auth for "+ path);
            const token = (req.cookies) ? req.cookies['token'] : req.headers.authorization?.split("Bearer ")[1];
            if (!token) throw new Error("No Authorization Header");
            const results = (JwtVerify(token,JWT_SECRET) as any);
            res.locals.user = results;
            return next();
        }
        catch (e){
            if (path != '/logout' && e instanceof JsonWebTokenError) {
                console.error("Auth check failed, JWT is invalid");
                return res.redirect('/logout');
            }
        }
        // TODO: redirect to login page if we're on a page that needs it
        if (path.startsWith('/api/') || path == '/logout') {
            return next();
        }
        // redirect to login
        console.error("Redirecting from " + req.path + " to /login");
        return res.redirect('/login');
        
    });

    app.get("/logout", (req, res)=> {
        // clear the login token
        res.clearCookie('token');
        // TODO: clear player's last login time
        res.redirect("/");
    });
}