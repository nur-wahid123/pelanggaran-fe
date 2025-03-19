'use client'
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import ENDPOINT from "@/config/url";
import { useToast } from "@/hooks/use-toast";
import { ClassObject } from "@/objects/class.object";
import AddClass from "@/user-components/class-object/add-class.component";
import EditClass from "@/user-components/class-object/update-class.component";
import useInfiniteScroll from "@/user-components/hook/useInfiniteScroll.hook";
import { PaginateContentProps } from "@/user-components/ui/pagination";
import SearchBar from "@/user-components/ui/search-bar";
import { axiosInstance } from "@/util/request.util";
import { Trash } from "lucide-react";
import { useCallback, useRef, useState } from "react";

export default function Page() {
    const [search, setSearch] = useState("");
    const [pagination, setPagination] = useState<PaginateContentProps>({});
    const [pageNum, setPageNum] = useState(1);
    const toaster = useToast();
    const observer = useRef<IntersectionObserver | null>(null);
    const { data: classes, error, hasMore, loading } = useInfiniteScroll<ClassObject>({ filter: { search }, take: 10, url: ENDPOINT.MASTER_CLASS, page: pageNum });
    const lastElementRef = useCallback((node: HTMLTableRowElement | null) => {
        if (loading) return;
        if (observer.current) observer.current.disconnect();
        observer.current = new IntersectionObserver((entries) => { 
            if (entries[0].isIntersecting && hasMore) {
                setPageNum((prev) => prev + 1);
            }
        })
        if (node) observer.current.observe(node);
    }, [loading, hasMore]);

    const handleSearch = useCallback(function (query: string) {
        if (query !== search) {
            setPageNum(1);
            setSearch(query);
        }
    },[search]);

    const reFetch = useCallback(function () {
        setPageNum(1);
    },[]);

    const handleDelete = useCallback(function (id: number) {
        const thisClass = classes.find((c) => c.id === id);
        if (!thisClass) return;
        if (thisClass.students && thisClass.students.length > 0) {
            toaster.toast({
                title: "Error",
                description: "Kelas ini masih memiliki siswa yang terdaftar",
                variant: "destructive",
            })
            return;
        }
        const confirm = window.confirm("Apakah anda yakin ingin menghapus Kelas ini?");
        if (!confirm) {
            return;
        }
        axiosInstance.delete(`${ENDPOINT.DELETE_CLASS}/${id}`).then(() => {
            toaster.toast({
                title: "Success",
                description: "Kelas berhasil dihapus",
                variant: "default",
            })
            reFetch();
        })
            .catch(() => {
                toaster.toast({
                    title: "Error",
                    description: "Gagal menghapus Kelas",
                    variant: "destructive",
                })
            });
    },[classes]);

    return (
        <div className="p-4">
            <h1 className="scroll-m-20 text-2xl mb-4 font-extrabold tracking-tight lg:text-5xl">
                Kelas
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
                    <AddClass reFetch={reFetch} />
                    {/* <PaginationSelf pagination={pagination} fetchData={fetchData} /> */}
                </div>
                <div>
                    <Table className="w-full table-fixed">
                        <TableHeader className="bg-slate-100 text-black">
                            <TableRow>
                                <TableHead>No</TableHead>
                                <TableHead>Nama Kelas</TableHead>
                                <TableHead>Jumlah Siswa</TableHead>
                                <TableHead>Aksi</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody
                        >
                            {classes.map((classObject, index) => {                                
                                if (classes.length === index + 1) {
                                    return (
                                        <TableRow ref={lastElementRef} key={index}>
                                            <TableCell>{index + 1}</TableCell>
                                            <TableCell>
                                                {classObject.name}
                                            </TableCell>
                                            <TableCell>{classObject.students?.length}</TableCell>
                                            <TableCell className="flex gap-2 items-center">
                                                <EditClass classId={classObject.id} reFetch={reFetch} />
                                                <Button onClick={() => { handleDelete(classObject.id ?? 0) }}>Hapus <Trash className="w-4"></Trash></Button>
                                            </TableCell>
                                        </TableRow>
                                    )
                                } else {
                                    return (
                                        <TableRow key={index}>
                                            <TableCell>{index + 1}</TableCell>
                                            <TableCell>
                                                {classObject.name}
                                            </TableCell>
                                            <TableCell>{classObject.students?.length}</TableCell>
                                            <TableCell className="flex gap-2 items-center">
                                                <EditClass classId={classObject.id} reFetch={reFetch} />
                                                <Button onClick={() => { handleDelete(classObject.id ?? 0) }}>Hapus <Trash className="w-4"></Trash></Button>
                                            </TableCell>
                                        </TableRow>
                                    )
                                }
                            })}
                        </TableBody>
                    </Table>
                </div>
            </div>
        </div>
    )
}