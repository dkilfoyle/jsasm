<template lang="pug">
  q-layout(ref="layout" view="lHh Lpr fff" :left-class="{'bg-grey-2': true}")
    q-toolbar.glossy(slot="header")
      q-btn(flat @click="$refs.layout.toggleLeft()")
        q-icon(name="menu")
      q-toolbar-title jsasm
        div(slot="subtitle") Running on Quasar v{{$q.version}}

    div(slot="left")
      q-list(no-border link inset-delimiter)
        q-list-header
          p Essential Links

    div
      q-btn(@click="cpu.jump(3)") jump(3)
</template>

<script>

console.log('Hello.vue started')

class Memory {
  constructor () {
    this.data = Array(256)
    this.lastAccess = -1
    this.reset()
  }
  reset () {
    this.lastAccess = -1
    for (var i = 0, l = this.data.length; i < l; i++) {
      this.data[i] = 0
    }
  }
  load (address) {
    if (address < 0 || address > this.data.length) {
      throw new Error('Memory access violation at ' + address)
    }
    this.lastAccess = address
    return this.data[address]
  }
  store (address, value) {
    if (address < 0 || address > this.data.length) {
      throw new Error('Memory access violation at ' + address)
    }
    this.lastAccess = address
    this.data[address] = value
  }
}

class CPU {
  constructor (memory) {
    this.memory = new Memory()
    this.reset()
  }
  reset () {
    this.maxSP = 231
    this.minSP = 0

    // general purpose registers GPR0, GPR1, GPR2, GPR3
    this.gpr = [0, 0, 0, 0]
    this.sp = this.maxSP // stack pointer
    this.ip = 0 // instruction pointer
    // zero, carry, fault flags
    this.zero = false
    this.carry = false
    this.fault = false
  }
  jump (newIP) {
    if (newIP < 0 || newIP >= this.memory.data.length) {
      throw new Error('IP outside memory')
    }
    else {
      this.ip = newIP
    }
  }
}

import {
  QLayout,
  QToolbar,
  QToolbarTitle,
  QBtn,
  QIcon,
  QList,
  QListHeader,
  QItem,
  QItemSide,
  QItemMain
} from 'quasar'

export default {
  name: 'index',
  components: {
    QLayout,
    QToolbar,
    QToolbarTitle,
    QBtn,
    QIcon,
    QList,
    QListHeader,
    QItem,
    QItemSide,
    QItemMain
  },
  data () {
    return {
      cpu: new CPU()
    }
  },
  computed: {
  },
  methods: {
  }
}
</script>

<style lang="stylus">

</style>
