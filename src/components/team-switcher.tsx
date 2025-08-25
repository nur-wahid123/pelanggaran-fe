"use client"

import * as React from "react"
import {
  SidebarMenu,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { axiosInstance } from "@/util/request.util"
import ENDPOINT from "@/config/url"

export function TeamSwitcher() {
  const [data, setData] = React.useState<{ logo: number, name: string, address: string }>({ logo: 0, name: "", address: "" })
  const fetchLogo = React.useCallback(async () => {
    const res = await axiosInstance.get(`${ENDPOINT.SCHOOL_LOGO}`)
    const res2 = await axiosInstance.get(`${ENDPOINT.SCHOOL_NAME}`)
    const res3 = await axiosInstance.get(`${ENDPOINT.SCHOOL_ADDRESS}`)
    const dat =
    {
      logo: res.data.data,
      name: res2.data.data,
      address: res3.data.data,
    }
    setData(dat)
  }, [setData,])

  React.useEffect(() => {
    fetchLogo()
  }, [])

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <div
          className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground flex gap-1"
        >
          <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-transparent text-sidebar-primary-foreground">
            {/* <activeTeam.logo className="size-4" /> */}
            <img src={`${ENDPOINT.DETAIL_IMAGE}/${data.logo}`} />
          </div>
          <div className="grid flex-1 text-left text-sm leading-tight">
            <span className="truncate font-semibold">
              {data.name}
            </span>
            <span className="truncate text-xs">{data.address}</span>
          </div>
        </div>
      </SidebarMenuItem>
    </SidebarMenu>
  )
}
