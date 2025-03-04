import { GalleryVerticalEnd } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "./ui/textarea"

interface QuestionProps {
  className?: string;
  textareaProps?: React.ComponentProps<typeof Textarea>;
}

export function Question({
  className,
  textareaProps,
  ...props
}: QuestionProps) {
  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <form>
        <div className="flex flex-col gap-6">
          <div className="flex flex-col items-center gap-2">
            <a
              href="#"
              className="flex flex-col items-center gap-2 font-medium"
            >
              <div className="flex size-8 items-center justify-center rounded-md">
                <GalleryVerticalEnd className="size-6" />
              </div>
              <span className="sr-only">Scarabetta 2.0</span>
            </a>
            <h1 className="text-xl font-bold">Welcome to Round {}</h1>
          </div>
          <div className="flex flex-col gap-6">
            <div className="grid gap-3">
              <Label htmlFor="question">Question {}</Label>
              <Textarea {...textareaProps} />
            </div>
            <div className="flex flex-col gap-3">
              <label htmlFor="answer">Answer</label>
              <Input id="answer" />
            </div>
            <Button type="submit" className="w-full">
              Submit
            </Button>
          </div>
        </div>
      </form>
    </div>
  )
}
