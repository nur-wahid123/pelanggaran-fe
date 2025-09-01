"use client"
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import ENDPOINT from "@/config/url";
import { User } from "@/objects/user.object";
import { axiosInstance } from "@/util/request.util";
import { Eye, EyeClosedIcon, KeyRound, Mail, ShieldAlert } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";

export default function Page() {

    const [user, setUser] = useState<User>({} as User);
    const [formData, setFormData] = useState({
        old_password: "",
        new_password: "",
        confirm_new_password: "",
    });
    const [isShow, setIsShow] = useState({
        old_password: false,
        new_password: false,
        confirm_new_password: false,
    });
    const [open, setOpen] = useState(false);

    const fetchUser = useCallback(async () => {
        await axiosInstance.get(ENDPOINT.PROFILE).then((res) => {
            setUser(res.data.data);
        });
    }, []);

    const toaster = useToast();

    const handleSubmit = useCallback(async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (formData.new_password !== formData.confirm_new_password) {
            toaster.toast({ title: "Error", description: "Password tidak sama", variant: "destructive" });
            return;
        }
        await axiosInstance.patch(ENDPOINT.EDIT_PASSWORD, formData).then(() => {
            fetchUser();
            setOpen(false);
            setFormData({ old_password: "", new_password: "", confirm_new_password: "" });
            toaster.toast({ title: "Success", description: "Berhasil mengubah password", variant: "default" });
        }).catch((err) => {
            if (err.code === 400) {
                toaster.toast({ title: "Error", description: err.response.data.message[0], variant: "destructive" });
            } else {
                toaster.toast({ title: "Error", description: err.response.data.message, variant: "destructive" });
            }
        });
    }, [fetchUser, formData]);

    useEffect(() => {
        fetchUser();
    }, []);

    return (
        <div className="w-full flex flex-col gap-4 items-center justify-center">
            <Avatar className="w-16 h-16">
                <AvatarFallback className="bg-primary text-white text-xl font-bold">
                    {user.name?.charAt(0).toUpperCase()}
                </AvatarFallback>
            </Avatar>
            <div className="flex flex-col gap-2 items-center">
                <div className="text-2xl font-bold">{user.name}</div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Mail className="w-4 h-4" /> {user.email}
                </div>
                <Dialog open={open} onOpenChange={setOpen}>
                    <DialogTrigger asChild>
                        <Button>Edit Password <KeyRound /></Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Edit Password</DialogTitle>
                            <DialogDescription asChild>
                                <form onSubmit={handleSubmit}>
                                    <div className="flex flex-col gap-4">
                                        <div className="flex flex-col gap-2">
                                            <Label htmlFor="password">Password Lama</Label>
                                            <div className="flex gap-2">
                                                <Input value={formData.old_password} onChange={(e) => setFormData({ ...formData, old_password: e.target.value })} type={isShow.old_password ? "text" : "password"} id="old_password" name="old_password" placeholder="Password Lama" />
                                                <Button type="button" onClick={()=>setIsShow((prev)=>({...prev,old_password:!prev.old_password}))} >{isShow.old_password ? <Eye /> : <EyeClosedIcon />}</Button>
                                            </div>
                                        </div>
                                        <div className="flex flex-col gap-2">
                                            <Label htmlFor="password">Password Baru</Label>
                                            <div className="flex gap-2">
                                                <Input value={formData.new_password} onChange={(e) => setFormData({ ...formData, new_password: e.target.value })} type={isShow.new_password ? "text" : "password"} id="new_password" name="new_password" placeholder="Password Baru" />
                                                <Button type="button" onClick={()=>setIsShow((prev)=>({...prev,new_password:!prev.new_password}))} >{isShow.new_password ? <Eye /> : <EyeClosedIcon />}</Button>
                                            </div>
                                        </div>
                                        <div className="flex flex-col gap-2">
                                            <Label htmlFor="password">Konfirmasi Password Baru</Label>
                                            <div className="flex gap-2">
                                                <Input value={formData.confirm_new_password} onChange={(e) => setFormData({ ...formData, confirm_new_password: e.target.value })} type={isShow.confirm_new_password ? "text" : "password"} id="confirm_new_password" name="confirm_new_password" placeholder="Konfirmasi Password Baru" />
                                                <Button type="button" onClick={()=>setIsShow((prev)=>({...prev,confirm_new_password:!prev.confirm_new_password}))} >{isShow.confirm_new_password ? <Eye /> : <EyeClosedIcon />}</Button>
                                            </div>
                                        </div>
                                        <Button type="submit">Simpan</Button>
                                    </div>
                                </form>
                            </DialogDescription>
                        </DialogHeader>
                    </DialogContent>
                </Dialog>
            </div>

            <div className="flex items-center w-full flex-col md:flex-row gap-4 max-w-md mt-12 justify-between">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <ShieldAlert className="w-4 h-4" />
                    <span>Mencatat Pelanggaran</span>
                </div>
                {user.violations?.length === 0 ? (
                    <Badge className="bg-green-500 hover:bg-green-600">
                        ✅ Tidak Pernah
                    </Badge>
                ) : (
                    <Badge variant="destructive">
                        {user.violations?.length} Kali
                    </Badge>
                )}
            </div>
        </div>
    );
}