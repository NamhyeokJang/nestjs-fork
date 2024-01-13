import { Type } from '@nestjs/common'

export class ModuleUtils {
  static exports(module: any): Type[] {
    return Object.values(Object.getOwnPropertyDescriptors(module))
      .map(descriptor => {
        if (descriptor.value) return descriptor.value
        if (descriptor.get) return descriptor.get()
      })
      .filter(value => typeof value === 'function')
      .filter(value => !!value.prototype)
      .filter(value => value.prototype.constructor === value)
  }
}
