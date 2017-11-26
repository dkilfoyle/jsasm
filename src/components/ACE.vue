<template lang="pug">
  div(:style="{height: height, width: width}")
</template>

<script>

console.log('ACE.vue started')
var ace = require('brace')
var Range = ace.acequire('ace/range').Range

export default {
  name: 'ace',
  props: {
    content: {
      type: String,
      required: true
    },
    lang: {
      type: String,
      // default: 'jsasm'
      default: 'assembly_x86'
    },
    theme: {
      type: String,
      default: 'chrome'
    },
    height: {
      type: String,
      default: '300px'
    },
    width: {
      type: String,
      default: '100%'
    },
    sync: {
      type: Boolean,
      default: false
    },
    lint: {
      type: Object,
      default: function () { return {line: -1, col: -1, msg: ''} }
    },
    options: {
      type: Object,
      default: function () { return {} }
    }
  },
  data () {
    return {
      editor: null,
      markerid: null
    }
  },
  mounted: function () {
    var vm = this
    var lang = vm.lang
    var theme = vm.theme
    var editor = vm.editor = ace.edit(vm.$el)
    var options = vm.options
    editor.$blockScrolling = Infinity
    editor.getSession().setMode('ace/mode/' + lang)
    // editor.getSession().setOption('useWorker', false)
    editor.setTheme('ace/theme/' + theme)
    editor.setValue(vm.content, 1)
    editor.setOptions(options)
    editor.on('change', function () {
      vm.$emit('editor-update', editor.getValue())
    })
  },

  watch: {
    content: function (newContent) {
      var vm = this
      if (vm.sync) {
        vm.editor.setValue(newContent, 1)
      }
    },

    theme: function (newTheme) {
      var vm = this
      vm.editor.setTheme('ace/theme/' + newTheme)
    },

    lint: function (lint) {
      // console.log('lint: ', lint.location.start.line, ',', lint.location.start.column)
      if (this.markerid !== null) {
        this.editor.getSession().removeMarker(this.markerid)
      }
      if (lint !== null) {
        var range = new Range(lint.location.start.line - 1,
          lint.location.start.column - 1,
          lint.location.end.line - 1,
          lint.location.end.column - 1)
        this.markerid = this.editor.getSession().addMarker(range, 'ace-related-code-highlight', 'fullline')
        this.editor.getSession().setAnnotations([{
          row: lint.location.start.line - 1,
          col: lint.location.start.column - 1,
          text: lint.message,
          type: 'error'
        }])
      }
      else {
        this.editor.getSession().clearAnnotations()
      }
    }
  }
}
</script>

<style lang="stylus">
.ace-related-code-highlight {
     border-bottom: 1px solid red;
     display: inline-block;
     position: absolute;
}
</style>
