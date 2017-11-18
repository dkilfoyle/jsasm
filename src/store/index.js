import Vue from 'vue'
import Vuex from 'vuex'

import CPU from './CPU.js'
import Assembler from './Assembler'
import Grammar from './Grammar'

Vue.use(Vuex)

export default new Vuex.Store({
  modules: {
  },
  state: {
    cpu: new CPU(),
    assembler: new Assembler(),
    grammar: new Grammar()
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
    assembler: (state) => { return (state.assembler) },
    grammar: (state) => { return (state.grammar) }
  },
  mutations: {
    setMemory: (state, payload) => { state.cpu.memory.data.splice(payload.offset, payload.data.length, ...payload.data) },
    resetCPU: (state) => { state.cpu.reset() },
    resetMemory: (state) => { state.cpu.memory.reset() },
    stepCPU: (state) => { state.cpu.step() },
    loadGrammar: (state, payload) => { state.grammar.loadGrammar(payload) },
    parseCode: (state, payload) => { state.grammar.parse(payload) }
  },
  actions: {
    assembleSourceCode ({commit, state}, payload) {
      var asm = state.assembler.assemble(payload)
      commit('setMemory', {offset: 0, data: asm.code})
    },
    reset ({commit, state}) {
      commit('resetCPU')
      commit('resetMemory')
    },
    step ({commit, state}) {
      commit('stepCPU')
    }
  }
})
