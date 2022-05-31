const moment = require('moment');
enum DateStrBrand { }

export type DateStr = string & DateStrBrand;

export function checkValidDateStr(str: string): str is DateStr {
    return str.match(/^\d{4}-\d{2}-\d{2}$/) !== null;
}

export function toDateStr(date: Date | string): DateStr {
    if (typeof date === 'string') {
        if (checkValidDateStr(date)) {
            return date;
        } else {
            throw new Error(`Invalid date string: ${date}`);
        }
    }
    else {
        const dateString = moment(date).format('YYYY-MM-DD');
        if (checkValidDateStr(dateString)) {
            return dateString;
        }
    }
    throw new Error(`Shouldn't get here (invalid toDateStr provided): ${date}`);
}

export function getDateStr() : DateStr {
    return toDateStr(new Date());
}

export type DataBaseID = number;

export interface DataBaseItem {
    _id: DataBaseID,
}

export interface User {
    email: string,
    name: string, // by default, it's the first part of your email
    creationDate?: DateStr,
    active?: DateStr, // if null they're not active, if not today's day, they're not active
    validated?:boolean, // if the user has been validated via an email, delete after 7 days if it has not been validated
    temporary?:boolean, // if the user is temporary and should be deleted 2 days after it was created
    magicCode?:string, // the magic string that gets generated when an email is sent
}

export type DbUser = User & DataBaseItem;

export type DbUserPart = DataBaseItem & Pick<Partial<User>, "email">;

export interface UserFriendship {
    friend: DataBaseID, // points to a user's ID, is always the lowest of the two IDs
    friendee: DataBaseID, // points to a user's ID
    confirmed?: boolean, // by default it is not confirmed, assumed false
}

export type DbUserFriendship = UserFriendship & DataBaseItem;

export interface DataBase {
    connect(): Promise<boolean>,
    // development routines
    reset(): Promise<boolean>,
    dumpData(): Promise<void>,
    serialize(): Promise<void>,
    // ---------------------------
    //user stuff
    userAdd(user: User): Promise<DbUser|null>,
    friendAdd(friend:DbUser, friendee:DbUser): Promise<DbUserFriendship|null>;
    // update
    userUpdate(user:DbUserPart): Promise<boolean>,
    friendshipUpdate(friendship:DbUserFriendship): Promise<boolean>;
    // find
    userFind(email: string | null, id: DataBaseID | null): Promise<DbUser|null>,
    userFindFriendships(user:DbUser): Promise<DbUserFriendship[]|null>,
    friendshipFind(id:DataBaseID): Promise<DbUserFriendship|null>,
    // delete
    userDelete(user:DbUserPart): Promise<boolean>;
    friendshipDelete(friendship:DbUserFriendship): Promise<boolean>;
}