'use client'
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import ENDPOINT from "@/config/url";
import { useToast } from "@/hooks/use-toast";
import { ViolationType } from "@/objects/violation-type.object";
import useInfiniteScroll from "@/user-components/hook/useInfiniteScroll.hook";
import SearchBar from "@/user-components/ui/search-bar";
import AddViolationType from "@/user-components/violation-type/add-violation-type.component";
import EditViolationType from "@/user-components/violation-type/update-violation-type.component";
import ImportViolationType from "@/user-components/violation-type/violation-type-import.component";
import { axiosInstance } from "@/util/request.util";
import { Trash } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function Page() {
    const [search, setSearch] = useState("");
    const toaster = useToast();
    const { data: violationTypes, loading, ref } = useInfiniteScroll<ViolationType, HTMLTableRowElement>({ filter: { search }, take: 20, url: ENDPOINT.MASTER_VIOLATION_TYPE })
    function handleSearch(query: string) {
        if (query !== search) {
            setSearch(query);
        }
    }

    function reFetch() {
        setSearch('');
    }

    function handleDelete(id: number) {
        const thisClass = violationTypes.find((c) => c.id === id);
        if (!thisClass) return;
        if (thisClass.violations.length > 0) {
            toaster.toast({
                title: "Error",
                description: "Pelanggaran ini sudah dipakai, tidak bisa dihapus",
                variant: "destructive",
            })
            return;
        }
        const confirm = window.confirm("Apakah anda yakin ingin menghapus pelanggaran ini?");
        if (!confirm) {
            return;
        }
        axiosInstance.delete(`${ENDPOINT.DELETE_VIOLATION_TYPE}/${id}`).then(() => {
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
    const route = useRouter();
    return (
        <div className="p-4 w-full">
            <h1 className="scroll-m-20 text-2xl mb-4 font-extrabold tracking-tight lg:text-5xl">
                Jenis Pelanggaran
            </h1>
            <div className="w-full flex flex-col gap-4">
                <div className="flex flex-col md:flex-row gap-6 items-center justify-between">
                    <SearchBar onSearch={handleSearch} />
                    <AddViolationType reFetch={reFetch} />
                    <ImportViolationType reFetch={reFetch} />
                </div>
                <div className="max-h-[31rem] w-full overflow-x-auto max-w-96 md:max-w-full overflow-y-auto">
                    <Table className="table-fixed w-full">
                        <TableHeader className="bg-slate-100 text-black">
                            <TableRow>
                                <TableHead className="w-8">No</TableHead>
                                <TableHead>Nama Pelanggaran</TableHead>
                                <TableHead className="w-8">Poin</TableHead>
                                <TableHead>Jumlah Pelanggaran dilakukan</TableHead>
                                <TableHead className="w-16 md:w-40">Aksi</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody
                        >
                            {violationTypes.map((violationType, index) => {
                                if (violationTypes.length === index + 1) {
                                    return (
                                        <TableRow onClick={() => { route.push(`/dashboard/violation-type/${violationType.id}`) }} className="cursor-pointer" ref={ref} key={index}>
                                            <TableCell>{index + 1}</TableCell>
                                            <TableCell>{violationType.name}</TableCell>
                                            <TableCell>{violationType.point}</TableCell>
                                            <TableCell>{violationType.violations.length}</TableCell>
                                            <TableCell className="flex md:hidden gap-2 items-center flex-col md:flex-row">
                                                <EditViolationType text={''} violationTypeId={violationType.id} reFetch={reFetch} />
                                                <Button onClick={() => { handleDelete(violationType.id ?? 0) }}><Trash className="w-4"></Trash></Button>
                                            </TableCell>
                                            <TableCell className="hidden md:flex gap-2 items-center flex-col md:flex-row">
                                                <EditViolationType violationTypeId={violationType.id} reFetch={reFetch} />
                                                <Button onClick={() => { handleDelete(violationType.id ?? 0) }}>Hapus <Trash className="w-4"></Trash></Button>
                                            </TableCell>
                                        </TableRow>
                                    )
                                } else {
                                    return (
                                        <TableRow onClick={() => { route.push(`/dashboard/violation-type/${violationType.id}`) }} className="cursor-pointer" key={index}>
                                            <TableCell>{index + 1}</TableCell>
                                            <TableCell>{violationType.name}</TableCell>
                                            <TableCell>{violationType.point}</TableCell>
                                            <TableCell>{violationType.violations.length}</TableCell>
                                            <TableCell className="flex md:hidden gap-2 items-center flex-col md:flex-row">
                                                <EditViolationType text={''} violationTypeId={violationType.id} reFetch={reFetch} />
                                                <Button onClick={() => { handleDelete(violationType.id ?? 0) }}><Trash className="w-4"></Trash></Button>
                                            </TableCell>
                                            <TableCell className="hidden md:flex gap-2 items-center flex-col md:flex-row">
                                                <EditViolationType violationTypeId={violationType.id} reFetch={reFetch} />
                                                <Button onClick={() => { handleDelete(violationType.id ?? 0) }}>Hapus <Trash className="w-4"></Trash></Button>
                                            </TableCell>
                                        </TableRow>
                                    )
                                }
                            })}
                            {loading && <TableRow><TableCell colSpan={4} className="text-center">Loading...</TableCell></TableRow>}
                            {!loading && violationTypes.length === 0 && <TableRow><TableCell colSpan={4} className="text-center">{search === '' ? 'Data Kosong' : 'Data Tidak Ditemukan'}</TableCell></TableRow>}
                        </TableBody>
                    </Table>
                </div>
            </div>
        </div>
    )
}