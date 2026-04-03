import Link from "next/link";

export function Footer() {
  return (
    <footer className="relative mt-20 border-t border-white/10 bg-gradient-to-b from-[#0b0b12] to-[#050509] text-white">
      
      
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top,rgba(109,94,252,0.15),transparent_60%)]" />

      <div className="mx-auto max-w-[1400px] px-6 py-16">
        <div className="grid gap-12 md:grid-cols-4">

         
          <div>
            <h2 className="text-2xl font-black tracking-tight">BuildVerse</h2>
            <p className="mt-4 text-sm leading-7 text-slate-400">
              A modern tech blog platform where creators share ideas, stories,
              and innovations.
            </p>
          </div>

          
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-400">
              Navigation
            </h3>
            <div className="mt-5 space-y-3 text-sm">
              <Link href="/" className="block hover:text-white">Home</Link>
              <Link href="/create" className="block hover:text-white">Create</Link>
              <Link href="/login" className="block hover:text-white">Login</Link>
              <Link href="/register" className="block hover:text-white">Register</Link>
            </div>
          </div>

          
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-400">
              Connect
            </h3>
            <div className="mt-5 space-y-3 text-sm">
              <a href="https://instagram.com/YOUR_INSTAGRAM_USERNAME" target="_blank" className="block hover:text-white">Instagram</a>
              <a href="https://linkedin.com/in/YOUR_LINKEDIN_USERNAME" target="_blank" className="block hover:text-white">LinkedIn</a>
              <a href="mailto:YOUR_EMAIL@gmail.com" className="block hover:text-white">Contact</a>
            </div>
          </div>

          
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-400">
              Legal
            </h3>
            <div className="mt-5 space-y-3 text-sm">
              <Link href="/terms" className="block hover:text-white">Terms</Link>
              <Link href="/privacy" className="block hover:text-white">Privacy</Link>
              <Link href="/cookies" className="block hover:text-white">Cookies</Link>
            </div>
          </div>
        </div>

        
        <div className="mt-14 flex flex-col items-center justify-between gap-4 border-t border-white/10 pt-6 text-sm text-slate-500 md:flex-row">
          <p>© 2026 BuildVerse. All rights reserved.</p>
          <p className="text-slate-400">Built with  by you</p>
        </div>
      </div>
    </footer>
  );
}