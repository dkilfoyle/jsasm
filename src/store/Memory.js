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
}

export default Memory
