import { ViolationType } from "@/objects/violation-type.object";
import { toTitleCase } from "@/util/util";
import EditViolationType from "./update-violation-type.component";
import { useRouter } from "next/navigation";
import { axiosInstance } from "@/util/request.util";
import ENDPOINT from "@/config/url";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Trash } from "lucide-react";
import Link from "next/link";

export default function ViolationTypeCard({ reFetch, violationType, ref, isLoading }: { reFetch: () => void, isLoading: boolean, violationType: ViolationType, ref?: any }) {
    const toaster = useToast();

    function handleDelete(id: number) {
        if (violationType.violations.length > 0) {
            toaster.toast({
                title: "Error",
                description: "Pelanggaran ini sudah dipakai, tidak bisa dihapus",
                variant: "destructive",
            })
            return;
        }
        const confirm = window.confirm("Apakah anda yakin ingin menghapus pelanggaran ini?");
        if (!confirm) {
            return;
        }

        axiosInstance.delete(`${ENDPOINT.DELETE_VIOLATION_TYPE}/${id}`).then(() => {
            toaster.toast({
                title: "Success",
                description: "Pelanggaran berhasil dihapus",
                variant: "default",
            })
            reFetch();
        })
            .catch(() => {
                toaster.toast({
                    title: "Error",
                    description: "Gagal menghapus Pelanggaran",
                    variant: "destructive",
                })
            });
    }
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
            <div className="flex gap-3 justify-center md:justify-end">
                <EditViolationType violationTypeId={violationType.id} reFetch={reFetch} />
                <Button disabled={isLoading} onClick={() => { handleDelete(violationType.id ?? 0) }}>Hapus <Trash className="w-4"></Trash></Button>
            </div>
        </Link>
    )
}