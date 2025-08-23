'use client'

import StudentAndViolationInput from "@/user-components/input-violation/student-and-violation-input"

export default function Page() {
    

    return (
        <div className="p-4 w-full">
            <h1 className="scroll-m-20 text-2xl mb-4 font-extrabold tracking-tight lg:text-5xl">
                Input Pelanggaran
            </h1>
            <StudentAndViolationInput/>
        </div>
    )
}