'use client'
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import ENDPOINT from "@/config/url";
import { useToast } from "@/hooks/use-toast";
import { ClassObject } from "@/objects/class.object";
import AddClass from "@/user-components/class-object/add-class.component";
import EditClass from "@/user-components/class-object/update-class.component";
import useInfiniteScroll from "@/user-components/hook/useInfiniteScroll.hook";
import SearchBar from "@/user-components/ui/search-bar";
import { axiosInstance } from "@/util/request.util";
import { Trash } from "lucide-react";
import { useCallback, useState } from "react";

export default function Page() {
    const [search, setSearch] = useState("");
    const toaster = useToast();
    const { data: classes, loading, ref, refresh:reFetch } = useInfiniteScroll<ClassObject, HTMLTableRowElement>({ filter: { search }, take: 20, url: ENDPOINT.MASTER_CLASS });

    const handleSearch = useCallback(function (query: string) {
        if (query !== search) {
            setSearch(query);
        }
    }, [search]);

    // const reFetch = useCallback(function () {
    //     setSearch('  ');
    //     setSearch('');
    // }, [setSearch]);

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
    }, [classes]);

    return (
        <div className="p-4 max-h-full">
            <h1 className="scroll-m-20 text-2xl mb-4 font-extrabold tracking-tight lg:text-5xl">
                Kelas
            </h1>
            <div className="w-full flex flex-col gap-4">
                <div className="flex flex-col md:flex-row gap-6 items-center justify-between">
                    <SearchBar onSearch={handleSearch} />
                    <AddClass reFetch={reFetch} />
                </div>
                <div className="max-h-[31rem] overflow-y-auto">
                    <Table className="w-full overflow-y-auto">
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
                                        <TableRow ref={ref} key={index}>
                                            <TableCell>{index + 1}</TableCell>
                                            <TableCell>
                                                {classObject.name}
                                            </TableCell>
                                            <TableCell>{classObject.students?.length}</TableCell>
                                            <TableCell className="flex md:hidden flex-col gap-2 items-center">
                                                <EditClass text={''} classId={classObject.id} reFetch={reFetch} />
                                                <Button onClick={() => { handleDelete(classObject.id ?? 0) }}><Trash className="w-4"></Trash></Button>
                                            </TableCell>
                                            <TableCell className="hidden md:flex gap-2 items-center">
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
                                            <TableCell className="flex md:hidden flex-col gap-2 items-center">
                                                <EditClass text={''} classId={classObject.id} reFetch={reFetch} />
                                                <Button onClick={() => { handleDelete(classObject.id ?? 0) }}><Trash className="w-4"></Trash></Button>
                                            </TableCell>
                                            <TableCell className="hidden md:flex gap-2 items-center">
                                                <EditClass classId={classObject.id} reFetch={reFetch} />
                                                <Button onClick={() => { handleDelete(classObject.id ?? 0) }}>Hapus <Trash className="w-4"></Trash></Button>
                                            </TableCell>
                                        </TableRow>
                                    )
                                }
                            })}
                            {loading && <TableRow><TableCell colSpan={4} className="text-center">Loading...</TableCell></TableRow>}
                            {!loading && classes.length === 0 && <TableRow><TableCell colSpan={4} className="text-center">{search === '' ? 'Data Kosong' : 'Data Tidak Ditemukan'}</TableCell></TableRow>}
                        </TableBody>
                    </Table>
                </div>
            </div>
        </div>
    )
}