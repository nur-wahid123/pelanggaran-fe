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
import axios from "axios"
import ENDPOINT from "@/config/url"
import { Eye, EyeOff } from "lucide-react"
import { useRouter } from "next/navigation"
import Cookies from 'js-cookie'

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
      .then(async res => {
        const token = res.data.data.access_token;

        if (token) {
          console.log(token);

          try {
            // Cookies.set('token', token);   
            localStorage.setItem('token', token);
          } catch (error) {
            console.log(error);
          }
        } else {
          console.error("Token is undefined");
          return;
        }
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
                  <div className="flex items-center gap-3">
                    <Input id="password" type={isView ? "text" : "password"} required value={state.password} onChange={(e) => setState({ ...state, password: e.target.value })} />
                    <Button type="button" onClick={() => setIsView(!isView)}>
                    {isView ? (
                      <Eye/>
                    ) : (
                      <EyeOff/>
                    )}
                    </Button>
                  </div>
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
