"use client"
import { Button } from "@/components/ui/button";
import ENDPOINT from "@/config/url";
import { axiosInstance } from "@/util/request.util";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";

export default function HeroSectionGradientBackground() {
  const [logo, setLogo] = useState<number>(0)
  const [schoolName, setSchoolName] = useState<string>("")

  const fetchLogo = useCallback(async () => {
    const res = await axiosInstance.get(`${ENDPOINT.SCHOOL_LOGO}`)
    const res2 = await axiosInstance.get(`${ENDPOINT.SCHOOL_NAME}`)
    setLogo(res.data.data)
    setSchoolName(res2.data.data)
  }, [setLogo, setSchoolName])


  useEffect(() => {
    fetchLogo()
  }, [logo])
  return (
    <>
      {/* Hero */}
      <div className="relative overflow-hidden py-24 lg:py-32">
        {/* Gradients */}
        <div
          aria-hidden="true"
          className="flex absolute -top-96 start-1/2 transform -translate-x-1/2"
        >
          <div className="bg-gradient-to-r from-background/50 to-background blur-3xl w-[25rem] h-[44rem] rotate-[-60deg] transform -translate-x-[10rem]" />
          <div className="bg-gradient-to-tl blur-3xl w-[90rem] h-[50rem] rounded-full origin-top-left -rotate-12 -translate-x-[15rem] from-primary-foreground via-primary-foreground to-background" />
        </div>
        {/* End Gradients */}
        <div className="relative z-10">
          <div className="container py-10 lg:py-16">
            <div className="max-w-2xl flex flex-col text-center gap-5 items-center mx-auto">
              <img src={`${ENDPOINT.DETAIL_IMAGE}/${logo}`} width={150} alt="Logo" />
              <p className="">Sistem Pencatatan Pelanggaran</p>
              {/* Title */}
              <div className="mt-5 max-w-2xl">
                <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">
                  {schoolName}
                </h1>
              </div>
              {/* End Title */}
              {/* Buttons */}
              <div className="mt-8 gap-3 flex justify-center">
                <Link href="/login">
                  <Button size={"lg"}>Login</Button>
                </Link>
              </div>
              {/* End Buttons */}
            </div>
          </div>
        </div>
      </div>
      {/* End Hero */}
    </>
  );
}
