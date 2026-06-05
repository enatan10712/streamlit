import Link from "next/link";
import Image from "next/image";

export default function Home() {
  return (
    <div className="min-h-screen bg-black text-white selection:bg-primary selection:text-white">
      {/* Navbar */}
      <nav className="fixed top-0 w-full z-50 bg-gradient-to-b from-black/80 to-transparent px-4 md:px-12 py-6 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="bg-primary p-1.5 rounded-lg">
            <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          <span className="text-2xl font-black tracking-tighter italic uppercase">StreamVault</span>
        </div>
        <Link
          href="/auth/login"
          className="bg-primary hover:bg-primary/90 text-white px-6 py-2 rounded-md font-bold transition-all transform hover:scale-105"
        >
          Sign In
        </Link>
      </nav>

      {/* Hero Section */}
      <main className="relative h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-black/60 z-10" />
          <img
            src="https://images.unsplash.com/photo-1574267432553-4b4628081c31?q=80&w=2066&auto=format&fit=crop"
            className="w-full h-full object-cover"
            alt="Cinematic Background"
          />
        </div>

        <div className="relative z-20 text-center space-y-8 px-4 max-w-4xl">
          <div className="space-y-4">
            <h1 className="text-5xl md:text-8xl font-black tracking-tighter uppercase italic">
              Unlimited Movies, <br />
              <span className="text-primary">Zero Limits.</span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-300 font-medium">
              Stream the latest blockbusters and exclusive originals anywhere, anytime.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Link
              href="/auth/register"
              className="w-full sm:w-auto bg-primary text-white text-xl font-bold px-12 py-4 rounded-md transition-all hover:bg-primary/90 transform hover:scale-105 shadow-[0_0_30px_rgba(124,58,237,0.4)]"
            >
              Start Your Free Trial
            </Link>
          </div>

          <p className="text-sm text-gray-400">
            Ready to watch? Enter your email to create or restart your membership.
          </p>
        </div>
      </main>

      {/* Features */}
      <section className="py-24 px-4 md:px-12 bg-[#0d0c1d]">
        <div className="max-w-7xl mx-auto grid md:grid-cols-3 gap-12 text-center">
          <div className="space-y-4 p-8 rounded-2xl bg-white/5 border border-white/10 hover:border-primary/50 transition-colors">
            <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-8 h-8 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
            <h3 className="text-2xl font-bold">Watch on any device</h3>
            <p className="text-gray-400">Stream on your phone, tablet, laptop, and TV without extra costs.</p>
          </div>
          <div className="space-y-4 p-8 rounded-2xl bg-white/5 border border-white/10 hover:border-primary/50 transition-colors">
            <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-8 h-8 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
            </div>
            <h3 className="text-2xl font-bold">Download and go</h3>
            <p className="text-gray-400">Save your favorites easily and always have something to watch.</p>
          </div>
          <div className="space-y-4 p-8 rounded-2xl bg-white/5 border border-white/10 hover:border-primary/50 transition-colors">
            <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-8 h-8 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <h3 className="text-2xl font-bold">Safe for kids</h3>
            <p className="text-gray-400">Send kids on adventures with their favorite characters in a space made just for them.</p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-4 md:px-12 border-t border-white/10 text-gray-500 text-sm">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex items-center gap-2 grayscale opacity-50">
            <div className="bg-white p-1 rounded-sm">
              <svg className="w-4 h-4 text-black" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <span className="font-black tracking-tighter uppercase italic">StreamVault</span>
          </div>
          <div className="flex gap-8">
            <a href="#" className="hover:underline">Privacy Policy</a>
            <a href="#" className="hover:underline">Terms of Use</a>
            <a href="#" className="hover:underline">Help Center</a>
          </div>
          <p>© 2024 StreamVault Inc.</p>
        </div>
      </footer>
    </div>
  );
}
