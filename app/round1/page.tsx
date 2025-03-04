import {Question } from "@/components/question";
import { GalleryVerticalEnd } from "lucide-react";

export default function Round1Page() {
    return (
        <div className="bg-muted flex min-h-svh flex-col items-center justify-center gap-6 p-6 md:p-10">
        <div className="flex w-full max-w-sm flex-col gap-6">
          <a href="#" className="flex items-center gap-2 self-center font-medium text-2xl">
            <div className="bg-primary text-primary-foreground flex size-6 items-center justify-center rounded-md">
              <GalleryVerticalEnd className="size-4" />
            </div>
            Scarabetta 2.0
          </a>
          <Question/>
        </div>
      </div>
    )
}
