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

    try {
      var checkGPR = function (reg) {
        if (reg < 0 || reg >= this.gpr.length) {
          throw new Error('Invalid register: ' + reg)
        }
        else {
          return reg
        }
      }

      var checkGPRSP = function (reg) {
        if (reg < 0 || reg >= 1 + this.gpr.length) {
          throw new Error('Invalid register: ' + reg)
        }
        else {
          return reg
        }
      }

      var setGPRSP = function (reg, value) {
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

      var getGPRSP = function (reg) {
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

      var indirectRegisterAddress = function (value) {
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

      var checkOperation = function (value) {
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

      var jump = function (newIP) {
        if (newIP < 0 || newIP >= this.memory.data.length) {
          throw new Error('IP outside this.memory')
        }
        else {
          this.ip = newIP
        }
      }

      var push = function (value) {
        this.memory.store(this.sp--, value)
        if (this.sp < this.minSP) {
          throw new Error('Stack overflow')
        }
      }

      var pop = function () {
        var value = this.memory.load(++this.sp)
        if (this.sp > this.maxSP) {
          throw new Error('Stack underflow')
        }
        return value
      }

      var division = function (divisor) {
        if (divisor === 0) {
          throw new Error('Division by 0')
        }
        return Math.floor(this.gpr[0] / divisor)
      }

      if (this.ip < 0 || this.ip >= this.memory.data.length) {
        throw new Error('Instruction pointer is outside of memory')
      }

      var regTo, regFrom, memFrom, memTo, number
      var instr = this.memory.load(this.ip)
      switch (instr) {
        case opcodes.NONE:
          return false // Abort step
        case opcodes.MOV_REG_TO_REG:
          regTo = checkGPRSP(this.memory.load(++this.ip))
          regFrom = checkGPRSP(this.memory.load(++this.ip))
          setGPRSP(regTo, getGPRSP(regFrom))
          this.ip++
          break
        case opcodes.MOV_ADDRESS_TO_REG:
          regTo = checkGPRSP(this.memory.load(++this.ip))
          memFrom = this.memory.load(++this.ip)
          setGPRSP(regTo, this.memory.load(memFrom))
          this.ip++
          break
        case opcodes.MOV_REGADDRESS_TO_REG:
          regTo = checkGPRSP(this.memory.load(++this.ip))
          regFrom = this.memory.load(++this.ip)
          setGPRSP(regTo, this.memory.load(indirectRegisterAddress(regFrom)))
          this.ip++
          break
        case opcodes.MOV_REG_TO_ADDRESS:
          memTo = this.memory.load(++this.ip)
          regFrom = checkGPRSP(this.memory.load(++this.ip))
          this.memory.store(memTo, getGPRSP(regFrom))
          this.ip++
          break
        case opcodes.MOV_REG_TO_REGADDRESS:
          regTo = this.memory.load(++this.ip)
          regFrom = checkGPRSP(this.memory.load(++this.ip))
          this.memory.store(indirectRegisterAddress(regTo), getGPRSP(regFrom))
          this.ip++
          break
        case opcodes.MOV_NUMBER_TO_REG:
          regTo = checkGPRSP(this.memory.load(++this.ip))
          number = this.memory.load(++this.ip)
          setGPRSP(regTo, number)
          this.ip++
          break
        case opcodes.MOV_NUMBER_TO_ADDRESS:
          memTo = this.memory.load(++this.ip)
          number = this.memory.load(++this.ip)
          this.memory.store(memTo, number)
          this.ip++
          break
        case opcodes.MOV_NUMBER_TO_REGADDRESS:
          regTo = this.memory.load(++this.ip)
          number = this.memory.load(++this.ip)
          this.memory.store(indirectRegisterAddress(regTo), number)
          this.ip++
          break
        case opcodes.ADD_REG_TO_REG:
          regTo = checkGPRSP(this.memory.load(++this.ip))
          regFrom = checkGPRSP(this.memory.load(++this.ip))
          setGPRSP(regTo, checkOperation(getGPRSP(regTo) + getGPRSP(regFrom)))
          this.ip++
          break
        case opcodes.ADD_REGADDRESS_TO_REG:
          regTo = checkGPRSP(this.memory.load(++this.ip))
          regFrom = this.memory.load(++this.ip)
          setGPRSP(regTo, checkOperation(getGPRSP(regTo) + this.memory.load(indirectRegisterAddress(regFrom))))
          this.ip++
          break
        case opcodes.ADD_ADDRESS_TO_REG:
          regTo = checkGPRSP(this.memory.load(++this.ip))
          memFrom = this.memory.load(++this.ip)
          setGPRSP(regTo, checkOperation(getGPRSP(regTo) + this.memory.load(memFrom)))
          this.ip++
          break
        case opcodes.ADD_NUMBER_TO_REG:
          regTo = checkGPRSP(this.memory.load(++this.ip))
          number = this.memory.load(++this.ip)
          setGPRSP(regTo, checkOperation(getGPRSP(regTo) + number))
          this.ip++
          break
        case opcodes.SUB_REG_FROM_REG:
          regTo = checkGPRSP(this.memory.load(++this.ip))
          regFrom = checkGPRSP(this.memory.load(++this.ip))
          setGPRSP(regTo, checkOperation(getGPRSP(regTo) - this.gpr[regFrom]))
          this.ip++
          break
        case opcodes.SUB_REGADDRESS_FROM_REG:
          regTo = checkGPRSP(this.memory.load(++this.ip))
          regFrom = this.memory.load(++this.ip)
          setGPRSP(regTo, checkOperation(getGPRSP(regTo) - this.memory.load(indirectRegisterAddress(regFrom))))
          this.ip++
          break
        case opcodes.SUB_ADDRESS_FROM_REG:
          regTo = checkGPRSP(this.memory.load(++this.ip))
          memFrom = this.memory.load(++this.ip)
          setGPRSP(regTo, checkOperation(getGPRSP(regTo) - this.memory.load(memFrom)))
          this.ip++
          break
        case opcodes.SUB_NUMBER_FROM_REG:
          regTo = checkGPRSP(this.memory.load(++this.ip))
          number = this.memory.load(++this.ip)
          setGPRSP(regTo, checkOperation(getGPRSP(regTo) - number))
          this.ip++
          break
        case opcodes.INC_REG:
          regTo = checkGPRSP(this.memory.load(++this.ip))
          setGPRSP(regTo, checkOperation(getGPRSP(regTo) + 1))
          this.ip++
          break
        case opcodes.DEC_REG:
          regTo = checkGPRSP(this.memory.load(++this.ip))
          setGPRSP(regTo, checkOperation(getGPRSP(regTo) - 1))
          this.ip++
          break
        case opcodes.CMP_REG_WITH_REG:
          regTo = checkGPRSP(this.memory.load(++this.ip))
          regFrom = checkGPRSP(this.memory.load(++this.ip))
          checkOperation(getGPRSP(regTo) - getGPRSP(regFrom))
          this.ip++
          break
        case opcodes.CMP_REGADDRESS_WITH_REG:
          regTo = checkGPRSP(this.memory.load(++this.ip))
          regFrom = this.memory.load(++this.ip)
          checkOperation(getGPRSP(regTo) - this.memory.load(indirectRegisterAddress(regFrom)))
          this.ip++
          break
        case opcodes.CMP_ADDRESS_WITH_REG:
          regTo = checkGPRSP(this.memory.load(++this.ip))
          memFrom = this.memory.load(++this.ip)
          checkOperation(getGPRSP(regTo) - this.memory.load(memFrom))
          this.ip++
          break
        case opcodes.CMP_NUMBER_WITH_REG:
          regTo = checkGPRSP(this.memory.load(++this.ip))
          number = this.memory.load(++this.ip)
          checkOperation(getGPRSP(regTo) - number)
          this.ip++
          break
        case opcodes.JMP_REGADDRESS:
          regTo = checkGPR(this.memory.load(++this.ip))
          jump(this.gpr[regTo])
          break
        case opcodes.JMP_ADDRESS:
          number = this.memory.load(++this.ip)
          jump(number)
          break
        case opcodes.JC_REGADDRESS:
          regTo = checkGPR(this.memory.load(++this.ip))
          if (this.carry) {
            jump(this.gpr[regTo])
          }
          else {
            this.ip++
          }
          break
        case opcodes.JC_ADDRESS:
          number = this.memory.load(++this.ip)
          if (this.carry) {
            jump(number)
          }
          else {
            this.ip++
          }
          break
        case opcodes.JNC_REGADDRESS:
          regTo = checkGPR(this.memory.load(++this.ip))
          if (!this.carry) {
            jump(this.gpr[regTo])
          }
          else {
            this.ip++
          }
          break
        case opcodes.JNC_ADDRESS:
          number = this.memory.load(++this.ip)
          if (!this.carry) {
            jump(number)
          }
          else {
            this.ip++
          }
          break
        case opcodes.JZ_REGADDRESS:
          regTo = checkGPR(this.memory.load(++this.ip))
          if (this.zero) {
            jump(this.gpr[regTo])
          }
          else {
            this.ip++
          }
          break
        case opcodes.JZ_ADDRESS:
          number = this.memory.load(++this.ip)
          if (this.zero) {
            jump(number)
          }
          else {
            this.ip++
          }
          break
        case opcodes.JNZ_REGADDRESS:
          regTo = checkGPR(this.memory.load(++this.ip))
          if (!this.zero) {
            jump(this.gpr[regTo])
          }
          else {
            this.ip++
          }
          break
        case opcodes.JNZ_ADDRESS:
          number = this.memory.load(++this.ip)
          if (!this.zero) {
            jump(number)
          }
          else {
            this.ip++
          }
          break
        case opcodes.JA_REGADDRESS:
          regTo = checkGPR(this.memory.load(++this.ip))
          if (!this.zero && !this.carry) {
            jump(this.gpr[regTo])
          }
          else {
            this.ip++
          }
          break
        case opcodes.JA_ADDRESS:
          number = this.memory.load(++this.ip)
          if (!this.zero && !this.carry) {
            jump(number)
          }
          else {
            this.ip++
          }
          break
        case opcodes.JNA_REGADDRESS: // JNA REG
          regTo = checkGPR(this.memory.load(++this.ip))
          if (this.zero || this.carry) {
            jump(this.gpr[regTo])
          }
          else {
            this.ip++
          }
          break
        case opcodes.JNA_ADDRESS:
          number = this.memory.load(++this.ip)
          if (this.zero || this.carry) {
            jump(number)
          }
          else {
            this.ip++
          }
          break
        case opcodes.PUSH_REG:
          regFrom = checkGPR(this.memory.load(++this.ip))
          push(this.gpr[regFrom])
          this.ip++
          break
        case opcodes.PUSH_REGADDRESS:
          regFrom = this.memory.load(++this.ip)
          push(this.memory.load(indirectRegisterAddress(regFrom)))
          this.ip++
          break
        case opcodes.PUSH_ADDRESS:
          memFrom = this.memory.load(++this.ip)
          push(this.memory.load(memFrom))
          this.ip++
          break
        case opcodes.PUSH_NUMBER:
          number = this.memory.load(++this.ip)
          push(number)
          this.ip++
          break
        case opcodes.POP_REG:
          regTo = checkGPR(this.memory.load(++this.ip))
          this.gpr[regTo] = pop()
          this.ip++
          break
        case opcodes.CALL_REGADDRESS:
          regTo = checkGPR(this.memory.load(++this.ip))
          push(this.ip + 1)
          jump(this.gpr[regTo])
          break
        case opcodes.CALL_ADDRESS:
          number = this.memory.load(++this.ip)
          push(this.ip + 1)
          jump(number)
          break
        case opcodes.RET:
          jump(pop())
          break
        case opcodes.MUL_REG: // A = A * REG
          regFrom = checkGPR(this.memory.load(++this.ip))
          this.gpr[0] = checkOperation(this.gpr[0] * this.gpr[regFrom])
          this.ip++
          break
        case opcodes.MUL_REGADDRESS: // A = A * [REG]
          regFrom = this.memory.load(++this.ip)
          this.gpr[0] = checkOperation(this.gpr[0] * this.memory.load(indirectRegisterAddress(regFrom)))
          this.ip++
          break
        case opcodes.MUL_ADDRESS: // A = A * [NUMBER]
          memFrom = this.memory.load(++this.ip)
          this.gpr[0] = checkOperation(this.gpr[0] * this.memory.load(memFrom))
          this.ip++
          break
        case opcodes.MUL_NUMBER: // A = A * NUMBER
          number = this.memory.load(++this.ip)
          this.gpr[0] = checkOperation(this.gpr[0] * number)
          this.ip++
          break
        case opcodes.DIV_REG: // A = A / REG
          regFrom = checkGPR(this.memory.load(++this.ip))
          this.gpr[0] = checkOperation(division(this.gpr[regFrom]))
          this.ip++
          break
        case opcodes.DIV_REGADDRESS: // A = A / [REG]
          regFrom = this.memory.load(++this.ip)
          this.gpr[0] = checkOperation(division(this.memory.load(indirectRegisterAddress(regFrom))))
          this.ip++
          break
        case opcodes.DIV_ADDRESS: // A = A / [NUMBER]
          memFrom = this.memory.load(++this.ip)
          this.gpr[0] = checkOperation(division(this.memory.load(memFrom)))
          this.ip++
          break
        case opcodes.DIV_NUMBER: // A = A / NUMBER
          number = this.memory.load(++this.ip)
          this.gpr[0] = checkOperation(division(number))
          this.ip++
          break
        case opcodes.AND_REG_WITH_REG:
          regTo = checkGPR(this.memory.load(++this.ip))
          regFrom = checkGPR(this.memory.load(++this.ip))
          this.gpr[regTo] = checkOperation(this.gpr[regTo] & this.gpr[regFrom])
          this.ip++
          break
        case opcodes.AND_REGADDRESS_WITH_REG:
          regTo = checkGPR(this.memory.load(++this.ip))
          regFrom = this.memory.load(++this.ip)
          this.gpr[regTo] = checkOperation(this.gpr[regTo] & this.memory.load(indirectRegisterAddress(regFrom)))
          this.ip++
          break
        case opcodes.AND_ADDRESS_WITH_REG:
          regTo = checkGPR(this.memory.load(++this.ip))
          memFrom = this.memory.load(++this.ip)
          this.gpr[regTo] = checkOperation(this.gpr[regTo] & this.memory.load(memFrom))
          this.ip++
          break
        case opcodes.AND_NUMBER_WITH_REG:
          regTo = checkGPR(this.memory.load(++this.ip))
          number = this.memory.load(++this.ip)
          this.gpr[regTo] = checkOperation(this.gpr[regTo] & number)
          this.ip++
          break
        case opcodes.OR_REG_WITH_REG:
          regTo = checkGPR(this.memory.load(++this.ip))
          regFrom = checkGPR(this.memory.load(++this.ip))
          this.gpr[regTo] = checkOperation(this.gpr[regTo] | this.gpr[regFrom])
          this.ip++
          break
        case opcodes.OR_REGADDRESS_WITH_REG:
          regTo = checkGPR(this.memory.load(++this.ip))
          regFrom = this.memory.load(++this.ip)
          this.gpr[regTo] = checkOperation(this.gpr[regTo] | this.memory.load(indirectRegisterAddress(regFrom)))
          this.ip++
          break
        case opcodes.OR_ADDRESS_WITH_REG:
          regTo = checkGPR(this.memory.load(++this.ip))
          memFrom = this.memory.load(++this.ip)
          this.gpr[regTo] = checkOperation(this.gpr[regTo] | this.memory.load(memFrom))
          this.ip++
          break
        case opcodes.OR_NUMBER_WITH_REG:
          regTo = checkGPR(this.memory.load(++this.ip))
          number = this.memory.load(++this.ip)
          this.gpr[regTo] = checkOperation(this.gpr[regTo] | number)
          this.ip++
          break
        case opcodes.XOR_REG_WITH_REG:
          regTo = checkGPR(this.memory.load(++this.ip))
          regFrom = checkGPR(this.memory.load(++this.ip))
          this.gpr[regTo] = checkOperation(this.gpr[regTo] ^ this.gpr[regFrom])
          this.ip++
          break
        case opcodes.XOR_REGADDRESS_WITH_REG:
          regTo = checkGPR(this.memory.load(++this.ip))
          regFrom = this.memory.load(++this.ip)
          this.gpr[regTo] = checkOperation(this.gpr[regTo] ^ this.memory.load(indirectRegisterAddress(regFrom)))
          this.ip++
          break
        case opcodes.XOR_ADDRESS_WITH_REG:
          regTo = checkGPR(this.memory.load(++this.ip))
          memFrom = this.memory.load(++this.ip)
          this.gpr[regTo] = checkOperation(this.gpr[regTo] ^ this.memory.load(memFrom))
          this.ip++
          break
        case opcodes.XOR_NUMBER_WITH_REG:
          regTo = checkGPR(this.memory.load(++this.ip))
          number = this.memory.load(++this.ip)
          this.gpr[regTo] = checkOperation(this.gpr[regTo] ^ number)
          this.ip++
          break
        case opcodes.NOT_REG:
          regTo = checkGPR(this.memory.load(++this.ip))
          this.gpr[regTo] = checkOperation(~this.gpr[regTo])
          this.ip++
          break
        case opcodes.SHL_REG_WITH_REG:
          regTo = checkGPR(this.memory.load(++this.ip))
          regFrom = checkGPR(this.memory.load(++this.ip))
          this.gpr[regTo] = checkOperation(this.gpr[regTo] << this.gpr[regFrom])
          this.ip++
          break
        case opcodes.SHL_REGADDRESS_WITH_REG:
          regTo = checkGPR(this.memory.load(++this.ip))
          regFrom = this.memory.load(++this.ip)
          this.gpr[regTo] = checkOperation(this.gpr[regTo] << this.memory.load(indirectRegisterAddress(regFrom)))
          this.ip++
          break
        case opcodes.SHL_ADDRESS_WITH_REG:
          regTo = checkGPR(this.memory.load(++this.ip))
          memFrom = this.memory.load(++this.ip)
          this.gpr[regTo] = checkOperation(this.gpr[regTo] << this.memory.load(memFrom))
          this.ip++
          break
        case opcodes.SHL_NUMBER_WITH_REG:
          regTo = checkGPR(this.memory.load(++this.ip))
          number = this.memory.load(++this.ip)
          this.gpr[regTo] = checkOperation(this.gpr[regTo] << number)
          this.ip++
          break
        case opcodes.SHR_REG_WITH_REG:
          regTo = checkGPR(this.memory.load(++this.ip))
          regFrom = checkGPR(this.memory.load(++this.ip))
          this.gpr[regTo] = checkOperation(this.gpr[regTo] >>> this.gpr[regFrom])
          this.ip++
          break
        case opcodes.SHR_REGADDRESS_WITH_REG:
          regTo = checkGPR(this.memory.load(++this.ip))
          regFrom = this.memory.load(++this.ip)
          this.gpr[regTo] = checkOperation(this.gpr[regTo] >>> this.memory.load(indirectRegisterAddress(regFrom)))
          this.ip++
          break
        case opcodes.SHR_ADDRESS_WITH_REG:
          regTo = checkGPR(this.memory.load(++this.ip))
          memFrom = this.memory.load(++this.ip)
          this.gpr[regTo] = checkOperation(this.gpr[regTo] >>> this.memory.load(memFrom))
          this.ip++
          break
        case opcodes.SHR_NUMBER_WITH_REG:
          regTo = checkGPR(this.memory.load(++this.ip))
          number = this.memory.load(++this.ip)
          this.gpr[regTo] = checkOperation(this.gpr[regTo] >>> number)
          this.ip++
          break
        default:
          throw new Error('Invalid op code: ' + instr)
      }
    }
    catch (e) {
      this.fault = true
      throw e
    }
  }
}

export default CPU
