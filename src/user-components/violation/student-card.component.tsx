import { Student } from "@/objects/student.object";
import { formatDateToExactString, formatDateToExactTime } from "@/util/date.util";
import { truncateName } from "@/util/util";

export default function StudentCard({ student }: { student: Student }) {
    return (
        <div className={"h-48 w-full gap-2 flex flex-col hover:border-slate-900 hover:scale-[99%] transition rounded-xl bg-white border border-slate-300 p-4 shadow-xl"}>
            <p className="text-xl text-center font-bold col-span-3">
                {student.name ? student.name.toUpperCase() : ''}
            </p>
            <div className="grid grid-cols-5 overflow-y-auto">
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
                <div className="overflow-auto col-span-2">
                    {student.violations?.map(violation => (
                        <p className="text-xs whitespace-nowrap p-1" key={violation.id}>| {violation.date ? formatDateToExactString(new Date(violation.date)) : ''} - <span className="text-slate-400">{violation.violation_types.reduce((acc, curr) => acc + curr.point, 0)} Poin</span></p>
                    ))}
                </div>
                <div className="overflow-auto col-span-2">
                    {Array.from(new Set(student.violations?.map(violation => violation.violation_types).flat().map(violation_types => violation_types.name))).map(name => {
                        const violation_type = student.violations?.map(violation => violation.violation_types).flat().filter(violation_types => violation_types.name === name)
                        return (
                            <p className="text-xs whitespace-nowrap p-1" key={name}>| <span className="text-slate-400">{violation_type?.length} Kali</span> - {name?.toUpperCase()}</p>
                        )
                    })}
                </div>
            </div>
        </div>
    );
}