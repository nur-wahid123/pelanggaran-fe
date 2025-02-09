import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useState } from "react"
import { useToast } from "@/hooks/use-toast"
import ckie from "js-cookie"
import axios from "axios"
import ENDPOINT from "@/config/url"
import { Eye, EyeOff } from "lucide-react"
import { useRouter } from "next/navigation"

export function LoginForm({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"div">) {
  const router = useRouter()
  const [isView, setIsView] = useState(false);
  const [state, setState] = useState({
    username: "",
    password: "",
  });
  const toaster = useToast()
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    await axios.post(`${ENDPOINT.LOGIN}`, state)
      .then(res => {
        const twoHours = new Date(Date.now() + 2 * 60 * 60 * 1000)
        ckie.set("token", res.data.data.access_token, { expires: twoHours })
        toaster.toast({ title: "Success", description: "Berhasil Login", variant: "default" })
        router.push("/dashboard")
      })
      .catch(() => {
        toaster.toast({ title: "Error", description: "Gagal Login", variant: "destructive" })
      })
  }
  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-xl">Selamat Datang</CardTitle>
          <CardDescription>
            Silahkan Login
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <div className="grid gap-6">
              <div className="grid gap-6">
                <div className="grid gap-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    value={state.username}
                    onChange={(e) => setState({ ...state, username: e.target.value })}
                    id="username"
                    type="username"
                    placeholder="username"
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <div className="flex items-center">
                    <Label htmlFor="password">Password</Label>
                  </div>
                  <Input id="password" type="password" required value={state.password} onChange={(e) => setState({ ...state, password: e.target.value })} />
                  {isView ? (
                    <Eye
                      className="absolute right-4 top-7 z-10 cursor-pointer text-gray-400 w-5"
                      onClick={() => {
                        setIsView(!isView)
                      }}
                    />
                  ) : (
                    <EyeOff
                      className="absolute right-4 top-7 z-10 cursor-pointer text-gray-300 w-5"
                      onClick={() => setIsView(!isView)}
                    />
                  )}
                </div>
                <Button type="submit" className="w-full">
                  Login
                </Button>
              </div>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
