import { GalleryVerticalEnd } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "./ui/textarea";

interface QuestionProps {
  className?: string;
  round: number;
  questionText: string;
  onSubmit: (answer: string) => void;
}

export function Question({
  className,
  round,
  questionText,
  onSubmit,
  ...props
}: QuestionProps) {
  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    const formData = new FormData(event.target as HTMLFormElement);
    const answer = formData.get("answer") as string;
    onSubmit(answer);
  };

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <form onSubmit={handleSubmit}>
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
            <h1 className="text-xl font-bold">Welcome to Round {round}</h1>
          </div>
          <div className="flex flex-col gap-6">
            <div className="grid gap-3">
              <Label htmlFor="question">Question {round}</Label>
              <Textarea id="question" value={questionText} readOnly />
            </div>
            <div className="flex flex-col gap-3">
              <Label htmlFor="answer">Answer</Label>
              <Input id="answer" name="answer" required />
            </div>
            <Button type="submit" className="w-full">
              Submit
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
}
