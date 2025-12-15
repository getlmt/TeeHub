import { GoogleGenAI } from "@google/genai";

const MAX_RETRIES = 3;

// API keys để luân chuyển (chỉ giữ lại những keys hoạt động)
const API_KEYS = [
    "AIzaSyB21y8-OLItYY-QpEv_BhYykdcsNsidXtA",
    "AIzaSyC5DMtT40k31_za90lBOgLrcGN2T8CShaM",
    "AIzaSyBUlHvK7zVewsOWyBGVJ_As_Nz40JzKxCA"
];

// ⚠️ QUAN TRỌNG: Nếu các API keys trên không hoạt động:
// 1. Lấy API key miễn phí tại: https://aistudio.google.com/app/apikey
// 2. Thay thế các keys trên bằng keys mới của bạn
// 3. Xem hướng dẫn chi tiết trong file: GEMINI_API_SETUP.md

// In thông báo khi khởi động
console.log(`
╔════════════════════════════════════════════════════════════╗
║           🤖 Google Gemini AI Try-On Service              ║
╠════════════════════════════════════════════════════════════╣
║  📊 Available API Keys: ${API_KEYS.length}                                    ║
║  🔑 Get free keys at: https://aistudio.google.com         ║
║  📖 Setup guide: GEMINI_API_SETUP.md                      ║
╚════════════════════════════════════════════════════════════╝
`);

// Track failed API keys để không thử lại
const failedKeys = new Set();

// Hàm lấy API key ngẫu nhiên (bỏ qua keys đã fail)
function getRandomApiKey() {
    const availableKeys = API_KEYS.filter(key => !failedKeys.has(key));
    
    if (availableKeys.length === 0) {
        // Nếu tất cả keys đều fail, reset và thử lại
        failedKeys.clear();
        return API_KEYS[Math.floor(Math.random() * API_KEYS.length)];
    }
    
    return availableKeys[Math.floor(Math.random() * availableKeys.length)];
}

const model = 'gemini-2.0-flash-preview-image-generation';

/**
 * Generate try-on image using Gemini AI
 * @param {Object} modelImage - Model image with base64 and mimeType
 * @param {Object} clothingImage - Clothing image with base64 and mimeType
 * @returns {Promise<string>} Base64 encoded result image
 */
export const generateTryOnImage = async (modelImage, clothingImage) => {
  const prompt = "Tạo ra một bức ảnh chụp toàn thân, chân thực của người trong ảnh đầu tiên đang mặc trang phục trong ảnh thứ hai. Người mẫu nên tạo dáng tự nhiên, tự tin như đang trong một buổi chụp ảnh thời trang chuyên nghiệp. Điều cực kỳ quan trọng là phải giữ nguyên các đặc điểm khuôn mặt, kiểu tóc và vóc dáng của người mẫu. Nền ảnh nên là một studio đơn giản, trung tính. Chỉ thay đổi quần áo.";
  
  const modelImagePart = {
    inlineData: {
      data: modelImage.base64,
      mimeType: modelImage.mimeType,
    },
  };
  
  const clothingImagePart = {
    inlineData: {
      data: clothingImage.base64,
      mimeType: clothingImage.mimeType,
    },
  };

  const textPart = { text: prompt };

  let lastError = null;
  let attemptedKeys = new Set();

  for (let attempt = 0; attempt < MAX_RETRIES; attempt++) {
    try {
      // Sử dụng API key ngẫu nhiên cho mỗi lần thử
      const currentApiKey = getRandomApiKey();
      attemptedKeys.add(currentApiKey);

      console.log(`🔑 Attempt ${attempt + 1}/${MAX_RETRIES} - Using API key: ${currentApiKey.substring(0, 20)}...`);

      const ai = new GoogleGenAI({ apiKey: currentApiKey });

      const response = await ai.models.generateContent({
        model: model,
        contents: {
          parts: [modelImagePart, clothingImagePart, textPart],
        },
        config: {
          responseModalities: ["IMAGE", "TEXT"],
          responseMimeType: "text/plain"
        },
      });

      // Find the first part that is an image and return its data
      for (const part of response.candidates?.[0]?.content?.parts || []) {
        if (part.inlineData && part.inlineData.mimeType.startsWith('image/')) {
          console.log('✅ Successfully generated image!');
          return part.inlineData.data;
        }
      }
      
      throw new Error("No image found in the API response.");

    } catch (error) {
      console.error(`❌ API call attempt ${attempt + 1} failed:`, error);
      lastError = error;
      
      // Nếu lỗi là về API key (403, suspended, leaked), đánh dấu key này là failed
      if (error?.message?.includes('403') || 
          error?.message?.includes('suspended') || 
          error?.message?.includes('leaked') ||
          error?.message?.includes('PERMISSION_DENIED')) {
        const currentKey = Array.from(attemptedKeys).pop();
        failedKeys.add(currentKey);
        console.warn(`🚫 API key marked as failed: ${currentKey.substring(0, 20)}...`);
      }
      
      if (attempt < MAX_RETRIES - 1) {
        const delay = Math.pow(2, attempt) * 1000 + Math.random() * 1000;
        console.log(`⏳ Waiting ${Math.round(delay/1000)}s before retry...`);
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }
  }

  // Tạo thông báo lỗi thân thiện hơn
  let errorMessage = 'Không thể tạo ảnh sau nhiều lần thử. ';
  
  if (lastError?.message?.includes('403') || 
      lastError?.message?.includes('PERMISSION_DENIED')) {
    errorMessage = 'API key không hợp lệ hoặc đã hết hạn. Vui lòng liên hệ quản trị viên để cập nhật API key.';
  } else if (lastError?.message?.includes('quota')) {
    errorMessage = 'Đã vượt quá giới hạn sử dụng API. Vui lòng thử lại sau.';
  } else if (lastError?.message) {
    errorMessage += `Chi tiết: ${lastError.message}`;
  }

  throw new Error(errorMessage);
};
