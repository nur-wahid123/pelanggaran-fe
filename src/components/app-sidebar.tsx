"use client"

import * as React from "react"
import {
  Building,
  GalleryVerticalEnd,
  LayoutDashboard,
  List,
  PlusSquareIcon,
  Settings,
  Tag,
  User,
  Users,
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

// This is sample data.
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
  navMain: [
    // {
    //   title: "Dashboard",
    //   url: "/dashboard",
    //   icon: SquareTerminal,
    //   isActive: true,
    // },
    // {
    //   title: "Models",
    //   url: "#",
    //   icon: Bot,
    //   items: [
    //     {
    //       title: "Genesis",
    //       url: "#",
    //     },
    //     {
    //       title: "Explorer",
    //       url: "#",
    //     },
    //     {
    //       title: "Quantum",
    //       url: "#",
    //     },
    //   ],
    // },
    // {
    //   title: "Documentation",
    //   url: "#",
    //   icon: BookOpen,
    //   items: [
    //     {
    //       title: "Introduction",
    //       url: "#",
    //     },
    //     {
    //       title: "Get Started",
    //       url: "#",
    //     },
    //     {
    //       title: "Tutorials",
    //       url: "#",
    //     },
    //     {
    //       title: "Changelog",
    //       url: "#",
    //     },
    //   ],
    // },
    // {
    //   title: "Settings",
    //   url: "#",
    //   icon: Settings2,
    //   items: [
    //     {
    //       title: "General",
    //       url: "#",
    //     },
    //     {
    //       title: "Team",
    //       url: "#",
    //     },
    //     {
    //       title: "Billing",
    //       url: "#",
    //     },
    //     {
    //       title: "Limits",
    //       url: "#",
    //     },
    //   ],
    // },
  ],
  projects: [
    {
      name: "Dashboard",
      url: "/dashboard",
      icon: LayoutDashboard,
    },
    {
      name: "Input Pelanggaran",
      url: "/dashboard/input-violation",
      icon: PlusSquareIcon,
    },
    
  ],
  adminPage: [
    {
      name: "Data Pelanggaran",
      url: "/dashboard/violation",
      icon: List,
    },
    {
      name: "Jenis Pelanggaran",
      url: "/dashboard/violation-type",
      icon: Tag,
    },
    {
      name: "Kelas",
      url: "/dashboard/class-page",
      icon: Building,
    },
    {
      name: "Siswa",
      url: "/dashboard/student",
      icon: User,
    },
    {
      name: "User",
      url: "/dashboard/user",
      icon: Users,
    },
    {
      name: "Pengaturan",
      url: "/dashboard/settings",
      icon: Settings,
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
