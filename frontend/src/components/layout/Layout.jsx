import { Outlet } from 'react-router-dom'
import Navbar from './Navbar'
import ChatbotWidget from './ChatbotWidget'
import ParticleCanvas from './ParticleCanvas'

export default function Layout() {
  return (
    <div className="min-h-screen bg-[#080B12] text-[#F0F0F5]">
      <ParticleCanvas />
      <Navbar />
      <main className="relative z-10 pt-[72px]">
        <Outlet />
      </main>
      <ChatbotWidget />
      <footer className="relative z-10 border-t border-white/10 py-8 text-center
                         text-[#4A4F66] text-sm">
        © 2026 AI<span className="text-accent">.</span>Solutions — Sunderland
      </footer>
    </div>
  )
}
