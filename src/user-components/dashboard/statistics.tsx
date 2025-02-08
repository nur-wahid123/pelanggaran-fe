/**
 * v0 by Vercel.
 * @see https://v0.dev/t/jMImGtyCUyf
 * Documentation: https://v0.dev/docs#integrating-generated-code-into-your-nextjs-app
 */
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"

export default function Statistics() {
  return (
    <div className="grid gap-4 md:grid-cols-3">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
          <CardTitle className="text-sm font-medium">Jumlah Siswa</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">1200</div>
          <p className="text-xs text-gray-500 dark:text-gray-400">Siswa</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
          <CardTitle className="text-sm font-medium">Siswa dengan jumlah poin melebihi 40</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">250</div>
          <p className="text-xs text-gray-500 dark:text-gray-400">Siswa</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
          <CardTitle className="text-sm font-medium">Siswa dengan poin melebihi 70</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">34</div>
          <p className="text-xs text-gray-500 dark:text-gray-400">Siswa</p>
        </CardContent>
      </Card>
    </div>
  )
}