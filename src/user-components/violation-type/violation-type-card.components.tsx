import { ViolationType } from "@/objects/violation-type.object";
import { toTitleCase } from "@/util/util";
import Link from "next/link";

export default function ViolationTypeCard({ violationType, ref }: { reFetch: () => void, isLoading: boolean, violationType: ViolationType, ref?: any }) {

    return (
        <Link href={`/dashboard/violation-type/${violationType.id}`} ref={ref} className="flex border w-full border-slate-300 flex-col md:flex-row gap-4 cursor-pointer hover:font-bold p-3 rounded-lg md:justify-between bg-white dark:bg-gray-800 shadow-md">
            <div className="flex text-center md:justify-between w-full flex-col md:flex-row gap-2 justify-between">
                <div className="font-semibold text-center md:text-left self-center">{toTitleCase(violationType.name ?? "")}</div>
                <div>
                    <div className="text-sm">{violationType.point} Poin</div>
                    {violationType.violations.length === 0 ?
                        <div className="text-sm text-green-700">
                            Tidak Pernah Dilanggar
                        </div>
                        :
                        <div className="text-sm">
                            {`${violationType.violations.length} Kali Dilanggar`}
                        </div>
                    }
                </div>
            </div>
        </Link>
    )
}