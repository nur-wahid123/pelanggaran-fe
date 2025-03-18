'use client'
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import ENDPOINT from "@/config/url";
import { ViolationTypeEnum } from "@/enums/violation-type.enum";
import { useToast } from "@/hooks/use-toast";
import { Student } from "@/objects/student.object";
import { ViolationType } from "@/objects/violation-type.object";
import { Violation } from "@/objects/violation.object";
import { DatePickerWithRange } from "@/user-components/dashboard/date-picker";
import PaginationSelf, { PaginateContentProps } from "@/user-components/ui/pagination";
import SearchBar from "@/user-components/ui/search-bar";
import StudentCard from "@/user-components/violation/student-card.component";
import ViolationCard from "@/user-components/violation/violation-card.component";
import ViolationTypeCard from "@/user-components/violation/violation-type-card.component";
import { DateRange, formatDate, formatDateToExactString, formatDateToExactStringAndTime, thisMonth } from "@/util/date.util";
import { axiosInstance } from "@/util/request.util";
import { AlertTriangle, PlusIcon, Trash } from "lucide-react";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";

export default function Page() {
    const [search, setSearch] = useState("");
    const thisMnth = thisMonth();
    const [dateRange, setDateRange] = useState<DateRange>({ start_date: formatDate(thisMnth.startOfMonth), finish_date: formatDate(thisMnth.endOfMonth) });
    const [pagination, setPagination] = useState<PaginateContentProps>({});
    const [violations, setViolation] = useState<Violation[]>([]);
    const [students, setStudent] = useState<Student[]>([]);
    const [violationTypes, setViolationTypes] = useState<ViolationType[]>([]);
    const [violationTypeEnum, setViolationTypeEnum] = useState<ViolationTypeEnum>(ViolationTypeEnum.COLLECTION);
    const toaster = useToast();
    const fetchData = useCallback(async (
        start: number,
        limit: number,
    ) => {
        const param = { page: start, take: limit, search: search, type: violationTypeEnum, ...dateRange };
        try {
            const res = await axiosInstance.get(
                `${ENDPOINT.MASTER_VIOLATION}`
                , { params: param });

            if (Array.isArray(res.data.data)) {
                switch (violationTypeEnum) {
                    case ViolationTypeEnum.COLLECTION:
                        setViolation(res.data.data);
                        break;
                    case ViolationTypeEnum.PER_STUDENT:
                        setStudent(res.data.data);
                        break;
                    case ViolationTypeEnum.PER_VIOLATION_TYPE:
                        setViolationTypes(res.data.data);
                        break;
                
                    default:
                        break;
                }
                setViolation(res.data.data);
            }
            if (res.data.pagination) {
                setPagination(res.data.pagination);
            }
        } catch (error) {
            console.error("Error fetching violation:", error);
        }
    }
        , [search, dateRange, violationTypeEnum]);
    useEffect(() => {
        fetchData(pagination?.page ?? 1, pagination?.take ?? 20);
    }, [fetchData, pagination?.page, pagination?.take, search, dateRange, violationTypeEnum]);

    function handleSearch(query: string) {
        if (query !== search) {
            setPagination({ ...pagination, page: 1 })
            setSearch(query);
        }
    }

    function reFetch() {
        fetchData(1, pagination?.take ?? 20);
    }

    function setDate(from: Date, to: Date) {
        setDateRange({ start_date: formatDate(from), finish_date: formatDate(to) });
    }

    return (
        <div className="p-4">
            <h1 className="scroll-m-20 text-2xl mb-4 font-extrabold tracking-tight lg:text-5xl">
                Data Pelanggaran
            </h1>
            <div className="w-full flex flex-col gap-4">
                {/* ({flatData.length} of {totalDBRowCount} rows fetched) */}
                <div className="flex gap-6 items-center justify-between">
                    <SearchBar onSearch={handleSearch} />
                    <div className="flex gap-4 items-center">
                        <p>Rows</p>
                        <Select value={pagination?.take?.toString()} onValueChange={(e) => setPagination({ ...pagination, take: Number(e), page: 1 })}>
                            <SelectTrigger className="w-[90px]">
                                <SelectValue placeholder="Rows" />
                            </SelectTrigger>
                            <SelectContent>
                                {[10, 20, 30, 40, 50].map((item) => (
                                    <SelectItem key={item} value={item.toString()}>
                                        {item}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                    <p className="w-full line-clamp-1">dari {pagination.item_count} data</p>
                    <DatePickerWithRange setOutDate={setDate} />
                    <Link href={'/dashboard/input-violation'}>
                        <Button className="flex gap-3 shadow hover:shadow-md" variant="outline"><AlertTriangle className="w-4" />Input Pelanggaran <PlusIcon className="w-4" /></Button>
                    </Link>
                    <PaginationSelf pagination={pagination} fetchData={fetchData} />
                </div>
                <div className="flex flex-wrap gap-2">
                    {Object.entries(ViolationTypeEnum).map(([key, value], index) => {
                        const isSelected = violationTypeEnum === value;
                        return (
                            <Button key={index} size={"sm"} onClick={() => !isSelected && setViolationTypeEnum(value)} className="text-xs px-2 py-1 rounded-md border border-slate-300 hover:border-slate-900 hover:scale-[99%] transition" disabled={isSelected}>{key}</Button>
                        )
                    })}
                </div>
                <div className="flex flex-col gap-2">
                    {violationTypeEnum === ViolationTypeEnum.COLLECTION && violations.map((violation, index) => (
                            <ViolationCard key={index} violation={violation} />
                    ))}
                    {violationTypeEnum === ViolationTypeEnum.PER_STUDENT && students.map((student, index) => (
                            <StudentCard key={index} student={student} />
                    ))}
                    {violationTypeEnum === ViolationTypeEnum.PER_VIOLATION_TYPE && violationTypes.map((violation_type, index) => (
                            <ViolationTypeCard key={index} violation_type={violation_type} />
                    ))}
                </div>
            </div>
        </div>
    )
}