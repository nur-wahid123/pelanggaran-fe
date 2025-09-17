"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import ENDPOINT from "@/config/url";
import { useToast } from "@/hooks/use-toast";
import { PreviewImage } from "@/user-components/preview-image.component";
import { axiosInstance } from "@/util/request.util";
import { CircleX, Edit, Save, Image as ImageIcon, School2 } from "lucide-react";
import React from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";

export default function Page() {
  const [logo, setLogo] = React.useState<number>(0);
  const [file, setFile] = React.useState<File | undefined | null>(undefined);
  const [schoolName, setSchoolName] = React.useState<string>("");
  const [schoolAddress, setSchoolAddress] = React.useState<string>("");
  const [isDisabled, setIsDisabled] = React.useState<{
    logo: boolean;
    name: boolean;
    address: boolean;
  }>({ logo: true, name: true, address: true });
  const toaster = useToast();

  const fetchLogo = React.useCallback(async () => {
    const res = await axiosInstance.get(`${ENDPOINT.SCHOOL_LOGO}`);
    const res2 = await axiosInstance.get(`${ENDPOINT.SCHOOL_NAME}`);
    const res3 = await axiosInstance.get(`${ENDPOINT.SCHOOL_ADDRESS}`);
    setLogo(res.data.data);
    setSchoolName(res2.data.data);
    setSchoolAddress(res3.data.data);
  }, []);

  const updateSchoolName = React.useCallback(async () => {
    await axiosInstance
      .put(`${ENDPOINT.EDIT_SCHOOL_NAME}`, { name: schoolName })
      .then(() => {
        fetchLogo();
        setIsDisabled((prev) => ({ ...prev, name: true }));
        toaster.toast({
          title: "Success",
          description: "Berhasil Mengubah Nama Sekolah",
          variant: "default",
        });
      })
      .catch((err) => {
        setIsDisabled((prev) => ({ ...prev, name: false }));
        console.log(err);
        toaster.toast({
          title: "Error",
          description: "Gagal Mengubah Nama Sekolah",
          variant: "destructive",
        });
      });
  }, [schoolName, fetchLogo, toaster]);

  const updateSchoolAddress = React.useCallback(async () => {
    await axiosInstance
      .put(`${ENDPOINT.EDIT_SCHOOL_ADDRESS}`, { name: schoolAddress })
      .then(() => {
        fetchLogo();
        setIsDisabled((prev) => ({ ...prev, address: true }));
        toaster.toast({
          title: "Success",
          description: "Berhasil Mengubah Alamat Sekolah",
          variant: "default",
        });
      })
      .catch((err) => {
        setIsDisabled((prev) => ({ ...prev, address: false }));
        console.log(err);
        toaster.toast({
          title: "Error",
          description: "Gagal Mengubah Alamat Sekolah",
          variant: "destructive",
        });
      });
  }, [schoolAddress, fetchLogo, toaster]);

  const updateSchoolLogo = React.useCallback(async () => {
    const formData = new FormData();
    if (file === null || file === undefined) {
      toaster.toast({
        title: "Error",
        description: "File Tidak Boleh Kosong",
        variant: "destructive",
      });
      return;
    }
    formData.append("file", file);
    await axiosInstance
      .put(`${ENDPOINT.EDIT_SCHOOL_LOGO}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      })
      .then(() => {
        fetchLogo();
        setIsDisabled((prev) => ({ ...prev, logo: true }));
        toaster.toast({
          title: "Success",
          description: "Berhasil Mengubah Logo Sekolah",
          variant: "default",
        });
      })
      .catch((err) => {
        setIsDisabled((prev) => ({ ...prev, logo: false }));
        console.log(err);
        toaster.toast({
          title: "Error",
          description: "Gagal Mengubah Logo Sekolah",
          variant: "destructive",
        });
      });
  }, [logo, file, fetchLogo, toaster]);

  React.useEffect(() => {
    fetchLogo();
  }, [fetchLogo]);

  return (
    <div className="w-full h-full flex flex-col items-center md:items-start justify-start py-6 px-2 md:px-0">
      <div className="w-full max-w-2xl">
        <div className="flex flex-col md:flex-row md:items-center gap-3 mb-6 md:mb-6 md:text-left text-center">
          <School2 className="w-8 h-8 text-primary mx-auto md:mx-0" />
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-gray-800">
            Pengaturan Sekolah
          </h1>
        </div>
        <div className="flex flex-col gap-6">
          {/* School Name Card */}
          <Card>
            <CardHeader className="flex flex-row items-center gap-2 pb-2">
              <CardTitle className="flex items-center gap-2 text-base md:text-lg">
                <span>Nama Sekolah</span>
                <Edit className="w-4 h-4 text-primary/70" />
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col md:flex-row gap-3 items-center md:items-start md:justify-start text-center md:text-left">
                <Input
                  className="flex-1 text-base"
                  value={schoolName}
                  onChange={(e) => setSchoolName(e.target.value)}
                  disabled={isDisabled.name}
                  placeholder="Masukkan nama sekolah"
                />
                {isDisabled.name ? (
                  <Button
                    variant="outline"
                    className="rounded-full"
                    onClick={() =>
                      setIsDisabled((prev) => ({ ...prev, name: !prev.name }))
                    }
                    aria-label="Edit Nama Sekolah"
                  >
                    <Edit className="w-5 h-5" />
                  </Button>
                ) : (
                  <div className="flex gap-2">
                    <Button
                      variant="ghost"
                      className="rounded-full"
                      onClick={() =>
                        setIsDisabled((prev) => ({ ...prev, name: !prev.name }))
                      }
                      aria-label="Batal"
                    >
                      <CircleX className="w-5 h-5 text-red-500" />
                    </Button>
                    <Button
                      variant="default"
                      className="rounded-full"
                      onClick={updateSchoolName}
                      aria-label="Simpan Nama Sekolah"
                    >
                      <Save className="w-5 h-5" />
                    </Button>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
          {/* School Address Card */}
          <Card>
            <CardHeader className="flex flex-row items-center gap-2 pb-2">
              <CardTitle className="flex items-center gap-2 text-base md:text-lg">
                <span>Alamat Sekolah</span>
                <Edit className="w-4 h-4 text-primary/70" />
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col md:flex-row gap-3 items-center md:items-start md:justify-start text-center md:text-left">
                <Input
                  className="flex-1 text-base"
                  value={schoolAddress}
                  onChange={(e) => setSchoolAddress(e.target.value)}
                  disabled={isDisabled.address}
                  placeholder="Masukkan alamat sekolah"
                />
                {isDisabled.address ? (
                  <Button
                    variant="outline"
                    className="rounded-full"
                    onClick={() =>
                      setIsDisabled((prev) => ({
                        ...prev,
                        address: !prev.address,
                      }))
                    }
                    aria-label="Edit Alamat Sekolah"
                  >
                    <Edit className="w-5 h-5" />
                  </Button>
                ) : (
                  <div className="flex gap-2">
                    <Button
                      variant="ghost"
                      className="rounded-full"
                      onClick={() =>
                        setIsDisabled((prev) => ({
                          ...prev,
                          address: !prev.address,
                        }))
                      }
                      aria-label="Batal"
                    >
                      <CircleX className="w-5 h-5 text-red-500" />
                    </Button>
                    <Button
                      variant="default"
                      className="rounded-full"
                      onClick={updateSchoolAddress}
                      aria-label="Simpan Alamat Sekolah"
                    >
                      <Save className="w-5 h-5" />
                    </Button>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
          {/* School Logo Card */}
          <Card>
            <CardHeader className="flex flex-row items-center gap-2 pb-2">
              <CardTitle className="flex items-center gap-2 text-base md:text-lg">
                <span>Logo Sekolah</span>
                <ImageIcon className="w-4 h-4 text-primary/70" />
              </CardTitle>
              <CardDescription className="ml-auto text-xs text-gray-500">
                Format: JPG, PNG, dsb.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col md:flex-row gap-6 items-center md:items-start md:justify-start text-center md:text-left">
                <div className="flex flex-col items-center gap-2">
                  <PreviewImage
                    src={`${ENDPOINT.DETAIL_IMAGE}/${logo}`}
                    alt="Logo"
                    className="w-28 h-28 rounded-lg border border-gray-200 shadow"
                  />
                  <span className="text-xs text-gray-500">Preview Logo</span>
                </div>
                <div className="flex flex-col gap-2 flex-1 w-full">
                  <label className="flex items-center gap-3 cursor-pointer w-fit">
                    <Input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => {
                        const files = e.target.files;
                        if (files?.length) {
                          setFile(files[0]);
                        }
                      }}
                    />
                    <span className="inline-flex items-center px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-semibold border border-primary/20 hover:bg-primary/20 transition-colors">
                      <ImageIcon className="w-4 h-4 mr-2" />
                      Pilih Logo
                    </span>
                  </label>
                  <Button
                    variant="outline"
                    className="rounded-full w-fit border-primary text-primary hover:bg-primary/10 mt-2"
                    onClick={updateSchoolLogo}
                    aria-label="Simpan Logo Sekolah"
                  >
                    <Save className="w-5 h-5 mr-2" />
                    Simpan Logo
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
