import React from "react";
import { Edit, LucideEdit3 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { ViolationType } from "@/objects/violation-type.object";
import { axiosInstance } from "@/util/request.util";
import ENDPOINT from "@/config/url";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

export default function EditViolationType({ violationTypeId, reFetch,text }: { text?:string,violationTypeId: number | undefined, reFetch: () => void }) {
    const [openEditViolationType, setOpenEditViolationType] = React.useState(false);
    const [violationType, setViolationType] = React.useState({} as ViolationType);
    const toast = useToast()
    const [value, setValue] = React.useState({
        name: "",
        point: 0
    })

    React.useEffect(() => {
        if (violationType) {
            setValue({
                name: violationType.name ?? "",
                point: violationType.point ?? 0
            })
        }
    }, [violationType]);


    const fetchData = React.useCallback(async () => {
        const subjectRes = await axiosInstance.get(`${ENDPOINT.DETAIL_VIOLATION_TYPE}/${violationTypeId}`);
        setViolationType(subjectRes.data.data);
    }, [violationTypeId])

    React.useEffect(() => {
        if (openEditViolationType === true) {
            fetchData();
        }
    }, [openEditViolationType, fetchData]);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        await axiosInstance.patch(`${ENDPOINT.UPDATE_VIOLATION_TYPE}/${violationTypeId}`, value)
            .then(() => {
                toast.toast({
                    title: "Success",
                    description: "Berhasil edit Pelanggaran",
                    variant: "default",
                });
                reFetch();
                setOpenEditViolationType(false);
            })
            .catch((err) => {
                if (err.code === 400) {
                    toast.toast({ title: "Error", description: err.response.data.message[0], variant: "destructive" })
                } else {
                    toast.toast({ title: "Error", description: err.response.data.message, variant: "destructive" })
                }
            })
    }
    return (
        <Dialog open={openEditViolationType} onOpenChange={setOpenEditViolationType}>
            <DialogTrigger asChild>
                <div>
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Button>{text ?? "Edit" }<Edit className="w-full md:w-4"></Edit></Button>
                        </TooltipTrigger>
                        <TooltipContent>
                            <p>Edit {value?.name ?? "Extra"}</p>
                        </TooltipContent>
                    </Tooltip>
                </div>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Edit Jenis Pelanggaran</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                    <Label>Nama Pelanggaran</Label>
                    <Input
                        type="text"
                        value={value.name}
                        onChange={(e) => setValue({ ...value, name: e.target.value })}
                    />
                    <Label>Poin Pelanggaran</Label>
                    <Input
                        type="number"
                        inputMode="numeric"
                        value={value.point}
                        onChange={(e) => setValue({ ...value, point: +e.target.value })}
                    />
                    <Button type="submit">
                        Edit Pelanggaran <LucideEdit3></LucideEdit3>
                    </Button>
                </form>
            </DialogContent>
        </Dialog>)
}