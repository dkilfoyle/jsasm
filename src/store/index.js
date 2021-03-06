import Vue from 'vue'
import Vuex from 'vuex'

import CPU from './CPU.js'
import Assembler from './Assembler'
import Assembler2 from './Assembler2'
import Parser from './Parser'

import asmGrammar from './asm.pegjs'

Vue.use(Vuex)

export default new Vuex.Store({
  modules: {
  },
  state: {
    cpu: new CPU(),
    assembler: new Assembler(),
    assembler2: new Assembler2(),
    asmParser: new Parser(asmGrammar)
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
    assembler2: (state) => { return (state.assembler2) },
    asmParser: (state) => { return (state.asmParser) }
  },
  mutations: {
    setMemory: (state, payload) => { state.cpu.memory.data.splice(payload.offset, payload.data.length, ...payload.data) },
    resetCPU: (state) => { state.cpu.reset() },
    resetMemory: (state) => { state.cpu.memory.reset() },
    stepCPU: (state) => { state.cpu.step() },
    compileGrammar: (state, payload) => { state.grammar.compile(payload) },
    parseCode: (state, payload) => { state.asmParser.parse(payload) }
  },
  actions: {
    assembleSourceCode ({commit, state}, payload) {
      state.assembler.assemble(payload)
      commit('setMemory', {offset: 0, data: state.assembler.code})
    },
    assembleSourceCode2 ({commit, state}, payload) {
      state.assembler2.assemble(payload)
      commit('setMemory', {offset: 0, data: state.assembler2.code})
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
