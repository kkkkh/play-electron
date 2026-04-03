import type { ErrorJSON } from '@main/types/base'
import { ErrorToJSON } from '@electron/utils/errors'

export default class CustomError extends Error {
  constructor(message: string, options?: ErrorOptions) {
    super(message, options)
    // 作用一：主动捕获 stack
    // 作用二：去掉构造函数本身的堆栈噪音
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, this.constructor)
    }
    // new.target：当前是“谁被 new 出来的”
    // 就是把当前实例对象 this 的原型，设成真正子类的 prototype
    // 保证 Object.getPrototypeOf(err) === HttpError.prototype
    Object.setPrototypeOf(this, new.target.prototype)
    // 保证 err = new HttpError(...) err.name === 'HttpError'成立
    Object.defineProperty(this, 'name', {
      value: new.target.name,
      enumerable: false,
      configurable: true
    })
  }

  public toJSON(): ErrorJSON {
    return {
      name: this.name,
      message: this.message,
      // cause可能就是一个Error 递归链表处理cause
      // 递归转换成可序列化、可上报、可阅读的结构化错误对象
      cause: this.cause ? ErrorToJSON(this.cause as Error) : undefined
    }
  }

  public toString() {
    return `${this.name}: ${this.message}`
  }
}
