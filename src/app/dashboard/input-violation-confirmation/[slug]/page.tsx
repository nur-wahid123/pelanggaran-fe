"use client"
import { Button } from "@/components/ui/button";
import ENDPOINT from "@/config/url";
import { Violation } from "@/objects/violation.object";
import { axiosInstance } from "@/util/request.util";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useCallback, useEffect, useState } from "react";

export default function Page() {
    const [data, setData] = useState<Violation>({} as Violation);
    const params = useParams();
    const violationId = params.slug
    const fetchData = useCallback(async () => {
        await axiosInstance.get(`${ENDPOINT.DETAIL_VIOLATION}/${violationId}`).then((res) => {
            setData(res.data.data);
        }).catch((err) => {
            if (err.response.status === 400) {
                alert(err.response.data.message[0]);
                return;
            } else {
                alert(err.response.data.message)
                return;
            }
        })
    }, [violationId])

    useEffect(() => {
        fetchData();
    }, [violationId])
    return (
        <div className="p-4 w-full">
            <h1 className="scroll-m-20 text-2xl mb-4 font-extrabold tracking-tight lg:text-5xl">
                Berhasil Memasukkan Pelanggaran
            </h1>
            <div className="w-full flex flex-col gap-4">
                <div className="max-h-[31rem] gap-3 w-full overflow-x-auto overflow-y-auto flex flex-col">
                    <div className="border flex flex-col gap-4 p-6 h-full border-gray-200 rounded-md">
                        <div className="text-2xl font-semibold">Siswa</div>
                        <div className="w-full flex flex-col gap-2">
                            {data.students &&data.students.map((student, i) => (
                                <div key={i} className="flex p-2 rounded-md justify-between border-2 border-slate-400">
                                    <div>{student.name}</div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
                <div className="max-h-[31rem] gap-3 w-full overflow-x-auto overflow-y-auto flex flex-col">
                    <div className="border flex flex-col gap-4 p-6 h-full border-gray-200 rounded-md">
                        <div className="text-2xl font-semibold">Pelanggaran</div>
                        <div className="w-full flex flex-col gap-2">
                            {data.violation_types && data.violation_types.map((vT, i) => (
                                <div key={i} className="flex p-2 rounded-md justify-between border-2 border-slate-400">
                                    <div>{vT.name}</div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
                <div className="flex gap-3">
                    <Link href="/dashboard/input-violation">
                        <Button>Input Pelanggaran Lagi</Button>
                    </Link>
                    <Link href="/dashboard">
                        <Button>Dashboard</Button>
                    </Link>
                </div>
            </div>
        </div>
    );
}