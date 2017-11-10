class Memory {
  constructor () {
    this.data = Array(256)
    this.lastAccess = -1
    this.reset()
  }
  reset () {
    this.lastAccess = -1
    for (var i = 0, l = this.data.length; i < l; i++) {
      this.data[i] = 0
    }
  }
  load (address) {
    if (address < 0 || address > this.data.length) {
      throw new Error('Memory access violation at ' + address)
    }
    this.lastAccess = address
    return this.data[address]
  }
  store (address, value) {
    if (address < 0 || address > this.data.length) {
      throw new Error('Memory access violation at ' + address)
    }
    this.lastAccess = address
    this.data[address] = value
  }
  loadBlock (start, end) {
    if (start < 0 || end < 0 || start > this.data.length || end > this.data.length || start > end) {
      throw new Error('Memory access violation between ' + start + ' and ' + end)
    }
    return this.data.slice(start, end)
  }
}

export default Memory
