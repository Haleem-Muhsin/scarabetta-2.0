"use client"
import { GalleryVerticalEnd } from "lucide-react"
import { LoginForm } from "@/components/login"
import  Threads  from "@/components/ui/threads"

export default function LoginPage() {
  return (
    <div className="bg-muted flex min-h-svh flex-col items-center justify-center gap-6 p-6 md:p-10 relative">
      <Threads
        color={[1, 1, 1]}
        amplitude={1}
        distance={1}
        enableMouseInteraction={true}
      />
      <div className="flex w-full max-w-sm flex-col gap-6 z-10 relative ">
        <a href="#" className="flex items-center gap-2 self-center font-medium text-2xl">
          <div className="bg-primary text-primary-foreground flex size-6 items-center justify-center rounded-md">
            <GalleryVerticalEnd className="size-4" />
          </div>
          Scarabetta 2.0
        </a>
        <LoginForm />
      </div>
    </div>
  )
}
