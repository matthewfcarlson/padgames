const rhino = require('rhino');

interface RhinoTDSType {
    id: number;
    name: string;
    type: string;
};

declare class RhinoResult {
    /**
     * Flattens a and merges multiple results into either an array of `Result` or a single `Result` object if only one
     * result is discovered. If no `Result` instances are found, a `null` value is returned.
     * @param  {...Result|Array.<Result>} results - The results to flatten.
     * @returns {Result|Array.<Result>}
     */
    static flatten(...results: (RhinoResult | Array<RhinoResult>)[]): RhinoResult | Array<RhinoResult> | null;
    /**
     * The return value from a stored procedure call (or series of calls).
     * @type {*|Array.<*>}
     */
    returned: any | Array<any>;
    /**
     * Array of column metadata. This will always be an array of columns even when the options `useColumnNames` is
     * used.
     * @type {Array}
     */
    columns: any[];
    /**
     * Array of row data. If the `useColumnNames` config option is true, each row will be an object with keys and
     * values corresponding to column names and values. If `useColumnNames` is false, each row will be an array
     * of values with indexes aligned with the `columns` metadata array.
     * @type {Array.<Object>|Array.<Array>}
     */
    rows: Array<any> | Array<any[]>;
}

interface RhinoQuery {
    /**
     * Sets the SQL query request timeout.
     * @throws Error if the `ms` argument less than 0 or not a number (or `null`).
     * @param {Number} ms - The timeout in milliseconds, or `null` to use configured defaults.
     * @returns {Query}
     */
    timeout(ms: number): RhinoQuery;
    /**
     * Sets the SQL query text (statment). Calling this function resets the query `mode` to an automatically determined
     * value.
     * @throws Error if the `statement` argument is falsey.
     * @throws Error if the `statement` argument is not a string.
     * @param {String} statement - The SQL query text to be executed.
     * @param {Map.<String,*>|Object} [params] - Optional parameters `Object` or `Map` that will be added to the
     * "in" parameters of the query. Keys and property names are used as the parameter name, and the value as the
     * parameter values.
     * @returns {Query}
     */
    sql(statement: string, params?: Map<string, any> | any): RhinoQuery;
    /**
     * Forces the query into BATCH `mode`.
     * @throws Error if the query contains parameters.
     * @returns {Query}
     */
    batch(): RhinoQuery;
    /**
     * Forces the query into EXEC `mode`.
     * @returns {Query}
     */
    exec(): RhinoQuery;
    /**
     * Adds an input parameter to the query.
     * Calling this when the query `mode` is set to BATCH will reset the `mode` to QUERY.
     * @throws Error if the `name` argument is falsey.
     * @throws Error if the `name` argument is not a string.
     * @throws Error if the `name` argument has already been specified or is not specified as a string.
     * @param {String|Map.<String,*>|Object} name - The parameter name, can be specified with the '@' character or not.
     * If a `Map` or `Object` is specified - it's keys or property names are used as the parameter name, and the
     * value(s) as the parameter values.
     * @param {String|Query.TDSType} [type] - The explicit database type to use, if not specified, it is auto-determined. This parameter
     * can be omitted.
     * @param {String|Number|Date|Buffer|Object|*} [value=null] - The value of the parameter.
     * @returns {Query}
     */
    in(name: string | Map<string, any> | any, type?: string | RhinoTDSType, value?: string | number | Date | Buffer | any | any, ...args: any[]): RhinoQuery;
    /**
     * Adds an output parameter to the query.
     * Calling this when the query `mode` is set to BATCH will reset the `mode` to QUERY.
     * @throws Error if the `name` argument is falsey.
     * @throws Error if the `name` is a `Map` and a key is not a `String`.
     * @throws Error if the `name` argument has already been specified.
     * @throws Error if the `type` argument is falsey.
     * @param {String|Map.<String,*>|Object} name - The parameter name, can be specified with the '@' character or not.
     * If a `Map` or `Object` is specified - it's keys or property names are used as the parameter name, and the
     * values(s) are ignored.
     * @param {*} type - The explicit database type to use. Must be specified on out parameters.
     * @returns {Query}
     */
    out(name: string | Map<string, any> | any, type: any): RhinoQuery;
    /**
     * Removes a parameter by name.
     * @throws Error if the `name` argument is falsey.
     * @throws Error if the `name` argument is not a string.
     * @param {String} name - The name of the parameter to remove.
     * @returns {Boolean} Returns `true` if a parameter with the name was found and removed, or `false` if no parameter
     * was found with the given name.
     */
    remove(name: string): boolean;
    /**
     * Clears all query criteria, including SQL statement values and parameters. The `Query` instance is fully reset
     * to a blank slate.
     */
    clear(): void;
}

interface RhinoTransaction {
    /**
     * Runs a SQL statement on the database and returns the results.
     * @param {String} sql - The SQL statement to execute.
     * @param {Map.<String,*>|Object} [params] - Optional parameters `Object` or `Map` that will be added to the
     * "in" parameters of the query. Keys and property names are used as the parameter name, and the value as the
     * parameter values.
     * @returns {Query}
     */
    query(sql: string, params?: Map<string, any> | any): Promise<RhinoQuery>;
    /**
    * Add a save-point to the transaction. This will follow the previously added query.
    * @throws Error if no queries are present. A save-point should follow at least one query.
    * @param {String} [name] - The name of the transaction savepoint. If no name is specified, one is automatically
    * generated. You can use this name with the rollback command.
    * @returns {String} Returns the name of the save-point.
    */
    savePoint(name?: string): string;
    /**
     * Remove all queued queries from the transaction.
     */
    clear(): void;
    /**
    * Commits all queries in the transaction queue.
    * @throws Error if the `pool` property is falsey.
    * @throws Error when a `txName` argument is not present and an `isolation` argument is specified.
    * @throws Error if there is an active connection already processing a transaction.
    * @param {String} [txName] = A name associated with the transaction - this is required when specifying an
    * `isolation` argument value.
    * @param {tedious.ISOLATION_LEVEL|Number|String} [isolation] - The isolation level of the transaction. Values
    * can be numbers or strings corresponding to the `Transaction.ISOLATION_LEVEL` enum. For example:
    * - READ_UNCOMMITTED
    * - READ_COMMITTED
    * - REPEATABLE_READ
    * - SERIALIZABLE
    * - SNAPSHOT
    *
    * Defaults to the connection's isolation level, which is *usually* "READ_COMMITED".
    *
    * @see {@link https://docs.microsoft.com/en-us/sql/t-sql/statements/set-transaction-isolation-level-transact-sql|Microsoft documentation on transaction isolation levels.}
    * @see `Connection.TediousConfiguration.options.isolationLevel`
    * @see `Connection.TediousConfiguration.options.connectionIsolationLevel`
    *
    * @returns {Promise.<Result|Array.<Result>>}
    */
    commit(txName?: string, isolation?: {
        NO_CHANGE: number;
        READ_UNCOMMITTED: number;
        READ_COMMITTED: number;
        REPEATABLE_READ: number;
        SERIALIZABLE: number;
        SNAPSHOT: number;
    } | number | string): Promise<RhinoResult | Array<RhinoResult>>;
    /**
     * Rolls back the active transaction.
     * @throws Error if the `pool` property is falsey.
     * @throws Error if there is no active transaction connection.
     * @throws Error if the active connection does not have an active transaction.
     * @param {String} [name] - The name of a savepoint to rollback to. If not specified, the entire transaction will
     * be rolled back.
     */
    rollback(name?: string): Promise<void>;
}

interface Rhino {
    /**
     * Destroys internal pooled resources in this instance. This is called automatically when the process exits.
     * @param {Function} [done] - Callback function when the destruction is complete.
     */
    destroy(done?: Function): void;
    /**
     * Attempts to connect to the database. This method utilizes the internal connection pool, and will return `true`
     * if a connection is already opened and active. If the connection cannot be established for any reason, including
     * an error, a `false` is returned.
     *
     * Note that if an error occurs in this function call, it is *not* thrown, but it will be logged normally.
     *
     * @returns {Boolean} Returns `true` when a connection was successfully aquired. A `false` value is returned if the
     * connection cannot be aquired for any reason.
     */
    ping(): boolean;
    transaction(): RhinoTransaction;
    /**
     * Runs a SQL statement on the database and returns the results.
     * @param {String} sql - The SQL statement to execute.
     * @param {Map.<String,*>|Object} [params] - Optional parameters `Object` or `Map` that will be added to the
     * "in" parameters of the query. Keys and property names are used as the parameter name, and the value as the
     * parameter values.
     * @returns {ConnectedQuery|Promise.<Result>}
     */
    query(sql: string, params?: Map<string, any> | any): Promise<RhinoResult>;
    /**
     * Creates a new bulk-loading query that can be used to rapidly insert large amounts of data.
     * @param {String} tableName - The name of the table to perform the bulk insert.
     * @param {BulkQuery.Options} options - Options to pass to the bulk query.
     * @returns {BulkQuery}
     */
    //bulk(tableName: string, options: RhinoBulkQuery.Options): RhinoBulkQuery;
}