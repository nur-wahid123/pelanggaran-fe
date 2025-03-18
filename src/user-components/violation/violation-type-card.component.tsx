import { ViolationType } from "@/objects/violation-type.object";
import { Violation } from "@/objects/violation.object";
import { formatDateToExactString, formatDateToExactTime } from "@/util/date.util";

export default function ViolationTypeCard({ violation_type }: { violation_type: ViolationType }) {
    return (
        <div className={"h-36 w-full gap-2 grid grid-cols-4 hover:border-slate-900 hover:scale-[99%] transition rounded-xl bg-white border border-slate-300 p-4 shadow-xl"}>
            <p className="text-md flex items-center text-center font-semibold">
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
            {/* <p className="text-sm whitespace-nowrap text-slate-600"> Catatan : {violation.note ? violation.note : '-'}</p> */}
            <div className="overflow-auto">
                {violation_type.violations?.map(violation => (
                    <p className="text-xs whitespace-nowrap p-1" key={violation.id}>| {violation.date ? formatDateToExactString(new Date(violation.date)) : ''} - <span className="text-slate-400">{violation.students?.length} Siswa</span></p>
                ))}
            </div>
            <div className="overflow-auto">
                {Array.from(new Set(violation_type.violations?.map(violation => violation.students).flat().map(student => student?.name))).map((name,i) => {
                    const student = violation_type.violations?.map(violation => violation.students).flat().filter(student => student?.name === name)
                    return (
                        <p className="text-xs whitespace-nowrap p-1" key={name}>| {name?.toUpperCase()} - <span className="text-slate-400">{student.length} Kali</span></p>
                    )
                })}
            </div>
            {/* <div className="grid grid-cols-2 overflow-y-auto">
            </div> */}
        </div>
    );
}