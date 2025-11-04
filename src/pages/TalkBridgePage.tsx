import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, BarChart3, Users, Heart, Brain, Download, Share, Mic, MicOff } from 'lucide-react';
import clsx from 'clsx';

type Generation = 'gen-z' | 'millennial' | 'gen-x' | 'boomer';

interface Participant {
  id: string;
  name: string;
  generation: Generation;
  color: string;
}

interface EmotionAnalysis {
  overall: {
    positive: number;
    negative: number;
    neutral: number;
    dominant: 'positive' | 'negative' | 'neutral';
    intensity: number;
  };
  byParticipant: Record<string, {
    positive: number;
    negative: number;
    neutral: number;
  }>;
}

interface AnalysisResult {
  emotionAnalysis: EmotionAnalysis;
  generationInsights: Array<{
    generation: Generation;
    communicationStyle: string;
    recommendations: string[];
  }>;
  suggestions: Array<{
    type: 'language' | 'emotion' | 'approach';
    priority: 'high' | 'medium' | 'low';
    description: string;
    example: string;
  }>;
}

const TalkBridgePage: React.FC = () => {
  const [conversationText, setConversationText] = useState('');
  const [participants, setParticipants] = useState<Participant[]>([
    { id: '1', name: '민지', generation: 'gen-z', color: 'pink' },
    { id: '2', name: '성호', generation: 'boomer', color: 'blue' }
  ]);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [activeTab, setActiveTab] = useState<'emotion' | 'insights' | 'suggestions'>('emotion');

  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const generations = [
    { id: 'gen-z' as Generation, label: 'Z세대', color: 'from-pink-500 to-purple-600' },
    { id: 'millennial' as Generation, label: '밀레니얼', color: 'from-blue-500 to-cyan-500' },
    { id: 'gen-x' as Generation, label: 'X세대', color: 'from-green-500 to-teal-500' },
    { id: 'boomer' as Generation, label: '베이비부머', color: 'from-amber-500 to-orange-500' },
  ];

  const colorOptions = ['pink', 'blue', 'green', 'purple', 'orange', 'teal'];

  const mockAnalyze = async (_text: string): Promise<AnalysisResult> => {
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    return {
      emotionAnalysis: {
        overall: {
          positive: 0.65,
          negative: 0.15,
          neutral: 0.20,
          dominant: 'positive',
          intensity: 0.7
        },
        byParticipant: {
          '민지': { positive: 0.8, negative: 0.1, neutral: 0.1 },
          '성호': { positive: 0.5, negative: 0.2, neutral: 0.3 }
        }
      },
      generationInsights: [
        {
          generation: 'gen-z',
          communicationStyle: '직접적이고 감정적인 표현을 선호하며, 줄임말과 이모티콘을 자주 사용합니다.',
          recommendations: [
            '상대방의 말을 끝까지 들어보세요',
            '공감의 표현을 더 많이 사용해보세요',
            '정중한 언어 사용을 연습해보세요'
          ]
        },
        {
          generation: 'boomer',
          communicationStyle: '정중하고 구체적인 설명을 선호하며, 전통적인 예의를 중시합니다.',
          recommendations: [
            '젊은 세대의 표현 방식을 이해해보세요',
            '감정 표현을 더 자유롭게 해보세요',
            '간결한 표현도 시도해보세요'
          ]
        }
      ],
      suggestions: [
        {
          type: 'language',
          priority: 'high',
          description: '세대 간 언어 차이를 인정하고 서로의 표현을 존중하세요',
          example: '"그 말씀이 맞습니다" → "맞아요, 그럴 수 있겠네요"'
        },
        {
          type: 'emotion',
          priority: 'medium',
          description: '감정 표현의 강도를 조절하여 상대방이 편안하게 느끼도록 하세요',
          example: '"완전 짜증나!" → "조금 답답하긴 해요"'
        },
        {
          type: 'approach',
          priority: 'medium',
          description: '대화 주제를 공통 관심사로 유도하여 자연스러운 소통을 도모하세요',
          example: '음식, 건강, 가족 이야기 등으로 화제를 전환'
        }
      ]
    };
  };

  const handleAnalyze = async () => {
    if (!conversationText.trim()) return;
    
    setIsAnalyzing(true);
    try {
      const result = await mockAnalyze(conversationText);
      setAnalysisResult(result);
    } catch (error) {
      console.error('Analysis error:', error);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const addParticipant = () => {
    const newParticipant: Participant = {
      id: Date.now().toString(),
      name: `참여자 ${participants.length + 1}`,
      generation: 'millennial',
      color: colorOptions[participants.length % colorOptions.length]
    };
    setParticipants([...participants, newParticipant]);
  };

  const updateParticipant = (id: string, updates: Partial<Participant>) => {
    setParticipants(prev => prev.map(p => p.id === id ? { ...p, ...updates } : p));
  };

  const removeParticipant = (id: string) => {
    if (participants.length > 1) {
      setParticipants(prev => prev.filter(p => p.id !== id));
    }
  };

  const toggleRecording = () => {
    setIsRecording(!isRecording);
    // 실제 음성 인식 구현 시 여기에 로직 추가
  };

  const getEmotionColor = (emotion: 'positive' | 'negative' | 'neutral') => {
    switch (emotion) {
      case 'positive': return 'text-green-600 bg-green-100';
      case 'negative': return 'text-red-600 bg-red-100';
      case 'neutral': return 'text-gray-600 bg-gray-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getPriorityColor = (priority: 'high' | 'medium' | 'low') => {
    switch (priority) {
      case 'high': return 'text-red-600 bg-red-100';
      case 'medium': return 'text-yellow-600 bg-yellow-100';
      case 'low': return 'text-green-600 bg-green-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  return (
    <div className="min-h-screen px-4 py-8 sm:px-6 lg:px-8 pb-24 md:pb-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="flex items-center justify-center mb-4">
            <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-500 rounded-2xl flex items-center justify-center mr-4">
              <MessageCircle size={32} className="text-white" />
            </div>
            <h1 className="text-4xl font-bold korean-text">TalkBridge</h1>
          </div>
          <p className="text-xl text-gray-600 mb-2 korean-text">대화 리포터</p>
          <p className="text-gray-500 korean-text">대화를 분석하고 소통 개선점을 제안드립니다</p>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Input Section */}
          <div className="lg:col-span-2 space-y-6">
            {/* Participants Setup */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white/80 backdrop-blur-sm rounded-2xl border border-white/20 p-6 shadow-xl"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900 korean-text">대화 참여자</h3>
                <button
                  onClick={addParticipant}
                  className="px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg text-sm font-medium transform transition-all duration-200 hover:scale-105"
                >
                  + 추가
                </button>
              </div>
              
              <div className="space-y-3">
                {participants.map((participant) => (
                  <div key={participant.id} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                    <div className={`w-4 h-4 rounded-full bg-${participant.color}-500`}></div>
                    <input
                      type="text"
                      value={participant.name}
                      onChange={(e) => updateParticipant(participant.id, { name: e.target.value })}
                      className="flex-1 bg-transparent border-none outline-none font-medium korean-text"
                    />
                    <select
                      value={participant.generation}
                      onChange={(e) => updateParticipant(participant.id, { generation: e.target.value as Generation })}
                      className="bg-white border border-gray-200 rounded px-2 py-1 text-sm korean-text"
                    >
                      {generations.map((gen) => (
                        <option key={gen.id} value={gen.id}>{gen.label}</option>
                      ))}
                    </select>
                    {participants.length > 1 && (
                      <button
                        onClick={() => removeParticipant(participant.id)}
                        className="text-red-500 hover:text-red-700 p-1"
                      >
                        ×
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Conversation Input */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white/80 backdrop-blur-sm rounded-2xl border border-white/20 p-6 shadow-xl"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900 korean-text">대화 내용</h3>
                <button
                  onClick={toggleRecording}
                  className={clsx(
                    'flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-all duration-200',
                    isRecording 
                      ? 'bg-red-500 text-white animate-pulse' 
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  )}
                >
                  {isRecording ? <MicOff size={16} /> : <Mic size={16} />}
                  <span className="korean-text">{isRecording ? '녹음 중지' : '음성 입력'}</span>
                </button>
              </div>

              <textarea
                ref={textareaRef}
                value={conversationText}
                onChange={(e) => setConversationText(e.target.value)}
                placeholder={`대화 내용을 입력하거나 붙여넣으세요...\n\n예시:\n민지: 아 오늘 진짜 힘들었어 ㅠㅠ\n성호: 무슨 일이 있었나요? 괜찮으신가요?\n민지: 과제가 너무 많아서요... 갑분싸 됐나?\n성호: 아니에요, 충분히 힘들 수 있죠. 도움이 필요하면 언제든 말씀하세요.`}
                className="w-full h-80 p-4 border border-gray-200 rounded-lg resize-none focus:ring-2 focus:ring-green-500 focus:border-transparent korean-text"
              />
              
              <div className="flex items-center justify-between mt-4">
                <div className="text-sm text-gray-400">
                  {conversationText.length}/2000
                </div>
                <div className="flex space-x-3">
                  <button
                    onClick={() => setConversationText('')}
                    className="px-4 py-2 border border-gray-200 rounded-lg text-gray-600 hover:bg-gray-50 transition-colors korean-text"
                  >
                    초기화
                  </button>
                  <button
                    onClick={handleAnalyze}
                    disabled={!conversationText.trim() || isAnalyzing}
                    className="px-6 py-2 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-lg font-semibold flex items-center space-x-2 transform transition-all duration-200 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isAnalyzing ? (
                      <>
                        <Brain size={16} className="animate-spin" />
                        <span className="korean-text">분석 중...</span>
                      </>
                    ) : (
                      <>
                        <BarChart3 size={16} />
                        <span className="korean-text">대화 분석하기</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Info Sidebar */}
          <div className="space-y-6">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-white/80 backdrop-blur-sm rounded-2xl border border-white/20 p-6 shadow-xl"
            >
              <h3 className="text-lg font-semibold text-gray-900 mb-4 korean-text">분석 항목</h3>
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <Heart size={20} className="text-red-500" />
                  <div>
                    <div className="font-medium korean-text">감정 분석</div>
                    <div className="text-sm text-gray-600 korean-text">대화의 감정적 톤 파악</div>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <Users size={20} className="text-blue-500" />
                  <div>
                    <div className="font-medium korean-text">세대별 인사이트</div>
                    <div className="text-sm text-gray-600 korean-text">소통 스타일 분석</div>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <Brain size={20} className="text-purple-500" />
                  <div>
                    <div className="font-medium korean-text">개선 제안</div>
                    <div className="text-sm text-gray-600 korean-text">더 나은 소통을 위한 팁</div>
                  </div>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-gradient-to-br from-yellow-50 to-orange-50 rounded-2xl border border-yellow-200 p-6"
            >
              <h3 className="text-lg font-semibold text-gray-900 mb-4 korean-text">💡 사용 팁</h3>
              <ul className="space-y-2 text-sm text-gray-700">
                <li className="korean-text">• 실제 대화를 그대로 복사해서 입력해보세요</li>
                <li className="korean-text">• 화자를 구분해서 입력하면 더 정확해요</li>
                <li className="korean-text">• 길수록 분석 결과가 정확해집니다</li>
                <li className="korean-text">• 개인정보는 제거하고 입력해주세요</li>
              </ul>
            </motion.div>
          </div>
        </div>

        {/* Analysis Results */}
        <AnimatePresence>
          {analysisResult && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="mt-8 bg-white/80 backdrop-blur-sm rounded-2xl border border-white/20 p-6 shadow-xl"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900 korean-text">분석 결과</h2>
                <div className="flex space-x-2">
                  <button className="p-2 text-gray-500 hover:text-gray-700 transition-colors" title="다운로드">
                    <Download size={20} />
                  </button>
                  <button className="p-2 text-gray-500 hover:text-gray-700 transition-colors" title="공유">
                    <Share size={20} />
                  </button>
                </div>
              </div>

              {/* Tab Navigation */}
              <div className="flex space-x-1 mb-6 bg-gray-100 rounded-lg p-1">
                {[
                  { id: 'emotion', label: '감정 분석', icon: Heart },
                  { id: 'insights', label: '세대 인사이트', icon: Users },
                  { id: 'suggestions', label: '개선 제안', icon: Brain }
                ].map((tab) => {
                  const Icon = tab.icon;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id as any)}
                      className={clsx(
                        'flex-1 flex items-center justify-center space-x-2 py-2 px-4 rounded-md transition-all duration-200 korean-text',
                        activeTab === tab.id
                          ? 'bg-white text-gray-900 shadow-sm'
                          : 'text-gray-600 hover:text-gray-900'
                      )}
                    >
                      <Icon size={16} />
                      <span>{tab.label}</span>
                    </button>
                  );
                })}
              </div>

              {/* Tab Content */}
              <AnimatePresence mode="wait">
                {activeTab === 'emotion' && (
                  <motion.div
                    key="emotion"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="space-y-6"
                  >
                    {/* Overall Emotion */}
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-4 korean-text">전체 감정 분석</h3>
                      <div className="grid grid-cols-3 gap-4 mb-4">
                        <div className="text-center p-4 bg-green-50 rounded-lg">
                          <div className="text-2xl font-bold text-green-600">
                            {Math.round(analysisResult.emotionAnalysis.overall.positive * 100)}%
                          </div>
                          <div className="text-sm text-gray-600 korean-text">긍정</div>
                        </div>
                        <div className="text-center p-4 bg-gray-50 rounded-lg">
                          <div className="text-2xl font-bold text-gray-600">
                            {Math.round(analysisResult.emotionAnalysis.overall.neutral * 100)}%
                          </div>
                          <div className="text-sm text-gray-600 korean-text">중립</div>
                        </div>
                        <div className="text-center p-4 bg-red-50 rounded-lg">
                          <div className="text-2xl font-bold text-red-600">
                            {Math.round(analysisResult.emotionAnalysis.overall.negative * 100)}%
                          </div>
                          <div className="text-sm text-gray-600 korean-text">부정</div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3">
                        <span className="korean-text">주요 감정:</span>
                        <span className={clsx(
                          'px-3 py-1 rounded-full text-sm font-medium',
                          getEmotionColor(analysisResult.emotionAnalysis.overall.dominant)
                        )}>
                          {analysisResult.emotionAnalysis.overall.dominant === 'positive' ? '긍정적' :
                           analysisResult.emotionAnalysis.overall.dominant === 'negative' ? '부정적' : '중립적'}
                        </span>
                        <span className="text-sm text-gray-600 korean-text">
                          (강도: {Math.round(analysisResult.emotionAnalysis.overall.intensity * 100)}%)
                        </span>
                      </div>
                    </div>

                    {/* By Participant */}
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-4 korean-text">참여자별 감정</h3>
                      <div className="space-y-3">
                        {Object.entries(analysisResult.emotionAnalysis.byParticipant).map(([name, emotions]) => (
                          <div key={name} className="p-4 bg-gray-50 rounded-lg">
                            <div className="flex items-center justify-between mb-2">
                              <span className="font-medium korean-text">{name}</span>
                            </div>
                            <div className="flex space-x-2">
                              <div className="flex-1 bg-gray-200 rounded-full h-2">
                                <div 
                                  className="bg-green-500 h-2 rounded-l-full"
                                  style={{ width: `${emotions.positive * 100}%` }}
                                />
                              </div>
                              <div className="text-xs text-gray-600 w-12">
                                {Math.round(emotions.positive * 100)}%
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                )}

                {activeTab === 'insights' && (
                  <motion.div
                    key="insights"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="space-y-6"
                  >
                    {analysisResult.generationInsights.map((insight, index) => {
                      const generation = generations.find(g => g.id === insight.generation);
                      return (
                        <div key={index} className="p-6 border rounded-lg">
                          <div className="flex items-center space-x-3 mb-4">
                            <div className={`w-12 h-12 bg-gradient-to-r ${generation?.color} rounded-lg flex items-center justify-center text-white font-bold`}>
                              {generation?.label.charAt(0)}
                            </div>
                            <div>
                              <h3 className="text-lg font-semibold text-gray-900 korean-text">{generation?.label}</h3>
                              <p className="text-gray-600 korean-text">소통 스타일 분석</p>
                            </div>
                          </div>
                          <p className="text-gray-700 mb-4 korean-text">{insight.communicationStyle}</p>
                          <div>
                            <h4 className="font-medium text-gray-900 mb-2 korean-text">개선 제안</h4>
                            <ul className="space-y-1">
                              {insight.recommendations.map((rec, recIndex) => (
                                <li key={recIndex} className="text-gray-700 korean-text">• {rec}</li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      );
                    })}
                  </motion.div>
                )}

                {activeTab === 'suggestions' && (
                  <motion.div
                    key="suggestions"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="space-y-4"
                  >
                    {analysisResult.suggestions.map((suggestion, index) => (
                      <div key={index} className="p-4 border rounded-lg">
                        <div className="flex items-start justify-between mb-2">
                          <h4 className="font-medium text-gray-900 korean-text">{suggestion.description}</h4>
                          <span className={clsx(
                            'px-2 py-1 rounded text-xs font-medium',
                            getPriorityColor(suggestion.priority)
                          )}>
                            {suggestion.priority === 'high' ? '높음' : 
                             suggestion.priority === 'medium' ? '보통' : '낮음'}
                          </span>
                        </div>
                        <div className="text-sm text-gray-600 korean-text">
                          <span className="font-medium">예시:</span> {suggestion.example}
                        </div>
                      </div>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default TalkBridgePage;