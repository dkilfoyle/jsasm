import Vue from 'vue'
import Vuex from 'vuex'

import CPU from './CPU.js'
// import memory from './Memory.js'
// import opcodes from './OpCodes.js'

Vue.use(Vuex)
// in main.js:
// import store from './store/index'
// in Quasar.start() add store eg
// new Vue({
//   el: '#q-app',
//   store,
//   router,

// in components
// import { mapGetters } from 'vuex'
// computed: {
//   ...mapGetters(['minsSinceOnset', 'isAnterior', 'isPosterior', 'scanCriteriaStatus']),

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
    fault: (state) => { return (state.cpu.fault) }
  },
  mutations: {
  },
  actions: {
    rootAction1 (context) {
      // actions are for grouped mutations or asynchronous calls
      context.dispatch('rootMutation1')
    }
  }
})
