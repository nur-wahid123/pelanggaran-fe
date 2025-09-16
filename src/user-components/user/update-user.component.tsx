import { LucideEdit3, Pencil, Trash } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { axiosInstance } from "@/util/request.util";
import ENDPOINT from "@/config/url";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { useCallback, useEffect, useState } from "react";
import { User } from "@/objects/user.object";
import { RoleEnum } from "@/enums/role.enum";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select";
import { convertStringToEnum } from "@/enums/chart-type.enum";
import { Dialog as ConfirmDialog, DialogContent as ConfirmDialogContent, DialogHeader as ConfirmDialogHeader, DialogTitle as ConfirmDialogTitle, DialogFooter as ConfirmDialogFooter } from "@/components/ui/dialog";

const config = {
    url: ENDPOINT.CREATE_USER,
    key_word: "user"
};

export default function EditUser({ id, reFetch }: { id: number | undefined, reFetch: () => void }) {
    const [openEdit, setOpenEdit] = useState(false);
    const [openEditConfirm, setOpenEditConfirm] = useState(false);
    const [openDelete, setOpenDelete] = useState(false);
    const [data, setData] = useState({} as User);
    const toast = useToast();
    const [value, setValue] = useState({
        name: "",
        username: "",
        email: "",
        role: RoleEnum.USER,
    });

    useEffect(() => {
        if (data) {
            setValue({
                name: data.name ?? "",
                username: data.username ?? "",
                email: data.email ?? "",
                role: data.role ?? RoleEnum.USER
            });
        }
    }, [data]);

    const fetchData = useCallback(async () => {
        const subjectRes = await axiosInstance.get(`${ENDPOINT.DETAIL_USER}/${id}`);
        setData(subjectRes.data.data);
    }, [id]);

    useEffect(() => {
        if (openEdit === true) {
            fetchData();
        }
    }, [openEdit, fetchData]);

    // For edit confirmation dialog
    const [pendingEdit, setPendingEdit] = useState(false);

    const handleEditSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setOpenEditConfirm(true);
    };

    const handleEditConfirm = async () => {
        setPendingEdit(true);
        await axiosInstance.patch(`${ENDPOINT.UPDATE_USER}/${id}`, value)
            .then(() => {
                reFetch();
                toast.toast({
                    title: "Berhasil!",
                    description: `Data ${config.key_word.toWellFormed()} berhasil diperbarui.`,
                    variant: "default",
                });
                setOpenEdit(false);
                setOpenEditConfirm(false);
            })
            .catch((err) => {
                console.error(err);
                if (err.code === 400) {
                    toast.toast({ title: "Error", description: err.response.data.message[0], variant: "destructive" });
                } else {
                    toast.toast({ title: "Error", description: err.response.data.message, variant: "destructive" });
                }
            })
            .finally(() => {
                setPendingEdit(false);
            });
    };

    // Delete dialog logic
    const handleDelete = async () => {
        await axiosInstance.delete(`${ENDPOINT.DELETE_USER}/${id}`)
            .then(() => {
                reFetch();
                toast.toast({
                    title: "Berhasil!",
                    description: `${config.key_word.toWellFormed()} berhasil dihapus.`,
                    variant: "default",
                });
                setOpenDelete(false);
            })
            .catch((err) => {
                console.error(err);
                if (err.code === 400) {
                    toast.toast({ title: "Error", description: err.response.data.message[0], variant: "destructive" });
                } else {
                    toast.toast({ title: "Error", description: err.response.data.message, variant: "destructive" });
                }
                setOpenDelete(false);
            });
    };

    return (
        <>
            <Dialog open={openEdit} onOpenChange={setOpenEdit}>
                <DialogTrigger asChild>
                    <div>
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Button variant="outline" className="flex items-center gap-1">
                                    <Pencil className="w-4 h-4 mr-1" />
                                    Edit
                                </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                                <p>
                                    Edit {value?.name ? <b>{value.name}</b> : config.key_word.toWellFormed()}
                                </p>
                            </TooltipContent>
                        </Tooltip>
                    </div>
                </DialogTrigger>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>
                            <span className="flex items-center gap-2">
                                <Pencil className="w-5 h-5" />
                                Edit {`${config.key_word.toWellFormed()}`}
                            </span>
                        </DialogTitle>
                    </DialogHeader>
                    <form onSubmit={handleEditSubmit} className="flex flex-col gap-4">
                        <Label>Nama {`${config.key_word.toWellFormed()}`}</Label>
                        <Input
                            type="text"
                            value={value.name}
                            onChange={(e) => setValue({ ...value, name: e.target.value })}
                            placeholder="Masukkan nama"
                        />
                        <Label>Username {`${config.key_word.toWellFormed()}`}</Label>
                        <Input
                            type="text"
                            value={value.username}
                            onChange={(e) => setValue({ ...value, username: e.target.value })}
                            placeholder="Masukkan username"
                        />
                        <Label>Email {`${config.key_word.toWellFormed()}`}</Label>
                        <Input
                            type="email"
                            value={value.email}
                            onChange={(e) => setValue({ ...value, email: e.target.value })}
                            placeholder="Masukkan email"
                        />
                        <div className="flex gap-3 items-center">
                            <Label>Role</Label>
                            <Select value={value.role} onValueChange={(e) => {
                                const vl = convertStringToEnum(e, RoleEnum);
                                if (vl !== undefined) {
                                    setValue({ ...value, role: vl });
                                }
                            }}>
                                <SelectTrigger className="w-[180px]">
                                    <SelectValue placeholder="Pilih Role" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectGroup>
                                        <SelectLabel>Role</SelectLabel>
                                        <SelectItem value={RoleEnum.USER}>User</SelectItem>
                                        <SelectItem value={RoleEnum.ADMIN}>Admin</SelectItem>
                                    </SelectGroup>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="flex gap-2 mt-2">
                            <Button type="submit" className="flex items-center gap-2 font-semibold">
                                Simpan Perubahan <LucideEdit3 className="w-5" />
                            </Button>
                        </div>
                    </form>
                </DialogContent>
            </Dialog>
            {/* Edit confirmation dialog */}
            <ConfirmDialog open={openEditConfirm} onOpenChange={setOpenEditConfirm}>
                <ConfirmDialogContent>
                    <ConfirmDialogHeader>
                        <ConfirmDialogTitle>
                            Konfirmasi Edit
                        </ConfirmDialogTitle>
                    </ConfirmDialogHeader>
                    <div>
                        Apakah Anda yakin ingin menyimpan perubahan pada {value?.name ? <b>{value.name}</b> : config.key_word.toWellFormed()}?
                    </div>
                    <ConfirmDialogFooter className="flex gap-2 justify-end mt-4">
                        <Button variant="outline" onClick={() => setOpenEditConfirm(false)} disabled={pendingEdit}>
                            Batal
                        </Button>
                        <Button onClick={handleEditConfirm} disabled={pendingEdit}>
                            {pendingEdit ? "Menyimpan..." : "Simpan"}
                        </Button>
                    </ConfirmDialogFooter>
                </ConfirmDialogContent>
            </ConfirmDialog>
            {/* Delete button and dialog */}
            <span>
                <Tooltip>
                    <TooltipTrigger asChild>
                        <Button
                            variant="destructive"
                            className="flex items-center gap-1"
                            onClick={() => setOpenDelete(true)}
                        >
                            <Trash className="w-4 h-4" />
                            <span className="hidden md:inline">Hapus</span>
                        </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                        <p>
                            Hapus {value?.name ? <b>{value.name}</b> : config.key_word.toWellFormed()}
                        </p>
                    </TooltipContent>
                </Tooltip>
            </span>
            <ConfirmDialog open={openDelete} onOpenChange={setOpenDelete}>
                <ConfirmDialogContent>
                    <ConfirmDialogHeader>
                        <ConfirmDialogTitle>
                            Konfirmasi Hapus
                        </ConfirmDialogTitle>
                    </ConfirmDialogHeader>
                    <div>
                        Apakah Anda yakin ingin menghapus {value?.name ? <b>{value.name}</b> : config.key_word.toWellFormed()}? Tindakan ini tidak dapat dibatalkan.
                    </div>
                    <ConfirmDialogFooter className="flex gap-2 justify-end mt-4">
                        <Button variant="outline" onClick={() => setOpenDelete(false)}>
                            Batal
                        </Button>
                        <Button variant="destructive" onClick={handleDelete}>
                            Hapus
                        </Button>
                    </ConfirmDialogFooter>
                </ConfirmDialogContent>
            </ConfirmDialog>
        </>
    );
}