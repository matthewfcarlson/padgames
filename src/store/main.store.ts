import { Getters, Mutations, Actions, Module } from 'vuex-smart-module'
import { Store } from "vuex";


// State
export class MainStoreState {
    userName = ""
}

class MainStoreGetters extends Getters<MainStoreState> {

    get userName() {
        return this.state.userName;
    }

}

// Mutations
// Extend 'Mutations' class with 'MainStoreState' type
class MainStoreMutations extends Mutations<MainStoreState> {

}

class MainStoreActions extends Actions<
    MainStoreState,
    MainStoreGetters,
    MainStoreMutations,
    MainStoreActions
> {
    // Called after the module is initialized
    $init(store: Store<any>): void {
        //this.actions.checkLogin();
    }
}

export const mainModule = new Module({
    namespaced: false,
    state: MainStoreState,
    getters: MainStoreGetters,
    mutations: MainStoreMutations,
    actions: MainStoreActions
});