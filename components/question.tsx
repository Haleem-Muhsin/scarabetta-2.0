import { GalleryVerticalEnd } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "./ui/textarea";
import { Dispatch, SetStateAction } from "react";

interface QuestionProps {
  className?: string;
  question: number;
  questionText: string;
  round: number;
  answer: string;
  setAnswer: Dispatch<SetStateAction<string>>;
  onSubmit: (answer: string) => void;
}

export function Question({
  className,
  question,
  questionText,
  round,
  answer,
  setAnswer,
  onSubmit,
  ...props
}: QuestionProps) {
  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    onSubmit(answer);
    setAnswer(""); // ✅ Clear answer field after submission
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
            <h1 className="text-xl font-bold">
              Welcome to Round {round === 3 && question === 3 ? (
                <span className="font-mono italic text-gray-600 px-1 rotate-3 inline-block">{round}</span>
              ) : (
                round
              )}
            </h1>



          </div>
          <div className="flex flex-col gap-6">
            <div className="grid gap-3">
              <Label htmlFor="question">Question {round === 3 && question === 3 ? (
                <span className="font-mono italic text-gray-600 px-1 rotate-3 inline-block">{round}</span>
                ) : (
                  question
                )}
              </Label>
              <Textarea id="question" value={questionText} readOnly />
            </div>
            <div className="flex flex-col gap-3">
              <Label htmlFor="answer">Answer</Label>
              <Input
                id="answer"
                name="answer"
                value={answer} // ✅ Controlled input
                onChange={(e) => setAnswer(e.target.value)} // ✅ Updates state
                required={!(round === 2 && question === 5)}
                autoComplete="off"
              />
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
