<template lang="pug">
  q-card
    q-card-title Source
    q-card-main
      ACE(:content="asmsource")
    q-card-actions
      q-btn(@click="assemble") Assemble
      q-btn Run
      q-btn Step
      q-btn Reset
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
      asmsource: `; Simple example
; Writes Hello World to the output

	JMP start
hello: DB "Hello World!" ; Variable
       DB 0	; String terminator

start:
	MOV C, hello    ; Point to var 
	MOV D, 232	; Point to output
	CALL print
        HLT             ; Stop execution

print:			; print(C:*from, D:*to)
	PUSH A
	PUSH B
	MOV B, 0
.loop:
	MOV A, [C]	; Get char from var
	MOV [D], A	; Write to output
	INC C
	INC D  
	CMP B, [C]	; Check if end
	JNZ .loop	; jump if not

	POP B
	POP A 
	RET`
    }
  },
  computed: {
  },
  methods: {
    assemble: function () {
      this.$store.commit('setMemory', {offset: 1, newdata: 10})
      console.log('hello')
    }
  }
}
</script>

<style lang="stylus">

</style>
