<template lang="pug">
  q-card
    q-card-title Console
    q-card-main
      table.q-table.bordered.striped-odd.vertical-separator.horizontal-separator.memdump
        tbody
          tr
            td(v-for="c in memory.data.slice(232,255)") {{ c | toChar }}
</template>

<script>

console.log('Console.vue started')

import {
  QCard,
  QCardTitle,
  QCardMain
} from 'quasar'

import { mapGetters } from 'vuex'

export default {
  name: 'console',
  components: {
    QCard,
    QCardTitle,
    QCardMain
  },
  filters: {
    toHex: function (value) { return (value.toString(16).toUpperCase()) },
    toChar: function (value) { return (String.fromCharCode(value)) },
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

</style>
