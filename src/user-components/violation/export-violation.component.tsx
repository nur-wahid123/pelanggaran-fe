"use client";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Label } from "@/components/ui/label";
import { DateRange, formatDate, formatDateToExactString, formatDateToExactStringAndTime, thisMonth } from "@/util/date.util";
import { Download } from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";
import { DatePickerWithRange } from "../dashboard/date-picker";
import { axiosInstance } from "@/util/request.util";
import ENDPOINT from "@/config/url";
import { ViolationTypeEnum } from "@/enums/violation-type.enum";
import { Violation } from "@/objects/violation.object";
import { Student } from "@/objects/student.object";
import { ViolationType } from "@/objects/violation-type.object";
import { Progress } from "@/components/ui/progress";
import ExcelJS from 'exceljs';

export const makeMonthYear = (startDate: Date) => {
    const months: string[][] = [];
    let currentDate = startDate;
    while (currentDate <= new Date()) {
        const nextMonth = new Date(currentDate.setMonth(currentDate.getMonth() + 1));
        currentDate.setMonth(currentDate.getMonth() - 1);
        months.push([formatDate(currentDate), formatDate(new Date(nextMonth.setDate(currentDate.getDate() - 1))), formatDateToExactString(currentDate).slice(2)]);
        currentDate = new Date(currentDate.setMonth(currentDate.getMonth() + 1));
    }
    return months;
}
export default function ExportViolation() {
    const appStartDate = process.env.NEXT_PUBLIC_APP_START_DATE ? new Date(process.env.NEXT_PUBLIC_APP_START_DATE) : new Date('01-2025');
    const months = makeMonthYear(appStartDate);
    // const [monthYears, setMonthYears] = useState<string[][]>([]);
    const [loading, setLoading] = useState(false);
    const thisMnth = useMemo(() => thisMonth(), []);
    const [selectedMonth, setSelectedMonth] = useState(0);
    const [exportType, setExportType] = useState<"date-range" | "per-month">("date-range");
    const [dateRange, setDateRange] = useState<DateRange>({ start_date: formatDate(thisMnth.startOfMonth), finish_date: formatDate(thisMnth.endOfMonth) });
    const setDate = useCallback((from: Date, to: Date) => {
        setDateRange({ start_date: formatDate(from), finish_date: formatDate(to) });
    }, []);
    const [dataCollection, setDataCollection] = useState<Violation[]>([]);
    const [dataPerStudent, setDataPerStudent] = useState<Student[]>([]);
    const [dataPerViolationType, setDataPerViolationType] = useState<ViolationType[]>([]);
    const [hasMore, setHasMore] = useState(true);
    const [progress, setProgress] = useState(0);

    const fetchData = useCallback(async (page: number, take: number, type: ViolationTypeEnum): Promise<boolean> => {
        let hasNext = true;
        await axiosInstance.get(ENDPOINT.MASTER_VIOLATION, {
            params: {
                page: page,
                take: take,
                type,
                ...dateRange
            },
        })
            .then(res => {
                if (Array.isArray(res.data.data)) {
                    if (type === ViolationTypeEnum.COLLECTION) setDataCollection(prevData => [...prevData, ...res.data.data]);
                    if (type === ViolationTypeEnum.PER_STUDENT) setDataPerStudent(prevData => [...prevData, ...res.data.data]);
                    if (type === ViolationTypeEnum.PER_VIOLATION_TYPE) setDataPerViolationType(prevData => [...prevData, ...res.data.data]);
                    console.log(res.data.pagination.has_next_page);
                    hasNext = res.data.pagination.has_next_page;
                    setHasMore(res.data.pagination.has_next_page)
                }
            })
            .catch(err => {
                console.log(err);
                setLoading(false);
            });
        return hasNext;
    }, [setHasMore, dateRange, setDataCollection, setDataPerStudent, setDataPerViolationType]);

    const exportData = useCallback(async () => {
        console.log(dateRange);
        setLoading(true);
        setDataCollection([]);
        setDataPerStudent([]);
        setDataPerViolationType([]);
        setProgress(0);
        setHasMore(true);
        let hasNext = true
        while (hasNext) {
            hasNext = await fetchData(1, 100, ViolationTypeEnum.COLLECTION);
        }
        setProgress(20);
        setHasMore(true);
        hasNext = true;
        while (hasNext) {
            hasNext = await fetchData(1, 100, ViolationTypeEnum.PER_STUDENT);
        }
        setProgress(30);
        hasNext = true;
        while (hasNext) {
            hasNext = await fetchData(1, 100, ViolationTypeEnum.PER_VIOLATION_TYPE);
        }
        setProgress(40);
        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet('Per Pelanggaran');
        const columns = [
            { header: 'No', width: 4 },
            { header: 'Tanggal Pelanggaran', width: 20 },
            { header: 'Jumlah Poin', width: 15 },
            { header: 'Jumlah Siswa', width: 15 },
            { header: 'Jumlah Pelanggaran', width: 20 },
            { header: 'Nama Pelanggaran', width: 90 },
            { header: 'Poin', width: 8 },
            { header: 'Nama Siswa', width: 30 },
        ];

        worksheet.columns = columns;

        const headerRow = worksheet.getRow(1);
        headerRow.eachCell((cell) => {
            cell.font = { bold: true };
            cell.border = {
                top: { style: 'thick' },
                left: { style: 'thick' },
                bottom: { style: 'thick' },
                right: { style: 'thick' },
            }
            cell.protection = { locked: true }; // Lock the header cells
        });

        dataCollection.map((violation, i) => {
            const exampleRow = worksheet.addRow([
                i + 1,
                `${violation.date ? formatDateToExactStringAndTime(new Date(violation.date)) : ''}`,
                `${violation.violation_types ? violation.violation_types.reduce((acc, curr) => acc + curr.point, 0) : 0} Poin`,
                `${violation.students ? violation.students.length : 0} Siswa`,
                `${violation.violation_types ? violation.violation_types.length  : 0} Pelanggaran`,
                `${violation.violation_types ? violation.violation_types[0].name : ''}`,
                `${violation.violation_types ? violation.violation_types[0].point : 0} Poin`,
                `${violation.students ? violation.students[0].name : ''}`,
            ]);
            exampleRow.eachCell((cell) => {
                cell.protection = { locked: true }; // Lock the example row
            });
            exampleRow.commit();
            const length = violation.violation_types.length > violation.students.length ? violation.violation_types.length : violation.students.length;
            for (let index = 0; index < length; index++) {                
                const exampleRow = worksheet.addRow([
                    '',
                    '',
                    '',
                    '',
                    '',
                    `${violation.violation_types[index+1] ? violation.violation_types[index+1].name : ''}`,
                    `${violation.violation_types[index+1] ? `${violation.violation_types[index+1].point} Poin` : ''}`,
                    `${violation.students[index+1] ? violation.students[index+1].name : ''}`,
                ]);
                exampleRow.eachCell((cell) => {
                    cell.protection = { locked: true }; // Lock the example row
                });
                exampleRow.commit();
            }
        })
        setProgress(50);

        const worksheet2 = workbook.addWorksheet('Per Siswa');
        const columns2 = [
            { header: 'No', width: 4 },
            { header: 'Nama Siswa', width: 30 },
            { header: 'Kelas', width: 90 },
            { header: 'Jumlah Pelanggaran', width: 30 },
            { header: 'Jumlah Poin', width: 17 },
            { header: 'Status', width: 20 },
        ];

        worksheet2.columns = columns2;

        const headerRow2 = worksheet2.getRow(1);
        headerRow2.eachCell((cell) => {
            cell.font = { bold: true };
            cell.border = {
                top:    { style: 'thick' },
                left:   { style: 'thick' },
                bottom: { style: 'thick' },
                right:  { style: 'thick' },
              };
            cell.protection = { locked: true }; // Lock the header cells
        });

        dataPerStudent.map((student, i) => {
            const totalPoint = student.violations?.reduce((total, violation) => total + violation.violation_types.reduce((total, violationType) => total + violationType.point, 0), 0);
            const exampleRow = worksheet2.addRow([
                i + 1,
                `${student.name ? student.name : ''}`,
                `${student.student_class ? student.student_class.name : ''}`,
                `${student.violations?.reduce((total, violation) => total + violation.violation_types.length, 0)} Poin`,
                `${totalPoint} Poin`,
            ]);
            exampleRow.eachCell((cell) => {
                cell.protection = { locked: true }; // Lock the example row
            });
            exampleRow.commit();
            const row3 = worksheet2.addRow([
                ``,
                `No.`,
                `Pelanggaran`,
                'Tanggal',
                'Poin',
            ]);
            row3.eachCell((cell) => {
                if (cell.value !== '') {
                cell.border = {
                    top:    { style: 'thick' },
                    left:   { style: 'thick' },
                    bottom: { style: 'thick' },
                    right:  { style: 'thick' },
                  }
                  }
                if (cell.value === 'No.') {
                    cell.alignment = { horizontal: 'right' };
                }
                cell.font = { bold: true };
                cell.protection = { locked: true }; // Lock the example row
            });
            row3.commit();
            let num = 1;
            // @typescript-eslint/no-unused-expressions
            student.violations && student.violations.map((violation) => {
                violation.violation_types.map((violationType) => {
                    const exampleRow = worksheet2.addRow([
                        ``,
                        num++,
                        `${violationType ? violationType.name : ''}`,
                        `${violation.date ? formatDateToExactStringAndTime(new Date(violation.date)) : ''}`,
                        `${violationType ? violationType.point : 0} Poin`,
                    ]);
                    exampleRow.eachCell((cell) => {
                        cell.protection = { locked: true }; // Lock the example row
                    });
                    exampleRow.commit();
                })
            })
            const row4 = worksheet2.addRow([
                ``,
                '',
                '',
                '',
                `${totalPoint} Poin`,
            ]);
            worksheet2.mergeCells(`B${row4.number}:D${row4.number}`);
            const cell = worksheet2.getCell(`B${row4.number}`);
            cell.font = { bold: true };
            cell.alignment = { horizontal: 'right' };
            cell.value = 'Total Poin';
            row4.eachCell((cell) => {
                cell.protection = { locked: true }; // Lock the example row
                cell.font = { bold: true };
            });
            row4.commit();
            const row2 = worksheet2.addRow([]);
            row2.eachCell((cell) => {
                cell.protection = { locked: true }; // Lock the example row
            });
            row2.commit();
        })
        setProgress(60);

        const worksheet3 = workbook.addWorksheet('Per Tipe Pelanggaran');
        const columns3 = [
            { header: 'No', width: 5 },
            { header: 'Nama Pelanggaran', width: 90 },
            { header: 'Berapa Kali Dilanggar', width: 20 },
            { header: 'Jumlah Siswa Melanggar', width: 20 },
            { header: 'Poin', width: 20 },
            { header: 'Jumlah Poin', width: 20 },
        ];

        worksheet3.columns = columns3;

        const headerRow3 = worksheet3.getRow(1);
        headerRow3.eachCell((cell) => {
            cell.protection = { locked: true }; // Lock the header cells
        });

        dataPerViolationType.map((violationType, i) => {
            const totalPoint = violationType.point * violationType.violations?.reduce((total, violation) => total + violation.students?.length, 0);
            const exampleRow = worksheet3.addRow([
                i + 1,
                `${violationType.name ? violationType.name : ''}`,
                `${violationType.violations?.length}`, 
                `${violationType.violations?.reduce((total, violation) => total + violation.students?.length, 0)} Siswa`,
                `${violationType.point} Poin`,
                `${totalPoint} Poin`,
            ]);
            exampleRow.eachCell((cell) => {
                cell.protection = { locked: true }; // Lock the example row
            });
            exampleRow.commit();
        })
        setProgress(80);

        const buffer = await workbook.xlsx.writeBuffer();
        const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        setProgress(90);
        a.href = url;
        a.download = `Export Data Pelanggaran ${formatDateToExactString(new Date(dateRange.start_date))} - ${formatDateToExactString(new Date(dateRange.finish_date))}.xlsx`;
        a.click();
        URL.revokeObjectURL(url);
        setProgress(100);
        setLoading(false)
        setProgress(0);

    }, [hasMore, setProgress, progress, dataCollection, dataPerStudent, dataPerViolationType, fetchData]);

    useEffect(() => {
        // console.log(months);

        // setMonthYears(months);
    }, [])

    useEffect(() => {
        setDateRange({ start_date: months[selectedMonth][0], finish_date: months[selectedMonth][1] });
    }, [selectedMonth])

    return (
        <Dialog modal={false}>
            <DialogTrigger asChild>
                <Button>
                    Export <Download />
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Export Data Pelanggaran</DialogTitle>
                    <DialogDescription asChild>
                        <div className="flex flex-col gap-4">
                            <Label>Jenis Export</Label>
                            <Select value={exportType} onValueChange={(e) => e === "date-range" ? setExportType("date-range") : setExportType("per-month")}>
                                <SelectTrigger className="w-[180px]">
                                    <SelectValue placeholder="Theme" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="date-range">Rentang Tanggal</SelectItem>
                                    <SelectItem value="per-month">Per Bulan</SelectItem>
                                </SelectContent>
                            </Select>
                            {exportType === "date-range" ?
                                <div className="flex flex-col gap-4">
                                    <Label>Pilih Tanggal</Label>
                                    <DatePickerWithRange startDate={new Date(dateRange.start_date)} finishDate={new Date(dateRange.finish_date)} setOutDate={setDate} />
                                </div>
                                :
                                <div className="flex flex-col gap-4">
                                    <Label>Pilih Bulan</Label>
                                    <Select value={selectedMonth.toString()} onValueChange={(e) => setSelectedMonth(parseInt(e))}>
                                        <SelectTrigger className="w-[180px]">
                                            <SelectValue placeholder="Theme" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {months.map((m, i) => <SelectItem key={i} value={`${i}`}>{m[2]}</SelectItem>)}
                                        </SelectContent>
                                    </Select>
                                </div>
                            }
                            {loading && <Progress value={progress} max={100} />}
                            <Button onClick={() => exportData()}>Export</Button>
                        </div>

                    </DialogDescription>
                </DialogHeader>
            </DialogContent>
        </Dialog >
    );
}