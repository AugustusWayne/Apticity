import { Copy } from 'lucide-react'
import React, { useState } from 'react'

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
    imageUrl: "/images/cyberkangaroo.webp", // Make sure to provide correct image URL
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

export default function PromptExample() {
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
    <div className="w-full min-h-screen bg-black text-white">
      <div className="max-w-7xl mx-auto p-8">
        {/* Decorative Border */}
        <div className="relative border border-gray-800 rounded-2xl p-8">
          <div className="absolute -left-px top-16 w-8 h-px bg-cyan-500/50" />
          <div className="absolute -right-px top-16 w-8 h-px bg-cyan-500/50" />
          
          {/* Header */}
          <div className="text-center mb-16">
            <span className="text-cyan-400 text-sm tracking-widest uppercase">GET INSPIRED</span>
            <h2 className="text-5xl font-mono mt-4 tracking-tight">
              Prompt{" "}
              <span className="inline-block border border-dashed border-gray-700 px-4 py-1 rounded">
                examples
              </span>
            </h2>
          </div>

          {/* Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {examples.map((example) => (
              <div
                key={example.id}
                className="group bg-gray-900/30 rounded-lg border border-gray-800 p-4 hover:border-gray-700 transition-all duration-300"
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
                        <div className="w-4 h-px bg-gray-700" />
                        <h3 className="text-xl font-semibold">{example.title}</h3>
                      </div>
                      <p className="text-gray-400 text-sm font-mono">{example.description}</p>
                    </div>
                    <button
                      onClick={() => copyToClipboard(example.description, example.id)}
                      className="flex items-center gap-2 text-gray-500 hover:text-white text-sm mt-4 transition-colors group"
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
    </div>
  )
}