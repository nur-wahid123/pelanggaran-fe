import ENDPOINT from "@/config/url";
import { axiosInstance } from "@/util/request.util";
import { useState } from "react";
import useInfiniteScroll from "@/user-components/hook/useInfiniteScroll.hook";
import { ClassObject } from "@/objects/class.object";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";

interface AddStudentProps {
  refresh: () => void;
}

type FormData = {
  name: string;
  nis: string;
  nisn: string;
  class_name: string;
};

export default function AddStudent({ refresh }: AddStudentProps) {
  const [formData, setFormData] = useState<FormData>({
    name: "",
    nis: "",
    nisn: "",
    class_name: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [open, setOpen] = useState(false);
  const toaster = useToast();

  // For class select, use infinite scroll hook
  const {
    data: classes,
    loading: loadingClass,
    ref: classRef,
  } = useInfiniteScroll<ClassObject, HTMLOptionElement>({
    filter: { search: "" },
    take: 20,
    url: ENDPOINT.MASTER_CLASS,
  });

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      await axiosInstance.post(`${ENDPOINT.STUDENT_CREATE}`, {
        name: formData.name,
        nis: formData.nis,
        nisn: formData.nisn,
        class_name: formData.class_name,
      });
      toaster.toast({
        title: "Sukses",
        description: "Siswa berhasil ditambahkan.",
        variant: "default",
      });
      setFormData({
        name: "",
        nis: "",
        nisn: "",
        class_name: "",
      });
      refresh();
      setOpen(false);
    } catch (err: any) {
      setError(
        err?.response?.data?.message ||
        err?.message ||
        "Terjadi kesalahan"
      );
    } finally {
      setLoading(false);
    }
  }

  function handleChange(field: keyof FormData, value: string) {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="default" className="w-full">Tambah Siswa</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Tambah Siswa</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4 w-full">
          <div>
            <Label htmlFor="name">Nama Siswa</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={e => handleChange("name", e.target.value)}
              placeholder="Nama Siswa"
              required
              autoFocus
            />
          </div>
          <div>
            <Label htmlFor="nis">NIS</Label>
            <Input
              id="nis"
              value={formData.nis}
              onChange={e => handleChange("nis", e.target.value)}
              placeholder="NIS"
              required
            />
          </div>
          <div>
            <Label htmlFor="nisn">NISN</Label>
            <Input
              id="nisn"
              value={formData.nisn}
              onChange={e => handleChange("nisn", e.target.value)}
              placeholder="NISN"
              required
            />
          </div>
          <div>
            <Label htmlFor="class_name">Kelas</Label>
            <select
              id="class_name"
              value={formData.class_name}
              onChange={e => handleChange("class_name", e.target.value)}
              required
              className="block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-primary focus:border-primary"
              >
              <option value="">Pilih Kelas</option>
              {classes.map((cls) => (
                  <option
                  key={cls.id}
                  ref={classRef}
                  value={cls.name ?? ""}
                >
                  {cls.name}
                </option>
              ))}
            </select>
            {loadingClass && (
              <div className="px-2 py-1 text-xs text-gray-400">Memuat...</div>
            )}
          </div>
          {error && <div className="text-red-500 text-sm">{error}</div>}
          <DialogFooter>
            <Button type="submit" disabled={loading}>
              {loading ? "Menambah..." : "Tambah Siswa"}
            </Button>
            <DialogClose asChild>
              <Button type="button" variant="outline">
                Batal
              </Button>
            </DialogClose>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}