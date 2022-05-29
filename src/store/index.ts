import Vue from 'vue';
import Vuex from 'vuex';
import { mainModule } from "@/store/main.store";
import { createComposable, createMapper, createStore, Module } from 'vuex-smart-module';

// setup vuex
Vue.use(Vuex);


// Create a module with module asset classes
const rootModule = new Module({
    modules: {
        mainModule,
    }
})

export const storeMapper = createMapper(mainModule);

export const store = createStore(
    rootModule,
    {
        //plugins: [clientSideSocketPlugin],
        strict: process.env.NODE_ENV !== 'production'
    }
)
export const rootMapper = createMapper(rootModule);
