"use client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import ENDPOINT from "@/config/url"
import { useToast } from "@/hooks/use-toast"
import { PreviewImage } from "@/user-components/preview-image.component"
import { axiosInstance } from "@/util/request.util"
import { CircleX, Edit, Save } from "lucide-react"
import React from "react"

export default function Page() {
    const [logo, setLogo] = React.useState<number>(0)
    const [file, setFile] = React.useState<File | undefined | null>(undefined)
    const [schoolName, setSchoolName] = React.useState<string>("")
    const [schoolAddress, setSchoolAddress] = React.useState<string>("")
    const [isDisabled, setIsDisabled] = React.useState<{ logo: boolean, name: boolean, address: boolean }>({ logo: true, name: true, address: true })
    const toaster = useToast()

    const fetchLogo = React.useCallback(async () => {
        const res = await axiosInstance.get(`${ENDPOINT.SCHOOL_LOGO}`)
        const res2 = await axiosInstance.get(`${ENDPOINT.SCHOOL_NAME}`)
        const res3 = await axiosInstance.get(`${ENDPOINT.SCHOOL_ADDRESS}`)
        setLogo(res.data.data)
        setSchoolName(res2.data.data)
        setSchoolAddress(res3.data.data)
    }, [setLogo, setSchoolName, schoolAddress])

    const updateSchoolName = React.useCallback(async () => {
        await axiosInstance.put(`${ENDPOINT.EDIT_SCHOOL_NAME}`, { name: schoolName }).then(() => {
            fetchLogo()
            setIsDisabled({ ...isDisabled, name: true })
            toaster.toast({ title: "Success", description: "Berhasil Mengubah Nama Sekolah", variant: "default" })
        }).then(err => {
            setIsDisabled({ ...isDisabled, name: false })
            console.log(err);
            toaster.toast({ title: "Error", description: "Gagal Mengubah Nama Sekolah", variant: "destructive" })
        })
    }, [schoolName])

    const updateSchoolAddress = React.useCallback(async () => {
        await axiosInstance.put(`${ENDPOINT.EDIT_SCHOOL_ADDRESS}`, { name: schoolAddress }).then(() => {
            fetchLogo()
            setIsDisabled({ ...isDisabled, address: true })
            toaster.toast({ title: "Success", description: "Berhasil Mengubah Alamat Sekolah", variant: "default" })
        }).catch(err => {
            setIsDisabled({ ...isDisabled, address: false })
            console.log(err);
            toaster.toast({ title: "Error", description: "Gagal Mengubah Alamat Sekolah", variant: "destructive" })
        })
    }, [schoolAddress])

    const updateSchoolLogo = React.useCallback(async () => {
        const formData = new FormData()
        if (file === null || file === undefined) {
            toaster.toast({ title: "Error", description: "File Tidak Boleh Kosong", variant: "destructive" })
            return
        }
        formData.append('file', file)
        await axiosInstance.put(`${ENDPOINT.EDIT_SCHOOL_LOGO}`, formData, {headers: { 'Content-Type': 'multipart/form-data' }}).then(() => {
            fetchLogo()
            setIsDisabled({ ...isDisabled, logo: true })
            toaster.toast({ title: "Success", description: "Berhasil Mengubah Logo Sekolah", variant: "default" })
        }).catch(err => {
            setIsDisabled({ ...isDisabled, logo: false })
            console.log(err);
            toaster.toast({ title: "Error", description: "Gagal Mengubah Logo Sekolah", variant: "destructive" })
        })
    }, [logo, file])

    React.useEffect(() => {
        fetchLogo()
    }, [])
    return (
        <div>
            <h1 className="scroll-m-20 text-2xl mb-4 font-extrabold tracking-tight lg:text-5xl">
                Settings
            </h1>
            <div className="flex flex-col gap-4">
                <div className="flex flex-col gap-2">
                    <Label>Nama Sekolah</Label>
                    <div className="flex flex-col md:flex-row gap-3">
                        <Input value={schoolName} onChange={(e) => setSchoolName(e.target.value)} disabled={isDisabled.name} />
                        {isDisabled.name &&
                            <Button onClick={() => setIsDisabled({ ...isDisabled, name: !isDisabled.name })}><Edit /></Button>
                        }
                        {!isDisabled.name && <div className="flex gap-2">
                            <Button onClick={() => setIsDisabled({ ...isDisabled, name: !isDisabled.name })}><CircleX /></Button>
                            <Button onClick={() => updateSchoolName()}><Save /></Button>
                        </div>}
                    </div>
                </div>
                <div className="flex flex-col gap-2">
                    <Label>Alamat Sekolah</Label>
                    <div className="flex flex-col md:flex-row gap-3">
                        <Input value={schoolAddress} onChange={(e) => setSchoolAddress(e.target.value)} disabled={isDisabled.address} />
                        {isDisabled.address &&
                            <Button onClick={() => setIsDisabled({ ...isDisabled, address: !isDisabled.address })}><Edit /></Button>
                        }
                        {!isDisabled.address && <div className="flex gap-2">
                            <Button onClick={() => setIsDisabled({ ...isDisabled, address: !isDisabled.address })}><CircleX /></Button>
                            <Button onClick={() => updateSchoolAddress()}><Save /></Button>
                        </div>}
                    </div>
                </div>
                <div className="flex flex-col gap-2">
                    <Label>Logo Sekolah</Label>
                    <PreviewImage src={`${ENDPOINT.DETAIL_IMAGE}/${logo}`} alt="Logo" />
                    <div className="flex flex-col md:flex-row gap-3">
                        <Input type="file" accept="image/*" onChange={(e) => {
                            const files = e.target.files;
                            if (files?.length) {
                                setFile(files[0]);
                            }
                        }} />
                        <Button onClick={() => updateSchoolLogo()}><Save /></Button>
                    </div>
                </div>
            </div>
        </div>
    )
}