<template lang="pug">
  q-card
    q-card-title Memory
    q-card-main
      - var memdump = "memory.data["
      table.q-table.bordered.striped-odd.vertical-separator.horizontal-separator
        thead
          tr
            td
            td(v-for="hex in hexadec") {{ hex }}
        tbody
          tr(v-for="memrow in [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15]")
            th {{ hexadec[memrow] }}
            td(v-for="memcol in [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16]") {{ memory.data[(memrow*16)+ memcol] }}
</template>

<script>

console.log('Memory.vue started')

import {
  QCard,
  QCardTitle,
  QCardMain
} from 'quasar'

import { mapGetters } from 'vuex'

export default {
  name: 'index',
  components: {
    QCard,
    QCardTitle,
    QCardMain
  },
  data () {
    return {
      hexadec: ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'A', 'B', 'C', 'D', 'E', 'F']
    }
  },
  computed: {
    ...mapGetters(['memory'])
  },
  methods: {
  }
}
</script>

<style lang="stylus">

</style>
