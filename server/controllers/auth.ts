import { Express } from "express";
import { DataBase, DataBaseItem, DbUser, getDateStr, User } from "../db/db_types";
import { sign as JwtSign, verify as JwtVerify, decode as JwtDecode } from 'jsonwebtoken';
import { compareSync } from 'bcrypt';
import { JwtUser } from '../../common/store_types';
import { shuffleArray } from '../../common/utils';
import { ApiEndpoints, ApiEndpointRoot } from '../../common/endpoints';
import { sendMagicCodeEmail } from "../sendgrid";
const JWT_SECRET = "yourSecretKey";

export function DecodeJwtToken(token: string): JwtUser | null {
    const results = (JwtDecode(token) as any);
    if (results == null) return null;
    const user: JwtUser = {
        name: results.name,
        _id: results._id,
        temporary: results.temporary,
    };
    return user;
}

function GiveToken(token_user: JwtUser, res: any, message: string, temporary?: boolean) {
    if (temporary == undefined || temporary == null) temporary = false;
    const expireInHours = temporary ? 24 : 10000; // about a year
    const token = JwtSign(token_user, JWT_SECRET, {
        expiresIn: expireInHours + 'h'
    });
    res.cookie('token', token, { maxAge: 1000 * 60 * 60 * expireInHours });
    if (message != '') {
        res.json({
            token,
            message
        });
    }
}

function GenerateMagicCode() {
    const magic_key_length = 25;
    const characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const charactersLength = characters.length;
    let result = Array(magic_key_length).fill('').map((x)=>characters.charAt(Math.floor(Math.random() * charactersLength))).join('');
    return result;
}

const noun_parts = ['dad', 'shirt', 'week', 'year', 'gate', 'disk', 'way', 'two', 'throat', 'flight', 'month', 'death', 'pie', 'growth', 'tooth', 'mall', 'hair', 'cell', 'heart', 'skill', 'bread', 'thanks', 'fact', 'role', 'scene', 'gene', 'tale', 'depth', 'world', 'speech', 'height', 'dad', 'love', 'sir', 'lake', 'wealth', 'goal', 'drawer', 'son', 'chest', 'hat', 'clothes', 'news', 'phone', 'thing', 'health', 'map', 'truth', 'mom', 'mood', 'guest', 'beer', 'art', 'song', 'bath', 'road', 'actor', 'bonus', 'river', 'basket', 'honey', 'sword', 'club', 'axe', 'monster'];
const adj_parts = ['pretty', 'green', 'red', 'blue', 'yellow', 'purple', 'wood', 'dark', 'brown', 'plucky', 'lean', 'decent', 'majestic', 'cynical', 'ruddy', 'funny', 'rich', 'cuddly', 'mighty', 'rapid', 'strong', 'puzzled', 'flippant', 'exotic',];
function RandomName() {
    let noun_indexes = Array.from(noun_parts.keys());
    shuffleArray(noun_indexes, Math.floor(Math.random() * 100000))
    const noun1 = noun_parts[noun_indexes[0]];
    const noun2 = noun_parts[noun_indexes[1]];
    const adj = adj_parts[Math.floor(Math.random() * adj_parts.length)];
    return [adj, noun1, noun2].join(" ")
}

// Attempt to login a user with the magic plaintext
async function LoginUserWithMagic(db: DataBase, user: DbUser, magic_plaintext: string): Promise<DbUser | null> {
    try {
        return null;
    }
    catch (e) {
        console.error("LoginUserWithMagic error:" + e);
        return null;
    }
}

function validateEmail(email: string) {
    const res = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return res.test(String(email).toLowerCase());
}

// Attempt to login a given email, if they already exist then 
async function AttemptLoginOrRegister(db: DataBase, email: string): Promise<DbUser | null | 'email'> {
    try {
        if (email == '') return null;
        // Step 1: check if the user already exists, if so return email
        const user = await db.userFind(email, null);
        // The user exists, set their magic code and return
        if (user != null) {
            // TODO: generate a magic thing and set it into their user
            const magic_code = GenerateMagicCode();
            user.magicCode = magic_code;
            sendMagicCodeEmail(user, magic_code);
            console.log("http://localhost:3000"+ApiEndpointRoot+ApiEndpoints.LOGIN_MAGIC+"?code="+magic_code+"&id="+user._id);
            await db.userUpdate(user);
            return 'email';
        }
        const name_parts = email.split('@');
        const name = name_parts[0];
        // Step 2: the user doesn't exist so we need to create them
        const new_user_data: User = {
            email,
            name,
        }
        let new_user = await db.userAdd(new_user_data);
        if (new_user == null) return null;
        return new_user;
    }
    catch (e) {
        console.error("AttemptLoginOrRegister error:" + e);
        return null;
    }
}

export default function RegisterEndPoints(app: Express, db: DataBase) {
    app.post(ApiEndpointRoot + ApiEndpoints.LOGIN_TEMP, async (req, res) => {
        try {
            const new_user_data: User = {
                email: '',
                name: RandomName(),
                temporary: true,
            }
            let new_user = await db.userAdd(new_user_data);
            if (new_user == null) {
                res.status(500).send("Unable to create temporary user");
                return;
            }
            const token_user: JwtUser = {
                _id: new_user._id,
                name: new_user.name,
                temporary: true,
            };
            GiveToken(token_user, res, "Created new temp account", true);
            return;
        }
        catch (e) {
            console.error("LoginUserTemp error:" + e);
            res.status(500).send("Not implemented");
        }
    });

    // magic link login
    app.get(ApiEndpointRoot + ApiEndpoints.LOGIN_MAGIC, async (req, res) => {
        if (req.query['code'] == undefined) {
            res.status(300).send("Code missing");
            return;
        }
        if (req.query['id'] == undefined) {
            res.status(300).send("id missing");
            return;
        }
        const id = parseInt(req.query['id'].toString());
        const user = await db.userFind(null, id);
        if (user == null) {
            res.status(300).send("user not found");
            return;
        }
        const magic = req.query['code'];
        const curr_magic = user.magicCode;
        // erase the magic code
        if (user.magicCode != '') {
            user.magicCode = '';
            db.userUpdate(user);
        }
        // check if they don't have a magic code
        if (curr_magic == null || curr_magic == undefined || user.temporary || curr_magic == '' || magic !=curr_magic) {
            res.status(300).send("Magic code doesn't match");
            // TODO: erase magic code?
            return;
        }
        
        const token_user: JwtUser = {
            _id: user._id,
            name: user.name,
            temporary: user.temporary || false,
        };
        res.status(200)
        GiveToken(token_user, res, "");
        //res.send("<script>window.location.replace('/');</script>")
        res.redirect("/")
        return
    });
    // Attempt to login a user
    app.post(ApiEndpointRoot + ApiEndpoints.LOGIN, async (req, res) => {
        if (req.body['email'] == undefined) {
            res.status(300).send("Email missing");
            return;
        }
        const email = req.body['email'];
        if (req.body['email'] == '') {
            res.status(300).send("Email blank");
            return;
        }
        const valid_email = validateEmail(email);
        if (!valid_email) {
            res.status(300).send("Email is not valid");
            return;
        }

        let user = await AttemptLoginOrRegister(db, email);

        if (user == null) {
            res.status(300).send("Unable to create new account");
            return;
        }
        if (user == 'email') {
            // tell the user to check their email
            res.send("Check email");
            return;
        }

        const token_user: JwtUser = {
            _id: user._id,
            name: user.name,
            temporary: user.temporary || false,
        };
        GiveToken(token_user, res, "created user");
    });

    // check if we're logged in
    app.use(async (req, res, next) => {
        const path = req.path;
        if (path == '/favicon.ico' || path.startsWith('/js/') || path.startsWith('/img/') || path.startsWith('/css/') || path == '/login' || path.indexOf('.') != -1) {
            return next();
        }
        try {
            //console.error("Checking auth for "+ path);
            const token = (req.cookies) ? req.cookies['token'] : req.headers.authorization?.split("Bearer ")[1];
            if (!token) throw new Error("No Authorization Header");
            await JwtVerify(token, JWT_SECRET);
            res.locals.token = token;
            const results = (JwtDecode(token) as any);
            // TODO: check if the user actually exists?
            res.locals.user = results;
            return next();
        }
        catch (e) {
            //console.error("Auth check", e);
        }
        // TODO: redirect to login page if we're on a page that needs it
        if (path.startsWith('/api/') || path == '/logout') {
            return next();
        }
        // redirect to login
        console.error("Redirecting from " + req.path + " to /login");
        return res.redirect('/login');

    });

    app.get(ApiEndpointRoot + ApiEndpoints.LOGOUT, (req, res) => {
        // clear the login token
        res.clearCookie('token');
        res.redirect("/");
    });
    app.get(ApiEndpoints.LOGOUT, (req, res) => {
        // clear the login token
        res.clearCookie('token');
        res.redirect("/");
    });
    const env = process.env.NODE_ENV || 'development';
    if (env === "development") {
        app.get("/api/dump", (req, res) => {
            db.dumpData();
            res.send("Data");
        })
    }
}