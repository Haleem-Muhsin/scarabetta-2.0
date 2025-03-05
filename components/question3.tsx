import { GalleryVerticalEnd } from "lucide-react"
import { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Textarea } from "./ui/textarea"
import { fetchQuestion, checkAnswer } from "@/lib/firebase"

export function Question3({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"div">) {
  const router = useRouter()
  const [question, setQuestion] = useState<string>("")
  const [options, setOptions] = useState<string[]>([
    "Cache", 
    "RAM", 
    "Register", 
  ]) // Default options or you can fetch from Firebase
  const [selectedOption, setSelectedOption] = useState<string>("")
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)
  const [feedback, setFeedback] = useState<string>("")
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false)
  
  // Reference to calculate the height needed for 3 options
  const optionRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const getQuestion = async () => {
      try {
        setLoading(true)
        // Fetch question from collection 1, document 3
        const questionData = await fetchQuestion(1, 3)
        
        if (questionData && questionData.q) {
          setQuestion(questionData.q)
          // If you have options in your question data
          if (questionData.options && Array.isArray(questionData.options)) {
            setOptions(questionData.options)
          }
        } else {
          setError("Question not found")
        }
      } catch (err) {
        setError("Error fetching question")
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    getQuestion()
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!selectedOption || isSubmitting) return
    
    try {
      setIsSubmitting(true)
      setFeedback("Checking answer...")
      
      // Check answer against database
      const result = await checkAnswer(1, 3, selectedOption)
      
      if (result.correct) {
        setFeedback("Correct! Moving to next question...")
        
        // Update score in localStorage
        const currentScore = parseInt(localStorage.getItem("score") || "0")
        localStorage.setItem("score", (currentScore + 10).toString())
        
        // Wait a moment before redirecting
        setTimeout(() => {
          // This will trigger the parent component to move to the next question
          // by refreshing the page with updated questionNumber in localStorage
          localStorage.setItem("questionNumber", "4")
          window.location.reload()
        }, 1500)
      } else {
        setFeedback("Incorrect. Please try again.")
        setTimeout(() => {
          setFeedback("")
        }, 1500)
      }
    } catch (err) {
      console.error("Error submitting answer:", err)
      setFeedback("Error checking answer. Please try again.")
      setTimeout(() => {
        setFeedback("")
      }, 1500)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleOptionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedOption(e.target.value)
  }

  // Calculate the initial height to show exactly 3 options
  // Each option is approximately 28px high (including margin)
  // Plus padding (16px top + 16px bottom = 32px)
  const initialHeight =28 + 32 + 'px'

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <form onSubmit={handleSubmit}>
        <div className="flex flex-col gap-6">
          <div className="flex flex-col items-center gap-2">
            <a
              href="#"
              className="flex flex-col items-center gap-2 font-medium"
            >
              <div className="flex h-8 w-8 items-center justify-center rounded-md">
                <GalleryVerticalEnd className="size-6" />
              </div>
              <span className="sr-only">Scarabetta 2.0</span>
            </a>
            <h1 className="text-xl font-bold">Welcome to Round 1</h1>
          </div>
          <div className="flex flex-col gap-6">
            <div className="grid gap-2">
              <Label htmlFor="question3">Question 3</Label>
              {loading ? (
                <Textarea id="question3" value="Loading question..." readOnly />
              ) : error ? (
                <Textarea id="question3" value={error} readOnly />
              ) : (
                <Textarea id="question3" value={question} readOnly />
              )}
            </div>
            <div className="grid gap-2">
              <Label htmlFor="answer3">Your Answer</Label>
              <div 
                className="resizable border rounded-md p-4" 
                style={{
                  resize: "vertical",
                  height: initialHeight,
                  minHeight: "84px", // Minimum height for 3 options
                  maxHeight: "400px",
                  overflow: "auto",
                  msOverflowStyle: "none", // Hide scrollbar in IE and Edge
                  scrollbarWidth: "none", // Hide scrollbar in Firefox
                }}
              >
                <style jsx>{`
                  div::-webkit-scrollbar {
                    display: none; /* Hide scrollbar in Chrome, Safari and Opera */
                  }
                `}</style>
                {loading ? (
                  <div className="flex items-center justify-center h-full">
                    <p>Loading options...</p>
                  </div>
                ) : (
                  <div className="space-y-3" ref={optionRef}>
                    {options.map((option, index) => (
                      <div key={index} className="flex items-center space-x-2">
                        <input
                          type="radio"
                          id={`option-${index}`}
                          name="answer-options"
                          value={option}
                          checked={selectedOption === option}
                          onChange={handleOptionChange}
                          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                        />
                        <Label 
                          htmlFor={`option-${index}`}
                          className="text-sm font-medium text-gray-700 cursor-pointer"
                        >
                          {option}
                        </Label>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
            {feedback && (
              <div className="text-center font-medium">
                {feedback}
              </div>
            )}
            <Button 
              type="submit" 
              className="w-full" 
              disabled={!selectedOption || isSubmitting || loading}
            >
              {isSubmitting ? "Checking..." : "Submit"}
            </Button>
          </div>
        </div>
      </form>
    </div>
  )
}
