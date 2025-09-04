import { ViolationType } from "@/objects/violation-type.object";
import useInfiniteScroll from "../hook/useInfiniteScroll.hook";
import { ViolationTypeEnum } from "@/enums/violation-type.enum";
import ENDPOINT from "@/config/url";
import { useRouter } from "next/navigation";

export default function ViolationTypeCard({ filter }: { filter: { search: string, start_date: string, finish_date: string, type: ViolationTypeEnum } }) {
    const { data, loading, ref } = useInfiniteScroll<ViolationType, HTMLDivElement>({ filter, take: 20, url: ENDPOINT.MASTER_VIOLATION })
    const router = useRouter();
    return (
        <div className="flex flex-col gap-2 max-h-[27rem] overflow-y-auto">
            {data.map((violation_type, i) => {
                if (data.length === i + 1) {
                    return (
                        <div onClick={() => router.push(`/dashboard/violation-type/${violation_type.id}`)} key={i} ref={ref} className={" w-full gap-2 grid cursor-pointergrid-cols-2 hover:border-slate-900 hover:scale-[99%] transition rounded-xl bg-white border border-slate-300 p-4 shadow-xl"}>
                            <p className="text-md flex items-center font-semibold">
                                {violation_type.name ? violation_type.name : ''}
                            </p>
                            <div className="grid grid-cols-3">
                                <div className="text-sm text-slate-600 grid grid-rows-3 col-span-2">
                                    <p className="flex items-center">Poin</p>
                                    <p className="flex items-center">Pelanggaran Dilakukan</p>
                                    <p className="flex items-center">Siswa pelanggar</p>
                                </div>
                                <div className="text-sm font-semibold text-slate-600 grid grid-rows-3">
                                    <p className="flex items-center">{violation_type.point} Poin</p>
                                    <p className="flex items-center">{violation_type.violations?.length} Kali</p>
                                    <p className="flex items-center">{[...new Set(violation_type.violations?.flatMap(v => v.students ?? []).map(student => student?.id))].length} Siswa</p>
                                </div>
                            </div>
                        </div>
                    )
                } else {
                    return (
                        <div onClick={() => router.push(`/dashboard/violation-type/${violation_type.id}`)} key={i} className={" w-full gap-2 grid cursor-pointergrid-cols-2 hover:border-slate-900 hover:scale-[99%] transition rounded-xl bg-white border border-slate-300 p-4 shadow-xl"}>
                            <p className="text-md flex items-center font-semibold">
                                {violation_type.name ? violation_type.name : ''}
                            </p>
                            <div className="grid grid-cols-3">
                                <div className="text-sm text-slate-600 grid grid-rows-3 col-span-2">
                                    <p className="flex items-center">Poin</p>
                                    <p className="flex items-center">Pelanggaran Dilakukan</p>
                                    <p className="flex items-center">Siswa pelanggar</p>
                                </div>
                                <div className="text-sm font-semibold text-slate-600 grid grid-rows-3">
                                    <p className="flex items-center">{violation_type.point} Poin</p>
                                    <p className="flex items-center">{violation_type.violations?.length} Kali</p>
                                    <p className="flex items-center">{[...new Set(violation_type.violations?.flatMap(v => v.students ?? []).map(student => student?.id))].length} Siswa</p>
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