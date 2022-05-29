import { empty_promise } from ".";
import fs from 'fs';
import { DataBase, DataBaseID, DataBaseItem, DbUser, DbUserFriendship, getDateStr, User } from "./db_types";

const findMaxId = (prev: number, curr: DataBaseItem) => Math.max(curr._id, prev);

interface SerialData {
    users: DbUser[]
}
const db_file = "db.json";
export class DevDB implements DataBase {

    private _users: DbUser[] = [];

    async connect(): Promise<boolean> {
        // Check if db file exists
        if (!fs.existsSync(db_file)) return true;
        // read in the file
        try{
            const db_file_text = fs.readFileSync(db_file, {encoding:'utf-8'});
            const db_content = JSON.parse(db_file_text) as SerialData;
            this._users = db_content.users;
        }
        catch (e) {
            console.error(e);
        }
        return true;
    }
    async reset(): Promise<boolean> {
        console.error("Clearing development database");
        this._users = [];
        return true;
    }

    async serialize(): Promise<void> {
        // write our state to disk
        console.log("Writing data out to disk")
        const data: SerialData= {
            users:this._users.filter((x)=>!x.temporary)
        }
        const json_data = JSON.stringify(data);
        fs.writeFileSync(db_file, json_data, 'utf-8');
        console.log("Finished writing data");
    }

    async userAdd(user: User): Promise<DbUser|null>{
        const _id = this._users.reduce(findMaxId, 0) + 1;
        user.creationDate = getDateStr();
        user.magicCode = "";
        user.validated = false;
        const existing_user = await this.userFind(user.email, null);
        if (existing_user)
        if (user.temporary == null) user.temporary = false;
        const db_user:DbUser = {_id, ...user};
        this._users.push(db_user); 
        return {...db_user}; // shallow clone
    }

    async userUpdate(user: DbUser): Promise<boolean> {
        const existing_user = await this.userFind(user.email, user._id);
        if (!existing_user) return false;
        for (let i=0; i < this._users.length; i++) {
            const item = this._users[i];
            if (user._id != item._id || user.email != item.email) continue;
            this._users[i] = {...user};
            return true;
        }
        return false;
    }

    async dumpData(): Promise<void> {
        console.log("users", this._users);
        return;
    }

    async userFind(email: string | null, id: number | null): Promise<DbUser|null> {
        for (let i = 0; i < this._users.length; i++) {
            const item = this._users[i];
            if (item._id == id) return { ...item }; // shallow copy
            if (item.email == email) return { ...item }; // shallow copy
        }
        return null;
    }

    async friendAdd(friend: DbUser, friendee: DbUser): Promise<DbUserFriendship> {
        throw new Error("Method not implemented.");
    }
    async friendshipUpdate(friendship: DbUserFriendship): Promise<boolean> {
        throw new Error("Method not implemented.");
    }
    async userFindFriendships(user: DbUser): Promise<DbUserFriendship[]> {
        throw new Error("Method not implemented.");
    }
    async friendshipFind(id: number): Promise<DbUserFriendship> {
        throw new Error("Method not implemented.");
    }
    async userDelete(user: DbUser): Promise<boolean> {
        throw new Error("Method not implemented.");
    }
    async friendshipDelete(friendship: DbUserFriendship): Promise<boolean> {
        throw new Error("Method not implemented.");
    }

}