// Types
export const enum Connections {
    NONE = 0,
    NO_WALLS = 1 << 1,
    TWO_WALLS = 1 << 2,
    ONE_WALL_OPEN = 1 << 4
}
// This is brittle and I hate it
export const enum TileType {
    NONE = 0,
    START = 1,
    EMPTY = 1 << 2,
    KEY = 1 << 3,
    EXIT = 1 << 4,
    CHEST = 1 << 5,
    SLIME_HAZARD = 1 << 6,
    SPIKE_HAZARD = 1 << 7,
    TUNNEL = 1 << 8,
    PASSAGE = 1 << 9,
}
export const enum Direction {
    NORTH,
    EAST,
    SOUTH,
    WEST,
}

export interface PlacementTile {
    possible: null | Set<number>
    selected: number | null
}
export interface PlacedTileGrid {
    grid: PlacedTileData[]
    size: number
}

export interface PlacementOptions {
    size: number
    enemies: number
}

type Connector = number
type ConnectorList = [Connector, Connector, Connector, Connector]
type TileProbabilityFunction = (grid: any, x: number, y: number) => number
interface BaseTileData {
    img_path: string
    type: TileType
}
interface RawTileData extends BaseTileData {
    connections: Connector | ConnectorList
    place_limit?: number // the limit that can be placed on the board
    unplacable?: boolean // whether the tile can be placed on initial generation
    no_touch_self?: boolean // whether the tile can be allowed to touch itself (id based)
    no_touch_types?: TileType // a bitfield that determines all the tile types that this tile cannot touch
    rotation_count?: 0 | 1 | 2 | 3 // the number of rotations that we generate
    rotation_start?: 0 | 90 | 180 | 270
    // relative probability to other possible tiles 0 is impossible, 1 is just as likely as any other possible tile
    // default is 1
    probability?: number | TileProbabilityFunction
}
interface FinalTileData extends BaseTileData {
    id: number
    rotation: number
    unplacable: boolean
    place_limit: number
    probability: number | TileProbabilityFunction
    connections: ConnectorList
}
// Rotated tile creates all the tile rotations
interface RotatedTileData extends FinalTileData {
    no_touch_self: boolean
    no_touch_types: TileType
}
// Tile is the final tile that has been rotated and unallowed connections determined
export interface TileData extends FinalTileData {
    unallowed: [Set<number>, Set<number>, Set<number>, Set<number>]
}

export type NumBoolean = 0 | 1;

export interface PlacedTileData{
    tile_index: number
    traversal: [NumBoolean, NumBoolean, NumBoolean, NumBoolean] // determines which directions can be moved through
    visible: [NumBoolean, NumBoolean, NumBoolean, NumBoolean] // determines which directions are visible through
}

export enum KeeypCharacterAbilityId {
    REVIVE_ONCE,
    PICK_UP_THREE_ITEMS_ONCE,
    AUTO_STEAL_KEY_ONCE,
    SHIELD_BREAK_ONCE,
    DRAW_THREE_PICK_ONE_ONCE,
    RUN_AWAY_2X,
    TELEPORT_2X,
    ATTACK_WITH_SHIELDS,
    MOVE_AFTER_COMBAT_2X,
}

export interface KeeypCharacter {
    attack: number,
    defense: number,
    speed: number,
    name: string,
    ability:KeeypCharacterAbilityId
}

// ----------------------------------------------------------
// DATA
export const keeyp_characters: KeeypCharacter[] = [
    {
        attack: 1,
        defense: 0,
        speed: 4,
        name: "Chad",
        ability: KeeypCharacterAbilityId.REVIVE_ONCE,
    },
    {
        attack: 1,
        defense: 3,
        speed: 3,
        name: "Chef Antony",
        ability: KeeypCharacterAbilityId.PICK_UP_THREE_ITEMS_ONCE,
    },
    {
        attack: 1,
        defense: 2,
        speed: 3,
        name: "Klepto-Mari",
        ability: KeeypCharacterAbilityId.AUTO_STEAL_KEY_ONCE,
    },
    {
        attack: 3,
        defense: 1,
        speed: 2,
        name: "Cold Sloth",
        ability: KeeypCharacterAbilityId.SHIELD_BREAK_ONCE,
    },
    {
        attack: 2,
        defense: 3,
        speed: 2,
        name: "Big Look",
        ability: KeeypCharacterAbilityId.DRAW_THREE_PICK_ONE_ONCE,
    },
    {
        attack: 2,
        defense: 1,
        speed: 3,
        name: "Mooshi",
        ability: KeeypCharacterAbilityId.RUN_AWAY_2X,
    },
    {
        attack: 2,
        defense: 2,
        speed: 2,
        name: "Wiz Bird",
        ability: KeeypCharacterAbilityId.TELEPORT_2X,
    },
    {
        attack: 1,
        defense: 4,
        speed: 2,
        name: "Shieldon",
        ability: KeeypCharacterAbilityId.ATTACK_WITH_SHIELDS,
    },
    {
        attack: 4,
        defense: 1,
        speed: 2,
        name: "Scally-Wog",
        ability: KeeypCharacterAbilityId.MOVE_AFTER_COMBAT_2X,
    },
    {
        attack: 4,
        defense: 1,
        speed: 2,
        name: "Carp-enter",
        ability: KeeypCharacterAbilityId.TELEPORT_2X,
    },
    {
        attack: 2,
        defense: 2,
        speed: 2,
        name: "Slip Kid",
        ability: KeeypCharacterAbilityId.TELEPORT_2X,
    },
]

export const ability_descriptions: { [k in KeeypCharacterAbilityId]: string } = {
    [KeeypCharacterAbilityId.REVIVE_ONCE]: "Revive at the start tile once per round",
    [KeeypCharacterAbilityId.AUTO_STEAL_KEY_ONCE] : "Auto steal the key once per ",
    [KeeypCharacterAbilityId.DRAW_THREE_PICK_ONE_ONCE] : "Draw three items, pick one once per round",
    [KeeypCharacterAbilityId.PICK_UP_THREE_ITEMS_ONCE]: "When you land on a treasure, get three things instead of once once per round",
    [KeeypCharacterAbilityId.RUN_AWAY_2X]: "Run away",
    [KeeypCharacterAbilityId.SHIELD_BREAK_ONCE]: "Break shields",
    [KeeypCharacterAbilityId.TELEPORT_2X]: "You can teleport to an adjacent or diagonal tile 2 times per round",
    [KeeypCharacterAbilityId.ATTACK_WITH_SHIELDS]: "Attack with shields",
    [KeeypCharacterAbilityId.MOVE_AFTER_COMBAT_2X]: "Move after combat"
}
export const raw_tile_list: RawTileData[] = [
    {
        img_path: "start_color.png",
        connections: Connections.TWO_WALLS,
        place_limit: 1,
        type: TileType.START,
        rotation_count: 0,
    },
    { img_path: "blank_color.png", connections: Connections.NO_WALLS, type: TileType.EMPTY },
    {
        img_path: "empty_corner_color.png",
        connections: [Connections.TWO_WALLS, Connections.NO_WALLS, Connections.NO_WALLS, Connections.TWO_WALLS],
        type: TileType.PASSAGE,
        unplacable: true
    },
    {
        img_path: "corner_color.png",
        connections: [Connections.TWO_WALLS, Connections.TWO_WALLS, Connections.NO_WALLS, Connections.NO_WALLS],
        type: TileType.PASSAGE
    },
    {
        img_path: "open_corner_color.png",
        connections: [Connections.ONE_WALL_OPEN, Connections.ONE_WALL_OPEN, Connections.NO_WALLS, Connections.NO_WALLS],
        type: TileType.PASSAGE
    },
    {
        img_path: "treasure_corner_color.png",
        connections: [Connections.TWO_WALLS, Connections.NO_WALLS, Connections.NO_WALLS, Connections.TWO_WALLS],
        place_limit: 3,
        no_touch_self: true,
        type: TileType.CHEST
    },
    {
        img_path: "exit_color.png",
        connections: [Connections.NO_WALLS, Connections.NO_WALLS, Connections.TWO_WALLS, Connections.NO_WALLS],
        place_limit: 1,
        type: TileType.EXIT
    },
    {
        img_path: "4way_color.png",
        connections: Connections.TWO_WALLS,
        type: TileType.PASSAGE
    },
    {
        img_path: "empty_key_color.png",
        connections: [Connections.NO_WALLS, Connections.NO_WALLS, Connections.TWO_WALLS, Connections.NO_WALLS],
        type: TileType.PASSAGE,
        unplacable: true
    },
    {
        img_path: "key_color.png",
        connections: [Connections.NO_WALLS, Connections.NO_WALLS, Connections.TWO_WALLS, Connections.NO_WALLS],
        place_limit: 1,
        type: TileType.KEY
    },
    {
        img_path: "spikes_color.png",
        connections: [Connections.TWO_WALLS, Connections.NO_WALLS, Connections.TWO_WALLS, Connections.NO_WALLS],
        place_limit: 2,
        no_touch_self: true,
        rotation_count: 1,
        type: TileType.SPIKE_HAZARD
    },
    {
        img_path: "straight_color.png",
        connections: [Connections.TWO_WALLS, Connections.NO_WALLS, Connections.TWO_WALLS, Connections.NO_WALLS],
        type: TileType.PASSAGE,
        rotation_count: 1,
    },
    {
        img_path: "treasure_straight_color.png",
        connections: [Connections.TWO_WALLS, Connections.NO_WALLS, Connections.TWO_WALLS, Connections.NO_WALLS],
        place_limit: 2,
        no_touch_self: true,
        no_touch_types: TileType.CHEST,
        rotation_count: 1,
        type: TileType.CHEST
    },
    {
        img_path: "empty_straight_color.png",
        connections: [Connections.TWO_WALLS, Connections.NO_WALLS, Connections.TWO_WALLS, Connections.NO_WALLS],
        type: TileType.EMPTY,
        rotation_count: 1,
        unplacable: true
    },
    {
        img_path: "slime_color.png",
        connections: [Connections.TWO_WALLS, Connections.NO_WALLS, Connections.TWO_WALLS, Connections.NO_WALLS],
        place_limit: 3,
        no_touch_self: true,
        rotation_count: 1,
        type: TileType.SLIME_HAZARD
    },
    {
        img_path: "open_3way_top.png",
        type: TileType.PASSAGE,
        connections: [Connections.ONE_WALL_OPEN, Connections.ONE_WALL_OPEN, Connections.TWO_WALLS, Connections.NO_WALLS]
    },
    {
        img_path: "3way_color.png",
        type: TileType.PASSAGE,
        connections: [Connections.TWO_WALLS, Connections.TWO_WALLS, Connections.TWO_WALLS, Connections.NO_WALLS]
    },
    {
        img_path: "tunnel_color.png",
        connections: [Connections.NO_WALLS, Connections.NO_WALLS, Connections.TWO_WALLS, Connections.NO_WALLS],
        place_limit: 2,
        type: TileType.TUNNEL,
        no_touch_self: true
    }
]

let tileList: TileData[] | null = null;
export function GenerateTiles() {
    if (tileList != null) return tileList;
    tileList = [];

    function convertConnections(val: Connector | ConnectorList): ConnectorList {
        if (typeof val == "object") {
            return val
        }
        return [val, val, val, val]
    }
    let rotated_tiles: RotatedTileData[] = []
    raw_tile_list.forEach((x, index) => {
        const img_path = x.img_path
        const place_limit = x.place_limit || 0
        const type = x.type || TileType.PASSAGE
        const unplacable = x.unplacable || false
        const rotation_count = x.rotation_count || 3
        const no_touch_self = x.no_touch_self || false
        const no_touch_types = x.no_touch_types || 0
        const probability = x.probability || 1
        let rotation = x.rotation_start || 0
        let connections = convertConnections(x.connections)
        rotated_tiles.push({
            img_path,
            id: index,
            rotation,
            place_limit,
            type,
            unplacable,
            connections: [...connections],
            no_touch_self,
            no_touch_types,
            probability
        })
        // No need to rotate it if it has the same connections on all sides
        // TODO: revisit?
        if (typeof x.connections != "object") {
            return
        }
        for (let i = 0; i < rotation_count; i += 1) {
            const first = connections.pop()
            rotation += 90;
            if (rotation >= 360) rotation -= 360;
            if (first == undefined) continue
            connections.unshift(first)
            rotated_tiles.push({
                img_path,
                id: index,
                place_limit,
                unplacable,
                type,
                rotation,
                connections: [...connections],
                no_touch_self,
                no_touch_types,
                probability
            })
        }
    })
    tileList = rotated_tiles.map((x, index) => {
        const north_set = new Set<number>()
        const south_set = new Set<number>()
        const east_set = new Set<number>()
        const west_set = new Set<number>()
        rotated_tiles.forEach((y, index2) => {
          //if (index == 0) console.log(index, index2, x.connections, y.connections, x, y)
          // we look to see if it's south edge matches our north edge
          if (x.connections[0] != y.connections[2]) north_set.add(index2)
          // look to see if it's west edge matches our east
          if (x.connections[1] != y.connections[3]) east_set.add(index2)
          // look to see if it's north matches our south
          if (x.connections[2] != y.connections[0]) south_set.add(index2)
          // look to see if it's east edge matches our west
          if (x.connections[3] != y.connections[1]) west_set.add(index2)
          // check to make sure we aren't checking it
          if ((x.no_touch_self || y.no_touch_self) && x.id == y.id) {
            north_set.add(index2)
            west_set.add(index2)
            east_set.add(index2)
            south_set.add(index2)
          }
        //   if ((x.no_touch_type || y.no_touch_self) && x.type == y.type) {
        //     north_set.add(index2)
        //     west_set.add(index2)
        //     east_set.add(index2)
        //     south_set.add(index2)
        //   }
        //   if (x.unplacable || y.unplacable) {
        //     north_set.add(index2)
        //     west_set.add(index2)
        //     east_set.add(index2)
        //     south_set.add(index2)
        //   }
        })
        return {
          img_path: x.img_path,
          rotation: x.rotation,
          id: x.id,
          type: x.type,
          place_limit: x.place_limit,
          unplacable: x.unplacable,
          connections: x.connections,
          probability: x.probability,
          unallowed: [north_set, east_set, south_set, west_set]
        }
      })

    return tileList;
}


// This grid creates a grid
export class PlacementGrid {
    private options: PlacementOptions;
    private grid: PlacementTile[]
    private tiles: TileData[]
    private tile_counts: number[]
    private start_pos: [number, number]
    constructor(options: PlacementOptions) {
        this.options = options;
        this.grid = []
        this.tile_counts = []
        this.tiles = GenerateTiles()
        const grid_size = options.size;
        this.start_pos = [Math.floor(Math.random() * (grid_size - 2)) + 1, Math.floor(Math.random() * (grid_size - 2)) + 1]
    }

    private resetGrid() {
        // remove everything in the grid
        this.grid.splice(0, this.grid.length);
        const grid_length = this.size * this.size;
        for (let i = 0; i < grid_length; i++) this.grid.push({ selected: null, possible: null });
    }

    get size() {
        return this.options.size;
    }

    static getXYIndex(grid: PlacedTileGrid | PlacementGrid, x: number, y: number) {
        if (x >= grid.size || y >= grid.size) return null;
        if (x < 0 || y < 0) return null;
        return y * grid.size + x
    }
    static getGridCell(grid: PlacedTileGrid | PlacementGrid, x: number, y: number) {
        const index = PlacementGrid.getXYIndex(grid, x, y);
        if (index == null) return null;
        if (grid instanceof PlacementGrid) return grid.grid[index];
        return grid.grid[index];
    }

    private updatePossible(x: number, y: number, remove?: Set<number>) {
        const index = PlacementGrid.getXYIndex(this, x, y);
        if (index == null) return false;
        return false;
    }

    private setGridCell(x: number, y: number, tile_index: number | null): boolean {
        const index = PlacementGrid.getXYIndex(this, x, y);
        if (index == null) return false;
        if (tile_index == null) {
            this.grid[index].possible = null
            this.grid[index].selected = null
            this.updatePossible(x, y)
            return true
        }
        const tile = this.tiles[tile_index]
        if (tile.place_limit != 0 && this.tile_counts[tile.id] > tile.place_limit) return false
        this.tile_counts[tile.id]++
        this.grid[index].possible = null
        this.grid[index].selected = tile_index
        this.updatePossible(x, y - 1, tile.unallowed[0]) // north
        this.updatePossible(x + 1, y, tile.unallowed[1]) // east
        this.updatePossible(x, y + 1, tile.unallowed[2]) // south
        this.updatePossible(x - 1, y, tile.unallowed[3]) // west
        this.updatePossible(x + 1, y + 1)
        this.updatePossible(x - 1, y - 1)
        this.updatePossible(x + 1, y - 1)
        this.updatePossible(x - 1, y + 1)
        return true;
    }

    placeGrid() {
        // First reset the grid
        this.resetGrid();
        // First we place the start
        for (let i = 0; i < this.grid.length; i++) {
            this.grid[i].selected = 1;
        }
        this.setGridCell(this.start_pos[0], this.start_pos[1], 0);

    }

    get isWinnable(): boolean {
        // Step 1: make sure a start and end exist
        // Step 2: If a key doesn't exist, make sure to set the key to be in the chest
        // Step 3: make sure there is a path from start to exit
        // Step 4: make sure there is a path from start to key/all chests

        return false;
    }
    convertToPlacedGrid(): PlacedTileGrid | null {
        const tiles = this.tiles;
        const unselected = this.grid.filter((x) => x.selected == null).length;
        if (unselected > 0) return null;
        const grid: PlacedTileData[] = this.grid.map((x, index) => {
            if (x.selected == null) {
                return {
                    tile_index:0,
                    traversal: [0, 0, 0, 0],
                    visible: [0, 0, 0, 0]
                }
            }
            const tile_data = tiles[x.selected];

            const data: PlacedTileData = {
                tile_index:x.selected,
                traversal: [0, 0, 0, 0],
                visible: [0, 0, 0, 0]
            }
            return data;
        });

        return {
            grid,
            size: this.options.size
        }
    }
}