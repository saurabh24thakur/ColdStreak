"use client"

import { useRef, useState } from "react"
import { motion, useScroll, useTransform, PanInfo } from "framer-motion"
import Link from "next/link"

export default function WinterArcPortal() {
  const containerRef = useRef<HTMLDivElement>(null)
  
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"]
  })

  // Portal Hero Transformations
  const titleScale = useTransform(scrollYProgress, [0, 0.4], [1, 1.3])
  const titleTracking = useTransform(scrollYProgress, [0, 0.4], ["-0.02em", "-0.04em"])
  
  // Left half moves left, Right half moves right
  const titleLeftX = useTransform(scrollYProgress, [0, 0.4], ["0%", "-30%"])
  const titleRightX = useTransform(scrollYProgress, [0, 0.4], ["0%", "30%"])

  // Panels opening
  const panelLeftX = useTransform(scrollYProgress, [0, 0.4], ["0%", "-100%"])
  const panelRightX = useTransform(scrollYProgress, [0, 0.4], ["0%", "100%"])

  // Image effects
  const imageScale = useTransform(scrollYProgress, [0, 0.4], [1.1, 1])
  const overlayOpacity = useTransform(scrollYProgress, [0, 0.4], [0, 0.5])
  
  // Floating dots (using safe x/y transforms from center)
  const dotLeftX = useTransform(scrollYProgress, [0, 0.4], ["0vw", "-40vw"])
  const dotLeftY = useTransform(scrollYProgress, [0, 0.4], ["0vh", "-40vh"])
  const dotRightX = useTransform(scrollYProgress, [0, 0.4], ["0vw", "40vw"])
  const dotRightY = useTransform(scrollYProgress, [0, 0.4], ["0vh", "40vh"])

  // Floating statement image
  const statementImageRotate = useTransform(scrollYProgress, [0, 1], [0, 360])
  const statementImageY = useTransform(scrollYProgress, [0, 1], [0, -200])

  return (
    <div className="bg-ground text-ink min-h-screen selection:bg-amber/20 font-sans">
      
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 h-[58px] bg-ground/60 backdrop-blur-[14px] border-b border-hairline z-50 flex items-center justify-between px-6">
        <div className="font-heading font-bold text-[15px] tracking-tight">
          COLD STREAK<span className="text-amber">.</span>
        </div>
        <div className="flex items-center gap-8">
          <div className="hidden md:flex gap-6 text-[10.5px] uppercase tracking-[0.15em] font-medium">
            <Link href="/login" className="hover:text-amber transition-colors">Sign In</Link>
            <Link href="/dashboard" className="hover:text-amber transition-colors">Dashboard</Link>
          </div>
          <Link href="/signup" className="px-5 py-2 rounded-full border border-hairline text-[10.5px] uppercase tracking-[0.15em] hover:bg-ink hover:text-ground transition-colors font-medium">
            Start Now
          </Link>
        </div>
      </nav>

      {/* Portal Hero - 2.5 viewports tall */}
      <section ref={containerRef} className="h-[250vh] relative">
        <div className="sticky top-0 h-screen w-full overflow-hidden isolate">
          
          {/* Base Image - Dark Moody Gym / Focus */}
          <motion.div 
            className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1517836357463-d25dfeac3438?q=80&w=2000')] bg-cover bg-center"
            style={{ scale: imageScale }}
          />

          {/* Duotone Wash */}
          <motion.div 
            className="absolute inset-0 mix-blend-overlay pointer-events-none bg-gradient-to-br from-amber to-teal"
            style={{ opacity: overlayOpacity }}
          />

          {/* Radial Veil */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,var(--ground)_100%)] opacity-80 pointer-events-none" />

          {/* Glowing Accents */}
          <motion.div 
            className="absolute top-1/2 left-1/2 w-2 h-2 rounded-full bg-amber shadow-[0_0_20px_4px_rgba(147,51,234,0.5)] z-20 -translate-x-1/2 -translate-y-1/2"
            style={{ x: dotLeftX, y: dotLeftY }}
          />
          <motion.div 
            className="absolute top-1/2 left-1/2 w-2 h-2 rounded-full bg-teal shadow-[0_0_20px_4px_rgba(216,180,254,0.5)] z-20 -translate-x-1/2 -translate-y-1/2"
            style={{ x: dotRightX, y: dotRightY }}
          />

          {/* Solid Panels */}
          <motion.div 
            className="absolute top-0 bottom-0 left-0 w-[51vw] bg-ground border-r border-hairline z-10"
            style={{ x: panelLeftX }}
          />
          <motion.div 
            className="absolute top-0 bottom-0 right-0 w-[51vw] bg-ground border-l border-hairline z-10"
            style={{ x: panelRightX }}
          />

          {/* Corner Metadata */}
          <div className="absolute top-24 left-6 z-20 text-[10.5px] uppercase tracking-[0.15em] text-muted font-medium mix-blend-difference">
            Phase 01
          </div>
          <div className="absolute bottom-10 right-6 z-20 text-[10.5px] uppercase tracking-[0.15em] text-muted font-medium mix-blend-difference">
            System Overhaul
          </div>

          {/* The Portal Title */}
          <div className="absolute inset-0 flex items-center justify-center z-30 pointer-events-none overflow-hidden">
            <motion.h1 
              className="font-heading font-extrabold text-[12vw] leading-none uppercase text-ink flex whitespace-nowrap mix-blend-difference gap-6"
              style={{ 
                scale: titleScale,
                letterSpacing: titleTracking
              }}
            >
              <motion.span style={{ x: titleLeftX }}>COLD</motion.span>
              <motion.span style={{ x: titleRightX }}>STREAK</motion.span>
            </motion.h1>
          </div>
        </div>
      </section>

      {/* Statement Fold */}
      <section className="min-h-screen relative flex items-center border-t border-hairline overflow-hidden bg-ground-secondary">
        <div className="absolute -right-32 top-1/4 opacity-10 pointer-events-none">
          <motion.div 
            className="w-96 h-96 rounded-full border border-ink bg-transparent"
            style={{ rotate: statementImageRotate, y: statementImageY }}
          >
            <div className="w-full h-full border border-ink rounded-full absolute top-4 left-4" />
          </motion.div>
        </div>
        
        <div className="max-w-[1400px] mx-auto px-6 w-full relative z-10 grid grid-cols-1 md:grid-cols-12 gap-8">
          <div className="md:col-span-1 flex flex-col justify-between">
            <span className="text-[10.5px] uppercase tracking-[0.15em] text-amber font-medium">Discipline</span>
            <span 
              className="text-[120px] font-heading font-bold opacity-10 select-none hidden md:block" 
              style={{ WebkitTextStroke: "1px var(--ink)", WebkitTextFillColor: "transparent" }}
            >
              90
            </span>
          </div>
          <div className="md:col-span-9 md:col-start-3">
            <h2 className="font-heading font-semibold text-[clamp(24px,3.6vw,52px)] leading-[1.1] max-w-[22ch] tracking-tight">
              We build discipline from the static. A brutal catalog of <span className="text-amber">effort and consistency</span>, engineered for those who stay hard.
            </h2>
          </div>
        </div>
      </section>

      {/* Releases (Throwable Deck) */}
      <section className="py-32 border-t border-hairline bg-ground">
        <div className="max-w-[1400px] mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-20">
          <div className="flex flex-col justify-center space-y-8">
            <h2 className="font-heading font-bold text-5xl tracking-tight">Your Archive</h2>
            <p className="text-ink-secondary text-lg max-w-md leading-relaxed font-light">
              Explore your past check-ins. Every card represents a distinct checkpoint in your personal growth, distilled by AI intelligence.
            </p>
            <div className="flex gap-4">
              <Link href="/dashboard" className="px-6 py-3 bg-ink text-ground font-medium text-[10.5px] uppercase tracking-[0.15em] hover:bg-amber transition-colors rounded-sm inline-block">
                Enter Dashboard
              </Link>
              <Link href="/dashboard/check-in" className="px-6 py-3 border border-hairline text-ink font-medium text-[10.5px] uppercase tracking-[0.15em] hover:bg-ground-secondary transition-colors rounded-sm inline-block">
                Log Today
              </Link>
            </div>
          </div>
          
          <div className="relative h-[500px] flex items-center justify-center">
            <Deck />
            <div className="absolute bottom-0 w-full flex justify-between items-center px-4">
              <span className="text-[10.5px] uppercase tracking-[0.15em] text-muted">Swipe left/right</span>
              <div className="flex gap-2">
                {[1,2,3,4,5].map(i => (
                  <div key={i} className="w-1.5 h-1.5 rounded-full bg-hairline" />
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Core Metrics & Logs */}
      <section className="py-32 bg-ground-secondary border-t border-hairline">
        <div className="max-w-[1400px] mx-auto px-6 space-y-32">
          
          {/* Metrics */}
          <div>
            <div className="flex justify-between items-end mb-12 border-b border-hairline pb-4">
              <span className="text-[10.5px] uppercase tracking-[0.15em] text-teal font-medium">Core Habits</span>
            </div>
            <div className="flex flex-col">
              {['Physical Training', 'Deep Work', 'Mental Recovery', 'Nutrition Standard'].map((habit, i) => (
                <div key={habit} className="group flex justify-between items-center py-6 border-b border-hairline hover:bg-ground transition-colors px-4 -mx-4 cursor-pointer">
                  <h3 className="font-heading font-bold text-4xl tracking-tight group-hover:text-amber transition-colors">{habit}</h3>
                  <span className="font-mono text-sm text-muted">M_0{i+1}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Logs Table */}
          <div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pb-4 border-b border-hairline text-[10.5px] uppercase tracking-[0.15em] text-muted font-medium">
              <div>Status</div>
              <div>Habit Hit</div>
              <div className="hidden md:block">AI Checkpoint</div>
              <div className="hidden md:block text-right">Date</div>
            </div>
            
            <div className="flex flex-col">
              {[
                { s: 'Secured', h: 'Workout, Study', c: 'Pushed limits on heavy lifts', d: 'Today' },
                { s: 'Secured', h: 'Study, Sleep', c: 'Deep focused coding session', d: 'Yesterday' },
                { s: 'Missed', h: 'None', c: 'Rest day, needed recovery', d: '2 Days Ago' },
              ].map((row, i) => (
                <div key={i} className="grid grid-cols-2 md:grid-cols-4 gap-4 py-6 border-b border-hairline items-center hover:bg-ground transition-colors px-4 -mx-4 cursor-pointer">
                  <div className="font-heading font-bold text-xl">{row.s}</div>
                  <div className="text-ink-secondary text-sm">{row.h}</div>
                  <div className="hidden md:block text-ink-secondary text-sm">{row.c}</div>
                  <div className="hidden md:block text-right font-mono text-sm text-amber">{row.d}</div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </section>

      {/* Close */}
      <footer className="pt-32 pb-0 bg-ground border-t border-hairline relative overflow-hidden">
        <div className="max-w-[1400px] mx-auto px-6 mb-24 flex flex-col md:flex-row justify-between items-start gap-12">
          <div>
            <h2 className="font-heading font-bold text-3xl mb-4">Lock in today.</h2>
            <p className="text-[10.5px] uppercase tracking-[0.15em] text-muted max-w-xs leading-relaxed">
              Create an accountability room. Track your habits. Build your cold streak without distractions.
            </p>
          </div>
          <div className="flex gap-4">
            <Link href="/signup" className="px-6 py-3 border border-hairline text-ink font-medium text-[10.5px] uppercase tracking-[0.15em] hover:bg-ink hover:text-ground transition-colors rounded-sm inline-block">
              Start Tracking
            </Link>
          </div>
        </div>
        
        <div className="border-t border-hairline pt-8 px-6 pb-2" />
        
        <div className="w-full translate-y-[15%]">
          <h2 className="font-heading font-extrabold text-[15vw] md:text-[20vw] leading-[0.75] uppercase text-ink text-center whitespace-nowrap opacity-10 select-none tracking-tighter">
            COLD STREAK
          </h2>
        </div>
      </footer>

    </div>
  )
}

// Throwable Deck Component
const cards = [
  "https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?q=80&w=600",
  "https://images.unsplash.com/photo-1499750310107-5fef28a66643?q=80&w=600",
  "https://images.unsplash.com/photo-1550399105-c4db5fb85c18?q=80&w=600",
  "https://images.unsplash.com/photo-1507398941214-5b10f54b6d77?q=80&w=600",
  "https://images.unsplash.com/photo-1519671482749-fd0987ab7615?q=80&w=600"
]

function Deck() {
  const [deck, setDeck] = useState(cards)

  const handleDragEnd = (e: any, info: PanInfo, index: number) => {
    const threshold = 100
    if (info.offset.x > threshold || info.offset.x < -threshold) {
      // Throw card away
      setDeck((prev) => {
        const newDeck = [...prev]
        const thrown = newDeck.shift()
        if (thrown) newDeck.push(thrown)
        return newDeck
      })
    }
  }

  return (
    <div className="relative w-[300px] h-[300px] md:w-[400px] md:h-[400px] perspective-[1000px]">
      {deck.map((src, index) => {
        const isTop = index === 0
        return (
          <motion.div
            key={src}
            className="absolute inset-0 rounded-sm overflow-hidden shadow-2xl border border-hairline origin-bottom"
            style={{
              zIndex: deck.length - index,
            }}
            initial={false}
            animate={{
              y: index * 10,
              x: index * 5,
              scale: 1 - index * 0.05,
              rotate: index === 0 ? 0 : index % 2 === 0 ? 2 : -2,
            }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
            drag={isTop ? "x" : false}
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.8}
            onDragEnd={(e, info) => isTop && handleDragEnd(e, info, index)}
            whileDrag={{ scale: 1.05, rotate: 5, cursor: "grabbing" }}
            whileHover={isTop ? { y: -5, cursor: "grab" } : {}}
          >
            <img src={src} alt="Archive Card" className="w-full h-full object-cover pointer-events-none filter grayscale hover:grayscale-0 transition-all duration-500" />
            <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent">
              <div className="text-[10px] uppercase tracking-widest text-white/70">Checkpoint {deck.length - index}</div>
            </div>
          </motion.div>
        )
      })}
    </div>
  )
}
