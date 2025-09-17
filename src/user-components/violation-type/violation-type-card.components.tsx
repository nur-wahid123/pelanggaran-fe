import { ViolationType } from "@/objects/violation-type.object";
import { toTitleCase } from "@/util/util";
import Link from "next/link";
import { AlertTriangle, TrendingUp, Users, Hash, Star } from "lucide-react";

export default function ViolationTypeCard({
  violationType,
  ref,
}: {
  reFetch: () => void;
  isLoading: boolean;
  violationType: ViolationType;
  ref?: any;
}) {
  const totalViolations = violationType.violations?.length || 0;
  const uniqueStudents = [
    ...new Set(
      violationType.violations
        ?.flatMap((v) => v.students ?? [])
        .map((student) => student?.id)
    ),
  ].length;
  const avgPerStudent =
    uniqueStudents > 0
      ? (totalViolations / uniqueStudents).toFixed(1)
      : "0";

  return (
    <Link
      href={`/dashboard/violation-type/${violationType.id}`}
      ref={ref}
      className="flex border w-full border-slate-200 flex-col md:flex-row gap-4 cursor-pointer hover:shadow-lg transition-all duration-200 hover:border-primary/50 p-4 rounded-xl md:justify-between bg-white dark:bg-gray-800 shadow-md group"
      title={`Lihat detail ${toTitleCase(violationType.name ?? "")}`}
    >
      <div className="flex items-center gap-4 w-full">
        <div className="h-12 w-12 bg-gradient-to-tr from-yellow-100 to-orange-200 dark:from-orange-900 dark:to-yellow-900 rounded-full flex items-center justify-center flex-shrink-0 shadow-inner">
          <AlertTriangle className="h-6 w-6 text-orange-500 dark:text-yellow-400" />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="text-lg font-bold break-words leading-tight text-primary group-hover:text-orange-600 transition-colors duration-150">
            {toTitleCase(violationType.name ?? "")}
          </h3>
          <div className="flex items-center gap-2 mt-1">
            <Star className="h-4 w-4 text-yellow-400" />
            <span className="text-sm font-medium text-yellow-700 dark:text-yellow-300">
              {violationType.point} Poin
            </span>
          </div>
        </div>
        <div className="flex flex-col items-end gap-1 min-w-[120px]">
          {totalViolations === 0 ? (
            <span className="text-xs px-2 py-1 rounded-full bg-green-100 text-green-700 font-semibold flex items-center gap-1">
              <Users className="h-3 w-3" />
              Tidak Pernah Dilanggar
            </span>
          ) : (
            <span className="text-xs px-2 py-1 rounded-full bg-orange-100 text-orange-700 font-semibold flex items-center gap-1">
              <TrendingUp className="h-3 w-3" />
              {totalViolations} Kali Dilanggar
            </span>
          )}
        </div>
      </div>
      <div className="flex flex-wrap gap-4 mt-3 md:mt-0 md:ml-16">
        <div className="flex items-center gap-2 bg-blue-50 dark:bg-blue-900/30 px-3 py-1 rounded-lg">
          <TrendingUp className="h-4 w-4 text-blue-500" />
          <span className="text-sm text-blue-700 dark:text-blue-200 font-medium">
            {totalViolations} Pelanggaran
          </span>
        </div>
        <div className="flex items-center gap-2 bg-green-50 dark:bg-green-900/30 px-3 py-1 rounded-lg">
          <Users className="h-4 w-4 text-green-500" />
          <span className="text-sm text-green-700 dark:text-green-200 font-medium">
            {uniqueStudents} Siswa
          </span>
        </div>
        <div className="flex items-center gap-2 bg-purple-50 dark:bg-purple-900/30 px-3 py-1 rounded-lg">
          <Hash className="h-4 w-4 text-purple-500" />
          <span className="text-sm text-purple-700 dark:text-purple-200 font-medium">
            Rata-rata: {avgPerStudent}x/siswa
          </span>
        </div>
      </div>
    </Link>
  );
}