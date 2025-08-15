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
import { User } from "@/objects/user.object";
import { RoleEnum } from "@/enums/role.enum";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select";
import { convertStringToEnum } from "@/enums/chart-type.enum";

const config = {
    url: ENDPOINT.CREATE_USER,
    key_word: "user"
}
export default function EditUser({ id, reFetch }: { id: number | undefined, reFetch: () => void }) {
    const [openEdit, setOpenEdit] = useState(false);
    const [data, setData] = useState({} as User);
    const toast = useToast()
    const [value, setValue] = useState({
        name: "",
        username: "",
        email: "",
        role: RoleEnum.USER,
    })

    useEffect(() => {
        if (data) {
            setValue({
                name: data.name ?? "",
                username: data.username ?? "",
                email: data.email ?? "",
                role: data.role ?? RoleEnum.USER
            })
        }
    }, [data]);


    const fetchData = useCallback(async () => {
        const subjectRes = await axiosInstance.get(`${ENDPOINT.DETAIL_USER}/${id}`);
        setData(subjectRes.data.data);
    }, [id])

    useEffect(() => {
        if (openEdit === true) {
            fetchData();
        }
    }, [openEdit, fetchData]);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        await axiosInstance.patch(`${ENDPOINT.UPDATE_CLASS}/${id}`, value)
            .then(() => {
                toast.toast({
                    title: "Success",
                    description: `Berhasil edit ${config.key_word.toWellFormed()}`,
                    variant: "default",
                });
                reFetch();
                setOpenEdit(false);
            })
            .catch((err) => {
                console.error(err)
                if (err.code === 400) {
                    toast.toast({ title: "Error", description: err.response.data.message[0], variant: "destructive" })
                } else {
                    toast.toast({ title: "Error", description: err.response.data.message, variant: "destructive" })
                }
            })
    }
    return (
        <Dialog open={openEdit} onOpenChange={setOpenEdit}>
            <DialogTrigger asChild>
                <div>
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Button>Edit <Edit className="w-4"></Edit></Button>
                        </TooltipTrigger>
                        <TooltipContent>
                            <p>Edit {value?.name ?? `${config.key_word.toWellFormed()}`}</p>
                        </TooltipContent>
                    </Tooltip>
                </div>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Edit {`${config.key_word.toWellFormed()}`}</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                    <Label>Nama {`${config.key_word.toWellFormed()}`}</Label>
                    <Input
                        type="text"
                        value={value.name}
                        onChange={(e) => setValue({ ...value, name: e.target.value })}
                    />
                    <Label>Username {`${config.key_word.toWellFormed()}`}</Label>
                    <Input
                        type="text"
                        value={value.username}
                        onChange={(e) => setValue({ ...value, username: e.target.value })}
                    />
                    <Label>Email {`${config.key_word.toWellFormed()}`}</Label>
                    <Input
                        type="email"
                        value={value.email}
                        onChange={(e) => setValue({ ...value, email: e.target.value })}
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
                            <SelectValue placeholder="Pilih ROle" />
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
                    <Button type="submit">
                        Edit {`${config.key_word.toWellFormed()}`}<LucideEdit3></LucideEdit3>
                    </Button>
                </form>
            </DialogContent>
        </Dialog>)
}