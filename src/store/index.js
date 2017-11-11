import Vue from 'vue'
import Vuex from 'vuex'

import CPU from './CPU.js'

Vue.use(Vuex)

export default new Vuex.Store({
  modules: {
  },
  state: {
    cpu: new CPU()
  },
  // use getters for values that are computed from state
  getters: {
    ip: (state) => { return (state.cpu.ip) },
    sp: (state) => { return (state.cpu.sp) },
    gpr: (state) => { return (state.cpu.gpr) },
    zero: (state) => { return (state.cpu.zero) },
    carry: (state) => { return (state.cpu.carry) },
    fault: (state) => { return (state.cpu.fault) },
    memory: (state) => { return (state.cpu.memory) }
  },
  mutations: {
    setMemory: (state, payload) => { state.cpu.memory.data.splice(payload.offset, 1, payload.newdata) }
  },
  actions: {
    rootAction1 (context) {
      // actions are for grouped mutations or asynchronous calls
      context.dispatch('rootMutation1')
    }
  }
})
