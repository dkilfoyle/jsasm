// import opcodes from './OpCodes'

class Assembler2 {
  constructor () {
    this.reset()
  }
  reset () {
    this.code = []
    this.labels = []
    this.mapping = {}
  }
  addLabel (label) {
    console.log('Adding label ' + label)
    var upperLabel = label.toUpperCase()
    if (upperLabel in this.labels) { throw new Error('Duplicate label: ' + label) }
    this.labels.push({address: this.code.length, label: label})
  }
  assemble (ast) {
    var body = ast['body']
    for (var i = 0, l = body.length; i < l; i++) {
      var node = body[i]
      if (node.type === 'label') {
        this.addLabel(node.name)
      }
    }
  }
}

export default Assembler2
