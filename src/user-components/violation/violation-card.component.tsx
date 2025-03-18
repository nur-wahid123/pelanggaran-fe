import { Violation } from "@/objects/violation.object";
import { formatDateToExactString, formatDateToExactTime } from "@/util/date.util";

export default function ViolationCard({ violation }: { violation: Violation }) {
    return <div className={"h-48 w-full gap-2 flex flex-col hover:border-slate-900 hover:scale-[99%] transition rounded-xl bg-white border border-slate-300 p-4 shadow-xl"}>
        <div className="grid grid-cols-3">
            <div className="flex gap-3">
                <p className="text-xl font-semibold">
                    {violation.date ? formatDateToExactString(new Date(violation.date)) : ''}
                </p>
                <p className="flex items-center">
                    {violation.date ? formatDateToExactTime(new Date(violation.date)) : ''}
                </p>
            </div>
            <div className="text-sm text-slate-600 grid grid-cols-2">
                <p className="flex items-center">Siswa : {violation.students?.length} Siswa</p>
                <p className="flex items-center">Poin Per Siswa : {violation.violation_types?.reduce((acc, curr) => acc + curr.point, 0)} Poin</p>
            </div>
            <div>
                <p className="text-md text-end text-slate-400">
                    {violation.creator ? violation.creator.name : ''}
                </p>
            </div>
        </div>
        <p className="text-sm whitespace-nowrap text-slate-600"> Catatan : {violation.note ? violation.note : '-'}</p>
        <div className="grid grid-cols-2 overflow-y-auto">
            <div className="overflow-auto">
                {violation.students?.map(student => (
                    <p className="text-xs whitespace-nowrap p-1" key={student.id}>| {student.name?.toUpperCase()} - <span className="text-slate-400">{student.national_student_id}</span></p>
                ))}
            </div>
            <div className="overflow-auto">
                {violation.violation_types?.map(violation_types => (
                    <p className="text-xs whitespace-nowrap p-1" key={violation_types.id}>| {violation_types.name?.toUpperCase()} - <span className="text-slate-400">{violation_types.point} Poin</span></p>
                ))}
            </div>
        </div>
    </div>;
}