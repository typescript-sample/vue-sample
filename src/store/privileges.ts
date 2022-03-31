import { GetterTree, MutationTree } from "vuex";
import { Pick, State } from "./type";
type PrivilegesGetter = GetterTree<State, any>;

const state: State = {
    pick: {
        type: "",
        id: ""
    }
}

const getters: PrivilegesGetter = {
    pick:s=>s.pick
}

const mutations: MutationTree<State> = {
    updatePickPrivilege(s: any, pick: Pick) {
        s.pick = {
            type : pick.type,
            id:pick.id
        }
        console.log(s.pick);
        
    }
} 

export const privileges = {
    state, getters, mutations
}