import { UserButton } from "@clerk/nextjs";
import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50 text-gray-900">
      <nav className="w-full py-4 px-6 flex justify-between items-center shadow-sm bg-white">
        <h1 className="text-2xl sm:text-3xl font-bold text-blue-600">
          AI MockMate
        </h1>
        <UserButton />
      </nav>

      <main className="flex-grow flex flex-col items-center justify-center text-center px-6 py-16 max-w-4xl mx-auto">
        <h1 className="text-4xl sm:text-5xl font-extrabold leading-tight">
          Perfect Your Interviews with{" "}
          <span className="text-blue-600">AI MockMate</span>
        </h1>
        <p className="mt-4 text-lg text-gray-600">
          Get real-time AI-powered mock interviews and boost your confidence to
          land your dream job.
        </p>

        <Link href="/dashboard">
          <button className="mt-8 bg-blue-600 hover:bg-blue-700 text-white text-lg font-medium px-8 py-3 rounded-xl shadow-md transition duration-300 cursor-pointer">
            Start Interview
          </button>
        </Link>

        <div className="mt-12 w-full max-w-md bg-white rounded-2xl shadow-lg p-6 text-left">
          <h2 className="text-xl font-semibold text-blue-600 mb-2">
            What You'll Get:
          </h2>
          <ul className="text-gray-700 list-disc list-inside space-y-1">
            <li>Role-specific AI-generated interview questions</li>
            <li>Mock answers with personalized feedback</li>
            <li>Track your performance and improve over time</li>
          </ul>
        </div>
      </main>

      <footer className="w-full py-4 text-center text-sm text-gray-500 border-t bg-white">
        © {new Date().getFullYear()} AI MockMate. Made by
        github.com/sajalchandhoke.
      </footer>
    </div>
  );
}
