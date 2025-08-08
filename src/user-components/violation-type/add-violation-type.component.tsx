"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "../../components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { AlertTriangle, PlusIcon } from "lucide-react";
import { axiosInstance } from "@/util/request.util";
import ENDPOINT from "@/config/url";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

export default function AddViolationType({ reFetch }: { reFetch: () => void }) {
    const [openAddViolationn, setOpenAddViolationn] = useState(false);
    const toast = useToast()
    const [value, setValue] = useState({
        name: "",
        point: 0,
    })

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        await axiosInstance.post(ENDPOINT.CREATE_VIOLATION_TYPE, value)
            .then(() => {
                reFetch();
                toast.toast({
                    title: "Success",
                    description: "Berhasil Tambahkan Extra",
                    variant: "default",
                })
                setOpenAddViolationn(false);
                setValue({
                    name: "",
                    point:0
                })
            })
            .catch((error) => {
                if (error.code === 400) {
                    toast.toast({
                        title: "Error",
                        description: error.response.data.message[0],
                        variant: "destructive",
                    })
                } else {
                    toast.toast({
                        title: "Error",
                        description: error.response.data.message,
                        variant: "destructive",
                    })
                }
            })
    };

    return (
        <Dialog open={openAddViolationn} onOpenChange={setOpenAddViolationn}>
            <DialogTrigger asChild>
                <Button className="flex gap-3 shadow hover:shadow-md" variant="outline"><AlertTriangle className="w-4" />Tambah Jenis Pelanggaran <PlusIcon className="w-4" /></Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Tambah Jenis Pelanggaran</DialogTitle>
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
                        Tambah Pelanggaran
                    </Button>
                </form>
            </DialogContent>
        </Dialog>
    );
}
