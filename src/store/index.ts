import Vue from 'vue';
import Vuex from 'vuex';
import { mainModule } from "@/store/main.store";
import { createComposable, createMapper, createStore, Module } from 'vuex-smart-module';
import clientSideSocketPlugin from './client.plugin';
import { KeeypStoreModule, GAME_NAME } from '../../common/keeyp2d_store';

// setup vuex
Vue.use(Vuex);


// Create a module with module asset classes
const rootModule = new Module({
    modules: {
        mainModule,
        [GAME_NAME]:KeeypStoreModule
    }
})

export const storeMapper = createMapper(mainModule);

export const keeypMapper = createMapper(KeeypStoreModule);

export const store = createStore(
    rootModule,
    {
        plugins: [clientSideSocketPlugin],
        strict: process.env.NODE_ENV !== 'production'
    }
)
export const rootMapper = createMapper(rootModule);