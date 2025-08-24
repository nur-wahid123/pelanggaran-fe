'use client'
import { LoginForm } from "@/components/login-form"
import ENDPOINT from "@/config/url"
import { axiosInstance } from "@/util/request.util"
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
  }, [logo])
  return (
    <div className="flex min-h-svh flex-col items-center justify-center gap-6 bg-muted p-6 md:p-10">
      <div className="flex w-full max-w-sm flex-col items-center gap-6">
        <img src={`${ENDPOINT.DETAIL_IMAGE}/${logo}`} width={150} alt="Logo" />
        <a href="/" className="flex items-center gap-2 self-center font-medium">
          {schoolName}
        </a>
        <LoginForm />
      </div>
    </div>
  )
}
