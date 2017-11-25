<template lang="pug">
  q-card
    q-card-title Grammar
    q-card-main
      ACE(:content="gsource" @editor-update="sourceChanged")
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

import asmgrammar from '../store/asm.pegjs'

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
      gsource: asmgrammar
    }
  },
  computed: {
  },
  methods: {
    compile: function () {
      console.log('Compiling...')
      this.$store.commit('compileGrammar', this.gsource)
    },
    sourceChanged: function (changedSource) {
      this.gsource = changedSource
    }
  }
}
</script>

<style lang="stylus">

</style>
