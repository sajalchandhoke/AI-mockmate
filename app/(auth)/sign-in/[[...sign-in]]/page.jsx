import { SignIn } from "@clerk/nextjs";

export default function Page() {
  return (
    <div className="min-h-screen flex fle-col items-center justify-center py-6 px-4">
      <div className="grid md:grid-cols-2 items-center gap-10 max-w-6xl max-md:max-w-md w-full">
        <div>
          <h2 className="lg:text-5xl text-3xl font-bold lg:leading-[57px] text-slate-900">
            Welcome to AI MOCK MATE
          </h2>
          <p className="text-sm mt-6 text-slate-500 leading-relaxed">
            Your personalised interview preperation platform . Effortlessly
            access your account.
          </p>
        </div>
        <SignIn />
      </div>
    </div>
  );
}
