import { useState } from "react"
import { Settings, Plus, ArrowRight } from 'lucide-react'
import React from "react"

export default function NFTGenerator() {
  const [prompt, setPrompt] = useState("A collection of cute cyberpunk robots")

  return (
    <div className="700px bg-black text-white w-full flex flex-col">
      {/* Navigation */}
      <nav className="border-b border-gray-800 w-full">
        <div className="w-full px-4">
          <div className="flex h-16 items-center justify-around">
            <div className="flex items-center space-x-8">
              <a href="/" className="text-2xl font-bold">
                <div className="flex items-center">
                  <div className="h-8 w-8 rounded bg-blue-500" />
                  <span className="ml-2">NFT</span>
                </div>
              </a>
              <button className="text-gray-400 hover:text-white">OUR ECOSYSTEM</button>
              <button className="text-blue-400 hover:text-blue-300">Generate</button>
              <button className="text-gray-400 hover:text-white">Explore</button>
              <button className="text-gray-400 hover:text-white">My NFTs</button>
              <button className="text-gray-400 hover:text-white">Events</button>
            </div>
            <div className="flex items-center space-x-4">
              <button className="px-4 py-2 border border-gray-700 rounded text-gray-400 hover:bg-gray-800">
                0 Credits
              </button>
              <div className="h-8 w-8 rounded-full bg-gray-800"></div>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="flex-grow px-4 py-16">
        <div className="relative">
          {/* 3D Elements */}
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute -left-20 top-20 h-40 w-40 rotate-12 rounded-lg border border-gray-800 bg-gray-900" />
            <div className="absolute -right-20 bottom-20 h-40 w-40 -rotate-12 rounded-lg border border-gray-800 bg-gray-900" />
          </div>

          {/* Content */}
          <div className="relative z-10 text-center">
            <h1 className="mb-4 text-6xl font-bold tracking-tight">
              Generate
              <span className="mx-4 inline-block rounded border border-gray-700 px-4 py-2">NFT</span>
              with AI.
            </h1>
            <p className="mb-12 text-xl text-gray-400">Create and deploy NFT artwork in seconds</p>

            {/* Generator Interface */}
            <div className="mx-auto max-w-4xl space-y-6">
              <div className="relative">
                <input
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  className="w-full h-14 rounded-lg border border-gray-800 bg-gray-900 px-4 text-lg text-white"
                />
                <div className="absolute right-2 top-2 space-x-2">
                  <button className="px-4 py-2 text-gray-400 hover:text-white">
                    SURPRISE ME
                  </button>
                  <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded">
                    GENERATE
                  </button>
                </div>
              </div>

              <div className="flex items-center  justify-end">
                {/* <div className="flex space-x-4">
                  <button className="px-4 py-2 border border-gray-800 rounded hover:bg-gray-800">
                    SINGLE IMAGE
                  </button>
                  <button className="px-4 py-2 border border-gray-800 rounded hover:bg-gray-800">
                    VISIONARY FORGE
                  </button>
                  <button className="px-4 py-2 border border-gray-800 rounded hover:bg-gray-800">
                    <Plus className="inline mr-2 h-4 w-4" />
                    ADD STYLES
                  </button>
                  <button className="px-4 py-2 border border-gray-800 rounded hover:bg-gray-800">
                    GENERATE BY IMAGE
                  </button>
                </div> */}
                <button className="px-4 py-2 border border-gray-800 rounded hover:bg-gray-800">
                  <Settings className="inline mr-2 h-4 w-4" />
                  ADVANCED
                </button>
              </div>
            </div>

            {/* Freemium Banner */}
            <div className="mt-8 mx-auto rounded-lg border border-gray-800 bg-gray-900 p-3 max-w-4xl">
              <div className="flex items-center justify-between ">
                <p className="text-gray-400">
                  Current cost of generation is <span className="text-white">free</span>. Wish to gain access to more features?
                </p>
                <button className="px-3 py-2 bg-blue-600 hover:bg-blue-700 rounded flex items-center">
                  PREMIUM PLAN
                  <ArrowRight className="ml-2 h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}