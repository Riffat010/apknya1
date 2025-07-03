
import { GoogleGenAI, GenerateContentResponse } from "@google/genai";
import type { AnalysisResult, Language, NewsArticle } from '../types';

if (!process.env.API_KEY) {
    throw new Error("Variabel lingkungan API_KEY tidak diatur.");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const fileToGenerativePart = (file: File) => {
  return new Promise<{inlineData: {mimeType: string, data: string}}>((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      if (typeof reader.result !== 'string') {
        return reject(new Error("Gagal membaca file sebagai string base64."));
      }
      const base64Data = reader.result.split(',')[1];
      resolve({
        inlineData: {
          mimeType: file.type,
          data: base64Data,
        },
      });
    };
    reader.onerror = (error) => reject(error);
    reader.readAsDataURL(file);
  });
};


const cleanAndParseJson = <T>(jsonString: string, lang: Language): T => {
    let cleanedString = jsonString.trim();

    const fenceRegex = /^```(?:json)?\s*\n?(.*?)\n?\s*```$/s;
    const match = cleanedString.match(fenceRegex);
    if (match && match[1]) {
        cleanedString = match[1].trim();
    }
    
    const firstChar = cleanedString.indexOf('{');
    const lastChar = cleanedString.lastIndexOf('}');
    const firstBracket = cleanedString.indexOf('[');
    const lastBracket = cleanedString.lastIndexOf(']');

    if (firstChar !== -1 && lastChar > firstChar && (firstChar < firstBracket || firstBracket === -1)) {
        cleanedString = cleanedString.substring(firstChar, lastChar + 1);
    } else if (firstBracket !== -1 && lastBracket > firstBracket) {
        cleanedString = cleanedString.substring(firstBracket, lastBracket + 1);
    }

    try {
        const sanitizedString = cleanedString.replace(/,\s*(?=[}\]])/g, "");
        return JSON.parse(sanitizedString) as T;
    } catch (error) {
        console.error("Failed to parse JSON response:", { original: jsonString, cleaned: cleanedString, error });
        const errorMessage = lang === 'id'
            ? "Gagal memproses respons dari AI. Format data tidak valid."
            : "Failed to process the response from the AI. Invalid data format.";
        throw new Error(errorMessage);
    }
};


const getAnalysisPrompt = (lang: Language): string => {
  const prompts = {
    id: `
ATURAN WAJIB (HARUS DIIKUTI):
- Respons Anda WAJIB dan HANYA berupa satu objek JSON yang valid dan bisa di-parse. Tidak boleh ada teks lain di luar objek JSON ini.
- JANGAN PERNAH menyertakan markdown seperti \`\`\`json atau \`\`\`.
- JANGAN PERNAH memberikan penjelasan, pengantar, atau penutup. HANYA JSON.
- SEMUA kunci dalam struktur JSON yang diminta di bawah ini WAJIB ADA. Jangan hilangkan kunci apa pun.
- Jika sebuah nilai tidak dapat ditentukan dari gambar (misalnya volume tidak ada), WAJIB gunakan string "N/A". JANGAN mengembalikan null.
- Pastikan 'confidenceScore' adalah sebuah angka (number), bukan string.

Anda adalah FrxAI, seorang analis keuangan ahli yang berspesialisasi dalam analisis teknis dan fundamental grafik saham dan forex.
Analisis gambar grafik yang diberikan secara komprehensif.

Lakukan hal berikut:
1.  Identifikasi Aset Pasar: Identifikasi dengan jelas aset yang ditampilkan dalam grafik (misalnya, 'EUR/USD', 'BTC/USD', 'Tesla (TSLA)').
2.  Analisis Teknis:
    - Tren Pasar: Tentukan trennya: 'Uptrend', 'Downtrend', atau 'Sideways'.
    - Volatilitas: Klasifikasikan volatilitas: 'High', 'Medium', atau 'Low'.
    - Volume: Nilai volume perdagangan: 'High', 'Medium', atau 'Low'.
    - Sentimen Pasar: Bedakan sentimennya: 'Bullish', 'Bearish', atau 'Neutral'.
    - Tingkat Keyakinan: Berikan skor keyakinan dari 0 hingga 100 untuk analisis Anda secara keseluruhan.
    - Rencana Aksi: Tulis strategi perdagangan yang ringkas dan dapat ditindaklanjuti. Jelaskan alasan di balik analisis teknis Anda, sebutkan pola candlestick atau indikator spesifik yang Anda identifikasi (misalnya, 'pola head and shoulders', 'golden cross pada MA').
3.  Analisis Fundamental (Gunakan Google Search): Berdasarkan aset pasar yang diidentifikasi, gunakan penelusuran web untuk memberikan ringkasan berita fundamental terkini (dari beberapa hari terakhir) yang relevan dan mungkin mempengaruhi pergerakan harga.

Kembalikan seluruh analisis dalam satu objek JSON bersih dengan struktur yang sama persis seperti ini:
{
  "market_asset": "string",
  "trend": "string",
  "volatility": "string",
  "volume": "string",
  "sentiment": "string",
  "confidenceScore": number,
  "gamePlan": "string",
  "fundamentalAnalysis": "string"
}
    `,
    en: `
MANDATORY RULES (MUST BE FOLLOWED):
- Your response MUST and ONLY be a single, valid, parsable JSON object. There must be no other text outside this JSON object.
- NEVER include markdown wrappers like \`\`\`json or \`\`\`.
- NEVER provide explanations, introductions, or conclusions. ONLY JSON.
- ALL keys in the JSON structure requested below are MANDATORY. Do not omit any keys.
- If a value cannot be determined from the image (e.g., no volume shown), you MUST use the string "N/A". DO NOT return null.
- Ensure 'confidenceScore' is a number, not a string.

You are FrxAI, an expert financial analyst specializing in technical and fundamental analysis of stock and forex charts.
Analyze the provided chart image comprehensively.

Perform the following:
1.  Identify Market Asset: Clearly identify the asset in the chart (e.g., 'EUR/USD', 'BTC/USD', 'Tesla (TSLA)').
2.  Technical Analysis:
    - Market Trend: Determine if the trend is 'Uptrend', 'Downtrend', or 'Sideways'.
    - Volatility: Classify volatility as 'High', 'Medium', or 'Low'.
    - Volume: Assess trading volume as 'High', 'Medium', or 'Low'.
    - Market Sentiment: Discern the sentiment as 'Bullish', 'Bearish', or 'Neutral'.
    - Confidence Score: Provide a confidence score from 0 to 100 for your overall analysis.
    - Game Plan: Write a concise, actionable trading strategy. Explain the reasoning, mentioning specific patterns or indicators identified (e.g., 'head and shoulders pattern', 'golden cross on MAs').
3.  Fundamental Analysis (Use Google Search): Based on the asset, use web search for a summary of recent, relevant fundamental news (last few days) influencing price action.

Return the entire analysis in a single, clean JSON object with the exact same structure as this:
{
  "market_asset": "string",
  "trend": "string",
  "volatility": "string",
  "volume": "string",
  "sentiment": "string",
  "confidenceScore": number,
  "gamePlan": "string",
  "fundamentalAnalysis": "string"
}
    `
  };
  return prompts[lang];
}

const getNewsPrompt = (asset: string, language: Language): string => {
    const prompts = {
        id: `
ATURAN WAJIB (HARUS DIIKUTI):
- Respons Anda WAJIB dan HANYA berupa satu array JSON yang valid dan bisa di-parse. Jika tidak ada berita, kembalikan array kosong \`[]\`.
- JANGAN PERNAH menyertakan markdown seperti \`\`\`json atau \`\`\`.
- JANGAN PERNAH memberikan penjelasan, pengantar, atau penutup. HANYA ARRAY JSON.
- Setiap objek di dalam array WAJIB memiliki SEMUA kunci berikut: "title", "snippet", "content", "source", "sentiment", "published_at". Jangan hilangkan kunci apa pun.
- Jika sebuah informasi tidak tersedia (misalnya, tidak ada cuplikan), gunakan string kosong "" sebagai nilainya. JANGAN mengembalikan null.
- Nilai 'sentiment' WAJIB salah satu dari: 'Bullish', 'Bearish', atau 'Neutral'.

Anda adalah agregator berita keuangan. Tugas Anda adalah menemukan artikel berita fundamental yang relevan dari 7 hari terakhir untuk aset pasar saham atau forex yang ditentukan: "${asset}".

Gunakan Google Search untuk menemukan informasi ini.

Untuk setiap artikel, berikan informasi berikut dalam bahasa ${language === 'id' ? 'Indonesia' : 'Inggris'}:
- title: Judul asli artikel secara lengkap.
- snippet: Ringkasan berita yang singkat (satu atau dua kalimat).
- content: Isi lengkap artikel berita.
- source: Nama sumber berita (misalnya, 'Reuters', 'Bloomberg').
- sentiment: Analisis berita dan tentukan sentimennya untuk aset tersebut.
- published_at: Tanggal dan waktu publikasi, sebagai string yang mudah dibaca (misalnya, "2 jam lalu", "Kemarin", "3 hari lalu").

Kembalikan temuan Anda sebagai satu array JSON bersih. Contoh struktur:
[
  {
    "title": "string",
    "snippet": "string",
    "content": "string",
    "source": "string",
    "sentiment": "Bullish",
    "published_at": "2 hours ago"
  }
]`,
        en: `
MANDATORY RULES (MUST BE FOLLOWED):
- Your response MUST and ONLY be a single, valid, parsable JSON array. If no news is found, return an empty array \`[]\`.
- NEVER include markdown wrappers like \`\`\`json or \`\`\`.
- NEVER provide explanations, introductions, or conclusions. ONLY THE JSON ARRAY.
- Every object in the array MUST have ALL of the following keys: "title", "snippet", "content", "source", "sentiment", "published_at". Do not omit any keys.
- If a piece of information is not available (e.g., no snippet), use an empty string "" as its value. DO NOT return null.
- The 'sentiment' value MUST be one of: 'Bullish', 'Bearish', or 'Neutral'.

You are a financial news aggregator. Your task is to find recent and relevant fundamental news articles from within the last 7 days for the specified forex or stock market asset: "${asset}".

Use Google Search to find this information.

For each article, provide the following information, written in ${language === 'id' ? 'Indonesian' : 'English'}:
- title: The full, original title of the article.
- snippet: A concise, one or two-sentence summary of the news.
- content: The full body of the news article.
- source: The name of the news source (e.g., 'Reuters', 'Bloomberg').
- sentiment: Analyze the news and determine its sentiment for the asset.
- published_at: The publication date and time, returned as a human-readable relative string (e.g., "2 hours ago", "Yesterday", "3 days ago").

Return your findings as a single, clean JSON array. The JSON array must have the exact same structure as this example:
[
  {
    "title": "string",
    "snippet": "string",
    "content": "string",
    "source": "string",
    "sentiment": "Bullish",
    "published_at": "2 hours ago"
  }
]`
    };
    return prompts[language];
};


export const analyzeChart = async (imageFile: File, language: Language): Promise<AnalysisResult> => {
    const imagePart = await fileToGenerativePart(imageFile);
    const prompt = getAnalysisPrompt(language);
    let response: GenerateContentResponse;

    try {
        const maxRetries = 3; // Increased retries for more resilience
        let lastError: Error | undefined;
        for (let attempt = 0; attempt < maxRetries; attempt++) {
            try {
                const res = await ai.models.generateContent({
                    model: 'gemini-2.5-flash-preview-04-17',
                    contents: { parts: [imagePart, { text: prompt }] },
                    config: {
                        temperature: 0.1, // Lower temperature for more deterministic JSON output
                        tools: [{ googleSearch: {} }],
                    }
                });
                if (!res.text) {
                    throw new Error("API response was empty or blocked, possibly due to safety settings.");
                }
                response = res;
                break; // Success
            } catch (error: any) {
                lastError = error;
                if (attempt < maxRetries - 1) {
                    console.warn(`Attempt ${attempt + 1} failed for analyzeChart. Retrying...`, error.message);
                    await new Promise(resolve => setTimeout(resolve, 1500 * (attempt + 1)));
                }
            }
        }
        if (!response!) { throw lastError; } // Re-throw last error if all retries failed
    } catch (error) {
        console.error("Error analyzing chart with Gemini after retries:", error);
        const errorMessage = language === 'id'
            ? "Gagal menganalisis chart setelah beberapa kali percobaan. Model AI mungkin sibuk atau ada masalah jaringan. Silakan coba lagi nanti."
            : "Failed to analyze the chart after multiple attempts. The AI model may be busy or there's a network issue. Please try again later.";
        throw new Error(errorMessage);
    }
    
    const parsedData = cleanAndParseJson<Partial<AnalysisResult>>(response.text, language);
    
    const groundingMetadata = response.candidates?.[0]?.groundingMetadata;
    const sources = groundingMetadata?.groundingChunks
      ?.map(chunk => chunk.web)
      .filter(web => web?.uri && web?.title) as { uri: string, title: string }[] | undefined;

    if (
      typeof parsedData.market_asset !== 'string' ||
      typeof parsedData.trend !== 'string' ||
      typeof parsedData.volatility !== 'string' ||
      typeof parsedData.volume !== 'string' ||
      typeof parsedData.sentiment !== 'string' ||
      typeof parsedData.confidenceScore !== 'number' ||
      typeof parsedData.gamePlan !== 'string' ||
      typeof parsedData.fundamentalAnalysis !== 'string'
    ) {
      console.error("Invalid data structure received from API:", parsedData);
      throw new Error(language === 'id' ? "Struktur data dari AI tidak valid." : "Invalid data structure received from API.");
    }
    
    return { ...parsedData, sources } as AnalysisResult;
};

export const fetchNewsForAsset = async (asset: string, language: Language): Promise<NewsArticle[]> => {
    const prompt = getNewsPrompt(asset, language);
    let response: GenerateContentResponse;

    try {
        const maxRetries = 3; // Increased retries for more resilience
        let lastError: Error | undefined;
        for (let attempt = 0; attempt < maxRetries; attempt++) {
            try {
                const res = await ai.models.generateContent({
                    model: 'gemini-2.5-flash-preview-04-17',
                    contents: prompt,
                    config: {
                        temperature: 0.1, // Lower temperature for more deterministic JSON output
                        tools: [{ googleSearch: {} }],
                    }
                });
                if (!res.text) {
                    throw new Error("API response was empty or blocked, possibly due to safety settings.");
                }
                response = res;
                break; // Success
            } catch (error: any) {
                lastError = error;
                if (attempt < maxRetries - 1) {
                    console.warn(`Attempt ${attempt + 1} failed for fetchNews. Retrying...`, error.message);
                    await new Promise(resolve => setTimeout(resolve, 1500 * (attempt + 1)));
                }
            }
        }
        if (!response!) { throw lastError; }
    } catch (error) {
        console.error(`Error fetching news for ${asset} after retries:`, error);
        throw new Error(language === 'id' ? `Gagal mengambil berita untuk ${asset} setelah beberapa kali percobaan.` : `Failed to fetch news for ${asset} after multiple attempts.`);
    }

    try {
        const parsedNews = cleanAndParseJson<any[]>(response.text, language);

        if (!Array.isArray(parsedNews)) {
            console.error("News response was not a valid array:", parsedNews);
            return [];
        }
        
        const validatedNews = parsedNews.filter(item => 
            item &&
            typeof item.title === 'string' &&
            typeof item.snippet === 'string' &&
            typeof item.content === 'string' &&
            typeof item.source === 'string' &&
            ['Bullish', 'Bearish', 'Neutral'].includes(item.sentiment) &&
            typeof item.published_at === 'string'
        ).map(item => item as NewsArticle);

        if (validatedNews.length !== parsedNews.length) {
            console.warn("Some news articles were filtered out due to invalid structure.", { original: parsedNews.length, validated: validatedNews.length });
        }

        return validatedNews;

    } catch(error) {
        console.error(`Error parsing news for ${asset}:`, error);
        return [];
    }
};
