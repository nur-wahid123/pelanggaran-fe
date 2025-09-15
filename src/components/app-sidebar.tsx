"use client"

import * as React from "react"
import {
  CogIcon,
  FilePlusIcon,
  GalleryVerticalEnd,
  GraduationCapIcon,
  HomeIcon,
  ListChecksIcon,
  SchoolIcon,
  TagsIcon,
  Users2Icon,
} from "lucide-react"

import { NavProjects } from "@/components/nav-projects"
import { NavUser } from "@/components/nav-user"
import { TeamSwitcher } from "@/components/team-switcher"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar"
import { RoleEnum } from "@/enums/role.enum"
import { axiosInstance } from "@/util/request.util"
import ENDPOINT from "@/config/url"

// Professional, neutral style data (no color classes)
const data = {
  user: {
    name: "Fajar",
    email: "fajar@example.com",
    avatar: "/avatars/shadcn.jpg",
  },
  teams: [
    {
      name: "SMAN 1 Srengat",
      logo: GalleryVerticalEnd,
      plan: "Bagelenan, Blitar",
    },
  ],
  projects: [
    {
      name: "Dashboard",
      url: "/dashboard",
      icon: HomeIcon,
      className: "font-semibold",
    },
    {
      name: "Input Pelanggaran",
      url: "/dashboard/input-violation",
      icon: FilePlusIcon,
      className: "font-medium",
    },
  ],
  adminPage: [
    {
      name: "Data Pelanggaran",
      url: "/dashboard/violation",
      icon: ListChecksIcon,
      className: "font-medium",
    },
    {
      name: "Jenis Pelanggaran",
      url: "/dashboard/violation-type",
      icon: TagsIcon,
      className: "font-medium",
    },
    {
      name: "Kelas",
      url: "/dashboard/class-page",
      icon: SchoolIcon,
      className: "font-medium",
    },
    {
      name: "Siswa",
      url: "/dashboard/student",
      icon: GraduationCapIcon,
      className: "font-medium",
    },
    {
      name: "User",
      url: "/dashboard/user",
      icon: Users2Icon,
      className: "font-medium",
    },
    {
      name: "Pengaturan",
      url: "/dashboard/settings",
      icon: CogIcon,
      className: "font-medium",
    },
  ]
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const [user, setUser] = React.useState({
    username: "",
    name: "",
    sub: 0,
    email: "",
    role: RoleEnum.USER
  })
  React.useEffect(() => {
    axiosInstance.get(ENDPOINT.ME).then(res => {
      const getUser: {
        username: string,
        name: string,
        sub: number,
        email: string,
        role: RoleEnum
      } = res.data.data
      setUser(getUser);
    })
  }, []);
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <TeamSwitcher />
      </SidebarHeader>
      <SidebarContent>
        <NavProjects title="User" projects={data.projects} />
        {user.role === RoleEnum.ADMIN && <NavProjects title="Halaman Admin" projects={data.adminPage} />}
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
