<template lang="pug">
  q-card 
    q-card-title CPU
    q-card-main
      table.q-table.bordered.striped-odd.vertical-separator.horizontal-separator
        thead
          tr
            th A
            th B
            th C
            th D
            th IP
            th SP
            th Z
            th C
            th F
        tbody
          tr
            td {{ gpr[0] }}
            td {{ gpr[1] }}
            td {{ gpr[2] }}
            td {{ gpr[3] }}
            td {{ ip }}
            td {{ sp }}
            td {{ zero }}
            td {{ carry }}
            td {{ fault }}
      //- q-btn(@click="reset()") Reset
      //- q-btn(@click="jump(3)") JMP(3)
</template>

<script>

console.log('CPU.vue started')

import {
  QCard,
  QCardTitle,
  QCardMain,
  QField,
  QInput,
  QBtn
} from 'quasar'

import { mapGetters } from 'vuex'

export default {
  name: 'cpu',
  components: {
    QCard,
    QCardTitle,
    QCardMain,
    QField,
    QInput,
    QBtn
  },
  data () {
    return {
    }
  },
  computed: {
    ...mapGetters(['ip', 'sp', 'gpr', 'carry', 'zero', 'fault'])
  },
  methods: {
  }
}
</script>

<style lang="stylus">

</style>
