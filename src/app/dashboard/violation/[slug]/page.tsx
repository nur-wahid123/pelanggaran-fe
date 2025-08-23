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
            <table className="table-auto w-full">
                <tbody>
                    <tr>
                        <td className="p-1 border">Tanggal</td>
                        <td className="p-1 border font-semibold">: {formatDateToExactString(violation?.date ? new Date(violation?.date) : new Date())}</td>
                    </tr>
                    <tr>
                        <td className="p-1 border">Jam</td>
                        <td className="p-1 border font-semibold">: {formatDateToExactTime(violation?.date ? new Date(violation?.date) : new Date())}</td>
                    </tr>
                    <tr>
                        <td className="p-1 border">Pencatat</td>
                        <td className="p-1 border font-semibold">: {violation?.creator ? violation?.creator?.name : "-"}</td>
                    </tr>
                    <tr>
                        <td className="p-1 border">Jumlah siswa</td>
                        <td className="p-1 border font-semibold">: {violation?.students.length} Siswa</td>
                    </tr>
                    <tr>
                        <td className="p-1 border">Pelanggaran yang dilakukan</td>
                        <td className="p-1 border font-semibold">: {violation?.violation_types.length} Pelanggaran</td>
                    </tr>
                    <tr>
                        <td className="p-1 border">Total Poin</td>
                        <td className="p-1 border font-semibold">: {violation?.violation_types.reduce((acc, curr) => acc + curr.point, 0)} poin</td>
                    </tr>
                </tbody>
            </table>
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