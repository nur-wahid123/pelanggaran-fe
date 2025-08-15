'use client'
import { Button } from "@/components/ui/button";
import { ViolationTypeEnum } from "@/enums/violation-type.enum";
import { DatePickerWithRange } from "@/user-components/dashboard/date-picker";
import SearchBar from "@/user-components/ui/search-bar";
import ExportViolation from "@/user-components/violation/export-violation.component";
import StudentCard from "@/user-components/violation/student-card.component";
import ViolationCard from "@/user-components/violation/violation-card.component";
import ViolationTypeCard from "@/user-components/violation/violation-type-card.component";
import { DateRange, formatDate, thisMonth } from "@/util/date.util";
import { AlertTriangle, PlusIcon } from "lucide-react";
import Link from "next/link";
import { useCallback, useMemo, useState } from "react";

export default function Page() {
    const [search, setSearch] = useState("");
    const thisMnth = useMemo(() => thisMonth(),[]);
    const [dateRange, setDateRange] = useState<DateRange>({ start_date: formatDate(thisMnth.startOfMonth), finish_date: formatDate(thisMnth.endOfMonth) });
    const [violationTypeEnum, setViolationTypeEnum] = useState<ViolationTypeEnum>(ViolationTypeEnum.COLLECTION);

    const handleSearch = useCallback((query: string) => {
        if (query !== search) {
            setSearch(query);
        }
    },[search]);

    const setDate = useCallback((from: Date, to: Date) => {
        setDateRange({ start_date: formatDate(from), finish_date: formatDate(to) });
    },[]);

    return (
        <div className="p-4">
            <h1 className="scroll-m-20 text-2xl mb-4 font-extrabold tracking-tight lg:text-5xl">
                Data Pelanggaran
            </h1>
            <div className="w-full flex flex-col gap-4">
                {/* ({flatData.length} of {totalDBRowCount} rows fetched) */}
                <div className="flex gap-6 items-center justify-between">
                    <SearchBar onSearch={handleSearch} />
                    <DatePickerWithRange startDate={new Date(dateRange.start_date)} finishDate={new Date(dateRange.finish_date)} setOutDate={setDate} />
                    <ExportViolation/>
                    <Link href={'/dashboard/input-violation'}>
                        <Button className="flex gap-3 shadow hover:shadow-md" variant="outline"><AlertTriangle className="w-4" />Input Pelanggaran <PlusIcon className="w-4" /></Button>
                    </Link>
                </div>
                <div className="flex flex-wrap gap-2">
                    {Object.entries(ViolationTypeEnum).map(([key, value], index) => {
                        const isSelected = violationTypeEnum === value;
                        let text =''
                        switch (key) {
                            case ViolationTypeEnum.COLLECTION:
                                text = 'Per Pelanggaran'
                                break;
                            case ViolationTypeEnum.PER_STUDENT:
                                text = 'Per Siswa'
                                break;
                            case ViolationTypeEnum.PER_VIOLATION_TYPE:
                                text = 'Per Tipe Pelanggaran'
                                break;
                        
                            default:
                                break;
                        }
                        return (
                            <Button key={index} size={"sm"} onClick={() => !isSelected && setViolationTypeEnum(value)} className="text-xs px-2 py-1 rounded-md border border-slate-300 hover:border-slate-900 hover:scale-[99%] transition" disabled={isSelected}>{text}</Button>
                        )
                    })}
                </div>
                    {violationTypeEnum === ViolationTypeEnum.COLLECTION && (<ViolationCard filter={{search, start_date:dateRange.start_date, finish_date: dateRange.finish_date, type:violationTypeEnum}}/>)}
                    {violationTypeEnum === ViolationTypeEnum.PER_STUDENT && (<StudentCard filter={{search, start_date:dateRange.start_date, finish_date: dateRange.finish_date, type:violationTypeEnum}} />)}
                    {violationTypeEnum === ViolationTypeEnum.PER_VIOLATION_TYPE && (<ViolationTypeCard filter={{search, start_date:dateRange.start_date, finish_date: dateRange.finish_date, type:violationTypeEnum}} />)}
            </div>
        </div>
    )
}