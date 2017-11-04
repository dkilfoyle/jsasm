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

  step () {
    if (this.fault === true) {
      throw new Error('Fault: Reset to continue')
    }
  }

  checkGPR (reg) {
    if (reg < 0 || reg >= this.gpr.length) {
      throw new Error('Invalid register: ' + reg)
    }
    else {
      return reg
    }
  }

  checkGPRSP (reg) {
    if (reg < 0 || reg >= 1 + this.gpr.length) {
      throw new Error('Invalid register: ' + reg)
    }
    else {
      return reg
    }
  }

  setGPRSP (reg, value) {
    if (reg >= 0 && reg < this.gpr.length) {
      this.gpr[reg] = value
    }
    else if (reg === this.gpr.length) {
      this.sp = value
      // Not likely to happen, since we always get here after checkOpertion().
      if (this.sp < this.minSP) {
        throw new Error('Stack overflow')
      }
      else if (this.sp > this.maxSP) {
        throw new Error('Stack underflow')
      }
    }
    else {
      throw new Error('Invalid register: ' + reg)
    }
  }

  getGPRSP (reg) {
    if (reg >= 0 && reg < this.gpr.length) {
      return this.gpr[reg]
    }
    else if (reg === this.gpr.length) {
      return this.sp
    }
    else {
      throw new Error('Invalid register: ' + reg)
    }
  }

  indirectRegisterAddress (value) {
    var reg = value % 8
    var base
    if (reg < this.gpr.length) {
      base = this.gpr[reg]
    }
    else {
      base = this.sp
    }
    var offset = Math.floor(value / 8)
    if (offset > 15) {
      offset = offset - 32
    }
    return base + offset
  }

  checkOperation (value) {
    this.zero = false
    this.carry = false

    if (value >= 256) {
      this.carry = true
      value = value % 256
    }
    else if (value === 0) {
      this.zero = true
    }
    else if (value < 0) {
      this.carry = true
      value = 256 - (-value) % 256
    }
    return value
  }

  jump (newIP) {
    if (newIP < 0 || newIP >= this.memory.data.length) {
      throw new Error('IP outside memory')
    }
    else {
      this.ip = newIP
    }
  }

  push (value) {
    this.memory.store(this.sp--, value)
    if (this.sp < this.minSP) {
      throw new Error('Stack overflow')
    }
  }

  pop () {
    var value = this.memory.load(++this.sp)
    if (this.sp > this.maxSP) {
      throw new Error('Stack underflow')
    }
    return value
  };

  division (divisor) {
    if (divisor === 0) {
      throw new Error('Division by 0')
    }
    return Math.floor(this.gpr[0] / divisor)
  }
}

export default CPU
