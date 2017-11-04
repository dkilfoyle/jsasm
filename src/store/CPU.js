import Memory from './Memory'
import opcodes from './OpCodes'

class CPU {
  constructor () {
    this.reset()
    this.memory = new Memory()
    console.log(opcodes)
  }
  reset () {
    this.maxSP = 231
    this.minSP = 0

    this.gpr = [0, 0, 0, 0]
    this.sp = this.maxSP
    this.ip = 0
    this.zero = false
    this.carry = false
    this.fault = false
  }
}

export default CPU
