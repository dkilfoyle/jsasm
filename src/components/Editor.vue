<template lang="pug">
  q-card
    q-card-title Source
    q-card-main
      ACE(:content="asmsource")
</template>

<script>

console.log('Editor.vue started')

import {
  QCard,
  QCardTitle,
  QCardMain
} from 'quasar'

import ACE from './ACE.vue'
import 'brace/mode/javascript'
import 'brace/theme/chrome'

export default {
  name: 'editor',
  components: {
    QCard,
    QCardTitle,
    QCardMain,
    ACE
  },
  data () {
    return {
      asmsource: 'bla bla bla'
    }
  },
  computed: {
  }}
</script>

<style lang="stylus">

</style>
