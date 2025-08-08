import { Student } from "@/objects/student.object";
import { DateRange } from "@/util/date.util";
import useInfiniteScroll from "../hook/useInfiniteScroll.hook";
import ENDPOINT from "@/config/url";
import { ViolationTypeEnum } from "@/enums/violation-type.enum";

export default function StudentCard({ filter }: { filter: { search: string, start_date: string, finish_date: string, type: ViolationTypeEnum } }) {
    const { data, loading, ref } = useInfiniteScroll<Student, HTMLDivElement>({ filter, take: 20, url: ENDPOINT.MASTER_VIOLATION })
    return (
        <div className="flex flex-col gap-2 max-h-[27rem] overflow-y-auto">
            {data.map((student, i) => {
                if (data.length === i + 1) {
                    return (
                        <div key={i} ref={ref} className={"h-48 w-full gap-2 flex flex-col hover:border-slate-900 hover:scale-[99%] transition rounded-xl bg-white border border-slate-300 p-4 shadow-xl"}>
                            <p className="text-xl text-center font-bold col-span-3">
                                {student.name ? student.name.toUpperCase() : ''}
                            </p>
                            <div className="grid grid-cols-2 col-span-1">
                                <div className="text-sm text-slate-600 grid grid-rows-4">
                                    <p className="flex items-end">NISN</p>
                                    <p className="flex items-end">NIS</p>
                                    <p className="flex items-end">Pelanggaran</p>
                                    <p className="flex items-end">Poin Siswa</p>
                                </div>
                                <div className="text-sm font-semibold text-slate-600 grid grid-rows-4">
                                    <p className="flex items-center">{student.national_student_id ? student.national_student_id : ''}</p>
                                    <p className="flex items-center">{student.school_student_id ? student.school_student_id : ''}</p>
                                    <p className="flex items-center">{student.violations?.length} Kali</p>
                                    <p className="flex items-center">{student.violations && student.violations?.reduce((acc, curr) => acc + curr.violation_types?.reduce((acc, curr) => acc + curr.point, 0), 0)} Poin</p>
                                </div>
                            </div>
                        </div>
                    )
                } else {
                    return (
                        <div key={i} className={"h-48 w-full gap-2 flex flex-col hover:border-slate-900 hover:scale-[99%] transition rounded-xl bg-white border border-slate-300 p-4 shadow-xl"}>
                            <p className="text-xl text-center font-bold col-span-3">
                                {student.name ? student.name.toUpperCase() : ''}
                            </p>
                            <div className="grid grid-cols-2 col-span-1">
                                <div className="text-sm text-slate-600 grid grid-rows-4">
                                    <p className="flex items-end">NISN</p>
                                    <p className="flex items-end">NIS</p>
                                    <p className="flex items-end">Pelanggaran</p>
                                    <p className="flex items-end">Poin Siswa</p>
                                </div>
                                <div className="text-sm font-semibold text-slate-600 grid grid-rows-4">
                                    <p className="flex items-center">{student.national_student_id ? student.national_student_id : ''}</p>
                                    <p className="flex items-center">{student.school_student_id ? student.school_student_id : ''}</p>
                                    <p className="flex items-center">{student.violations?.length} Kali</p>
                                    <p className="flex items-center">{student.violations && student.violations?.reduce((acc, curr) => acc + curr.violation_types?.reduce((acc, curr) => acc + curr.point, 0), 0)} Poin</p>
                                </div>
                            </div>
                        </div>

                    )
                }
            })}
            {loading && (
                <div className={"h-36 w-full justify-center rounded-xl bg-white text-md text-center flex items-center font-semibold"}>
                    Loading.....
                </div>
            )}
            {data.length === 0 && !loading && (
                <div className={"h-36 w-full justify-center rounded-xl bg-white text-md text-center flex items-center font-semibold"}>
                    {filter.search === '' ? 'Data Kosong' : 'Data tidak ditemukan'}
                </div>
            )}
        </div>
    );
}