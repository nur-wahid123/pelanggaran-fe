'use client'
import ENDPOINT from "@/config/url";
import { ViolationTypeEnum } from "@/enums/violation-type.enum";
import { Student } from "@/objects/student.object";
import { ViolationType } from "@/objects/violation-type.object";
import { Violation } from "@/objects/violation.object";
import useInfiniteScroll from "@/user-components/hook/useInfiniteScroll.hook";
import { formatDateToExactString, formatDateToExactStringAndTime } from "@/util/date.util";
import { axiosInstance } from "@/util/request.util";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useCallback, useEffect, useMemo, useState } from "react";

export default function Page() {
    const param = useParams()
    const studentId = useMemo<string>(() => {
        return String(param.slug)
    }, [param])
    const [student, setStudent] = useState<Student | undefined>(undefined);
    const fetchData = useCallback(async () => {
        await axiosInstance.get(`${ENDPOINT.DETAIL_STUDENT}/${studentId}`).then((res) => {
            setStudent(res.data.data)
        })
    }, [studentId])
    useEffect(() => {
        fetchData();
    }, [])
    const { data: dataV, loading: loadingV, ref: refV } = useInfiniteScroll<Violation, HTMLDivElement>({ filter: { student_id: studentId, type: ViolationTypeEnum.COLLECTION }, take: 10, url: ENDPOINT.MASTER_VIOLATION });
    return (
        <div>
            <h1 className="scroll-m-20 text-2xl mb-4 font-extrabold tracking-tight lg:text-5xl">
                Detail Siswa
            </h1>
            <div className="grid grid-cols-4">
                <div className="">
                    <p className="p-1 border rounded-tl-xl">Nama</p>
                    <p className="p-1 border">Kelas</p>
                    <p className="p-1 border">NISN</p>
                    <p className="p-1 border">NIS</p>
                    <p className="p-1 border">Total Poin</p>
                    <p className="p-1 border">Total Melanggar</p>
                </div>
                <div className="font-semibold col-span-3">
                    <p className="p-1 border rounded-tr-xl">: {student?.name}</p>
                    <p className="p-1 border">: {student?.student_class?.name}</p>
                    <p className="p-1 border">: {student?.national_student_id}</p>
                    <p className="p-1 border">: {student?.school_student_id}</p>
                    <p className="p-1 border">: {dataV.length === 0 ? 0 : dataV?.reduce((acc, curr) => acc + curr.violation_types?.reduce((acc, curr) => acc + curr.point, 0), 0)} Poin</p>
                    <p className="p-1 border">: {dataV.length} Kali</p>
                </div>
            </div>
            <div className="w-full flex flex-col gap-4">
                <div className="rounded-xl bg-white p-4">
                    <p className="font-bold text-xl">Riwayat Pelanggaran</p>
                    <div className="max-h-60 overflow-y-auto">
                        {dataV.map((v, i) => {
                            if (dataV.length === i + 1) {
                                return (
                                    <Link key={i}  href={`/dashboard/violation/${v.id}`}>
                                        <div ref={refV} className="p-2 border-b border-slate-300">
                                            <p className="font-semibold">{formatDateToExactStringAndTime(new Date(String(v.date)) ?? new Date())}</p>
                                            <p className="font-medium text-slate-500">{v.creator?.name}</p>
                                        </div>
                                    </Link>
                                )
                            } else {
                                return (
                                    <Link key={i} href={`/dashboard/violation/${v.id}`}>
                                        <div className="p-2 border-b border-slate-300" key={i}>
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