'use client'
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import ENDPOINT from "@/config/url";
import { useToast } from "@/hooks/use-toast";
import { Violation } from "@/objects/violation.object";
import PaginationSelf, { PaginateContentProps } from "@/user-components/ui/pagination";
import SearchBar from "@/user-components/ui/search-bar";
import { formatDateToExactString, formatDateToExactStringAndTime } from "@/util/date.util";
import { axiosInstance } from "@/util/request.util";
import { AlertTriangle, PlusIcon, Trash } from "lucide-react";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";

export default function Page() {
    const [search, setSearch] = useState("");
    const [pagination, setPagination] = useState<PaginateContentProps>({});
    const [violations, setViolation] = useState<Violation[]>([]);
    const toaster = useToast();
    const fetchData = useCallback(async (
        start: number,
        limit: number,
    ) => {
        try {
            const res = await axiosInstance.get(
                `${ENDPOINT.MASTER_VIOLATION}?page=${start}&take=${limit}&search=${search}`
            );

            if (Array.isArray(res.data.data)) {
                setViolation(res.data.data);
            }
            if (res.data.pagination) {
                setPagination(res.data.pagination);
            }
        } catch (error) {
            console.error("Error fetching violation:", error);
        }
    }
        , [search]);
    useEffect(() => {
        fetchData(pagination?.page ?? 1, pagination?.take ?? 20);
    }, [fetchData, pagination?.page, pagination?.take, search]);

    function handleSearch(query: string) {
        if (query !== search) {
            setPagination({ ...pagination, page: 1 })
            setSearch(query);
        }
    }

    function reFetch() {
        fetchData(1, pagination?.take ?? 20);
    }

    function handleDelete(id: number) {
        const thisClass = violations.find((c) => c.id === id);
        if (!thisClass) return;
        const confirm = window.confirm("Apakah anda yakin ingin menghapus pelanggaran ini?");
        if (!confirm) {
            return;
        }
        axiosInstance.delete(`${ENDPOINT.DELETE_VIOLATION}/${id}`).then(() => {
            toaster.toast({
                title: "Success",
                description: "Pelanggaran berhasil dihapus",
                variant: "default",
            })
            reFetch();
        })
            .catch(() => {
                toaster.toast({
                    title: "Error",
                    description: "Gagal menghapus Pelanggaran",
                    variant: "destructive",
                })
            });
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
                    <Link href={'/dashboard/input-violation'}>
                        <Button className="flex gap-3 shadow hover:shadow-md" variant="outline"><AlertTriangle className="w-4" />Input Pelanggaran <PlusIcon className="w-4" /></Button>
                    </Link>
                    <PaginationSelf pagination={pagination} fetchData={fetchData} />
                </div>
                <div>
                    <Table className="w-full table-fixed">
                        <TableHeader className="bg-slate-100 text-black">
                            <TableRow>
                                <TableHead>No</TableHead>
                                <TableHead>Nama Siswa</TableHead>
                                <TableHead>Tanggal</TableHead>
                                <TableHead>Poin</TableHead>
                                <TableHead>Pencatat</TableHead>
                                <TableHead>Aksi</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody
                        >
                            {violations.map((violation, index) => {
                                return (
                                    <TableRow key={index}>
                                        <TableCell>{index + 1}</TableCell>
                                        <TableCell>
                                            <div className="line-clamp-1 text-lg font-semibold">
                                                {violation.student?.name}
                                            </div>
                                            <div>{violation.student?.national_student_id}</div>
                                        </TableCell>
                                        <TableCell>{formatDateToExactStringAndTime(new Date(violation.date ?? new Date()))}</TableCell>
                                        <TableCell>{violation.violation_types?.map((e) => e.point).reduce((a, b) => (a ?? 0) + (b ?? 0), 0)}</TableCell>
                                        <TableCell>{violation.creator?.name}</TableCell>
                                        <TableCell className="flex gap-2 items-center">
                                            {/* <EditViolation violationId={violation.id} reFetch={reFetch} /> */}
                                            <Button onClick={() => { handleDelete(violation.id ?? 0) }}>Hapus <Trash className="w-4"></Trash></Button>
                                        </TableCell>
                                    </TableRow>
                                )
                            })}
                        </TableBody>
                    </Table>
                </div>
            </div>
        </div>
    )
}