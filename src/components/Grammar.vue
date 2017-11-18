<template lang="pug">
  q-card
    q-card-title Grammar
    q-card-main
      ACE(:content="nesource" @editor-update="sourceChanged")
    q-card-actions
      q-btn(@click="compile") Compile
</template>

<script>

console.log('Grammar.vue started')

import {
  QCard,
  QCardTitle,
  QCardMain,
  QCardActions,
  QBtn
} from 'quasar'

import ACE from './ACE.vue'
import 'brace/mode/jsasm'
import 'brace/mode/javascript'
import 'brace/theme/chrome'

import ne from './asm.ne'

// import { mapGetters } from 'vuex'

export default {
  name: 'grammar',
  components: {
    QCard,
    QCardTitle,
    QCardMain,
    QCardActions,
    ACE,
    QBtn
  },
  data () {
    return {
      nesource: ne
    }
  },
  computed: {
  },
  methods: {
    compile: function () {
      console.log('Compiling...')
      this.$store.commit('loadGrammar', this.nesource)
    },
    sourceChanged: function (changedSource) {
      this.asmsource = changedSource
    }
  }
}
</script>

<style lang="stylus">

</style>
