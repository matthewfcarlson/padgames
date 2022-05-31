import { Express } from "express";
import { DataBase, DbUser } from "../db/db_types";
import { ApiEndpointRoot, ApiEndpoints } from "../../common/endpoints";

export default function RegisterEndPoints(app: Express, db: DataBase) {

    app.get(ApiEndpointRoot + ApiEndpoints.MAKE_FRIEND, async (req, res) => {
        const user = res.locals.user;
        if (user == null || user == undefined) {
            res.status(402).send("Not logged in");
            return;
        }
        try {
            const dbuser = user as DbUser;
            if (dbuser.temporary) {
                res.status(403).send("Temporary User");
                return;
            }
        }
        catch {
            res.status(402).send("Not logged in");
            return
        }
        const dbuser = user as DbUser;
        if (dbuser.temporary)
        res.json({"hi": dbuser});
    });
    app.post(ApiEndpointRoot + ApiEndpoints.GET_FRIENDS, async (req, res) => {
        const user = res.locals.user;
        if (user == null || user == undefined) {
            res.status(402).send("Not logged in");
            return;
        }
        try {
            const dbuser = user as DbUser;
            if (dbuser.temporary) {
                res.status(403).send("Temporary User");
                return;
            }
            res.json({"hi": dbuser});
        }
        catch {
            res.status(402).send("Not logged in");
            return
        }
    });
}