import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useState } from "react"
import { useToast } from "@/hooks/use-toast"
import axios from "axios"
import ENDPOINT from "@/config/url"
import { Eye, EyeOff, User, Lock, LogIn, Loader2 } from "lucide-react"
import { useRouter } from "next/navigation"

export function LoginForm({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"div">) {
  const router = useRouter()
  const [isView, setIsView] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [state, setState] = useState({
    username: "",
    password: "",
  });
  const toaster = useToast()
  
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsLoading(true)
    
    await axios.post(`${ENDPOINT.LOGIN}`, state)
      .then(async res => {
        const token = res.data.data.access_token;

        if (token) {
          try {
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
      .finally(() => {
        setIsLoading(false)
      })
  }
  
  return (
    <div className={cn("w-full", className)} {...props}>
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Username Field */}
        <div className="space-y-2">
          <Label htmlFor="username" className="text-sm font-medium text-gray-700">
            Username
          </Label>
          <div className="relative">
            <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              id="username"
              type="text"
              placeholder="Masukkan username Anda"
              value={state.username}
              onChange={(e) => setState({ ...state, username: e.target.value })}
              className="pl-10 h-12 border-gray-200 focus:border-blue-500 focus:ring-blue-500/20 rounded-xl"
              required
            />
          </div>
        </div>

        {/* Password Field */}
        <div className="space-y-2">
          <Label htmlFor="password" className="text-sm font-medium text-gray-700">
            Password
          </Label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              id="password"
              type={isView ? "text" : "password"}
              placeholder="Masukkan password Anda"
              value={state.password}
              onChange={(e) => setState({ ...state, password: e.target.value })}
              className="pl-10 pr-12 h-12 border-gray-200 focus:border-blue-500 focus:ring-blue-500/20 rounded-xl"
              required
            />
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => setIsView(!isView)}
              className="absolute right-2 top-1/2 transform -translate-y-1/2 h-8 w-8 p-0 hover:bg-gray-100"
            >
              {isView ? (
                <Eye className="h-4 w-4 text-gray-400" />
              ) : (
                <EyeOff className="h-4 w-4 text-gray-400" />
              )}
            </Button>
          </div>
        </div>

        {/* Submit Button */}
        <Button 
          type="submit" 
          className="w-full h-12 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02]"
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Memproses...
            </>
          ) : (
            <>
              <LogIn className="mr-2 h-4 w-4" />
              Masuk ke Dashboard
            </>
          )}
        </Button>
      </form>
    </div>
  )
}
