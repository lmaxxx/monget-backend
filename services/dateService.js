class DateService {
  subtractDays(date, days) {
    const copyDate = new Date(date.getTime())
    copyDate.setUTCDate(copyDate.getUTCDate() - days + 1)

    return copyDate
  }

  addDays(date, days) {
    const copyDate = new Date(date.getTime())
    copyDate.setUTCDate(copyDate.getUTCDate() + days - 1)

    return copyDate
  }

  getStartOfTheDay(date) {
    const copyDate = new Date(date.getTime())
    copyDate.setUTCHours(0, 0, 0, 0)

    return copyDate
  }

  getEndOfTheDay(date) {
    const copyDate = new Date(date.getTime())
    copyDate.setUTCHours(23, 59, 59, 999)

    return copyDate
  }

  subtractMonths(date, months) {
    const copyDate = new Date(date.getTime())
    copyDate.setUTCMonth(copyDate.getUTCMonth() - months + 1)

    return copyDate
  }

  getStartOfTheYear(date, years) {
    const copyDate = new Date(date.getTime())

    copyDate.setUTCFullYear(copyDate.getUTCFullYear() - years + 1)
    copyDate.setUTCMonth(0, 1)
    copyDate.setUTCHours(0, 0, 0, 0)

    return copyDate
  }

  getEndOfTheYear(date, years) {
    return new Date(Date.UTC(date.getUTCFullYear() - years + 1, 11, 31, 23, 59, 59, 999))
  }

  getStartOfTheMonthByIndex(date, index) {
    const copyDate = new Date(date.getTime())
    copyDate.setUTCMonth(index)

    return copyDate
  }

  getEndOfTheMonthByIndex(date, months) {
    return new Date(date.getUTCFullYear(), months + 1, 0, 23, 59, 59, 999)
  }

  getWeeksInMonth(monthStartDay) {
    const firstDay = monthStartDay.getUTCDay()
    const totalDays = new Date(monthStartDay.getUTCFullYear(), monthStartDay.getUTCMonth() + 1, 0).getUTCDate()

    return Math.ceil((firstDay + totalDays) / 7);
  }

  getWeeksBordersInMonth(monthStartDay, monthEndDay) {
    const result = []
    const monthStartDayCopy = new Date(monthStartDay)
    const weeks = this.getWeeksInMonth(monthStartDay)
    let counter = 0

    for (let i = 0; i < monthEndDay.getUTCDate(); i++) {
      counter++
      if (monthStartDayCopy.getUTCDay() === 0 || monthEndDay.getUTCDate() === monthStartDayCopy.getUTCDate()) {
        const weekBorders = {
          start: this.getStartOfTheDay(new Date(this.subtractDays(monthStartDayCopy, counter))),
          end: this.getEndOfTheDay(new Date(monthStartDayCopy))
        }

        counter = 0
        result.push(weekBorders)

        if (weeks === result.length) return result
      }

      monthStartDayCopy.setUTCDate(monthStartDayCopy.getUTCDate() + 1)
    }
  }

  addTimezoneOffset(date) {
    const copyDate = new Date(date)
    copyDate.setUTCMinutes(copyDate.getUTCMinutes() - copyDate.getTimezoneOffset())

    return copyDate
  }
}

module.exports = new DateService()
