import type { Generation, SlangTranslation, EmotionAnalysis } from '../types';

const OPENAI_API_KEY = import.meta.env.VITE_OPENAI_API_KEY;
const API_BASE_URL = 'https://api.openai.com/v1';

class OpenAIService {
  private async makeRequest(endpoint: string, data: any): Promise<any> {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${OPENAI_API_KEY}`,
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error(`OpenAI API Error: ${response.statusText}`);
    }

    return response.json();
  }

  async translateSlang(
    text: string, 
    sourceGeneration: Generation, 
    targetGeneration: Generation
  ): Promise<SlangTranslation> {
    const generationDescriptions = {
      'gen-z': 'Z세대 (1997-2012): 디지털 네이티브, 소셜미디어 중심의 언어 사용',
      'millennial': '밀레니얼 (1981-1996): 인터넷 문화와 전통 문화의 교차점',
      'gen-x': 'X세대 (1965-1980): 아날로그와 디지털 문화를 모두 경험',
      'boomer': '베이비부머 (1946-1964): 전통적이고 정중한 언어 사용 선호'
    };

    const prompt = `
다음 텍스트를 ${generationDescriptions[sourceGeneration]}에서 ${generationDescriptions[targetGeneration]} 언어 스타일로 번역해주세요.

원본 텍스트: "${text}"

요구사항:
1. 세대별 언어 특성을 반영하여 자연스럽게 번역
2. 의미는 유지하되 표현 방식을 세대에 맞게 조정
3. 번역 이유와 설명 포함
4. 사용 예시 2-3개 제공

응답 형식을 다음 JSON으로 제공해주세요:
{
  "translatedText": "번역된 텍스트",
  "confidence": 0.95,
  "explanation": "번역 이유와 세대별 언어 차이 설명",
  "examples": ["예시 1", "예시 2", "예시 3"]
}
`;

    const response = await this.makeRequest('/chat/completions', {
      model: 'gpt-4',
      messages: [
        {
          role: 'system',
          content: '당신은 한국의 세대별 언어 차이를 전문적으로 분석하고 번역하는 AI입니다. 각 세대의 언어 특성을 정확히 파악하여 자연스러운 번역을 제공합니다.'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      max_tokens: 1000,
      temperature: 0.7,
    });

    try {
      const result = JSON.parse(response.choices[0].message.content);
      return {
        id: crypto.randomUUID(),
        originalText: text,
        translatedText: result.translatedText,
        sourceGeneration,
        targetGeneration,
        confidence: result.confidence,
        explanation: result.explanation,
        examples: result.examples,
        createdAt: new Date(),
      };
    } catch (error) {
      throw new Error('OpenAI 응답을 파싱하는 중 오류가 발생했습니다.');
    }
  }

  async analyzeEmotion(text: string): Promise<EmotionAnalysis> {
    const prompt = `
다음 대화 텍스트의 감정을 분석해주세요.

텍스트: "${text}"

분석 요구사항:
1. 전체적인 감정 분석 (긍정/부정/중립)
2. 세부 감정 분석 (기쁨, 슬픔, 분노, 두려움, 놀라움, 혐오)
3. 감정 강도 (0-1 범위)
4. 화자별 감정 분석 (가능한 경우)

응답 형식을 다음 JSON으로 제공해주세요:
{
  "overall": {
    "positive": 0.7,
    "negative": 0.2,
    "neutral": 0.1,
    "dominant": "positive",
    "intensity": 0.8,
    "specificEmotions": {
      "joy": 0.6,
      "sadness": 0.1,
      "anger": 0.1,
      "fear": 0.05,
      "surprise": 0.1,
      "disgust": 0.05
    }
  },
  "emotionFlow": [
    {
      "timestamp": 0,
      "emotion": { /* 감정 객체 */ },
      "text": "문장",
      "speaker": "화자"
    }
  ]
}
`;

    const response = await this.makeRequest('/chat/completions', {
      model: 'gpt-4',
      messages: [
        {
          role: 'system',
          content: '당신은 한국어 텍스트의 감정을 정확하게 분석하는 AI입니다. 문맥과 뉘앙스를 고려하여 감정을 분석합니다.'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      max_tokens: 1500,
      temperature: 0.3,
    });

    try {
      const result = JSON.parse(response.choices[0].message.content);
      return {
        overall: result.overall,
        byParticipant: {},
        emotionFlow: result.emotionFlow || [],
      };
    } catch (error) {
      throw new Error('감정 분석 응답을 파싱하는 중 오류가 발생했습니다.');
    }
  }

  async generateQuizQuestions(generation: Generation, count: number = 5) {
    const generationInfo = {
      'gen-z': 'Z세대의 언어, 문화, 가치관',
      'millennial': '밀레니얼 세대의 언어, 문화, 가치관',
      'gen-x': 'X세대의 언어, 문화, 가치관',
      'boomer': '베이비부머 세대의 언어, 문화, 가치관'
    };

    const prompt = `
${generationInfo[generation]}에 대한 퀴즈 문제 ${count}개를 생성해주세요.

요구사항:
1. 각 문제는 4개의 선택지를 가져야 함
2. 정답 번호와 해설 포함
3. 세대별 특성을 잘 반영한 문제
4. 다양한 난이도와 주제 포함

응답 형식을 다음 JSON 배열로 제공해주세요:
[
  {
    "question": "문제 내용",
    "options": ["선택지1", "선택지2", "선택지3", "선택지4"],
    "correctAnswer": 0,
    "explanation": "정답 해설",
    "points": 10
  }
]
`;

    const response = await this.makeRequest('/chat/completions', {
      model: 'gpt-4',
      messages: [
        {
          role: 'system',
          content: '당신은 한국의 세대별 특성을 잘 알고 있는 교육 콘텐츠 전문가입니다. 흥미롭고 교육적인 퀴즈를 만들어주세요.'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      max_tokens: 2000,
      temperature: 0.8,
    });

    try {
      return JSON.parse(response.choices[0].message.content);
    } catch (error) {
      throw new Error('퀴즈 문제 생성 응답을 파싱하는 중 오류가 발생했습니다.');
    }
  }
}

export const openAIService = new OpenAIService();