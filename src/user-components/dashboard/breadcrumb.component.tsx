"use client"

import { usePathname } from "next/navigation"
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { HomeIcon } from "lucide-react"
import React from "react"

export function AppBreadcrumb() {
    const pathname = usePathname()
    const segments = pathname.split("/").filter(Boolean)

    return (
        <Breadcrumb>
            <BreadcrumbList>
                <BreadcrumbItem>
                    <HomeIcon className="h-4 w-4" />
                </BreadcrumbItem>
                {segments.length > 0 && <BreadcrumbSeparator />}
                {segments.map((segment, index) => {
                    const href = "/" + segments.slice(0, index + 1).join("/")
                    const isLast = index === segments.length - 1
                    if (isLast) {
                        return (
                            <BreadcrumbItem key={href}>
                                <BreadcrumbPage className="capitalize">{segment}</BreadcrumbPage>
                            </BreadcrumbItem>
                        )
                    } else {
                        return (
                            <React.Fragment key={href}>
                                <BreadcrumbItem>
                                    <BreadcrumbLink href={href} className="capitalize">
                                        {segment}
                                    </BreadcrumbLink>
                                </BreadcrumbItem>
                                <BreadcrumbSeparator />
                            </React.Fragment>
                        )
                    }
                    // return (
                    //     <BreadcrumbItem key={href}>
                    //         {isLast ? (
                    //             <BreadcrumbPage className="capitalize">{segment}</BreadcrumbPage>
                    //         ) : (
                    //             <>
                    //                 <BreadcrumbLink href={href} className="capitalize">
                    //                     {segment}
                    //                 </BreadcrumbLink>
                    //                 <BreadcrumbSeparator />
                    //             </>
                    //         )}
                    //     </BreadcrumbItem>
                    // )
                })}
            </BreadcrumbList>
        </Breadcrumb>
    )
}
