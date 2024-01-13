import dayjs from 'dayjs'

export class DayUtils {
  static getNow(): dayjs.Dayjs {
    return dayjs()
  }

  static getNowDate(): Date {
    return this.getNow().toDate()
  }

  static getDay(input: dayjs.ConfigType): dayjs.Dayjs {
    return dayjs(input)
  }

  static isBeforeNow(date: Date): boolean {
    return dayjs(date).isBefore(dayjs())
  }

  static isAfterNow(date: Date): boolean {
    return dayjs(date).isAfter(dayjs())
  }
}
