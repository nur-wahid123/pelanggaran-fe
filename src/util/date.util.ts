export function formatDate(date: Date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
}

export function convertMonthNumberToMonthName(month_number: number){
    const months:string[] = 
    [
        "Januari",
        "Februari",
        "Maret",
        "April",
        "Mei",
        "Juni",
        "Juli",
        "Agustus",
        "September",
        "Oktober",
        "November",
        "Desember",
    ]
    return months[month_number]
}

export function formatDateToExactString(date: Date){
 const day = date.getDate()
 const month_name = convertMonthNumberToMonthName(date.getMonth())
 const year = date.getFullYear()
 return `${day} ${month_name} ${year}`
}

  /**
   * Return the start and end of the current week.
   * The start of the week is determined by the day of the week the current date is.
   * The end of the week is the start of the week plus 6 days.
   * @returns [Date, Date] - The start and end of the current week.
   */
export function thisWeek(): {startOfWeek:Date, endOfWeek:Date} {
    const today = new Date();
    const startOfWeek = new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate() - today.getDay(),
    );
    const endOfWeek = new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate() - today.getDay() + 6,
    );
    return {startOfWeek, endOfWeek};
  }
  
  /**
   * Return the start and end of the current month.
   * The start of the month is the first day of the month.
   * The end of the month is the last day of the month.
   * @returns [Date, Date] - The start and end of the current month.
   */
  export function thisMonth(): {startOfMonth:Date, endOfMonth:Date} {
    const today = new Date();
    const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    const endOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0);
    return {startOfMonth, endOfMonth};
  }
  

export function formatDateToExactStringAndTime(date: Date){
 const day = date.getDate()
 const month_name = convertMonthNumberToMonthName(date.getMonth())
 const year = date.getFullYear()
 return `${day} ${month_name} ${year} ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`
}

export class DateRange {
  start_date!: string;

  finish_date!: string;
}
