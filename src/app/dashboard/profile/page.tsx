"use client";
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
} from "@/components/ui/dialog";
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
  
  const toaster = useToast();

  const fetchUser = useCallback(async () => {
    try {
      const res = await axiosInstance.get(ENDPOINT.PROFILE);
      setUser(res.data.data);
    } catch (error: any) {
      // Handle error with toast
      toaster.toast({
        title: "Gagal Memuat Profil",
        description: error?.response?.data?.message || "Terjadi kesalahan saat memuat data profil.",
        variant: "destructive",
      });
    }
  }, [toaster]);


  const handleSubmit = useCallback(
    async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      if (formData.new_password !== formData.confirm_new_password) {
        toaster.toast({
          title: "Password Tidak Sama",
          description: "Password baru dan konfirmasi password tidak cocok.",
          variant: "destructive",
        });
        return;
      }
      try {
        await axiosInstance.patch(ENDPOINT.EDIT_PASSWORD, formData);
        fetchUser();
        setOpen(false);
        setFormData({
          old_password: "",
          new_password: "",
          confirm_new_password: "",
        });
        toaster.toast({
          title: "Password Berhasil Diubah",
          description: "Password Anda berhasil diperbarui.",
          variant: "default",
        });
      } catch (err: any) {
        if (err.code === 400) {
          toaster.toast({
            title: "Gagal Mengubah Password",
            description: err.response?.data?.message?.[0] || "Permintaan tidak valid.",
            variant: "destructive",
          });
        } else {
          toaster.toast({
            title: "Gagal Mengubah Password",
            description: err.response?.data?.message || "Terjadi kesalahan saat memperbarui password Anda.",
            variant: "destructive",
          });
        }
      }
    },
    [fetchUser, formData, toaster]
  );

  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  return (
    <div className="w-full flex flex-col gap-6 items-center justify-center py-8">
      <Avatar className="w-20 h-20 shadow">
        <AvatarFallback className="bg-primary text-white text-2xl font-bold">
          {user.name?.charAt(0).toUpperCase() || "U"}
        </AvatarFallback>
      </Avatar>
      <div className="flex flex-col gap-2 items-center">
        <div className="text-2xl font-bold">{user.name || "Pengguna"}</div>
        <div className="flex items-center gap-2 text-base text-muted-foreground">
          <Mail className="w-4 h-4" /> {user.email || "-"}
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button variant="outline" className="mt-2">
              Ubah Password <KeyRound className="ml-2" />
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Ubah Password</DialogTitle>
              <DialogDescription asChild>
                <form onSubmit={handleSubmit} className="mt-4">
                  <div className="flex flex-col gap-4">
                    <div className="flex flex-col gap-2">
                      <Label htmlFor="old_password">Password Lama</Label>
                      <div className="flex gap-2">
                        <Input
                          value={formData.old_password}
                          onChange={(e) =>
                            setFormData({ ...formData, old_password: e.target.value })
                          }
                          type={isShow.old_password ? "text" : "password"}
                          id="old_password"
                          name="old_password"
                          placeholder="Masukkan password lama"
                          autoComplete="current-password"
                          required
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          onClick={() =>
                            setIsShow((prev) => ({
                              ...prev,
                              old_password: !prev.old_password,
                            }))
                          }
                          aria-label={
                            isShow.old_password ? "Sembunyikan password" : "Tampilkan password"
                          }
                        >
                          {isShow.old_password ? <Eye /> : <EyeClosedIcon />}
                        </Button>
                      </div>
                    </div>
                    <div className="flex flex-col gap-2">
                      <Label htmlFor="new_password">Password Baru</Label>
                      <div className="flex gap-2">
                        <Input
                          value={formData.new_password}
                          onChange={(e) =>
                            setFormData({ ...formData, new_password: e.target.value })
                          }
                          type={isShow.new_password ? "text" : "password"}
                          id="new_password"
                          name="new_password"
                          placeholder="Masukkan password baru"
                          autoComplete="new-password"
                          required
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          onClick={() =>
                            setIsShow((prev) => ({
                              ...prev,
                              new_password: !prev.new_password,
                            }))
                          }
                          aria-label={
                            isShow.new_password ? "Sembunyikan password" : "Tampilkan password"
                          }
                        >
                          {isShow.new_password ? <Eye /> : <EyeClosedIcon />}
                        </Button>
                      </div>
                    </div>
                    <div className="flex flex-col gap-2">
                      <Label htmlFor="confirm_new_password">Konfirmasi Password Baru</Label>
                      <div className="flex gap-2">
                        <Input
                          value={formData.confirm_new_password}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              confirm_new_password: e.target.value,
                            })
                          }
                          type={isShow.confirm_new_password ? "text" : "password"}
                          id="confirm_new_password"
                          name="confirm_new_password"
                          placeholder="Konfirmasi password baru"
                          autoComplete="new-password"
                          required
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          onClick={() =>
                            setIsShow((prev) => ({
                              ...prev,
                              confirm_new_password: !prev.confirm_new_password,
                            }))
                          }
                          aria-label={
                            isShow.confirm_new_password
                              ? "Sembunyikan password"
                              : "Tampilkan password"
                          }
                        >
                          {isShow.confirm_new_password ? <Eye /> : <EyeClosedIcon />}
                        </Button>
                      </div>
                    </div>
                    <Button type="submit" className="mt-2">
                      Simpan Perubahan
                    </Button>
                  </div>
                </form>
              </DialogDescription>
            </DialogHeader>
          </DialogContent>
        </Dialog>
      </div>

      <div className="flex items-center w-full flex-col md:flex-row gap-4 max-w-md mt-12 justify-between">
        <div className="flex items-center gap-2 text-base text-muted-foreground">
          <ShieldAlert className="w-4 h-4" />
          <span>Catatan Pelanggaran</span>
        </div>
        {user.violations?.length === 0 || !user.violations ? (
          <Badge className="bg-green-500 hover:bg-green-600" variant="default">
            Tidak Pernah Melanggar
          </Badge>
        ) : (
          <Badge variant="destructive">
            {user.violations.length} {user.violations.length === 1 ? "Kali" : "Kali"}
          </Badge>
        )}
      </div>
    </div>
  );
}