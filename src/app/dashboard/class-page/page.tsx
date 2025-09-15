'use client'
import { Button } from "@/components/ui/button";
import ENDPOINT from "@/config/url";
import { useToast } from "@/hooks/use-toast";
import { ClassObject } from "@/objects/class.object";
import AddClass from "@/user-components/class-object/add-class.component";
import EditClass from "@/user-components/class-object/update-class.component";
import useInfiniteScroll from "@/user-components/hook/useInfiniteScroll.hook";
import SearchBar from "@/user-components/ui/search-bar";
import { axiosInstance } from "@/util/request.util";
import { Trash, Users, BookOpen, GraduationCap } from "lucide-react";
import { useCallback, useState } from "react";

export default function Page() {
    const [search, setSearch] = useState("");
    const toaster = useToast();
    const { data: classes, loading, ref, refresh: reFetch } = useInfiniteScroll<ClassObject, HTMLDivElement>({
        filter: { search },
        take: 20,
        url: ENDPOINT.MASTER_CLASS,
    });

    const handleSearch = useCallback(
        (query: string) => {
            if (query !== search) {
                setSearch(query);
            }
        },
        [search]
    );

    const handleDelete = useCallback(
        async (id: number) => {
            const thisClass = classes.find((c) => c.id === id);
            if (!thisClass) return;
            if (thisClass.students && thisClass.students.length > 0) {
                toaster.toast({
                    title: "Error",
                    description: "Kelas ini masih memiliki siswa yang terdaftar",
                    variant: "destructive",
                });
                return;
            }
            const confirm = window.confirm("Apakah anda yakin ingin menghapus Kelas ini?");
            if (!confirm) {
                return;
            }
            try {
                await axiosInstance.delete(`${ENDPOINT.DELETE_CLASS}/${id}`);
                toaster.toast({
                    title: "Success",
                    description: "Kelas berhasil dihapus",
                    variant: "default",
                });
                reFetch();
            } catch (err: any) {
                if (err.code === 400) {
                    toaster.toast({
                        title: "Error",
                        description: err.response.data.message[0],
                        variant: "destructive",
                    });
                } else {
                    toaster.toast({
                        title: "Error",
                        description: err.response.data.message,
                        variant: "destructive",
                    });
                }
            }
        },
        [classes, toaster, reFetch]
    );

    return (
        <div className="p-4">
            <h1 className="scroll-m-20 text-2xl mb-4 font-extrabold tracking-tight lg:text-5xl">
                Kelas
            </h1>
            <div className="w-full">
                <div className="flex flex-row flex-wrap gap-4 items-stretch my-4">
                    <div className="flex-grow min-w-[220px]">
                        <SearchBar onSearch={handleSearch} />
                    </div>
                    <div className="flex-grow min-w-[220px]">
                        <AddClass reFetch={reFetch} />
                    </div>
                </div>
            </div>
            <div className="max-h-[31rem] w-full flex flex-col gap-2 overflow-y-auto">
                {classes.map((classObject, i) => {
                    const isLast = classes.length === i + 1;
                    return (
                        <div
                            key={classObject.id ?? i}
                            ref={isLast ? ref : undefined}
                            className="relative rounded-xl border border-gray-200 bg-white dark:bg-gray-900 p-4 md:p-6 shadow-sm flex flex-col gap-4 transition hover:shadow-md"
                        >
                            <div className="flex flex-row items-center justify-between gap-4">
                                <div className="flex items-center gap-4">
                                    <BookOpen className="h-12 w-12 text-blue-500 bg-blue-100 dark:bg-blue-900 rounded-full p-2 flex-shrink-0" />
                                    <div>
                                        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 break-words">
                                            {classObject.name || "N/A"}
                                        </h3>
                                        <div className="flex gap-2 items-center mt-1">
                                            <Users className="h-4 w-4 text-purple-500" />
                                            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                                {classObject.students?.length ?? 0} Siswa
                                            </span>
                                        </div>
                                    </div>
                                </div>
                                {/* Actions: always visible, stacked on mobile, row on md+ */}
                                <div className="flex flex-col gap-2 sm:flex-row sm:gap-2 items-end sm:items-center ml-2">
                                    <EditClass classId={classObject.id} reFetch={reFetch} />
                                    <Button
                                        variant="destructive"
                                        onClick={() => handleDelete(classObject.id ?? 0)}
                                        className="flex gap-1 items-center"
                                    >
                                        <Trash className="w-4" />
                                        <span className="inline">Hapus</span>
                                    </Button>
                                </div>
                            </div>
                        </div>
                    );
                })}
                {loading && (
                    <div className="flex justify-center items-center h-full py-8">
                        Loading...
                    </div>
                )}
                {!loading && classes.length === 0 && (
                    <div className="flex justify-center items-center h-full py-8">
                        {search !== "" ? "Data Tidak Ditemukan" : "Data Kosong"}
                    </div>
                )}
            </div>
        </div>
    );
}