import OpenAI from 'openai';

if (!import.meta.env.VITE_OPENAI_API_KEY) {
  throw new Error('OpenAI API key is missing. Please check your .env file.');
}

const openai = new OpenAI({
  apiKey: import.meta.env.VITE_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true // Only if you're calling OpenAI directly from the browser
});

export const generateImage = async (prompt: string): Promise<string> => {

  console.log('API Key exists:', !!import.meta.env.VITE_OPENAI_API_KEY);
  
  try {
    const response = await openai.images.generate({
      model: "dall-e-3",
      prompt: prompt,
      n: 1,
      size: "1024x1024",
    });

    if (!response.data[0]?.url) {
      throw new Error('No image URL received from OpenAI');
    }

    return response.data[0].url;
  } catch (error) {
    console.error('Error generating image:', error);
    throw error;
  }

};

export default openai;