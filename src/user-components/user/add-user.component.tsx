"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "../../components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { Building, Eye, EyeClosed, PlusIcon } from "lucide-react";
import { axiosInstance } from "@/util/request.util";
import ENDPOINT from "@/config/url";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { RoleEnum } from "@/enums/role.enum";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select";
import { convertStringToEnum } from "@/enums/chart-type.enum";

const config = {
    url: ENDPOINT.CREATE_USER,
    key_word: "user"
}

export default function AddUser({ reFetch }: { reFetch: () => void }) {
    const [openAdd, setOpenAdd] = useState(false);
    const [passwordHide, setPasswordHide] = useState(true);
    const toast = useToast()
    const [value, setValue] = useState({
        name: "",
        username: "",
        email: "",
        password: "",
        role: RoleEnum.USER,
    })

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        await axiosInstance.post(config.url, value)
            .then(() => {
                reFetch();
                toast.toast({
                    title: "Success",
                    description: `Berhasil Tambahkan ${config.key_word.toWellFormed()}`,
                    variant: "default",
                })
                setOpenAdd(false);
                setValue({
                    name: "",
                    username: "",
                    email: "",
                    password: "",
                    role: RoleEnum.USER
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
        <Dialog open={openAdd} onOpenChange={setOpenAdd}>
            <DialogTrigger asChild>
                <Button className="flex gap-3 shadow hover:shadow-md" variant="outline"><Building className="w-4" />Tambah {config.key_word.toWellFormed()} <PlusIcon className="w-4" /></Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Tambah {config.key_word.toWellFormed()}</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                    <Label>Nama {config.key_word.toWellFormed()}</Label>
                    <Input
                        type="text"
                        value={value.name}
                        onChange={(e) => setValue({ ...value, name: e.target.value })}
                    />
                    <Label>Username</Label>
                    <Input
                        type="text"
                        value={value.username}
                        onChange={(e) => setValue({ ...value, username: e.target.value })}
                    />
                    <Label>Email</Label>
                    <Input
                        type="email"
                        value={value.email}
                        onChange={(e) => setValue({ ...value, email: e.target.value })}
                    />
                    <Label>Password</Label>
                    <div className="flex gap-3">
                        <Input
                            type={passwordHide ? "password" : "text"}
                            name="password"
                            id="password"
                            value={value.password}
                            onChange={(e) => setValue({ ...value, password: e.target.value })}
                        />
                        <Button type="button" onClick={() => setPasswordHide(!passwordHide)}>{passwordHide ? <EyeClosed /> : <Eye />}</Button>
                    </div>
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
                        Tambah {config.key_word.toWellFormed()}
                    </Button>
                </form>
            </DialogContent>
        </Dialog>
    );
}
