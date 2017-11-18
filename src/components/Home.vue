<template lang="pug">
  q-layout(ref="layout" view="lHh Lpr fff" :left-class="{'bg-grey-2': true}")
    q-toolbar.glossy(slot="header")
      q-btn(flat @click="$refs.layout.toggleLeft()")
        q-icon(name="menu")
      q-toolbar-title jsasm
        div(slot="subtitle") Running on Quasar v{{$q.version}}

    //- div(slot="left")
    //-   q-list(no-border link inset-delimiter)
    //-     q-list-header
    //-       p Essential Links

    .row
      .col
        Editor
        Grammar
      .col
        Console
        CPU
        Memory
        Labels
</template>

<script>

console.log('Home.vue started')

import CPU from './CPU.vue'
import Memory from './Memory.vue'
import Editor from './Editor.vue'
import Console from './Console.vue'
import Labels from './Labels.vue'
import Grammar from './Grammar.vue'

import {
  QLayout,
  QToolbar,
  QToolbarTitle,
  QBtn,
  QIcon,
  QList,
  QListHeader,
  QItem,
  QItemSide,
  QItemMain
} from 'quasar'

export default {
  name: 'index',
  components: {
    QLayout,
    QToolbar,
    QToolbarTitle,
    QBtn,
    QIcon,
    QList,
    QListHeader,
    QItem,
    QItemSide,
    QItemMain,
    CPU,
    Memory,
    Editor,
    Console,
    Labels,
    Grammar
  },
  data () {
    return {

    }
  },
  computed: {
  },
  methods: {
  }
}
</script>

<style lang="stylus">

</style>
