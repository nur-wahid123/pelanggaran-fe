'use client'
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import ENDPOINT from "@/config/url";
import { RoleEnum } from "@/enums/role.enum";
import { useToast } from "@/hooks/use-toast";
import { User } from "@/objects/user.object";
import useInfiniteScroll from "@/user-components/hook/useInfiniteScroll.hook";
import SearchBar from "@/user-components/ui/search-bar";
import AddUser from "@/user-components/user/add-user.component";
import EditUser from "@/user-components/user/update-user.component";
import { axiosInstance } from "@/util/request.util";
import { Trash } from "lucide-react";
import { useCallback, useState } from "react";

const config = {
    url: ENDPOINT.MASTER_USER,
    title: "Data User",
    key_word: "user",
}

export default function Page() {
    const [search, setSearch] = useState("");
    const toaster = useToast();
    const { data, loading, ref } = useInfiniteScroll<User,HTMLTableRowElement>({ filter: { search }, take: 20, url: config.url });

    const handleSearch = useCallback(function (query: string) {
        if (query !== search) {
            setSearch(query);
        }
    }, [search]);

    const reFetch = useCallback(function () {
        setSearch('');
    }, []);

    const handleDelete = useCallback(function (id: number) {
        const thisClass = data.find((c) => c.id === id);
        if (!thisClass) return;

        const confirm = window.confirm(`Apakah anda yakin ingin menghapus ${config.key_word.toWellFormed()} ini?`);
        if (!confirm) {
            return;
        }
        axiosInstance.delete(`${ENDPOINT.DELETE_CLASS}/${id}`).then(() => {
            toaster.toast({
                title: "Success",
                description: `${config.key_word.toWellFormed()} berhasil dihapus`,
                variant: "default",
            })
            reFetch();
        })
            .catch(() => {
                toaster.toast({
                    title: "Error",
                    description: `Gagal menghapus ${config.key_word.toWellFormed()}`,
                    variant: "destructive",
                })
            });
    }, [data]);


    return (
        <div className="p-4 max-h-full">
            <h1 className="scroll-m-20 text-2xl mb-4 font-extrabold tracking-tight lg:text-5xl">
                {config.title}
            </h1>
            <div className="w-full flex flex-col gap-4">
                <div className="flex flex-col md:flex-row gap-6 items-center justify-between">
                    <SearchBar onSearch={handleSearch} />
                    <AddUser reFetch={reFetch} />
                </div>
                <div className="max-h-[31rem] overflow-y-auto">
                    <Table className="w-full overflow-y-auto">
                        <TableHeader className="bg-slate-100 text-black">
                            <TableRow>
                                <TableHead>No</TableHead>
                                <TableHead>Nama</TableHead>
                                <TableHead>Role</TableHead>
                                <TableHead>Aksi</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody
                        >
                            {data.map((user, index) => {
                                if (data.length === index + 1) {
                                    return (
                                        <TableRow ref={ref} key={index}>
                                            <TableCell>{index + 1}</TableCell>
                                            <TableCell>
                                                {user.name}
                                            </TableCell>
                                            <TableCell>{user.role === RoleEnum.USER ? "User" : "Admin"}</TableCell>
                                            <TableCell className="flex gap-2 items-center">
                                                <EditUser id={user.id} reFetch={reFetch} />
                                                <Button onClick={() => { handleDelete(user.id ?? 0) }}>Hapus <Trash className="w-4"></Trash></Button>
                                            </TableCell>
                                        </TableRow>
                                    )
                                } else {
                                    return (
                                        <TableRow key={index}>
                                             <TableCell>{index + 1}</TableCell>
                                            <TableCell>
                                                {user.name}
                                            </TableCell>
                                            <TableCell>{user.role === RoleEnum.USER ? "User" : "Admin"}</TableCell>
                                            <TableCell className="flex gap-2 items-center">
                                                <EditUser id={user.id} reFetch={reFetch} />
                                                <Button onClick={() => { handleDelete(user.id ?? 0) }}>Hapus <Trash className="w-4"></Trash></Button>
                                            </TableCell>
                                        </TableRow>
                                    )
                                }
                            })}
                            {loading && <TableRow><TableCell colSpan={4} className="text-center">Loading...</TableCell></TableRow>}
                            {!loading && data.length === 0 && <TableRow><TableCell colSpan={4} className="text-center">{search === '' ? 'Data Kosong' : 'Data Tidak Ditemukan'}</TableCell></TableRow>}
                        </TableBody>
                    </Table>
                </div>
            </div>
        </div>
    )
}