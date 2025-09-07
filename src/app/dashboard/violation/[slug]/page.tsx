'use client'
import { Separator } from "@/components/ui/separator"
import { Textarea } from "@/components/ui/textarea"
import ENDPOINT from "@/config/url"
import { Violation } from "@/objects/violation.object"
import { PreviewImage } from "@/user-components/preview-image.component"
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
    const fetchImage = useCallback(async (violation: Violation) => {
        await axiosInstance.get(`${ENDPOINT.LIST_IMAGE}/${violation.image?.id}`).then((res) => {
            setImages(res.data.data)
        })
    }, [violation])
    
    const fetchData = useCallback(async () => {
        await axiosInstance.get(`${ENDPOINT.DETAIL_VIOLATION}/${violationId}`).then((res) => {
            setViolation(res.data.data)
            if (!res.data.data.image) {
                return
            }
            fetchImage(res.data.data)
        })
    }, [violation, fetchImage])

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
            <Separator className="my-4"/>
            <div>
                <h1 className="scroll-m-20 text-xl mb-4 font-extrabold tracking-tight lg:text-2xl">
                    Catatan
                </h1>
                <Textarea disabled className="disabled:text-black" value={violation?.note ? violation?.note : '-'}></Textarea>
            </div>
            <Separator className="my-4"/>
            <h1 className="scroll-m-20 text-xl mb-4 font-extrabold tracking-tight lg:text-2xl">
                Siswa
            </h1>
            <div className="flex gap-2 flex-col">
                {violation?.students.map((st) => (
                    <Link href={`/dashboard/student/${st.national_student_id}`} className="grid cursor-pointer hover:font-bold" key={st.id}>
                        <div className="flex gap-2 w-full justify-between border p-2 border-slate-300 rounded-lg shadow-md">
                            <p>{st.name}</p>
                            <p>{st.national_student_id}</p>
                        </div>
                    </Link>
                ))}
            </div>
            <Separator className="my-4"/>
            <h1 className="scroll-m-20 text-xl mb-4 font-extrabold tracking-tight lg:text-2xl">
                Pelanggaran
            </h1>
            <div className="flex gap-2 flex-col">
                {violation?.violation_types.map((vt) => (
                    <Link href={`/dashboard/violation-type/${vt.id}`} className="flex hover:font-bold cursor-pointer gap-2" key={vt.id}>
                        <div className="flex gap-2 w-full justify-between border p-2 border-slate-300 rounded-lg shadow-md">
                            <p>{vt.name}</p>
                            <p className="font-semibold min-w-16"> {vt.point} Poin</p>
                        </div>
                    </Link>
                ))}
            </div>
            <Separator className="my-4"/>
            {violation?.image &&
                <div>
                    <h1 className="scroll-m-20 text-xl mb-4 font-extrabold tracking-tight lg:text-2xl">
                        Gambar
                    </h1>
                    <div className="flex gap-2 flex-wrap">
                        {images.map((img) => {
                            return (
                                <div key={img}>
                                    <PreviewImage src={`${ENDPOINT.DETAIL_IMAGE}/${img}`} alt="image" />
                                </div>
                            )
                        })}
                    </div>
                </div>
            }
        </div>
    )
}