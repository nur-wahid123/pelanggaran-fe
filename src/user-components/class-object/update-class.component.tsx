import { Edit, LucideEdit3 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { axiosInstance } from "@/util/request.util";
import ENDPOINT from "@/config/url";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { useCallback, useEffect, useState } from "react";
import { ClassObject } from "@/objects/class.object";

export default function EditClass({ classId, reFetch }: { classId: number | undefined, reFetch: () => void }) {
    const [openEditClass, setOpenEditClass] = useState(false);
    const [classObject, setClass] = useState({} as ClassObject);
    const toast = useToast()
    const [value, setValue] = useState({
        name: "",
    })

    useEffect(() => {
        if (classObject) {
            setValue({
                name: classObject.name ?? "",
            })
        }
    }, [classObject]);


    const fetchData = useCallback(async () => {
        const subjectRes = await axiosInstance.get(`${ENDPOINT.DETAIL_CLASS}/${classId}`);
        setClass(subjectRes.data.data);
    }, [classId])

    useEffect(() => {
        if (openEditClass === true) {
            fetchData();
        }
    }, [openEditClass, fetchData]);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        await axiosInstance.patch(`${ENDPOINT.UPDATE_CLASS}/${classId}`, value)
            .then(() => {
                toast.toast({
                    title: "Success",
                    description: "Berhasil edit Kelas",
                    variant: "default",
                });
                reFetch();
                setOpenEditClass(false);
            })
            .catch((err) => {
                console.log(err)
                if (err.code === 400) {
                    toast.toast({ title: "Error", description: err.response.data.message[0], variant: "destructive" })
                } else {
                    toast.toast({ title: "Error", description: err.response.data.message, variant: "destructive" })
                }
            })
    }
    return (
        <Dialog open={openEditClass} onOpenChange={setOpenEditClass}>
            <DialogTrigger asChild>
                <div>
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Button>Edit <Edit className="w-4"></Edit></Button>
                        </TooltipTrigger>
                        <TooltipContent>
                            <p>Edit {value?.name ?? "Extra"}</p>
                        </TooltipContent>
                    </Tooltip>
                </div>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Edit Kelas</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                    <Label>Nama Kelas</Label>
                    <Input
                        type="text"
                        value={value.name}
                        onChange={(e) => setValue({ ...value, name: e.target.value })}
                    />
                    <Button type="submit">
                        Edit Kelas <LucideEdit3></LucideEdit3>
                    </Button>
                </form>
            </DialogContent>
        </Dialog>)
}