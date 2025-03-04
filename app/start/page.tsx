"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function StartPage() {
  const router = useRouter();
  const [showText, setShowText] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setShowText((prev) => !prev);
    }, 500); // Toggle visibility every 500ms

    return () => clearInterval(interval);
  }, []);

  return (
    <div
      className="flex h-screen items-end justify-center bg-black text-white py-10"
      style={{ backgroundImage: 'url("/images/Desktop-2.png")',backgroundSize: 'cover', backgroundPosition: 'center', backgroundRepeat: 'no-repeat' }}
      onClick={() => router.push("/guidelines")} // Change "/next-page" to your target page
    >
      {showText && (
        <p className="text-xl cursor-pointer animate-blink">
          Click on the screen to continue
        </p>
      )}
    </div>
  );
}
