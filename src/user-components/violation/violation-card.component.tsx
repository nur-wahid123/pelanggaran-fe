import { Violation } from "@/objects/violation.object";
import { formatDateToExactString, formatDateToExactTime } from "@/util/date.util";
import useInfiniteScroll from "../hook/useInfiniteScroll.hook";
import ENDPOINT from "@/config/url";
import { ViolationTypeEnum } from "@/enums/violation-type.enum";
import { useRouter } from "next/navigation";

export default function ViolationCard({ filter }: { filter: { search: string, start_date: string, finish_date: string, type: ViolationTypeEnum } }) {
    const { data, loading, ref } = useInfiniteScroll<Violation, HTMLDivElement>({ filter, take: 20, url: ENDPOINT.MASTER_VIOLATION })
    const route = useRouter();
    return (
        <div className="flex flex-col gap-2 max-h-[27rem] overflow-y-auto">
            {data.map((violation, i) => {
                if (data.length === i + 1) {
                    return (
                        <div ref={ref} onClick={() => route.push(`/dashboard/violation/${violation.id}`)} key={i} className={"h-72 md:h-32 w-full cursor-pointer gap-2 flex flex-row md:flex-col hover:border-slate-900 hover:scale-[99%] transition rounded-xl bg-white border border-slate-300 p-4 shadow-xl"}>
                            <div className="grid grid-rows-3 md:grid-cols-3">
                                <div className="flex gap-3">
                                    <p className="text-xl items-center md:items-start flex font-semibold">
                                        {violation.date ? formatDateToExactString(new Date(violation.date)) : ''}
                                    </p>
                                    <p className="flex items-center">
                                        {violation.date ? formatDateToExactTime(new Date(violation.date)) : ''}
                                    </p>
                                </div>
                                <div className="text-sm text-slate-600 grid gap-2 grid-rows-2 md:grid-cols-2">
                                    <p className="flex items-center">Siswa : {violation.students?.length} Siswa</p>
                                    <p className="flex items-center">Poin Per Siswa : {violation.violation_types?.reduce((acc, curr) => acc + curr.point, 0)} Poin</p>
                                </div>
                                <p className="text-sm whitespace-nowrap text-slate-600"> Catatan : {violation.note ? violation.note : '-'}</p>
                                <p className="text-md text-start mdd:text-end text-slate-400">
                                    {violation.creator ? violation.creator.name : ''}
                                </p>
                            </div>
                        </div>
                    )
                } else {
                    return (
                        <div onClick={() => route.push(`/dashboard/violation/${violation.id}`)} key={i} className={"h-72 md:h-32 w-full cursor-pointer gap-2 flex flex-row md:flex-col hover:border-slate-900 hover:scale-[99%] transition rounded-xl bg-white border border-slate-300 p-4 shadow-xl"}>
                            <div className="grid grid-rows-3 md:grid-cols-3">
                                <div className="flex gap-3">
                                    <p className="text-xl items-center md:items-start flex font-semibold">
                                        {violation.date ? formatDateToExactString(new Date(violation.date)) : ''}
                                    </p>
                                    <p className="flex items-center">
                                        {violation.date ? formatDateToExactTime(new Date(violation.date)) : ''}
                                    </p>
                                </div>
                                <div className="text-sm text-slate-600 grid gap-2 grid-rows-2 md:grid-cols-2">
                                    <p className="flex items-center">Siswa : {violation.students?.length} Siswa</p>
                                    <p className="flex items-center">Poin Per Siswa : {violation.violation_types?.reduce((acc, curr) => acc + curr.point, 0)} Poin</p>
                                </div>
                                <p className="text-sm whitespace-nowrap text-slate-600"> Catatan : {violation.note ? violation.note : '-'}</p>
                                <p className="text-md text-start mdd:text-end text-slate-400">
                                    {violation.creator ? violation.creator.name : ''}
                                </p>
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