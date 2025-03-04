"use client";
import { Button } from "@/components/ui/button";
import { Spotlight } from "@/components/ui/spotlight-new";
import { ArrowLeft, Link } from "lucide-react";
import { useRouter } from "next/navigation";

export default function GuidelinesPage() {
    const router = useRouter(); // Initialize router
    const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault(); // Prevent default form submission
    router.push("/round1"); // Navigate to /start
  };
  return (
    <div className="relative min-h-screen bg-gray-900">
        <Spotlight />
            <div className="absolute top-0 left-0 w-full h-full">
                <div className="flex flex-col items-center justify-normal h-screen gap-6 py-20">
                    <h1 className="text-5xl font-bold text-white px-10">GUIDELINES</h1>

                    {/* Guidelines */}
                    <div className="flex flex-col text-justify text-xl px-10 py-10 ">
                        <ul className="list-disc text-white text-justify pl-20">
                            <li className="leading-8 text-justify mb-4">
                                <strong>Eligibility:</strong> Open to Asthra Pass holders.
                            </li>
                            <li className="leading-8 text-justify mb-4">
                                <strong>Registration:</strong> Must register online to access clues.
                            </li>
                            <li className="leading-8 text-justify mb-4">
                                <strong>Participation:</strong> Compete individually or in teams (max 4). <br /> No cross-team collaboration.
                            </li>
                            <li className="leading-8 text-justify mb-4">
                                <strong>Clues:</strong> Solve clues sequentially to progress.
                            </li>
                            <li className="leading-8 text-justify mb-4">
                                <strong>Fair Play:</strong> No hacking or answer-sharing.
                            </li>
                            <li className="leading-8 text-justify mb-4">
                                <strong>Time Limit:</strong> Complete within the set duration.
                            </li>
                            <li className="leading-8 text-justify mb-4">
                                <strong>Prizes:</strong> Awarded based on fastest completion or highest score.
                            </li>
                            <li className="leading-8 text-justify mb-4">
                                <strong>Disqualification:</strong> Rule violations result in disqualification.
                            </li>
                            <li className="leading-8 text-justify mb-4">
                                <strong>Organizers' Decision:</strong> Final and binding on all matters.
                            </li>
                            <li className="leading-8 text-justify mb-4">
                                <strong>Code of Conduct:</strong> Maintain respect and sportsmanship.
                            </li>
                        </ul>
                        <br />
                        <div className="flex justify-center items-end h-full">
                            <Button variant={"outline"} size={"xl"} className="text-xl" onClick={handleSubmit}>
                                Start Hunt
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
            
        </div>
  
  );
}

