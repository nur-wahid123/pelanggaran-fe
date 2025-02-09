'use client'
import { LoginForm } from "@/components/login-form"
import { isLogged } from "@/util/util"
import { useRouter } from "next/navigation"

export default function LoginPage() {
  const router = useRouter()
  if(isLogged()){
      router.push('/dashboard')
  }
  return (
    <div className="flex min-h-svh flex-col items-center justify-center gap-6 bg-muted p-6 md:p-10">
      <div className="flex w-full max-w-sm flex-col gap-6">
        <a href="/" className="flex items-center gap-2 self-center font-medium">
          SMAN 1 Srengat
        </a>
        <LoginForm />
      </div>
    </div>
  )
}
