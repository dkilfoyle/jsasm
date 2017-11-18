<template lang="pug">
  q-card
    q-card-title Source
    q-card-main
      ACE(:content="asmsource" @editor-update="sourceChanged")
    q-card-actions
      q-btn(@click="lint") Lint
      q-btn(@click="assemble") Assemble
      q-btn Run
      q-btn(@click="step") Step
      q-btn(@click="reset") Reset
</template>

<script>

console.log('Editor.vue started')

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

import helloasm from './hello.asm'

// import { mapGetters } from 'vuex'

export default {
  name: 'editor',
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
      asmsource: helloasm
    }
  },
  computed: {
  },
  methods: {
    lint: function () {
      console.log('Linting...')
      this.$store.commit('parseCode', this.asmsource)
    },
    assemble: function () {
      console.log('Assembling...')
      this.$store.dispatch('assembleSourceCode', this.asmsource)
    },
    sourceChanged: function (changedSource) {
      this.asmsource = changedSource
    },
    reset: function () {
      console.log('Resetting...')
      this.$store.dispatch('reset')
    },
    step: function () {
      console.log('Step...')
      this.$store.dispatch('step')
    }
  }
}
</script>

<style lang="stylus">

</style>
