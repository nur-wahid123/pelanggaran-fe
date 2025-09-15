'use client'
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ViolationTypeEnum } from "@/enums/violation-type.enum";
import { DatePickerWithRange } from "@/user-components/dashboard/date-picker";
import SearchBar from "@/user-components/ui/search-bar";
import ExportViolation from "@/user-components/violation/export-violation.component";
import StudentCard from "@/user-components/violation/student-card.component";
import ViolationCard from "@/user-components/violation/violation-card.component";
import ViolationTypeCard from "@/user-components/violation/violation-type-card.component";
import { DateRange, formatDate, thisMonth } from "@/util/date.util";
import { AlertTriangle, Plus, Search, Users, FileText, BarChart3 } from "lucide-react";
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
    },[setDateRange]);

    const getTabInfo = (type: ViolationTypeEnum) => {
        switch (type) {
            case ViolationTypeEnum.COLLECTION:
                return { text: 'Per Pelanggaran', icon: FileText, description: 'Lihat data pelanggaran per kejadian' };
            case ViolationTypeEnum.PER_STUDENT:
                return { text: 'Per Siswa', icon: Users, description: 'Lihat data pelanggaran per siswa' };
            case ViolationTypeEnum.PER_VIOLATION_TYPE:
                return { text: 'Per Tipe Pelanggaran', icon: BarChart3, description: 'Lihat data pelanggaran per jenis' };
            default:
                return { text: '', icon: FileText, description: '' };
        }
    };

    return (
        <div className="container mx-auto p-4 space-y-6">
            {/* Header Section */}
            <div className="space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight flex items-center gap-3">
                            <AlertTriangle className="h-8 w-8 text-destructive" />
                            Data Pelanggaran
                        </h1>
                        <p className="text-muted-foreground mt-2">
                            Kelola dan lihat data pelanggaran siswa
                        </p>
                    </div>
                    
                    <Link href={'/dashboard/input-violation'}>
                        <Button size="lg" className="flex items-center gap-2">
                            <Plus className="h-4 w-4" />
                            Input Pelanggaran
                        </Button>
                    </Link>
                </div>

                {/* Filter Controls */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Search className="h-5 w-5" />
                            Filter & Pencarian
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Pencarian</label>
                                <SearchBar onSearch={handleSearch} />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Periode</label>
                                <DatePickerWithRange 
                                    startDate={new Date(dateRange.start_date)} 
                                    finishDate={new Date(dateRange.finish_date)} 
                                    setOutDate={setDate} 
                                />
                            </div>
                            <div className="space-y-2 sm:col-span-2 lg:col-span-1">
                                <label className="text-sm font-medium">Aksi</label>
                                <div className="flex justify-start">
                                    <ExportViolation />
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            <Separator />

            {/* View Type Tabs */}
            <div className="space-y-4">
                <div className="flex items-center gap-2">
                    <BarChart3 className="h-5 w-5" />
                    <h2 className="text-xl font-semibold">Tampilan Data</h2>
                </div>
                
                <Tabs value={violationTypeEnum} onValueChange={(value) => setViolationTypeEnum(value as ViolationTypeEnum)}>
                    <TabsList className="grid w-full grid-cols-3">
                        {Object.entries(ViolationTypeEnum).map(([key, value]) => {
                            const tabInfo = getTabInfo(value);
                            const Icon = tabInfo.icon;
                            return (
                                <TabsTrigger key={key} value={value} className="flex items-center gap-2">
                                    <Icon className="h-4 w-4" />
                                    {tabInfo.text}
                                </TabsTrigger>
                            );
                        })}
                    </TabsList>
                    
                    {Object.entries(ViolationTypeEnum).map(([key, value]) => {
                        const tabInfo = getTabInfo(value);
                        return (
                            <TabsContent key={key} value={value} className="mt-6">
                                <Card>
                                    <CardHeader>
                                        <CardTitle className="flex items-center gap-2">
                                            <tabInfo.icon className="h-5 w-5" />
                                            {tabInfo.text}
                                        </CardTitle>
                                        <p className="text-muted-foreground">{tabInfo.description}</p>
                                    </CardHeader>
                                    <CardContent>
                                        {value === ViolationTypeEnum.COLLECTION && (
                                            <ViolationCard filter={{search, start_date:dateRange.start_date, finish_date: dateRange.finish_date, type:value}}/>
                                        )}
                                        {value === ViolationTypeEnum.PER_STUDENT && (
                                            <StudentCard filter={{search, start_date:dateRange.start_date, finish_date: dateRange.finish_date, type:value}} />
                                        )}
                                        {value === ViolationTypeEnum.PER_VIOLATION_TYPE && (
                                            <ViolationTypeCard filter={{search, start_date:dateRange.start_date, finish_date: dateRange.finish_date, type:value}} />
                                        )}
                                    </CardContent>
                                </Card>
                            </TabsContent>
                        );
                    })}
                </Tabs>
            </div>
        </div>
    )
}