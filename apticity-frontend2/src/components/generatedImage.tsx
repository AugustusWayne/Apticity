import React from "react";

interface GeneratedImageProps {
  imageUrl: string;
  isDemoImage?: boolean; // Flag to indicate if this is a demo image
}

const GeneratedImage: React.FC<GeneratedImageProps> = ({ imageUrl, isDemoImage = false }) => {
  return (
    <div className="mt-4 text-center">
      <img
        src={imageUrl}
        alt="Generated or Demo"
        className="w-64 h-64 mx-auto rounded-lg border border-gray-700"
      />
      {isDemoImage && (
        <p className="mt-2 text-sm text-red-500">
          Demo Image used as OpenAI billing limit reached
        </p>
      )}
    </div>
  );
};

export default GeneratedImage;
