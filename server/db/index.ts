import { DevDB } from "./dev_db";
//import { SqlDB } from "./sql_db";
import { DataBase } from "./db_types";
import { hashSync } from 'bcrypt';

export function empty_promise<T>(item: T): Promise<T> {
    return new Promise((resolve) => resolve(item));
}

export function hashPassword(plain_text:string): string {
    return hashSync(plain_text, 10);
}

let db: DataBase | null = null;
export function GetDB(): DataBase {
    if (db == null) {
        const env = process.env.NODE_ENV || 'development';
        if (env === "development") {
            console.log("Staring dev database");
            db = new DevDB();
        }
        else if (env === "production") {
            console.log("Staring SQL database");
            //db = new SqlDB();
            db = new DevDB();
            // TODO: temporarily use the in memory database
            //throw new Error("Method not implemented.");
        }
        else throw new Error("Unknown environment " + process.env.NODE_ENV);
        // Temporarily erase all data and start over
        //SetDBToDefaultData();
    }
    return db;
}