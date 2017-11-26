<template lang="pug">
  q-card
    q-card-title Labels
    q-card-main
      table.q-table.bordered.striped-odd.vertical-separator.horizontal-separator
        thead
          tr
            th Name
            th Address
            //- th Value
        tbody
          tr(v-for = "label in this.assembler2.labels")
            td {{ label.label }}
            td {{ label.address | toHex }}
</template>

<script>

console.log('Labels.vue started')

import {
  QCard,
  QCardTitle,
  QCardMain
} from 'quasar'

import { mapGetters } from 'vuex'

export default {
  name: 'labels',
  components: {
    QCard,
    QCardTitle,
    QCardMain
  },
  filters: {
    toHex: function (value) {
      var hex = value.toString(16).toUpperCase()
      return hex.length === 1 ? '0' + hex : hex
    },
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
    ...mapGetters(['memory', 'assembler', 'assembler2'])
  },
  methods: {
  }
}
</script>

<style lang="stylus">
.memdump {
  font-family: source-code-pro, Courier New;
}
.consoleChar {
  width: 1em;
  margin-right: 1px;
  margin-left: 1px;
  text-align: center;
  background-color: #DFDFDF;
}

</style>
