import Vue from 'vue'
import Vuex from 'vuex'

import CPU from './CPU.js'
import Assembler from './Assembler'

Vue.use(Vuex)

export default new Vuex.Store({
  modules: {
  },
  state: {
    cpu: new CPU(),
    assembler: new Assembler()
  },
  // use getters for values that are computed from state
  getters: {
    ip: (state) => { return (state.cpu.ip) },
    sp: (state) => { return (state.cpu.sp) },
    gpr: (state) => { return (state.cpu.gpr) },
    zero: (state) => { return (state.cpu.zero) },
    carry: (state) => { return (state.cpu.carry) },
    fault: (state) => { return (state.cpu.fault) },
    memory: (state) => { return (state.cpu.memory) },
    assembler: (state) => { return (state.assembler) }
  },
  mutations: {
    setMemory: (state, payload) => { state.cpu.memory.data.splice(payload.offset, payload.data.length, ...payload.data) }
  },
  actions: {
    assembleSourceCode ({commit, state}, payload) {
      var asm = state.assembler.assemble(payload)
      commit('setMemory', {offset: 0, data: asm.code})
    }
  }
})
