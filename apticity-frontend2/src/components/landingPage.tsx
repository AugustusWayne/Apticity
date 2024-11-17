import { useState } from "react"
import { Settings, ArrowRight, Copy } from 'lucide-react'

interface PromptExample {
  id: string
  title: string
  description: string
  imageUrl: string
}

const examples: PromptExample[] = [
  {
    id: "1",
    title: "Cyber Kangaroo",
    description: "CYBER KANGAROO IN SPACE, SCI-FI STYLE, PURPLE COLORS",
    imageUrl: "/images/cyberkangaroo.webp",
  },
  {
    id: "2",
    title: "Cat Warrior",
    description: "ORANGE FUR, CYBER CAT WARRIOR PORTRAIT",
    imageUrl: "/images/catwarrior.png",
  },
  {
    id: "3",
    title: "Origami Batman",
    description: "BATMAN ORIGAMI PAPER SKETCHING, RED HUE",
    imageUrl: "/images/origamibatman.webp",
  },
  {
    id: "4",
    title: "Stellar Black Hole ",
    description: "BLACK HOLE PAINTING, SKY, COSMIC BLUE HIGHLY STYLIZED",
    imageUrl: "/images/blackhole.avif",
  },
]

export default function LandingPage() {
  const [prompt, setPrompt] = useState("A collection of cute cyberpunk robots")
  const [copiedId, setCopiedId] = useState<string | null>(null)

  const copyToClipboard = async (text: string, id: string) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopiedId(id)
      setTimeout(() => setCopiedId(null), 2000)
    } catch (err) {
      console.error('Failed to copy text: ', err)
    }
  }

  return (
    <div className="min-h-screen bg-black text-white w-full flex flex-col">
      
      {/* Hero Section */}
      <main className="flex-grow px-4 py-16">
        <div className="relative">
          {/* 3D Elements */}
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute -left-20 top-20 h-40 w-40 rotate-12 rounded-lg border border-pink-900/30 bg-gradient-to-br from-pink-950 to-purple-950" />
            <div className="absolute -right-20 bottom-20 h-40 w-40 -rotate-12 rounded-lg border border-pink-900/30 bg-gradient-to-br from-pink-950 to-purple-950" />
          </div>

          {/* Content */}
          <div className="relative z-10 text-center">
            <h1 className="mb-4 text-6xl font-bold tracking-tight">
              Generate
              <span className="mx-4 inline-block rounded border border-pink-900/30 px-4 py-2">NFT</span>
              with AI.
            </h1>
            <p className="mb-12 text-xl text-pink-200/70">Create and deploy NFT artwork in seconds</p>

            {/* Generator Interface */}
            <div className="mx-auto max-w-4xl space-y-6">
              <div className="relative">
                <input
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  className="w-full h-14 rounded-lg border border-pink-900/30 bg-pink-950/20 px-4 text-lg text-white"
                />
                <div className="absolute right-2 top-2 space-x-2">
                  <button className="px-4 py-2 text-pink-200/70 hover:text-white">
                    SURPRISE ME
                  </button>
                  <button className="px-4 py-2 bg-gradient-to-r from-pink-500 to-orange-500 hover:from-pink-600 hover:to-orange-600 rounded">
                    GENERATE
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-end">
                <button className="px-4 py-2 border border-pink-900/30 rounded hover:bg-pink-950/30">
                  <Settings className="inline mr-2 h-4 w-4" />
                  ADVANCED
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Prompt Examples Section */}
      <section className="w-full">
        <div className="max-w-7xl mx-auto p-8">
          {/* Decorative Border */}
          <div className="relative border border-pink-900/30 rounded-2xl p-8">
            <div className="absolute -left-px top-16 w-8 h-px bg-gradient-to-r from-pink-500 to-orange-500" />
            <div className="absolute -right-px top-16 w-8 h-px bg-gradient-to-r from-orange-500 to-pink-500" />
            
            {/* Header */}
            <div className="text-center mb-16">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-orange-500 text-sm tracking-widest uppercase font-bold">GET INSPIRED</span>
              <h2 className="text-5xl font-mono mt-4 tracking-tight">
                Prompt{" "}
                <span className="inline-block border border-dashed border-pink-900/30 px-4 py-1 rounded">
                  examples
                </span>
              </h2>
            </div>

            {/* Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {examples.map((example) => (
                <div
                  key={example.id}
                  className="group bg-pink-950/10 rounded-lg border border-pink-900/30 p-4 hover:border-pink-700/50 transition-all duration-300"
                >
                  <div className="flex gap-4">
                    <div className="relative w-32 h-32 rounded-lg overflow-hidden flex-shrink-0">
                      <img
                        src={example.imageUrl}
                        alt={example.title}
                        className="object-cover w-full h-full"
                      />
                    </div>
                    <div className="flex flex-col justify-between flex-grow">
                      <div>
                        <div className="flex items-center gap-2 mb-2">
                          <div className="w-4 h-px bg-gradient-to-r from-pink-500 to-orange-500" />
                          <h3 className="text-xl font-semibold">{example.title}</h3>
                        </div>
                        <p className="text-pink-200/70 text-sm font-mono">{example.description}</p>
                      </div>
                      <button
                        onClick={() => copyToClipboard(example.description, example.id)}
                        className="flex items-center gap-2 text-pink-200/50 hover:text-white text-sm mt-4 transition-colors group"
                      >
                        {copiedId === example.id ? 'COPIED!' : 'COPY'}
                        <Copy className="w-4 h-4 opacity-50 group-hover:opacity-100 transition-opacity" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}