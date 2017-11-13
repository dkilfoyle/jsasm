import Memory from './Memory'
import opcodes from './OpCodes'

class CPU {
  constructor () {
    this.reset()
    this.memory = new Memory()
  }

  reset () {
    this.maxSP = 231
    this.minSP = 0

    this.gpr = [0, 0, 0, 0]
    this.sp = self.maxSP
    this.ip = 0
    this.zero = false
    this.carry = false
    this.fault = false
  }

  step () {
    var self = this
    if (self.fault === true) {
      throw new Error('Fault: Reset to continue')
    }

    try {
      var checkGPR = function (reg) {
        if (reg < 0 || reg >= self.gpr.length) {
          throw new Error('Invalid register: ' + reg)
        }
        else {
          return reg
        }
      }

      var checkGPRSP = function (reg) {
        if (reg < 0 || reg >= 1 + self.gpr.length) {
          throw new Error('Invalid register: ' + reg)
        }
        else {
          return reg
        }
      }

      var setGPRSP = function (reg, value) {
        if (reg >= 0 && reg < self.gpr.length) {
          self.gpr[reg] = value
        }
        else if (reg === self.gpr.length) {
          self.sp = value
          // Not likely to happen, since we always get here after checkOpertion().
          if (self.sp < self.minSP) {
            throw new Error('Stack overflow')
          }
          else if (self.sp > self.maxSP) {
            throw new Error('Stack underflow')
          }
        }
        else {
          throw new Error('Invalid register: ' + reg)
        }
      }

      var getGPRSP = function (reg) {
        if (reg >= 0 && reg < self.gpr.length) {
          return self.gpr[reg]
        }
        else if (reg === self.gpr.length) {
          return self.sp
        }
        else {
          throw new Error('Invalid register: ' + reg)
        }
      }

      var indirectRegisterAddress = function (value) {
        var reg = value % 8
        var base
        if (reg < self.gpr.length) {
          base = self.gpr[reg]
        }
        else {
          base = self.sp
        }
        var offset = Math.floor(value / 8)
        if (offset > 15) {
          offset = offset - 32
        }
        return base + offset
      }

      var checkOperation = function (value) {
        self.zero = false
        self.carry = false

        if (value >= 256) {
          self.carry = true
          value = value % 256
        }
        else if (value === 0) {
          self.zero = true
        }
        else if (value < 0) {
          self.carry = true
          value = 256 - (-value) % 256
        }
        return value
      }

      var jump = function (newIP) {
        if (newIP < 0 || newIP >= self.memory.data.length) {
          throw new Error('IP outside self.memory')
        }
        else {
          self.ip = newIP
        }
      }

      var push = function (value) {
        self.memory.store(self.sp--, value)
        if (self.sp < self.minSP) {
          throw new Error('Stack overflow')
        }
      }

      var pop = function () {
        var value = self.memory.load(++self.sp)
        if (self.sp > self.maxSP) {
          throw new Error('Stack underflow')
        }
        return value
      }

      var division = function (divisor) {
        if (divisor === 0) {
          throw new Error('Division by 0')
        }
        return Math.floor(self.gpr[0] / divisor)
      }

      if (self.ip < 0 || self.ip >= self.memory.data.length) {
        throw new Error('Instruction pointer is outside of memory')
      }

      var regTo, regFrom, memFrom, memTo, number
      var instr = self.memory.load(self.ip)
      switch (instr) {
        case opcodes.NONE:
          return false // Abort step
        case opcodes.MOV_REG_TO_REG:
          regTo = checkGPRSP(self.memory.load(++self.ip))
          regFrom = checkGPRSP(self.memory.load(++self.ip))
          setGPRSP(regTo, getGPRSP(regFrom))
          self.ip++
          break
        case opcodes.MOV_ADDRESS_TO_REG:
          regTo = checkGPRSP(self.memory.load(++self.ip))
          memFrom = self.memory.load(++self.ip)
          setGPRSP(regTo, self.memory.load(memFrom))
          self.ip++
          break
        case opcodes.MOV_REGADDRESS_TO_REG:
          regTo = checkGPRSP(self.memory.load(++self.ip))
          regFrom = self.memory.load(++self.ip)
          setGPRSP(regTo, self.memory.load(indirectRegisterAddress(regFrom)))
          self.ip++
          break
        case opcodes.MOV_REG_TO_ADDRESS:
          memTo = self.memory.load(++self.ip)
          regFrom = checkGPRSP(self.memory.load(++self.ip))
          self.memory.store(memTo, getGPRSP(regFrom))
          self.ip++
          break
        case opcodes.MOV_REG_TO_REGADDRESS:
          regTo = self.memory.load(++self.ip)
          regFrom = checkGPRSP(self.memory.load(++self.ip))
          self.memory.store(indirectRegisterAddress(regTo), getGPRSP(regFrom))
          self.ip++
          break
        case opcodes.MOV_NUMBER_TO_REG:
          regTo = checkGPRSP(self.memory.load(++self.ip))
          number = self.memory.load(++self.ip)
          setGPRSP(regTo, number)
          self.ip++
          break
        case opcodes.MOV_NUMBER_TO_ADDRESS:
          memTo = self.memory.load(++self.ip)
          number = self.memory.load(++self.ip)
          self.memory.store(memTo, number)
          self.ip++
          break
        case opcodes.MOV_NUMBER_TO_REGADDRESS:
          regTo = self.memory.load(++self.ip)
          number = self.memory.load(++self.ip)
          self.memory.store(indirectRegisterAddress(regTo), number)
          self.ip++
          break
        case opcodes.ADD_REG_TO_REG:
          regTo = checkGPRSP(self.memory.load(++self.ip))
          regFrom = checkGPRSP(self.memory.load(++self.ip))
          setGPRSP(regTo, checkOperation(getGPRSP(regTo) + getGPRSP(regFrom)))
          self.ip++
          break
        case opcodes.ADD_REGADDRESS_TO_REG:
          regTo = checkGPRSP(self.memory.load(++self.ip))
          regFrom = self.memory.load(++self.ip)
          setGPRSP(regTo, checkOperation(getGPRSP(regTo) + self.memory.load(indirectRegisterAddress(regFrom))))
          self.ip++
          break
        case opcodes.ADD_ADDRESS_TO_REG:
          regTo = checkGPRSP(self.memory.load(++self.ip))
          memFrom = self.memory.load(++self.ip)
          setGPRSP(regTo, checkOperation(getGPRSP(regTo) + self.memory.load(memFrom)))
          self.ip++
          break
        case opcodes.ADD_NUMBER_TO_REG:
          regTo = checkGPRSP(self.memory.load(++self.ip))
          number = self.memory.load(++self.ip)
          setGPRSP(regTo, checkOperation(getGPRSP(regTo) + number))
          self.ip++
          break
        case opcodes.SUB_REG_FROM_REG:
          regTo = checkGPRSP(self.memory.load(++self.ip))
          regFrom = checkGPRSP(self.memory.load(++self.ip))
          setGPRSP(regTo, checkOperation(getGPRSP(regTo) - self.gpr[regFrom]))
          self.ip++
          break
        case opcodes.SUB_REGADDRESS_FROM_REG:
          regTo = checkGPRSP(self.memory.load(++self.ip))
          regFrom = self.memory.load(++self.ip)
          setGPRSP(regTo, checkOperation(getGPRSP(regTo) - self.memory.load(indirectRegisterAddress(regFrom))))
          self.ip++
          break
        case opcodes.SUB_ADDRESS_FROM_REG:
          regTo = checkGPRSP(self.memory.load(++self.ip))
          memFrom = self.memory.load(++self.ip)
          setGPRSP(regTo, checkOperation(getGPRSP(regTo) - self.memory.load(memFrom)))
          self.ip++
          break
        case opcodes.SUB_NUMBER_FROM_REG:
          regTo = checkGPRSP(self.memory.load(++self.ip))
          number = self.memory.load(++self.ip)
          setGPRSP(regTo, checkOperation(getGPRSP(regTo) - number))
          self.ip++
          break
        case opcodes.INC_REG:
          regTo = checkGPRSP(self.memory.load(++self.ip))
          setGPRSP(regTo, checkOperation(getGPRSP(regTo) + 1))
          self.ip++
          break
        case opcodes.DEC_REG:
          regTo = checkGPRSP(self.memory.load(++self.ip))
          setGPRSP(regTo, checkOperation(getGPRSP(regTo) - 1))
          self.ip++
          break
        case opcodes.CMP_REG_WITH_REG:
          regTo = checkGPRSP(self.memory.load(++self.ip))
          regFrom = checkGPRSP(self.memory.load(++self.ip))
          checkOperation(getGPRSP(regTo) - getGPRSP(regFrom))
          self.ip++
          break
        case opcodes.CMP_REGADDRESS_WITH_REG:
          regTo = checkGPRSP(self.memory.load(++self.ip))
          regFrom = self.memory.load(++self.ip)
          checkOperation(getGPRSP(regTo) - self.memory.load(indirectRegisterAddress(regFrom)))
          self.ip++
          break
        case opcodes.CMP_ADDRESS_WITH_REG:
          regTo = checkGPRSP(self.memory.load(++self.ip))
          memFrom = self.memory.load(++self.ip)
          checkOperation(getGPRSP(regTo) - self.memory.load(memFrom))
          self.ip++
          break
        case opcodes.CMP_NUMBER_WITH_REG:
          regTo = checkGPRSP(self.memory.load(++self.ip))
          number = self.memory.load(++self.ip)
          checkOperation(getGPRSP(regTo) - number)
          self.ip++
          break
        case opcodes.JMP_REGADDRESS:
          regTo = checkGPR(self.memory.load(++self.ip))
          jump(self.gpr[regTo])
          break
        case opcodes.JMP_ADDRESS:
          number = self.memory.load(++self.ip)
          jump(number)
          break
        case opcodes.JC_REGADDRESS:
          regTo = checkGPR(self.memory.load(++self.ip))
          if (self.carry) {
            jump(self.gpr[regTo])
          }
          else {
            self.ip++
          }
          break
        case opcodes.JC_ADDRESS:
          number = self.memory.load(++self.ip)
          if (self.carry) {
            jump(number)
          }
          else {
            self.ip++
          }
          break
        case opcodes.JNC_REGADDRESS:
          regTo = checkGPR(self.memory.load(++self.ip))
          if (!self.carry) {
            jump(self.gpr[regTo])
          }
          else {
            self.ip++
          }
          break
        case opcodes.JNC_ADDRESS:
          number = self.memory.load(++self.ip)
          if (!self.carry) {
            jump(number)
          }
          else {
            self.ip++
          }
          break
        case opcodes.JZ_REGADDRESS:
          regTo = checkGPR(self.memory.load(++self.ip))
          if (self.zero) {
            jump(self.gpr[regTo])
          }
          else {
            self.ip++
          }
          break
        case opcodes.JZ_ADDRESS:
          number = self.memory.load(++self.ip)
          if (self.zero) {
            jump(number)
          }
          else {
            self.ip++
          }
          break
        case opcodes.JNZ_REGADDRESS:
          regTo = checkGPR(self.memory.load(++self.ip))
          if (!self.zero) {
            jump(self.gpr[regTo])
          }
          else {
            self.ip++
          }
          break
        case opcodes.JNZ_ADDRESS:
          number = self.memory.load(++self.ip)
          if (!self.zero) {
            jump(number)
          }
          else {
            self.ip++
          }
          break
        case opcodes.JA_REGADDRESS:
          regTo = checkGPR(self.memory.load(++self.ip))
          if (!self.zero && !self.carry) {
            jump(self.gpr[regTo])
          }
          else {
            self.ip++
          }
          break
        case opcodes.JA_ADDRESS:
          number = self.memory.load(++self.ip)
          if (!self.zero && !self.carry) {
            jump(number)
          }
          else {
            self.ip++
          }
          break
        case opcodes.JNA_REGADDRESS: // JNA REG
          regTo = checkGPR(self.memory.load(++self.ip))
          if (self.zero || self.carry) {
            jump(self.gpr[regTo])
          }
          else {
            self.ip++
          }
          break
        case opcodes.JNA_ADDRESS:
          number = self.memory.load(++self.ip)
          if (self.zero || self.carry) {
            jump(number)
          }
          else {
            self.ip++
          }
          break
        case opcodes.PUSH_REG:
          regFrom = checkGPR(self.memory.load(++self.ip))
          push(self.gpr[regFrom])
          self.ip++
          break
        case opcodes.PUSH_REGADDRESS:
          regFrom = self.memory.load(++self.ip)
          push(self.memory.load(indirectRegisterAddress(regFrom)))
          self.ip++
          break
        case opcodes.PUSH_ADDRESS:
          memFrom = self.memory.load(++self.ip)
          push(self.memory.load(memFrom))
          self.ip++
          break
        case opcodes.PUSH_NUMBER:
          number = self.memory.load(++self.ip)
          push(number)
          self.ip++
          break
        case opcodes.POP_REG:
          regTo = checkGPR(self.memory.load(++self.ip))
          self.gpr[regTo] = pop()
          self.ip++
          break
        case opcodes.CALL_REGADDRESS:
          regTo = checkGPR(self.memory.load(++self.ip))
          push(self.ip + 1)
          jump(self.gpr[regTo])
          break
        case opcodes.CALL_ADDRESS:
          number = self.memory.load(++self.ip)
          push(self.ip + 1)
          jump(number)
          break
        case opcodes.RET:
          jump(pop())
          break
        case opcodes.MUL_REG: // A = A * REG
          regFrom = checkGPR(self.memory.load(++self.ip))
          self.gpr[0] = checkOperation(self.gpr[0] * self.gpr[regFrom])
          self.ip++
          break
        case opcodes.MUL_REGADDRESS: // A = A * [REG]
          regFrom = self.memory.load(++self.ip)
          self.gpr[0] = checkOperation(self.gpr[0] * self.memory.load(indirectRegisterAddress(regFrom)))
          self.ip++
          break
        case opcodes.MUL_ADDRESS: // A = A * [NUMBER]
          memFrom = self.memory.load(++self.ip)
          self.gpr[0] = checkOperation(self.gpr[0] * self.memory.load(memFrom))
          self.ip++
          break
        case opcodes.MUL_NUMBER: // A = A * NUMBER
          number = self.memory.load(++self.ip)
          self.gpr[0] = checkOperation(self.gpr[0] * number)
          self.ip++
          break
        case opcodes.DIV_REG: // A = A / REG
          regFrom = checkGPR(self.memory.load(++self.ip))
          self.gpr[0] = checkOperation(division(self.gpr[regFrom]))
          self.ip++
          break
        case opcodes.DIV_REGADDRESS: // A = A / [REG]
          regFrom = self.memory.load(++self.ip)
          self.gpr[0] = checkOperation(division(self.memory.load(indirectRegisterAddress(regFrom))))
          self.ip++
          break
        case opcodes.DIV_ADDRESS: // A = A / [NUMBER]
          memFrom = self.memory.load(++self.ip)
          self.gpr[0] = checkOperation(division(self.memory.load(memFrom)))
          self.ip++
          break
        case opcodes.DIV_NUMBER: // A = A / NUMBER
          number = self.memory.load(++self.ip)
          self.gpr[0] = checkOperation(division(number))
          self.ip++
          break
        case opcodes.AND_REG_WITH_REG:
          regTo = checkGPR(self.memory.load(++self.ip))
          regFrom = checkGPR(self.memory.load(++self.ip))
          self.gpr[regTo] = checkOperation(self.gpr[regTo] & self.gpr[regFrom])
          self.ip++
          break
        case opcodes.AND_REGADDRESS_WITH_REG:
          regTo = checkGPR(self.memory.load(++self.ip))
          regFrom = self.memory.load(++self.ip)
          self.gpr[regTo] = checkOperation(self.gpr[regTo] & self.memory.load(indirectRegisterAddress(regFrom)))
          self.ip++
          break
        case opcodes.AND_ADDRESS_WITH_REG:
          regTo = checkGPR(self.memory.load(++self.ip))
          memFrom = self.memory.load(++self.ip)
          self.gpr[regTo] = checkOperation(self.gpr[regTo] & self.memory.load(memFrom))
          self.ip++
          break
        case opcodes.AND_NUMBER_WITH_REG:
          regTo = checkGPR(self.memory.load(++self.ip))
          number = self.memory.load(++self.ip)
          self.gpr[regTo] = checkOperation(self.gpr[regTo] & number)
          self.ip++
          break
        case opcodes.OR_REG_WITH_REG:
          regTo = checkGPR(self.memory.load(++self.ip))
          regFrom = checkGPR(self.memory.load(++self.ip))
          self.gpr[regTo] = checkOperation(self.gpr[regTo] | self.gpr[regFrom])
          self.ip++
          break
        case opcodes.OR_REGADDRESS_WITH_REG:
          regTo = checkGPR(self.memory.load(++self.ip))
          regFrom = self.memory.load(++self.ip)
          self.gpr[regTo] = checkOperation(self.gpr[regTo] | self.memory.load(indirectRegisterAddress(regFrom)))
          self.ip++
          break
        case opcodes.OR_ADDRESS_WITH_REG:
          regTo = checkGPR(self.memory.load(++self.ip))
          memFrom = self.memory.load(++self.ip)
          self.gpr[regTo] = checkOperation(self.gpr[regTo] | self.memory.load(memFrom))
          self.ip++
          break
        case opcodes.OR_NUMBER_WITH_REG:
          regTo = checkGPR(self.memory.load(++self.ip))
          number = self.memory.load(++self.ip)
          self.gpr[regTo] = checkOperation(self.gpr[regTo] | number)
          self.ip++
          break
        case opcodes.XOR_REG_WITH_REG:
          regTo = checkGPR(self.memory.load(++self.ip))
          regFrom = checkGPR(self.memory.load(++self.ip))
          self.gpr[regTo] = checkOperation(self.gpr[regTo] ^ self.gpr[regFrom])
          self.ip++
          break
        case opcodes.XOR_REGADDRESS_WITH_REG:
          regTo = checkGPR(self.memory.load(++self.ip))
          regFrom = self.memory.load(++self.ip)
          self.gpr[regTo] = checkOperation(self.gpr[regTo] ^ self.memory.load(indirectRegisterAddress(regFrom)))
          self.ip++
          break
        case opcodes.XOR_ADDRESS_WITH_REG:
          regTo = checkGPR(self.memory.load(++self.ip))
          memFrom = self.memory.load(++self.ip)
          self.gpr[regTo] = checkOperation(self.gpr[regTo] ^ self.memory.load(memFrom))
          self.ip++
          break
        case opcodes.XOR_NUMBER_WITH_REG:
          regTo = checkGPR(self.memory.load(++self.ip))
          number = self.memory.load(++self.ip)
          self.gpr[regTo] = checkOperation(self.gpr[regTo] ^ number)
          self.ip++
          break
        case opcodes.NOT_REG:
          regTo = checkGPR(self.memory.load(++self.ip))
          self.gpr[regTo] = checkOperation(~self.gpr[regTo])
          self.ip++
          break
        case opcodes.SHL_REG_WITH_REG:
          regTo = checkGPR(self.memory.load(++self.ip))
          regFrom = checkGPR(self.memory.load(++self.ip))
          self.gpr[regTo] = checkOperation(self.gpr[regTo] << self.gpr[regFrom])
          self.ip++
          break
        case opcodes.SHL_REGADDRESS_WITH_REG:
          regTo = checkGPR(self.memory.load(++self.ip))
          regFrom = self.memory.load(++self.ip)
          self.gpr[regTo] = checkOperation(self.gpr[regTo] << self.memory.load(indirectRegisterAddress(regFrom)))
          self.ip++
          break
        case opcodes.SHL_ADDRESS_WITH_REG:
          regTo = checkGPR(self.memory.load(++self.ip))
          memFrom = self.memory.load(++self.ip)
          self.gpr[regTo] = checkOperation(self.gpr[regTo] << self.memory.load(memFrom))
          self.ip++
          break
        case opcodes.SHL_NUMBER_WITH_REG:
          regTo = checkGPR(self.memory.load(++self.ip))
          number = self.memory.load(++self.ip)
          self.gpr[regTo] = checkOperation(self.gpr[regTo] << number)
          self.ip++
          break
        case opcodes.SHR_REG_WITH_REG:
          regTo = checkGPR(self.memory.load(++self.ip))
          regFrom = checkGPR(self.memory.load(++self.ip))
          self.gpr[regTo] = checkOperation(self.gpr[regTo] >>> self.gpr[regFrom])
          self.ip++
          break
        case opcodes.SHR_REGADDRESS_WITH_REG:
          regTo = checkGPR(self.memory.load(++self.ip))
          regFrom = self.memory.load(++self.ip)
          self.gpr[regTo] = checkOperation(self.gpr[regTo] >>> self.memory.load(indirectRegisterAddress(regFrom)))
          self.ip++
          break
        case opcodes.SHR_ADDRESS_WITH_REG:
          regTo = checkGPR(self.memory.load(++self.ip))
          memFrom = self.memory.load(++self.ip)
          self.gpr[regTo] = checkOperation(self.gpr[regTo] >>> self.memory.load(memFrom))
          self.ip++
          break
        case opcodes.SHR_NUMBER_WITH_REG:
          regTo = checkGPR(self.memory.load(++self.ip))
          number = self.memory.load(++self.ip)
          self.gpr[regTo] = checkOperation(self.gpr[regTo] >>> number)
          self.ip++
          break
        default:
          throw new Error('Invalid op code: ' + instr)
      }
    }
    catch (e) {
      self.fault = true
      throw e
    }
  }
}

export default CPU
