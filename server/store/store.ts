import { WatchOptions } from "vue";
import { Action, ActionHandler, ActionObject, ActionPayload, ActionTree, Commit, CommitOptions, Dispatch, DispatchOptions, Getter, GetterTree, Module, ModuleOptions, ModuleTree, Mutation, MutationPayload, MutationTree, Store, StoreOptions, SubscribeActionOptions, SubscribeOptions } from "vuex";
import { CommonModule, SyncedGameActions, SyncedGameGetters, SyncedGameMutations, SyncedGameState } from '../../common/common_store';
import { __assign } from "tslib";
import Vue from "vue";

type VuexPath = string[];

function forEachValue<S>(obj: { [key: string]: S }, fn: ((a: S, b: string) => any)): void {
    Object.keys(obj).forEach(function (key) { return fn(obj[key], key); });
}
let functionAssert = {
    assert: function (value: any) { return typeof value === 'function'; },
    expected: 'function'
};
function assert(condition: boolean, msg: string) {
    if (!condition) { throw new Error(("[vuex] " + msg)) }
}

function partial<S, R>(fn: ((a: S) => R), arg: S) {
    return function () {
        return fn(arg)
    }
}

function getNestedState<S>(state: S, path: VuexPath) {
    return path.reduce(function (state: any, key: string) { return state[key]; }, state)
}

function isObject(obj: any): obj is Object {
    return obj !== null && typeof obj === 'object'
}
function isPromise(val: any): val is Promise<any> {
    return val && typeof val.then === 'function'
}

function unifyObjectStyle(type: any, payload: any, options?: any) {
    if (isObject(type) && type.type) {
        options = payload;
        payload = type;
        type = type.type;
    }

    {
        assert(typeof type === 'string', ("expects string as the type, but found " + (typeof type) + "."));
    }

    return { type: type, payload: payload, options: options }
}


let objectAssert = {
    assert: function (value: any) {
        return typeof value === 'function' ||
            (typeof value === 'object' && typeof value.handler === 'function');
    },
    expected: 'function or object with "handler" function'
};
const assertTypes = {
    getters: functionAssert,
    mutations: functionAssert,
    actions: objectAssert
};
function makeAssertionMessage(path: any, key: string | number, type: string | number, value: any, expected: boolean) {
    let buf = key + " should be " + expected + " but \"" + key + "." + type + "\"";
    if (path.length > 0) {
        buf += " in module \"" + (path.join('.')) + "\"";
    }
    buf += " is " + (JSON.stringify(value)) + ".";
    return buf
}
function assertRawModule(path: any, rawModule: any) {
    Object.keys(assertTypes).forEach(function (key) {
        if (!rawModule[key]) { return }
        if (!(key in assertTypes)) { return }

        let assertOptions = (assertTypes as any)[key];

        forEachValue(rawModule[key], function (value, type) {
            assert(
                assertOptions.assert(value),
                makeAssertionMessage(path, key, type, value, assertOptions.expected)
            );
        });
    });
}

class VuexModule<S> {
    private _children: any;
    private _rawModule: StoreOptions<S>;
    state: S;
    runtime: boolean;
    public context: any = null;

    constructor(rawModule: StoreOptions<S>, runtime: boolean) {
        this.runtime = runtime;
        // Store some children item
        this._children = Object.create(null);
        // Store the origin module object which passed by programmer
        this._rawModule = rawModule;
        let rawState = rawModule.state;

        // Store the origin module's state
        this.state = (typeof rawState === 'function' ? (rawState as any)() : rawState) || {};
    }
    get namespaced() {
        return (this._rawModule as any).namespaced || true;
    }

    getChild(key: string) {
        return this._children[key];
    }
    hasChild(key: string) {
        return key in this._children;
    }

    forEachChild(fn: ((a: any, b: string) => void)) {
        forEachValue(this._children, fn);
    }

    forEachGetter(fn: ((a: Getter<S, S>, b: string) => void)) {
        if (this._rawModule.getters) {
            forEachValue(this._rawModule.getters, fn);
        }
    }

    forEachAction(fn: ((a: Action<S, S>, b: string) => void)) {
        if (this._rawModule.actions) {
            forEachValue(this._rawModule.actions, fn);
        }
    }

    forEachMutation(fn: ((a: Mutation<S>, b: string) => void)) {
        if (this._rawModule.mutations) {
            forEachValue(this._rawModule.mutations, fn);
        }
    }
}

class VuexModuleCollection<S> {
    private _root: VuexModule<S>;

    get root() {
        return this._root;
    }
    constructor(rawRootModule: StoreOptions<S>) {
        // register root module (Vuex.Store options)
        assertRawModule([], rawRootModule);
        const path: string[] = [];
        this._root = new VuexModule(rawRootModule, false);
        if (rawRootModule.modules) {
            const self = this;
            forEachValue(rawRootModule.modules, function (rawChildModule: any, key: string) {
                self.register(path.concat(key), rawChildModule);
            });
        }

    }
    private register(path: VuexPath, rawModule: StoreOptions<S>, runtime: boolean = false) {
        assertRawModule(path, rawModule);
        let newModule = new VuexModule(rawModule, runtime);
        assert(path.length > 0, "Cannot re-register root module")
        let parent = this.get(path.slice(0, -1));
        parent.addChild(path[path.length - 1], newModule);
        // register nested modules
        if (rawModule.modules) {
            const self = this;
            forEachValue(rawModule.modules, function (rawChildModule: any, key: string) {
                self.register(path.concat(key), rawChildModule, runtime);
            });
        }
    }
    private get(path: VuexPath) {
        return path.reduce(function (module: any, key: string) {
            return module.getChild(key)
        }, this.root)
    }

    getNamespace(path: any) {
        let module = this.root;
        return path.reduce(function (namespace: any, key: string) {
            module = module.getChild(key);
            return namespace + (module.namespaced ? key + '/' : '')
        }, '');
    }
}


class ServerStore<S> implements Store<S> {
    getters: any;
    private _committing: boolean;
    private _actions: any;
    private _actionSubscribers: any[];
    private _mutations: any;
    private _makeLocalGettersCache: any;
    private _subscribers: any[];
    private _modulesNamespaceMap: any;
    private _modules: VuexModuleCollection<S>;
    private _wrappedGetters: any;
    //private _state: S;
    private _vm: any;
    dispatch: Dispatch;
    commit: Commit;

    constructor(options: StoreOptions<S>) {
        let plugins = options.plugins; if (plugins === void 0) plugins = [];
        // store internal state
        this._committing = false;
        this._actions = Object.create(null);
        this._actionSubscribers = [];
        this._mutations = Object.create(null);
        this._wrappedGetters = Object.create(null);
        this._modules = new VuexModuleCollection(options);
        this._modulesNamespaceMap = Object.create(null);
        this._subscribers = [];
        this._makeLocalGettersCache = Object.create(null);
        const self = this;
        const commit = this._commit;
        const dispatch = this._dispatch;
        this.commit = function boundCommit(type: string, payload: any, options?: CommitOptions) {
            return commit.call(self, type, payload, options);
        }
        this.dispatch = function boundDispatch(type: string, payload: any) {
            return dispatch.call(self, type, payload);
        }

        const state = this._modules.root.state;

        // init root module.
        // this also recursively registers all sub-modules
        // and collects all module getters inside this._wrappedGetters
        this.installModule(state, [], this._modules.root);

        // initialize the store vm, which is responsible for the reactivity
        // (also registers _wrappedGetters as computed properties)
        this.resetStoreVM(state);

        // apply plugins
        plugins.forEach(function (plugin) { return plugin(self); });
    }
    private resetStore(hot: boolean = false) {
        this._actions = Object.create(null);
        this._mutations = Object.create(null);
        this._wrappedGetters = Object.create(null);
        this._modulesNamespaceMap = Object.create(null);
        // init all modules
        const state = this.state;
        this.installModule(state, [], this._modules.root, true);
        this.resetStoreVM(state, hot);
    }
    private resetStoreVM(state: S, hot: boolean = false) {
        const store = this;
        // bind store public getters
        store.getters = {};
        // reset local getters cache
        store._makeLocalGettersCache = Object.create(null);
        let wrappedGetters = store._wrappedGetters;
        let computed: any = {};
        forEachValue(wrappedGetters, function (fn: any, key: string) {
            // use computed to leverage its lazy-caching mechanism
            // direct inline function use will lead to closure preserving oldVm.
            // using partial to return function with only arguments preserved in closure environment.
            computed[key] = partial(fn, store);
            Object.defineProperty(store.getters, key, {
                get: function () { return store._vm[key]; },
                enumerable: true // for local getters
            });
        });

        // use a Vue instance to store the state tree
        // suppress warnings just in case the user has added
        // some funky global mixins
        let silent = Vue.config.silent;
        Vue.config.silent = true;
        store._vm = new Vue({
            data: {
                $$state: state
            },
            computed: computed
        });
        Vue.config.silent = silent;
    }
    private _withCommit(fn: (() => void)) {
        const committing = this._committing;
        this._committing = true;
        fn();
        this._committing = committing;
    }
    private makeLocalContext(namespace: string, path: VuexPath) {
        const noNamespace = namespace === '';
        const store = this;
        let local = {
            dispatch: noNamespace ? store.dispatch : function (_type: any, _payload: any, _options?: any) {
                let args = unifyObjectStyle(_type, _payload, _options);
                let payload = args.payload;
                let options = args.options;
                let type = args.type;

                if (!options || !options.root) {
                    type = namespace + type;
                    if (!store._actions[type]) {
                        console.error(("[vuex] unknown local action type: " + (args.type) + ", global type: " + type));
                        return
                    }
                }

                return store.dispatch(type, payload)
            },

            commit: noNamespace ? store.commit : function (_type: any, _payload: any, _options?: any) {
                let args = unifyObjectStyle(_type, _payload, _options);
                let payload = args.payload;
                let options = args.options;
                let type = args.type;

                if (!options || !options.root) {
                    type = namespace + type;
                    if (!store._mutations[type]) {
                        console.error(("[vuex] unknown local mutation type: " + (args.type) + ", global type: " + type));
                        return
                    }
                }

                store.commit(type, payload, options);
            }
        };
        return local;
    }
    private installModule(rootState: S, path: any, module: VuexModule<S>, hot: boolean = false) {
        let isRoot = !path.length;
        let namespace = this._modules.getNamespace(path);

        if (module.namespaced) {
            if (this._modulesNamespaceMap[namespace] && (process.env.NODE_ENV !== 'production')) {
                console.error(("[vuex] duplicate namespace " + namespace + " for the namespaced module " + (path.join('/'))));
            }
            this._modulesNamespaceMap[namespace] = module;
        }

        // set state
        if (!isRoot && !hot) {
            let parentState = getNestedState(rootState, path.slice(0, -1));
            let moduleName = path[path.length - 1];
            this._withCommit(function () {
                if ((process.env.NODE_ENV !== 'production')) {
                    if (moduleName in parentState) {
                        console.warn(
                            ("[vuex] state field \"" + moduleName + "\" was overridden by a module with the same name at \"" + (path.join('.')) + "\"")
                        );
                    }
                }
                //Vue.set(parentState, moduleName, module.state);
            });
        }

        // Register all the mutations, actions, getters
        let local = module.context = this.makeLocalContext(namespace, path);
        const store = this;
        module.forEachMutation(function (mutation, key) {
            let namespacedType = namespace + key;
            store.registerMutation(namespacedType, mutation, local);
        });

        module.forEachAction(function (action, key) {
            const raw_action = action as ActionObject<S, S>;
            let type = raw_action.root ? key : namespace + key;
            let handler = raw_action.handler || action as ActionHandler<S, S>;
            store.registerAction(type, handler, local);
        });

        module.forEachGetter(function (getter, key) {
            let namespacedType = namespace + key;
            store.registerGetter(namespacedType, getter, local);
        });

        module.forEachChild(function (child, key) {
            store.installModule(rootState, path.concat(key), child, hot);
        });
    }
    // Register actions, mutations, getters
    private registerAction(type: string, rawAction: ActionHandler<S, S>, local: any) {
        const store = this;
        let entry = store._actions[type] || (store._actions[type] = []);
        entry.push(function wrappedActionHandler(payload: any) {
            let res = rawAction.call(store, {
                dispatch: local.dispatch,
                commit: local.commit,
                getters: local.getters,
                state: local.state,
                rootGetters: store.getters,
                rootState: store.state
            }, payload);
            if (!isPromise(res)) {
                res = Promise.resolve(res);
            }
            return res;
        });
    }
    private registerMutation(type: string, rawMutator: Mutation<S>, local: any) {
        let entry = this._mutations[type] || (this._mutations[type] = []);
        const store = this;
        entry.push(function wrappedMutationHandler(payload: any) {
            rawMutator.call(store, local.state, payload);
        });
    }
    private registerGetter(type: string, rawGetter: Getter<S, S>, local: any) {
        if (this._wrappedGetters[type]) {
            {
                console.error(("[vuex] duplicate getter key: " + type));
            }
            return
        }
        this._wrappedGetters[type] = function wrappedGetter(store: ServerStore<S>) {
            return rawGetter(
                local.state, // local state
                local.getters, // local getters
                store.state, // root state
                store.getters // root getters
            )
        };
    }
    // Getters
    get state(): S {
        return this._vm._data.$$state;
    }
    _commit(_type: string, _payload: any, _options?: any) {
        let this$1 = this;

        // check object-style commit
        let ref = unifyObjectStyle(_type, _payload, _options);
        let type = ref.type;
        let payload = ref.payload;
        let options = ref.options;

        let mutation = { type: type, payload: payload };
        let entry = this._mutations[type];
        if (!entry) {
            {
                console.error(("[vuex] unknown mutation type: " + type));
            }
            return
        }
        this._withCommit(function () {
            entry.forEach(function commitIterator(handler: any) {
                handler(payload);
            });
        });
        this._subscribers
            .slice() // shallow copy to prevent iterator invalidation if subscriber synchronously calls unsubscribe
            .forEach(function (sub) { return sub(mutation, this$1.state, this$1.getters); });
    }
    async _dispatch(_type: string, payload: any) {
        const this$1 = this;
        // check object-style dispatch
        const ref = unifyObjectStyle(_type, payload);
        const type = ref.type;
        var payload = ref.payload;

        var action = { type: type, payload: payload };
        var entry = this._actions[type];
        if (!entry) {
            {
                console.error(("[vuex] unknown action type: " + type));
            }
            return
        }

        try {
            this._actionSubscribers
                .slice() // shallow copy to prevent iterator invalidation if subscriber synchronously calls unsubscribe
                .filter(function (sub) { return sub.before; })
                .forEach(function (sub) { return sub.before(action, this$1.state); });
        } catch (e) {
            {
                console.warn("[vuex] error in before action subscribers: ");
                console.error(e);
            }
        }

        var result = entry.length > 1
            ? Promise.all(entry.map(function (handler:any) { return handler(payload); }))
            : entry[0](payload);

        return new Promise(function (resolve, reject) {
            result.then(function (res: any) {
                try {
                    this$1._actionSubscribers
                        .filter(function (sub) { return sub.after; })
                        .forEach(function (sub) { return sub.after(action, this$1.state); });
                } catch (e) {
                    {
                        console.warn("[vuex] error in after action subscribers: ");
                        console.error(e);
                    }
                }
                resolve(res);
            }, function (error: any) {
                try {
                    this$1._actionSubscribers
                        .filter(function (sub) { return sub.error; })
                        .forEach(function (sub) { return sub.error(action, this$1.state, error); });
                } catch (e) {
                    {
                        console.warn("[vuex] error in error action subscribers: ");
                        console.error(e);
                    }
                }
                reject(error);
            });
        });
    }
    private genericSubscribe(fn: any, subs: any[], options?: SubscribeOptions) {
        if (subs.indexOf(fn) < 0) {
            options && options.prepend
                ? subs.unshift(fn)
                : subs.push(fn);
        }
        return function () {
            var i = subs.indexOf(fn);
            if (i > -1) {
                subs.splice(i, 1);
            }
        }
    }
    replaceState(state: any): void {
        throw new Error("Method not implemented.");
    }
    subscribe<P extends MutationPayload>(fn: (mutation: P, state: any, getters:any) => any, options?: SubscribeOptions): () => void {
        return this.genericSubscribe(fn, this._subscribers, options)
    }
    subscribeAction<P extends ActionPayload>(fn: SubscribeActionOptions<P, any>, options?: SubscribeOptions): () => void {
        throw new Error("Method not implemented.");
    }
    watch<T>(getter: (state: any, getters: any) => T, cb: (value: T, oldValue: T) => void, options?: WatchOptions): () => void {
        throw new Error("Method not implemented.");
    }
    registerModule<T>(path: string, module: Module<T, any>, options?: ModuleOptions): void;
    registerModule<T>(path: string[], module: Module<T, any>, options?: ModuleOptions): void;
    registerModule(path: any, module: any, options?: any): void {
        throw new Error("Method not implemented.");
    }
    unregisterModule(path: string): void;
    unregisterModule(path: string[]): void;
    unregisterModule(path: any): void {
        throw new Error("Method not implemented.");
    }
    hasModule(path: string): boolean;
    hasModule(path: string[]): boolean;
    hasModule(path: any): boolean {
        throw new Error("Method not implemented.");
    }
    hotUpdate(options: { actions?: ActionTree<any, any>; mutations?: MutationTree<any>; getters?: GetterTree<any, any>; modules?: ModuleTree<any>; }): void {
        throw new Error("Method not implemented.");
    }

}

export function createStore<P extends MutationPayload>(rootModule: CommonModule, callback: null|((mutation: P, state: SyncedGameState, getters:SyncedGameGetters<SyncedGameState>) => any)) {
    const module = rootModule.clone();
    const _a = (module as any).create([], '');
    const rootModuleOptions = _a.options;
    const options: StoreOptions<any> = {};
    rootModuleOptions.namespaced = false;
    const injectStore = _a.injectStore;
    const storeOptions: StoreOptions<SyncedGameState> = __assign(__assign(__assign({}, rootModuleOptions), options), { modules: __assign(__assign({}, rootModuleOptions.modules), options.modules), plugins: [injectStore].concat(options.plugins || []) });
    const store = new ServerStore<SyncedGameState>(storeOptions);
    if (callback) {
        store.subscribe(callback);
    }
    return module.context(store);
}