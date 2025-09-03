"use client"
import { Button } from "@/components/ui/button";
import ENDPOINT from "@/config/url";
import { ViolationTypeEnum } from "@/enums/violation-type.enum";
import { useToast } from "@/hooks/use-toast";
import { ViolationType } from "@/objects/violation-type.object";
import { Violation } from "@/objects/violation.object";
import useInfiniteScroll from "@/user-components/hook/useInfiniteScroll.hook";
import EditViolationType from "@/user-components/violation-type/update-violation-type.component";
import { formatDateToExactStringAndTime } from "@/util/date.util";
import { axiosInstance } from "@/util/request.util";
import { Trash } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation"
import { useCallback, useEffect, useState } from "react";

export default function Page() {
    const params = useParams();
    const violationTypeId = params.slug
    const [isLoading, setIsLoading] = useState(false);
    const [data, setData] = useState<ViolationType>({} as ViolationType);
    const fetchData = useCallback(async () => {
        await axiosInstance.get(`${ENDPOINT.DETAIL_VIOLATION_TYPE}/${violationTypeId}`).then((res) => {
            setData(res.data.data);
        })
    }, [setData])

    useEffect(() => {
        fetchData();
    }, [])
    const toaster = useToast();

    function handleDelete(id: number) {
        setIsLoading(true);
        if (data.violations.length > 0) {
            toaster.toast({
                title: "Error",
                description: "Pelanggaran ini sudah dipakai, tidak bisa dihapus",
                variant: "destructive",
            })
            setIsLoading(false);
            return;
        }
        const confirm = window.confirm("Apakah anda yakin ingin menghapus pelanggaran ini?");
        if (!confirm) {
            setIsLoading(false);
            return;
        }

        axiosInstance.delete(`${ENDPOINT.DELETE_VIOLATION_TYPE}/${id}`).then(() => {
            toaster.toast({
                title: "Success",
                description: "Pelanggaran berhasil dihapus",
                variant: "default",
            })
            fetchData();
            setIsLoading(false);
        })
            .catch((err) => {
                setIsLoading(false);
                if (err.code === 400) {
                    toaster.toast({ title: "Error", description: err.response.data.message[0], variant: "destructive" });
                } else {
                    toaster.toast({ title: "Error", description: err.response.data.message, variant: "destructive" });
                }
            });
    }
    const { data: dataV, loading: loadingV, ref: refV } = useInfiniteScroll<Violation, HTMLDivElement>({ filter: { violation_type_id: violationTypeId, type: ViolationTypeEnum.COLLECTION }, take: 10, url: ENDPOINT.MASTER_VIOLATION });
    return (
        <div className=" flex-col flex gap-4 p-4">
            <div className="flex flex-col gap-2">
                <h1 className="scroll-m-20 text-2xl mb-4 font-extrabold tracking-tight lg:text-5xl">
                    Tipe Pelanggaran
                </h1>
                <div className="flex gap-3 justify-start md:justify-start">
                    <EditViolationType violationTypeId={data.id} reFetch={fetchData} />
                    <Button disabled={isLoading} onClick={() => { handleDelete(data.id ?? 0) }}>Hapus <Trash className="w-4"></Trash></Button>
                </div>
            </div>
            <table className="w-full border border-slate-300">
                <tbody>
                    <tr>
                        <td className="border p-1">Nama Pelanggaran</td>
                        <td className="border p-1 font-semibold">{data?.name}</td>
                    </tr>
                    <tr>
                        <td className="border p-1">Poin</td>
                        <td className="border p-1 font-semibold">{data?.point}</td>
                    </tr>
                    <tr>
                        <td className="border p-1">Jumlah siswa yang pernah melanggar</td>
                        <td className="border p-1 font-semibold">{data?.violations?.reduce((acc, curr) => acc + curr.students?.length, 0)}</td>
                    </tr>
                    <tr>
                        <td className="border p-1">Pelanggaran dilakukan</td>
                        <td className="border p-1 font-semibold">{data?.violations?.length === 0 ? "Tidak Pernah Dilanggar" : `${data?.violations?.length} kali dilanggar`}</td>
                    </tr>
                </tbody>
            </table>
            <div className="w-full flex flex-col gap-4">
                <div className="rounded-xl bg-white">
                    <p className="font-bold text-xl">Riwayat Pelanggaran</p>
                    <div className="h-full flex flex-col gap-3 w-full overflow-y-auto">
                        {dataV.map((v, i) => {
                            if (dataV.length === i + 1) {
                                return (
                                    <Link key={i} href={`/dashboard/violation/${v.id}`}>
                                        <div ref={refV} className="p-2 border rounded-md shadow-md border-slate-300">
                                            <p className="font-semibold">{formatDateToExactStringAndTime(new Date(String(v.date)) ?? new Date())}</p>
                                            <p className="font-medium text-slate-500">{v.creator?.name}</p>
                                        </div>
                                    </Link>
                                )
                            } else {
                                return (
                                    <Link key={i} href={`/dashboard/violation/${v.id}`}>
                                        <div className="p-2 border rounded-md shadow-md border-slate-300" key={i}>
                                            <p className="font-semibold">{formatDateToExactStringAndTime(new Date(String(v.date)) ?? new Date())}</p>
                                            <p className="font-medium text-slate-500">{v.creator?.name}</p>
                                        </div>
                                    </Link>
                                )
                            }
                        })}
                        {loadingV && (
                            <div className="h-36 w-full justify-center rounded-xl bg-white text-md text-center flex items-center font-semibold">
                                Loading.....
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}