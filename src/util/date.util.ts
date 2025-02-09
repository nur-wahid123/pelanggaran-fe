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

export function formatDateToExactStringAndTime(date: Date){
 const day = date.getDate()
 const month_name = convertMonthNumberToMonthName(date.getMonth())
 const year = date.getFullYear()
 return `${day} ${month_name} ${year} ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`
}