import { useState } from "react";
import { AlertCircle, Loader2, ChevronDown, Sparkles } from "lucide-react";
import { useWallet } from './walletProvider';

// Define model interface
interface Model {
  id: string;
  name: string;
  provider: string;
  endpoint: string;
  description: string;
  maxTokens: number;
}

// Define supported models
const SUPPORTED_MODELS: Model[] = [
  {
    id: "flux-1",
    name: "FLUX.1-dev",
    provider: "Black Forest Labs",
    endpoint: "https://api-inference.huggingface.co/models/black-forest-labs/FLUX.1-dev",
    description: "Optimized for artistic and creative generations",
    maxTokens: 77
  },
  {
    id: "sd-2-1",
    name: "Stable Diffusion 2.1",
    provider: "Stability AI",
    endpoint: "https://api-inference.huggingface.co/models/stabilityai/stable-diffusion-2-1",
    description: "Versatile image generation model",
    maxTokens: 77
  }
];

// Define prompt templates interface
interface PromptTemplates {
  [key: string]: string[];
}

// Predefined prompt templates
const PROMPT_TEMPLATES: PromptTemplates = {
  landscape: [
    "mountain landscape at sunset with lake",
    "ancient forest with mystical fog",
    "coastal scene with crashing waves",
    "meadow with wildflowers under rainbow",
  ],
  portrait: [
    "cyberpunk character with neon highlights",
    "forest spirit with glowing butterflies",
    "steampunk inventor with brass gadgets",
    "sorceress casting magical energy swirls",
  ],
  abstract: [
    "kaleidoscopic explosion of geometric patterns",
    "swirling metallic colors in space",
    "crystalline structures refracting rainbow light",
    "digital waves forming abstract shapes",
  ],
  scifi: [
    "futuristic city with flying vehicles",
    "alien landscape with crystal formations",
    "space station orbiting a nebula",
    "cybernetic garden blending nature and tech",
  ]
};


type PromptCategory = keyof typeof PROMPT_TEMPLATES;

interface GenerateButtonProps {
  prompt: string;
  onImageGenerated: (imageUrl: string) => void;
  onPromptChange: (newPrompt: string) => void;
  apiKey?: string;
}

export const GenerateButton: React.FC<GenerateButtonProps> = ({
  prompt,
  onImageGenerated,
  onPromptChange,
  apiKey = import.meta.env.VITE_HUGGING_FACE_API_KEY
}) => {
  const { walletAddress, connectWallet } = useWallet();
  const [showConnectPrompt, setShowConnectPrompt] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedModelId, setSelectedModelId] = useState<string>("flux-1");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [lastCategory, setLastCategory] = useState<PromptCategory>("landscape");

  const selectedModel = SUPPORTED_MODELS.find(model => model.id === selectedModelId)!;
  const demoImageUrl = "./images/ai2.webp";

  // Helper function to get random item from array
  const getRandomItem = <T,>(array: T[]): T => {
    return array[Math.floor(Math.random() * array.length)];
  };

  // Generate a random prompt from templates
  const generateRandomPrompt = () => {
    const categories = Object.keys(PROMPT_TEMPLATES) as PromptCategory[];
    let newCategory: PromptCategory;
    do {
      newCategory = getRandomItem(categories);
    } while (categories.length > 1 && newCategory === lastCategory);
    
    setLastCategory(newCategory);
    
    const categoryPrompts = PROMPT_TEMPLATES[newCategory];
    const basePrompt = getRandomItem(categoryPrompts);
    
    const styleModifiers = [
      "in the style of an oil painting",
      "with watercolor effects",
      "as a digital illustration",
      "with cinematic lighting",
      "in a minimalist style",
      "with vibrant colors",
    ];
    
    const qualityModifiers = [
      "highly detailed",
      "masterpiece",
      "stunning",
      "professional",
      "8k resolution",
    ];
    
    const randomStyle = getRandomItem(styleModifiers);
    const randomQuality = getRandomItem(qualityModifiers);
    
    const fullPrompt = `${basePrompt}, ${randomStyle}, ${randomQuality}`;
    onPromptChange(fullPrompt);
    
    if (Math.random() < 0.3) {
      const newModelId = getRandomItem(SUPPORTED_MODELS).id;
      setSelectedModelId(newModelId);
    }
  };

  const generateImage = async (model: Model) => {
    try {
      const response = await fetch(model.endpoint, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ 
          inputs: prompt,
          options: {
            wait_for_model: true
          }
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`${response.status}: ${errorText}`);
      }

      const blob = await response.blob();
      return URL.createObjectURL(blob);
    } catch (error) {
      console.error(`Failed to generate with ${model.name}:`, error);
      throw error;
    }
  };

  const handleGenerateClick = async () => {
    if (!walletAddress) {
      setShowConnectPrompt(true);
      return;
    }

    if (!prompt.trim()) {
      setError("Please enter a prompt first");
      return;
    }

    setIsGenerating(true);
    setError(null);

    try {
      const imageUrl = await generateImage(selectedModel);
      onImageGenerated(imageUrl);
    } catch (error: any) {
      let errorMessage = "Failed to generate image. Displaying a demo instead.";
      
      if (error?.message) {
        if (error.message.includes("429")) {
          errorMessage = "Rate limit exceeded. Please try again in a few minutes.";
        } else if (error.message.includes("503")) {
          errorMessage = "Model is currently loading. Please try again shortly.";
        } else if (error.message.includes("413")) {
          errorMessage = "Prompt is too long. Please try a shorter prompt.";
        }
      }

      setError(errorMessage);
      onImageGenerated(demoImageUrl);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="relative space-y-4">
      <div className="flex gap-2">
        {/* Generate Button */}
        <button
          onClick={handleGenerateClick}
          disabled={isGenerating}
          className={`flex-1 px-4 py-2 bg-gradient-to-r from-pink-500 to-orange-500 
            hover:from-pink-600 hover:to-orange-600 rounded-lg text-white 
            flex items-center justify-center gap-2 transition-all
            ${isGenerating ? "opacity-75 cursor-not-allowed" : ""}`}
        >
          {isGenerating ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              GENERATING...
            </>
          ) : (
            "GENERATE"
          )}
        </button>

        {/* Surprise Me Button */}
        <button
          onClick={generateRandomPrompt}
          disabled={isGenerating}
          className="px-3 py-2 bg-gradient-to-r from-purple-500 to-blue-500 
            hover:from-purple-600 hover:to-blue-600 rounded-lg text-white 
            flex items-center gap-2 transition-all"
          title="Generate a random creative prompt"
        >
          <Sparkles className="w-4 h-4" />
        </button>

        {/* Model Selector Button */}
        <button
          onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          className="px-3 py-2 bg-pink-950/20 border border-pink-900/30 
            rounded-lg text-pink-200/70 hover:text-white hover:bg-pink-950/30 
            transition-colors flex items-center gap-2"
        >
          <ChevronDown className={`w-4 h-4 transition-transform ${isDropdownOpen ? "rotate-180" : ""}`} />
        </button>
      </div>

      {/* Enhanced Dropdown Menu */}
      {isDropdownOpen && (
        <div className="absolute right-0 w-72 bg-black border border-pink-900/30 
          rounded-lg shadow-xl z-10 overflow-hidden">
          {SUPPORTED_MODELS.map((model) => (
            <button
              key={model.id}
              className={`w-full px-4 py-3 text-left hover:bg-pink-950/20 
                transition-colors border-b border-pink-900/30 last:border-0
                ${model.id === selectedModelId ? "bg-pink-950/30 text-white" : "text-pink-200/70"}`}
              onClick={() => {
                setSelectedModelId(model.id);
                setIsDropdownOpen(false);
              }}
            >
              <div className="flex flex-col gap-1">
                <div className="flex items-center justify-between">
                  <span className="font-medium">{model.name}</span>
                  <span className="text-xs text-pink-200/50">{model.provider}</span>
                </div>
                <span className="text-xs text-pink-200/50">{model.description}</span>
              </div>
            </button>
          ))}
        </div>
      )}

      {/* Error Modal */}
      {error && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-black border border-red-500 rounded-lg p-6 max-w-sm w-full mx-4">
            <div className="flex items-center gap-3 mb-4">
              <AlertCircle className="text-red-500 w-4 h-4" />
              <h3 className="text-lg font-semibold text-white">Error</h3>
            </div>
            <p className="text-red-400 mb-6">{error}</p>
            <button
              onClick={() => setError(null)}
              className="w-full px-4 py-2 bg-red-500 hover:bg-red-600 rounded-lg text-white"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* Wallet Connect Modal */}
      {showConnectPrompt && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-black border border-pink-900/30 rounded-lg p-6 max-w-sm w-full mx-4">
            <div className="flex items-center gap-3 mb-4">
              <AlertCircle className="text-pink-500 w-6 h-6" />
              <h3 className="text-lg font-semibold">Connect Wallet</h3>
            </div>
            <p className="text-pink-200/70 mb-6">
              Please connect your wallet to generate NFTs.
            </p>
            <div className="space-y-3">
              {window.aptos && (
                <button
                  className="w-full px-4 py-2 bg-pink-950/20 border border-pink-900/30 
                    rounded-lg text-pink-200/70 hover:text-white hover:bg-pink-950/30 
                    transition-colors flex items-center justify-center gap-2"
                  onClick={async () => {
                    try {
                      await connectWallet("Petra");
                      setShowConnectPrompt(false);
                    } catch (error) {
                      console.error(error);
                    }
                  }}
                >
                  <img src="/petra-wallet.png" alt="Petra" className="w-4 h-4" />
                  Connect Petra Wallet
                </button>
              )}
              {window.martian && (
                <button
                  className="w-full px-4 py-2 bg-pink-950/20 border border-pink-900/30 
                    rounded-lg text-pink-200/70 hover:text-white hover:bg-pink-950/30 
                    transition-colors flex items-center justify-center gap-2"
                  onClick={async () => {
                    try {
                      await connectWallet("Martian");
                      setShowConnectPrompt(false);
                    } catch (error) {
                      console.error(error);
                    }
                  }}
                >
                  <img src="/martian-wallet-icon.avif" alt="Martian" className="w-4 h-4" />
                  Connect Martian Wallet
                </button>
              )}
              <button
                className="w-full px-4 py-2 text-pink-200/50 hover:text-pink-200/70 transition-colors"
                onClick={() => setShowConnectPrompt(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GenerateButton;