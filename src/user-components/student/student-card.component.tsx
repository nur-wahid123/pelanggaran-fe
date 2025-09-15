import { Student } from "@/objects/student.object";
import { Hash, GraduationCap, Users, AlertTriangle } from "lucide-react";
import Link from "next/link";
import React from "react";

export default React.forwardRef<HTMLDivElement, { student: Student; isLoading: boolean }>(function StudentCard(
    { student },
    ref
) {
    const totalViolations = student.violations?.length || 0;
    const totalPoints = student.total_points ?? 0;

    // Status logic
    let status = "Tidak ada pelanggaran";
    if (totalPoints > 30) status = "Perhatian Tinggi";
    else if (totalPoints > 15) status = "Perhatian Sedang";
    else if (totalPoints > 0) status = "Perhatian Rendah";

    // Make the whole card clickable to go to the detail page
    return (
        <Link
            href={`/dashboard/student/${student.national_student_id}`}
            tabIndex={0}
            className="block"
        >
            <div
                ref={ref}
                className="relative rounded-xl border border-gray-200 bg-white dark:bg-gray-900 p-4 md:p-6 shadow-sm flex flex-col gap-4 transition hover:shadow-md cursor-pointer"
            >
                <div className="flex items-center gap-3">
                    <div className="h-12 w-12 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center">
                        <span className="text-lg font-bold text-primary">
                            {student.name?.charAt(0).toUpperCase() || "?"}
                        </span>
                    </div>
                    <div className="flex-1">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">{student.name || "N/A"}</h3>
                        <p className="text-sm text-muted-foreground">Siswa</p>
                    </div>
                    <span
                        className={
                            "inline-block rounded px-3 py-1 text-xs font-semibold " +
                            (totalPoints > 30
                                ? "bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-200"
                                : totalPoints > 15
                                ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
                                : totalPoints > 0
                                ? "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
                                : "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-300")
                        }
                    >
                        {totalPoints} Poin
                    </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="flex items-center gap-2">
                        <Hash className="h-4 w-4 text-blue-500" />
                        <div>
                            <p className="text-sm text-muted-foreground">NISN</p>
                            <p className="font-semibold">{student.national_student_id || "N/A"}</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <GraduationCap className="h-4 w-4 text-green-500" />
                        <div>
                            <p className="text-sm text-muted-foreground">NIS</p>
                            <p className="font-semibold">{student.school_student_id || "N/A"}</p>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="flex items-center gap-2">
                        <AlertTriangle className="h-4 w-4 text-orange-500" />
                        <div>
                            <p className="text-sm text-muted-foreground">Total Pelanggaran</p>
                            <p className="font-semibold">{totalViolations} Kali</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <Users className="h-4 w-4 text-purple-500" />
                        <div>
                            <p className="text-sm text-muted-foreground">Status</p>
                            <p className="font-semibold">{status}</p>
                        </div>
                    </div>
                </div>
            </div>
        </Link>
    );
});