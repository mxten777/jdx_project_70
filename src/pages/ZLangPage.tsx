import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRightLeft, Copy, Volume2, Sparkles, MessageSquare, Zap, TrendingUp } from 'lucide-react';
import clsx from 'clsx';
import { LoadingSpinner, TypingIndicator } from '../components/LoadingComponents';
import { ProgressRing, StatCard } from '../components/DataVisualization';

type Generation = 'gen-z' | 'millennial' | 'gen-x' | 'boomer';

interface TranslationResult {
  translatedText: string;
  confidence: number;
  explanation: string;
  examples: string[];
}

const ZLangPage: React.FC = () => {
  const [inputText, setInputText] = useState('');
  const [sourceGeneration, setSourceGeneration] = useState<Generation>('gen-z');
  const [targetGeneration, setTargetGeneration] = useState<Generation>('boomer');
  const [result, setResult] = useState<TranslationResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [history, setHistory] = useState<Array<{
    input: string;
    source: Generation;
    target: Generation;
    result: TranslationResult;
    timestamp: Date;
  }>>([]);

  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const generations = [
    { 
      id: 'gen-z' as Generation, 
      label: 'Z세대', 
      desc: '1997-2012', 
      color: 'from-pink-500 to-purple-600',
      examples: ['ㄹㅇ', '갑분싸', 'TMI', '왜켈케', '핫플']
    },
    { 
      id: 'millennial' as Generation, 
      label: '밀레니얼', 
      desc: '1981-1996', 
      color: 'from-blue-500 to-cyan-500',
      examples: ['ㅋㅋ', '헐', '대박', '짱', '쩔어']
    },
    { 
      id: 'gen-x' as Generation, 
      label: 'X세대', 
      desc: '1965-1980', 
      color: 'from-green-500 to-teal-500',
      examples: ['그렇습니다', '좋네요', '훌륭해요', '멋져요']
    },
    { 
      id: 'boomer' as Generation, 
      label: '베이비부머', 
      desc: '1946-1964', 
      color: 'from-amber-500 to-orange-500',
      examples: ['좋습니다', '훌륭합니다', '감사합니다', '반갑습니다']
    },
  ];

  const mockTranslate = async (text: string, from: Generation, to: Generation): Promise<TranslationResult> => {
    // Mock translation for demo purposes
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const translations: Record<string, Record<Generation, string>> = {
      'ㄹㅇ': {
        'gen-z': 'ㄹㅇ',
        'millennial': '진짜',
        'gen-x': '정말로',
        'boomer': '정말입니다'
      },
      '갑분싸': {
        'gen-z': '갑분싸',
        'millennial': '갑자기 분위기 싸해짐',
        'gen-x': '갑자기 어색해졌네요',
        'boomer': '갑자기 분위기가 어색해졌습니다'
      },
      '헐': {
        'gen-z': '헐ㅋㅋ',
        'millennial': '헐',
        'gen-x': '어머나',
        'boomer': '아이고'
      }
    };

    const translated = translations[text]?.[to] || 
      (to === 'boomer' ? `${text}입니다` : 
       to === 'gen-x' ? `${text}요` : 
       to === 'millennial' ? `${text}ㅋㅋ` : 
       `${text}ㅋㅋㅋ`);

    return {
      translatedText: translated,
      confidence: 0.92,
      explanation: `${generations.find(g => g.id === from)?.label}의 "${text}"를 ${generations.find(g => g.id === to)?.label} 스타일로 번역했습니다.`,
      examples: [
        `예시 1: ${translated}`,
        `예시 2: ${translated} (상황에 따라)`,
        `예시 3: ${translated} (정중한 표현)`
      ]
    };
  };

  const handleTranslate = async () => {
    if (!inputText.trim()) return;
    
    setIsLoading(true);
    try {
      const translationResult = await mockTranslate(inputText, sourceGeneration, targetGeneration);
      setResult(translationResult);
      
      // Add to history
      setHistory(prev => [{
        input: inputText,
        source: sourceGeneration,
        target: targetGeneration,
        result: translationResult,
        timestamp: new Date()
      }, ...prev.slice(0, 4)]);
    } catch (error) {
      console.error('Translation error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const swapGenerations = () => {
    setSourceGeneration(targetGeneration);
    setTargetGeneration(sourceGeneration);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  const speak = (text: string) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'ko-KR';
      speechSynthesis.speak(utterance);
    }
  };

  return (
    <div className="min-h-screen px-4 py-8 sm:px-6 lg:px-8 pb-24 md:pb-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="flex items-center justify-center mb-4">
            <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-2xl flex items-center justify-center mr-4">
              <MessageSquare size={32} className="text-white" />
            </div>
            <h1 className="text-4xl font-bold korean-text">ZLang</h1>
          </div>
          <p className="text-xl text-gray-600 mb-2 korean-text">신조어 변환 웹앱</p>
          <p className="text-gray-500 korean-text">AI가 세대별 언어를 자연스럽게 번역합니다</p>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Translation Area */}
          <div className="lg:col-span-2">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white/80 backdrop-blur-sm rounded-2xl border border-white/20 p-6 shadow-xl"
            >
              {/* Generation Selectors */}
              <div className="flex items-center justify-between mb-6">
                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-700 mb-2 korean-text">
                    번역할 세대
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {generations.map((gen) => (
                      <button
                        key={gen.id}
                        onClick={() => setSourceGeneration(gen.id)}
                        className={clsx(
                          'p-3 rounded-lg text-sm font-medium transition-all duration-200',
                          sourceGeneration === gen.id
                            ? `bg-gradient-to-r ${gen.color} text-white shadow-lg scale-105`
                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                        )}
                      >
                        <div className="korean-text">{gen.label}</div>
                        <div className="text-xs opacity-80">{gen.desc}</div>
                      </button>
                    ))}
                  </div>
                </div>

                <button
                  onClick={swapGenerations}
                  className="mx-4 p-3 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:scale-110 transition-transform duration-200"
                >
                  <ArrowRightLeft size={20} />
                </button>

                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-700 mb-2 korean-text">
                    변환할 세대
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {generations.map((gen) => (
                      <button
                        key={gen.id}
                        onClick={() => setTargetGeneration(gen.id)}
                        className={clsx(
                          'p-3 rounded-lg text-sm font-medium transition-all duration-200',
                          targetGeneration === gen.id
                            ? `bg-gradient-to-r ${gen.color} text-white shadow-lg scale-105`
                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                        )}
                      >
                        <div className="korean-text">{gen.label}</div>
                        <div className="text-xs opacity-80">{gen.desc}</div>
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Input Area */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2 korean-text">
                  번역할 텍스트를 입력하세요
                </label>
                <div className="relative">
                  <textarea
                    ref={textareaRef}
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    placeholder="예: ㄹㅇ 갑분싸네..."
                    className="w-full h-32 p-4 border border-gray-200 rounded-lg resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent korean-text"
                  />
                  <div className="absolute bottom-3 right-3 text-sm text-gray-400">
                    {inputText.length}/500
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3">
                <motion.button
                  onClick={handleTranslate}
                  disabled={!inputText.trim() || isLoading}
                  className="flex-1 bg-gradient-to-r from-blue-500 to-purple-600 text-white py-3 px-6 rounded-lg font-semibold flex items-center justify-center space-x-2 transform transition-all duration-200 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none shadow-lg hover:shadow-xl"
                  whileHover={!isLoading ? { boxShadow: '0 20px 25px -5px rgba(59, 130, 246, 0.4)' } : {}}
                  whileTap={!isLoading ? { scale: 0.98 } : {}}
                >
                  {isLoading ? (
                    <>
                      <LoadingSpinner size="sm" color="white" />
                      <TypingIndicator text="AI 번역 중" className="text-white" />
                    </>
                  ) : (
                    <>
                      <Sparkles size={20} />
                      <span className="korean-text">AI 번역하기</span>
                    </>
                  )}
                </motion.button>
                <button
                  onClick={() => setInputText('')}
                  className="px-4 py-3 border border-gray-200 rounded-lg text-gray-600 hover:bg-gray-50 transition-colors"
                >
                  초기화
                </button>
              </div>

              {/* Quick Examples */}
              <div className="mt-6">
                <h3 className="text-sm font-medium text-gray-700 mb-3 korean-text">빠른 예시</h3>
                <div className="flex flex-wrap gap-2">
                  {generations.find(g => g.id === sourceGeneration)?.examples.map((example) => (
                    <button
                      key={example}
                      onClick={() => setInputText(example)}
                      className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm hover:bg-gray-200 transition-colors korean-text"
                    >
                      {example}
                    </button>
                  ))}
                </div>
              </div>
            </motion.div>

            {/* Translation Result */}
            <AnimatePresence>
              {result && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="mt-6 bg-white/80 backdrop-blur-sm rounded-2xl border border-white/20 p-6 shadow-xl"
                >
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 korean-text">번역 결과</h3>
                  
                  <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg p-4 mb-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <p className="text-lg text-gray-900 korean-text">{result.translatedText}</p>
                        <div className="flex items-center mt-2 space-x-2">
                          <div className="flex items-center">
                            <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                            <span className="text-sm text-green-700">
                              신뢰도 {Math.round(result.confidence * 100)}%
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="flex space-x-2 ml-4">
                        <button
                          onClick={() => copyToClipboard(result.translatedText)}
                          className="p-2 text-gray-500 hover:text-gray-700 transition-colors"
                          title="복사하기"
                        >
                          <Copy size={16} />
                        </button>
                        <button
                          onClick={() => speak(result.translatedText)}
                          className="p-2 text-gray-500 hover:text-gray-700 transition-colors"
                          title="읽기"
                        >
                          <Volume2 size={16} />
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="mb-4">
                    <h4 className="font-medium text-gray-900 mb-2 korean-text">설명</h4>
                    <p className="text-gray-600 korean-text">{result.explanation}</p>
                  </div>

                  <div>
                    <h4 className="font-medium text-gray-900 mb-2 korean-text">사용 예시</h4>
                    <ul className="space-y-1">
                      {result.examples.map((example, index) => (
                        <li key={index} className="text-gray-600 korean-text">• {example}</li>
                      ))}
                    </ul>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Enhanced Usage Stats */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="space-y-4"
            >
              <StatCard
                title="오늘 번역"
                value="127회"
                change={{ value: 15, type: 'increase' }}
                icon={<Zap size={20} />}
                color="blue"
              />
              <StatCard
                title="인기 조합"
                value="Z→부머"
                icon={<TrendingUp size={20} />}
                color="purple"
              />
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-white/20 p-6 shadow-xl">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 korean-text">만족도</h3>
                <div className="flex items-center justify-center">
                  <ProgressRing 
                    progress={94} 
                    size={100} 
                    color="#10B981"
                    showPercentage={true}
                  />
                </div>
                <p className="text-center text-sm text-gray-600 mt-2 korean-text">
                  사용자 만족도
                </p>
              </div>
            </motion.div>

            {/* Recent History */}
            {history.length > 0 && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
                className="bg-white/80 backdrop-blur-sm rounded-2xl border border-white/20 p-6 shadow-xl"
              >
                <h3 className="text-lg font-semibold text-gray-900 mb-4 korean-text">최근 번역</h3>
                <div className="space-y-3">
                  {history.map((item, index) => (
                    <div key={index} className="p-3 bg-gray-50 rounded-lg">
                      <div className="text-sm text-gray-600 mb-1 korean-text">
                        {generations.find(g => g.id === item.source)?.label} → {generations.find(g => g.id === item.target)?.label}
                      </div>
                      <div className="text-xs text-gray-500 mb-2 korean-text">"{item.input}"</div>
                      <div className="text-sm text-gray-900 korean-text">"{item.result.translatedText}"</div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Tips */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-gradient-to-br from-yellow-50 to-orange-50 rounded-2xl border border-yellow-200 p-6"
            >
              <h3 className="text-lg font-semibold text-gray-900 mb-4 korean-text">💡 사용 팁</h3>
              <ul className="space-y-2 text-sm text-gray-700">
                <li className="korean-text">• 문맥을 포함해서 입력하면 더 정확해요</li>
                <li className="korean-text">• 길이가 길수록 번역 품질이 향상됩니다</li>
                <li className="korean-text">• 음성 읽기로 발음을 확인해보세요</li>
                <li className="korean-text">• 번역 결과를 바로 복사할 수 있어요</li>
              </ul>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ZLangPage;