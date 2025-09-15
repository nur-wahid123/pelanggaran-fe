'use client'
import { LoginForm } from "@/components/login-form"
import ENDPOINT from "@/config/url"
import { axiosInstance } from "@/util/request.util"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import React from "react"

export default function LoginPage() {
  const [logo, setLogo] = React.useState<number>(0)
  const [schoolName, setSchoolName] = React.useState<string>("")

  const fetchLogo = React.useCallback(async () => {
    const res = await axiosInstance.get(`${ENDPOINT.SCHOOL_LOGO}`)
    const res2 = await axiosInstance.get(`${ENDPOINT.SCHOOL_NAME}`)
    setLogo(res.data.data)
    setSchoolName(res2.data.data)
  }, [setLogo, setSchoolName])

  React.useEffect(() => {
    fetchLogo()
    // eslint-disable-next-line
  }, [])

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-2">
      <div className="w-full max-w-sm mx-auto">
        {/* Back Button */}
        <div className="mb-4">
          <Link href="/" className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-800 text-sm">
            <ArrowLeft className="h-4 w-4" />
            Kembali ke Beranda
          </Link>
        </div>

        {/* Login Card */}
        <div className="bg-white rounded-lg shadow border border-gray-200 p-6">
          {/* Logo and Header */}
          <div className="text-center mb-6">
            <div className="inline-block mb-3">
              <img
                src={`${ENDPOINT.DETAIL_IMAGE}/${logo}`}
                width={56}
                alt="Logo"
                className="mx-auto rounded"
                style={{ maxHeight: 56 }}
              />
            </div>
            <h1 className="text-xl font-semibold text-gray-800 mb-1">
              Selamat Datang
            </h1>
            <p className="text-gray-600 font-medium text-sm">{schoolName}</p>
            <p className="text-xs text-gray-500 mt-1">Masuk ke akun Anda untuk melanjutkan</p>
          </div>

          {/* Login Form */}
          <LoginForm />
        </div>

        {/* Footer */}
        <div className="text-center mt-4">
          <p className="text-xs text-gray-400">
            © 2024 Sistem Pencatatan Pelanggaran.
          </p>
        </div>
      </div>
    </div>
  )
}
