import { IRoom, GameType } from "../../../common/rooms/IRoom";
import { EGameState } from "../../../common/games/IGame";
import { IPlayerID } from "../../../common/players/IPlayer";
import { RootLogger } from "../../../common/util/logger";

export class ServerRoom implements IRoom {
    protected players = [];
    protected id = "";
    protected gameType = "";
    protected game = null;
    protected foriegn =  false;

    public GetHostPlayer(): IPlayerID {
        throw new Error("Method not implemented.");
    }
    public GetGameState(): EGameState {
        throw new Error("Method not implemented.");
    }

    constructor(game: GameType = "", foriegn: boolean = false) {
        // TODO figure out which game type I need to create
        RootLogger.info("Creating game of type " + game);
        this.foriegn = foriegn;
        this.gameType = game;
    }

    public GetGameType(): GameType {
        return this.gameType;
    }

    public IsForiegn(): boolean {
        return this.foriegn;
    }


}