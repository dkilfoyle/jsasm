<template lang="pug">
  q-card
    q-card-title Memory
    q-card-main
      table.q-table.bordered.striped-odd.vertical-separator.horizontal-separator.memdump
        thead
          tr
            td
            td(v-for="n in [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15]") {{ n | toHex }}
        tbody
          tr(v-for="memrow in [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15]")
            th {{ memrow | toHex }}
            td(v-for="memcol in [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15]") {{ memory.data[(memrow*15)+ memcol] | toHex | pad(2) }}
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
  name: 'memory',
  components: {
    QCard,
    QCardTitle,
    QCardMain
  },
  filters: {
    toHex: function (value) { return (value.toString(16).toUpperCase()) },
    pad: function (value, size) {
      var s = '000000' + value
      return s.substr(s.length - size)
    }
  },
  data () {
    return {
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
.memdump {
  font-family: source-code-pro, Courier New;
}
table.memdump td {
  padding: 0.1rem 0.2rem;
}

</style>
