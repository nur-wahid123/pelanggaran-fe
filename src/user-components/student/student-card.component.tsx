import { Button } from "@/components/ui/button";
import { Student } from "@/objects/student.object";
import { toTitleCase } from "@/util/util";
import { Eye } from "lucide-react";
import Link from "next/link";

export default function StudentCard({ student, ref, isLoading }: { isLoading: boolean, student: Student, ref?: any }) {
    return (
        <div ref={ref} className="flex gap-4 flex-col md:flex-row md:justify-between items-center rounded-lg border border-gray-200 bg-white p-6 shadow hover:bg-gray-100 dark:border-gray-700 dark:bg-gray-800 dark:hover:bg-gray-700">
            <div className="flex items-center flex-col gap-2">
                <h5 className="mb-1 text-lg md:text-xl text-center font-medium text-gray-900 dark:text-white">{toTitleCase(student.name ?? "")}</h5>
                <span className="text-sm text-gray-500 dark:text-gray-400">{student.student_class?.name}</span>
                <span className="text-sm text-gray-500 dark:text-gray-400">{student.national_student_id}</span>
                <span className="text-sm text-gray-800 dark:text-gray-200">{student.violations?.length === 0 ? 'Tidak Ada Pelanggaran' : `${student.violations?.length} Kali Melakukan Pelanggaran`}</span>
            </div>
            <div>
                <Link
                    href={`/dashboard/student/${student.national_student_id}`}
                >
                    <Button disabled={isLoading}>
                        Detail <Eye />
                    </Button>
                </Link>
            </div>
        </div>
    )
}