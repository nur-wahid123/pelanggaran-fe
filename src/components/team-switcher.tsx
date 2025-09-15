"use client"

import * as React from "react"
import {
  SidebarMenu,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { axiosInstance } from "@/util/request.util"
import ENDPOINT from "@/config/url"
import { useToast } from "@/hooks/use-toast"

interface SchoolInfo {
  logo: number | string
  name: string
  address: string
}

export function TeamSwitcher() {
  const [school, setSchool] = React.useState<SchoolInfo>({
    logo: 0,
    name: "",
    address: "",
  })
  const [loading, setLoading] = React.useState<boolean>(true)
  const [error, setError] = React.useState<string | null>(null)


  const toaster = useToast();

  const fetchSchoolInfo = React.useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const [logoRes, nameRes, addressRes] = await Promise.all([
        axiosInstance.get(ENDPOINT.SCHOOL_LOGO),
        axiosInstance.get(ENDPOINT.SCHOOL_NAME),
        axiosInstance.get(ENDPOINT.SCHOOL_ADDRESS),
      ])
      setSchool({
        logo: logoRes.data.data,
        name: nameRes.data.data,
        address: addressRes.data.data,
      })
    } catch (err: any) {
      setError("Failed to load school information.")
      toaster.toast({
        title: "Gagal Memuat Data Sekolah",
        description: err?.response?.data?.message || "Terjadi kesalahan saat memuat data sekolah.",
        variant: "destructive",
      });
    } finally {
      setLoading(false)
    }
  }, [toaster])

  React.useEffect(() => {
    fetchSchoolInfo()
  }, [fetchSchoolInfo])

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <div className="flex items-center gap-2 px-1 py-1.5 rounded-lg transition-colors data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground">
          <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-muted text-sidebar-primary-foreground border border-sidebar-border overflow-hidden">
            {loading ? (
              <span className="text-xs text-muted-foreground">...</span>
            ) : school.logo ? (
              <img
                src={`${ENDPOINT.DETAIL_IMAGE}/${school.logo}`}
                alt={school.name || "School Logo"}
                className="object-cover w-full h-full"
              />
            ) : (
              <span className="text-xs text-muted-foreground">N/A</span>
            )}
          </div>
          <div className="flex flex-col min-w-0">
            <span className="truncate font-semibold text-sm">
              {loading ? "Loading..." : school.name || "School Name"}
            </span>
            <span className="truncate text-xs text-muted-foreground">
              {loading ? "" : school.address || "School Address"}
            </span>
            {error && (
              <span className="text-xs text-destructive">{error}</span>
            )}
          </div>
        </div>
      </SidebarMenuItem>
    </SidebarMenu>
  )
}
