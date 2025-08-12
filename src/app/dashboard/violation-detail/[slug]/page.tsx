import { use } from "react"

export default function Page({params}:{params:Promise<{slug:string}>}) {
    const slug = use(params)
    const studentId = slug.slug
    return (
        <div>
            oiehoihwoieh slug is : {studentId}
        </div>
    )
}