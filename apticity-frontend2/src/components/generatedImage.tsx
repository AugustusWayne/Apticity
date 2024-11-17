interface GeneratedImageProps {
    imageUrl: string;
    isDemoImage: boolean; // Accept the flag indicating if the image is from the demo
  }
  
  const GeneratedImage: React.FC<GeneratedImageProps> = ({ imageUrl, isDemoImage }) => {
    return (
      <div className="relative">
        <img
          src={imageUrl}
          alt="Generated NFT"
          className="w-full h-auto rounded-lg shadow-lg"
        />
        {isDemoImage && (
          <div className="absolute top-2 left-2 px-4 py-2 bg-pink-950 text-white text-sm font-semibold rounded-lg">
            Demo Image
          </div>
        )}
      </div>
    );
  };
  
  export default GeneratedImage;
  