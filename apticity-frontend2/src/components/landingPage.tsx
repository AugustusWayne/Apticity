import { useState, useEffect } from "react";
import { Copy } from "lucide-react";
import { GenerateButton } from "./generateButton";
import MintNFTButton from "./mintNFT";
import GeneratedImage from "./generatedImage"; // Import the GeneratedImage component

interface PromptExample {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
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
    title: "Stellar Black Hole",
    description: "BLACK HOLE PAINTING, SKY, COSMIC BLUE HIGHLY STYLIZED",
    imageUrl: "/images/blackhole.avif",
  },
];

const MODEL_NAMES = ["stable-diffusion-2-1", "FLUX.1-dev"];

export default function LandingPage() {
  const [prompt, setPrompt] = useState("angel aesthetic robot girl, highly stylized");
  const [copiedId, setCopiedId] = useState<string | null>(null); // Track copied ID
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [isDemoImage, setIsDemoImage] = useState(false);
  const [model, setModel] = useState(MODEL_NAMES[0]);
  const [typedModelName, setTypedModelName] = useState("");
  const [typingIndex, setTypingIndex] = useState(0);
  const [isTyping, setIsTyping] = useState(true);

  const copyToClipboard = async (text: string, id: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedId(id); // Set the copied ID
      setTimeout(() => setCopiedId(null), 2000); // Clear after 2 seconds
    } catch (err) {
      console.error("Failed to copy text: ", err);
    }
  };

  // Handle model name typing effect
  useEffect(() => {
    if (isTyping) {
      const interval = setInterval(() => {
        if (typingIndex < model.length) {
          setTypedModelName((prev) => prev + model[typingIndex]);
          setTypingIndex(typingIndex + 1);
        } else {
          clearInterval(interval);
          setTimeout(() => {
            setIsTyping(false);
            setTypingIndex(0);
            setTypedModelName("");
            setModel((prev) => (prev === MODEL_NAMES[0] ? MODEL_NAMES[1] : MODEL_NAMES[0]));
            setIsTyping(true);
          }, 1000); // Wait for 1 second before switching the model
        }
      }, 150); // Typing speed (150ms between characters)

      return () => clearInterval(interval); // Cleanup interval on unmount
    }
  }, [isTyping, typingIndex, model]);

  // Check if the generated image is a demo image
  const checkIfDemoImage = (imageUrl: string) => examples.some((example) => example.imageUrl === imageUrl);

  return (
    <div className="min-h-screen bg-black text-white w-full flex flex-col">
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
            <p className="mb-4 text-xl text-pink-200/70">
              Create and deploy NFT artwork in seconds, powered by{" "}
              <a
                href={`https://huggingface.co/${model === "FLUX.1-dev" ? "black-forest-labs/FLUX.1-dev" : "stabilityai/stable-diffusion-2-1"}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-pink-500 hover:text-pink-400 transition-colors"
              >
                {typedModelName}
              </a>
            </p>
            <p className="mb-12 text-base text-pink-200/70">
              Choose{" "}
              <a
                href={`https://huggingface.co/black-forest-labs/FLUX.1-dev`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-pink-500 hover:text-pink-400 transition-colors"
              >
                FLUX.1-dev
              </a>{" "}
              for better image generation, may take up to 45 seconds to generate!
            </p>

            {/* Generator Interface */}
            <div className="mx-auto max-w-4xl space-y-6">
              <div className="relative">
                <input
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  className="w-full h-14 rounded-lg border border-pink-900/30 bg-pink-950/20 px-4 text-lg text-white"
                />
                <div className="absolute right-2 top-2 space-x-2">
                  <button>
                    <GenerateButton
                      prompt={prompt}
                      onPromptChange={setPrompt}
                      onImageGenerated={(imageUrl: string) => {
                        setGeneratedImage(imageUrl);
                        setIsDemoImage(checkIfDemoImage(imageUrl));
                      }}
                    />
                  </button>
                </div>
              </div>

              {/* Display generated image */}
              {generatedImage && (
                <div className="mt-8">
                  <div className="max-w-lg mx-auto rounded-lg overflow-hidden border border-pink-900/30">
                    <GeneratedImage
                      imageUrl={generatedImage}
                      isDemoImage={isDemoImage} // Pass the flag to GeneratedImage
                    />
                  </div>
                  <MintNFTButton imageUrl={generatedImage} />
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      {/* Prompt Examples Section */}
      <section className="w-full">
        <div className="max-w-7xl mx-auto p-8">
          <div className="relative border border-pink-900/30 rounded-2xl p-8">
            <div className="absolute -left-px top-16 w-8 h-px bg-gradient-to-r from-pink-500 to-orange-500" />
            <div className="absolute -right-px top-16 w-8 h-px bg-gradient-to-r from-orange-500 to-pink-500" />

            <div className="text-center mb-16">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-orange-500 text-sm tracking-widest uppercase font-bold">
                GET INSPIRED
              </span>
              <h2 className="text-5xl font-mono mt-4 tracking-tight">
                Prompt{" "}
                <span className="inline-block border border-dashed border-pink-900/30 px-4 py-1 rounded">examples</span>
              </h2>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {examples.map((example) => (
                <div key={example.id} className="group bg-pink-950/10 rounded-lg border border-pink-900/30 p-4 hover:border-pink-700/50 transition-all duration-300">
                  <div className="flex gap-4">
                    <div className="relative w-32 h-32 rounded-lg overflow-hidden flex-shrink-0">
                      <img src={example.imageUrl} alt={example.title} className="object-cover w-full h-full" />
                    </div>
                    <div className="flex flex-col justify-between flex-grow">
                      <div>
                        <div className="flex justify-between">
                          <h3 className="text-lg font-medium text-white">{example.title}</h3>
                          <button
                            onClick={() => copyToClipboard(example.description, example.id)}
                            className="text-pink-500 hover:text-pink-400"
                          >
                            <Copy size={20} />
                          </button>
                        </div>
                        <p className="text-sm text-pink-200 mt-2">{example.description}</p>
                      </div>

                      {/* Display "Copied" text */}
                      {copiedId === example.id && (
                        <span className="text-green-500 mt-2 text-sm">Copied!</span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
