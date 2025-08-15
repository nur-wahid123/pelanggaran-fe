'use client'
import { Textarea } from "@/components/ui/textarea"
import ENDPOINT from "@/config/url"
import { Violation } from "@/objects/violation.object"
import { formatDateToExactString, formatDateToExactTime } from "@/util/date.util"
import { axiosInstance } from "@/util/request.util"
import Link from "next/link"
import { useParams } from "next/navigation"
import { useCallback, useEffect, useMemo, useState } from "react"

export default function Page() {
    const param = useParams()
    const violationId = useMemo(() => { return String(param.slug) }, [param])
    const [violation, setViolation] = useState<Violation | undefined>(undefined)
    const [images, setImages] = useState<number[]>([]);
    const fetchData = useCallback(async () => {
        await axiosInstance.get(`${ENDPOINT.DETAIL_VIOLATION}/${violationId}`).then((res) => {
            setViolation(res.data.data)
            if (!res.data.data.imageGroupId) {
                return
            }
            fetchImage(res.data.data)
        })
    }, [violation])

    const fetchImage = useCallback(async (violation: Violation) => {
        await axiosInstance.get(`${ENDPOINT.LIST_IMAGE}/${violation.imageGroupId}`).then((res) => {
            setImages(res.data.data)
        })
    }, [violation])
    useEffect(() => {
        fetchData();
    }, [])

    return (
        <div>
            <h1 className="scroll-m-20 text-2xl mb-4 font-extrabold tracking-tight lg:text-5xl">
                Detail Pelanggaran
            </h1>
            <div className="grid grid-cols-4">
                <div className="">
                    <p className="p-1 border rounded-tl-xl">Tanggal</p>
                    <p className="p-1 border">Jam</p>
                    <p className="p-1 border">Pencatat</p>
                    <p className="p-1 border">Jumlah siswa</p>
                    <p className="p-1 border">Pelanggaran yang dilakukan</p>
                    <p className="p-1 border">Total Poin</p>
                </div>
                <div className="font-semibold col-span-3">
                    <p className="p-1 border rounded-tr-xl">: {formatDateToExactString(violation?.date ? new Date(violation?.date) : new Date())}</p>
                    <p className="p-1 border">: {formatDateToExactTime(violation?.date ? new Date(violation?.date) : new Date())}</p>
                    <p className="p-1 border">: {violation?.creator ? violation?.creator?.name : "-"}</p>
                    <p className="p-1 border">: {violation?.students.length} Siswa</p>
                    <p className="p-1 border">: {violation?.violation_types.length} Pelanggaran</p>
                    <p className="p-1 border">: {violation?.violation_types.reduce((acc, curr) => acc + curr.point, 0)} poin</p>
                </div>
            </div>
            <div>
                <h1 className="scroll-m-20 text-xl mb-4 font-extrabold tracking-tight lg:text-2xl">
                    Catatan
                </h1>
                <Textarea disabled className="disabled:text-black" value={violation?.note ? violation?.note : '-'}></Textarea>
            </div>
            <h1 className="scroll-m-20 text-xl mb-4 font-extrabold tracking-tight lg:text-2xl">
                Siswa
            </h1>
            <div>
                {violation?.students.map((st) => (
                    <Link href={`/dashboard/student/${st.national_student_id}`} className="grid cursor-pointer hover:font-bold grid-cols-2" key={st.id}>
                        <p>{st.name}</p>
                        <p>{st.national_student_id}</p>
                    </Link>
                ))}
            </div>
            <h1 className="scroll-m-20 text-xl mb-4 font-extrabold tracking-tight lg:text-2xl">
                Pelanggaran
            </h1>
            <div>
                {violation?.violation_types.map((vt) => (
                    <Link href={`/dashboard/violation-type/${vt.id}`} className="flex hover:font-bold cursor-pointer gap-2" key={vt.id}>
                        <p>{vt.name} -</p>
                        <p> {vt.point} Poin</p>
                    </Link>
                ))}
            </div>
            {violation?.imageGroupId &&
                <div>
                    <h1 className="scroll-m-20 text-xl mb-4 font-extrabold tracking-tight lg:text-2xl">
                        Gambar
                    </h1>
                    <div className="flex gap-2 flex-wrap">
                        {images.map((img) => {
                            return (
                                <div key={img}>
                                    <img src={`${ENDPOINT.DETAIL_IMAGE}/${img}`} width={200} height={200} alt="image" />
                                </div>
                            )
                        })}
                    </div>
                </div>
            }
        </div>
    )
}