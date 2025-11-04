import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Brain, Clock, Trophy, Users, CheckCircle, XCircle, RotateCcw, ArrowRight, Star, Target } from 'lucide-react';
import clsx from 'clsx';
import { DonutChart, MetricCard } from '../components/DataVisualization';

type Generation = 'gen-z' | 'millennial' | 'gen-x' | 'boomer';

interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
  generation: Generation;
  points: number;
}

interface QuizResult {
  score: number;
  totalPoints: number;
  answers: Array<{
    questionId: string;
    selectedAnswer: number;
    isCorrect: boolean;
    timeSpent: number;
  }>;
  generationMatch: Record<Generation, number>;
  insights: string[];
}

const GenQuizPage: React.FC = () => {
  const [selectedGeneration, setSelectedGeneration] = useState<Generation>('gen-z');
  const [quizState, setQuizState] = useState<'setup' | 'playing' | 'result'>('setup');
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [userAnswers, setUserAnswers] = useState<Array<{ questionId: string; selectedAnswer: number; timeSpent: number }>>([]);
  const [timeLeft, setTimeLeft] = useState(30);
  const [questionStartTime, setQuestionStartTime] = useState(Date.now());
  const [quizResult, setQuizResult] = useState<QuizResult | null>(null);

  const generations = [
    { 
      id: 'gen-z' as Generation, 
      label: 'Z세대', 
      desc: '1997-2012', 
      color: 'from-pink-500 to-purple-600',
      icon: '🔥'
    },
    { 
      id: 'millennial' as Generation, 
      label: '밀레니얼', 
      desc: '1981-1996', 
      color: 'from-blue-500 to-cyan-500',
      icon: '💻'
    },
    { 
      id: 'gen-x' as Generation, 
      label: 'X세대', 
      desc: '1965-1980', 
      color: 'from-green-500 to-teal-500',
      icon: '📼'
    },
    { 
      id: 'boomer' as Generation, 
      label: '베이비부머', 
      desc: '1946-1964', 
      color: 'from-amber-500 to-orange-500',
      icon: '📺'
    },
  ];

  const mockQuestions: Record<Generation, QuizQuestion[]> = {
    'gen-z': [
      {
        id: '1',
        question: '다음 중 Z세대가 자주 사용하는 표현은?',
        options: ['대박이다', 'ㄹㅇ루', '쩔어', '멋지다'],
        correctAnswer: 1,
        explanation: 'ㄹㅇ루는 "리얼로"의 줄임말로 Z세대가 많이 사용합니다.',
        generation: 'gen-z',
        points: 10
      },
      {
        id: '2',
        question: 'Z세대의 소비 패턴 특징은?',
        options: ['브랜드 충성도가 높다', '가성비를 중시한다', '개성과 경험을 중시한다', '전통적 가치를 선호한다'],
        correctAnswer: 2,
        explanation: 'Z세대는 개성 표현과 특별한 경험을 중시하는 소비 패턴을 보입니다.',
        generation: 'gen-z',
        points: 15
      },
      {
        id: '3',
        question: '"갑분싸"의 의미는?',
        options: ['갑자기 분노', '갑자기 분위기 싸해짐', '갑자기 분석', '갑자기 분주'],
        correctAnswer: 1,
        explanation: '"갑분싸"는 "갑자기 분위기 싸해짐"의 줄임말입니다.',
        generation: 'gen-z',
        points: 10
      }
    ],
    'millennial': [
      {
        id: '4',
        question: '밀레니얼 세대의 특징적인 경험은?',
        options: ['아날로그에서 디지털로의 전환', '전쟁 경험', '경제 호황기 성장', '완전 디지털 네이티브'],
        correctAnswer: 0,
        explanation: '밀레니얼 세대는 아날로그에서 디지털로의 전환기를 경험한 세대입니다.',
        generation: 'millennial',
        points: 15
      },
      {
        id: '5',
        question: '밀레니얼이 자주 사용했던 인터넷 표현은?',
        options: ['ㄹㅇ', 'ㅋㅋㅋ', 'ㅇㅈ', 'TMI'],
        correctAnswer: 1,
        explanation: 'ㅋㅋㅋ는 밀레니얼 세대가 인터넷 초기부터 사용한 대표적인 웃음 표현입니다.',
        generation: 'millennial',
        points: 10
      }
    ],
    'gen-x': [
      {
        id: '6',
        question: 'X세대가 경험한 주요 문화적 변화는?',
        options: ['스마트폰 보급', '인터넷 상용화', 'SNS 등장', 'AI 발전'],
        correctAnswer: 1,
        explanation: 'X세대는 인터넷 상용화를 직접 경험한 세대입니다.',
        generation: 'gen-x',
        points: 15
      }
    ],
    'boomer': [
      {
        id: '7',
        question: '베이비부머 세대의 가치관 특징은?',
        options: ['개성 중시', '안정성 중시', '변화 추구', '디지털 중심'],
        correctAnswer: 1,
        explanation: '베이비부머 세대는 안정성과 전통적 가치를 중시합니다.',
        generation: 'boomer',
        points: 15
      }
    ]
  };

  const currentQuestions = mockQuestions[selectedGeneration] || [];
  const currentQuestion = currentQuestions[currentQuestionIndex];

  useEffect(() => {
    let interval: number;
    if (quizState === 'playing' && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft(prev => prev - 1);
      }, 1000);
    } else if (timeLeft === 0 && quizState === 'playing') {
      handleNextQuestion();
    }
    return () => clearInterval(interval);
  }, [quizState, timeLeft]);

  const startQuiz = () => {
    setQuizState('playing');
    setCurrentQuestionIndex(0);
    setSelectedAnswer(null);
    setUserAnswers([]);
    setTimeLeft(30);
    setQuestionStartTime(Date.now());
  };

  const handleAnswerSelect = (answerIndex: number) => {
    setSelectedAnswer(answerIndex);
  };

  const handleNextQuestion = () => {
    if (currentQuestion) {
      const timeSpent = Math.round((Date.now() - questionStartTime) / 1000);
      const newAnswer = {
        questionId: currentQuestion.id,
        selectedAnswer: selectedAnswer ?? -1,
        timeSpent
      };
      
      const updatedAnswers = [...userAnswers, newAnswer];
      setUserAnswers(updatedAnswers);

      if (currentQuestionIndex < currentQuestions.length - 1) {
        setCurrentQuestionIndex(prev => prev + 1);
        setSelectedAnswer(null);
        setTimeLeft(30);
        setQuestionStartTime(Date.now());
      } else {
        finishQuiz(updatedAnswers);
      }
    }
  };

  const finishQuiz = (answers: typeof userAnswers) => {
    let score = 0;
    let totalPoints = 0;
    const resultAnswers = answers.map(answer => {
      const question = currentQuestions.find(q => q.id === answer.questionId);
      if (question) {
        totalPoints += question.points;
        const isCorrect = answer.selectedAnswer === question.correctAnswer;
        if (isCorrect) score += question.points;
        return {
          ...answer,
          isCorrect
        };
      }
      return { ...answer, isCorrect: false };
    });

    const generationMatch: Record<Generation, number> = {
      'gen-z': 0,
      'millennial': 0,
      'gen-x': 0,
      'boomer': 0
    };

    // 임시로 선택한 세대에 높은 점수 부여
    generationMatch[selectedGeneration] = Math.round((score / totalPoints) * 100);

    const insights = [
      `${generations.find(g => g.id === selectedGeneration)?.label} 문화에 대한 이해도가 높습니다!`,
      `${resultAnswers.filter(a => a.isCorrect).length}/${currentQuestions.length} 문제를 맞히셨네요.`,
      score > totalPoints * 0.8 ? '세대 이해 전문가 수준입니다!' : '더 많은 학습이 필요해요.'
    ];

    setQuizResult({
      score,
      totalPoints,
      answers: resultAnswers,
      generationMatch,
      insights
    });
    setQuizState('result');
  };

  const resetQuiz = () => {
    setQuizState('setup');
    setCurrentQuestionIndex(0);
    setSelectedAnswer(null);
    setUserAnswers([]);
    setQuizResult(null);
  };

  return (
    <div className="min-h-screen px-4 py-8 sm:px-6 lg:px-8 pb-24 md:pb-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="flex items-center justify-center mb-4">
            <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center mr-4">
              <Brain size={32} className="text-white" />
            </div>
            <h1 className="text-4xl font-bold korean-text">GenQuiz</h1>
          </div>
          <p className="text-xl text-gray-600 mb-2 korean-text">세대공감 퀴즈</p>
          <p className="text-gray-500 korean-text">재미있는 퀴즈로 다른 세대를 이해해보세요</p>
        </motion.div>

        <AnimatePresence mode="wait">
          {quizState === 'setup' && (
            <motion.div
              key="setup"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="bg-white/80 backdrop-blur-sm rounded-2xl border border-white/20 p-8 shadow-xl"
            >
              <h2 className="text-2xl font-bold text-gray-900 mb-6 korean-text">퀴즈 설정</h2>
              
              <div className="mb-8">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 korean-text">학습할 세대를 선택하세요</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {generations.map((gen) => (
                    <button
                      key={gen.id}
                      onClick={() => setSelectedGeneration(gen.id)}
                      className={clsx(
                        'p-6 rounded-xl text-center transition-all duration-200 transform hover:scale-105',
                        selectedGeneration === gen.id
                          ? `bg-gradient-to-r ${gen.color} text-white shadow-lg scale-105`
                          : 'bg-white border-2 border-gray-200 text-gray-600 hover:border-gray-300'
                      )}
                    >
                      <div className="text-3xl mb-2">{gen.icon}</div>
                      <div className="font-semibold korean-text">{gen.label}</div>
                      <div className="text-sm opacity-80">{gen.desc}</div>
                      <div className="text-xs mt-2 opacity-70">
                        {mockQuestions[gen.id]?.length || 0}문제
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-6 mb-8">
                <h3 className="font-semibold text-gray-900 mb-3 korean-text">퀴즈 정보</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                  <div>
                    <div className="text-2xl font-bold text-blue-600">{mockQuestions[selectedGeneration]?.length || 0}</div>
                    <div className="text-sm text-gray-600 korean-text">문제 수</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-purple-600">30초</div>
                    <div className="text-sm text-gray-600 korean-text">문제당 시간</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-green-600">
                      {mockQuestions[selectedGeneration]?.reduce((sum, q) => sum + q.points, 0) || 0}
                    </div>
                    <div className="text-sm text-gray-600 korean-text">총 점수</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-orange-600">중급</div>
                    <div className="text-sm text-gray-600 korean-text">난이도</div>
                  </div>
                </div>
              </div>

              <button
                onClick={startQuiz}
                disabled={!mockQuestions[selectedGeneration]?.length}
                className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white py-4 px-6 rounded-lg font-semibold text-lg flex items-center justify-center space-x-2 transform transition-all duration-200 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Trophy size={24} />
                <span className="korean-text">퀴즈 시작하기</span>
              </button>
            </motion.div>
          )}

          {quizState === 'playing' && currentQuestion && (
            <motion.div
              key="playing"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="bg-white/80 backdrop-blur-sm rounded-2xl border border-white/20 p-8 shadow-xl"
            >
              {/* Progress & Timer */}
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center space-x-4">
                  <div className="text-sm text-gray-600 korean-text">
                    {currentQuestionIndex + 1} / {currentQuestions.length}
                  </div>
                  <div className="flex-1 bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${((currentQuestionIndex + 1) / currentQuestions.length) * 100}%` }}
                    />
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Clock size={20} className="text-gray-500" />
                  <span className={clsx(
                    "text-lg font-bold",
                    timeLeft <= 10 ? "text-red-500" : "text-gray-700"
                  )}>
                    {timeLeft}s
                  </span>
                </div>
              </div>

              {/* Question */}
              <div className="mb-8">
                <h3 className="text-xl font-bold text-gray-900 mb-6 korean-text">
                  {currentQuestion.question}
                </h3>
                <div className="space-y-3">
                  {currentQuestion.options.map((option, index) => (
                    <button
                      key={index}
                      onClick={() => handleAnswerSelect(index)}
                      className={clsx(
                        'w-full p-4 text-left rounded-lg border-2 transition-all duration-200 korean-text',
                        selectedAnswer === index
                          ? 'border-purple-500 bg-purple-50 text-purple-700'
                          : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                      )}
                    >
                      <div className="flex items-center space-x-3">
                        <div className={clsx(
                          'w-6 h-6 rounded-full border-2 flex items-center justify-center text-sm font-bold',
                          selectedAnswer === index
                            ? 'border-purple-500 bg-purple-500 text-white'
                            : 'border-gray-300'
                        )}>
                          {index + 1}
                        </div>
                        <span>{option}</span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Next Button */}
              <button
                onClick={handleNextQuestion}
                disabled={selectedAnswer === null}
                className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white py-3 px-6 rounded-lg font-semibold flex items-center justify-center space-x-2 transform transition-all duration-200 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <span className="korean-text">
                  {currentQuestionIndex === currentQuestions.length - 1 ? '결과 보기' : '다음 문제'}
                </span>
                <ArrowRight size={20} />
              </button>
            </motion.div>
          )}

          {quizState === 'result' && quizResult && (
            <motion.div
              key="result"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6"
            >
              {/* Enhanced Score Cards */}
              <div className="grid md:grid-cols-2 gap-6 mb-6">
                <MetricCard
                  title="최종 점수"
                  value={`${quizResult.score}/${quizResult.totalPoints}`}
                  trend={{
                    value: Math.round((quizResult.score / quizResult.totalPoints) * 100),
                    isPositive: quizResult.score > quizResult.totalPoints * 0.7
                  }}
                  icon={<Trophy size={24} />}
                  color="bg-gradient-to-r from-purple-500 to-pink-500"
                  size="lg"
                />
                <MetricCard
                  title="정답률"
                  value={`${Math.round((quizResult.score / quizResult.totalPoints) * 100)}%`}
                  description={
                    quizResult.score > quizResult.totalPoints * 0.8 ? "훌륭해요!" :
                    quizResult.score > quizResult.totalPoints * 0.6 ? "좋아요!" : "더 노력해보세요!"
                  }
                  icon={<Target size={24} />}
                  color="bg-gradient-to-r from-green-500 to-emerald-500"
                  size="lg"
                />
              </div>

              {/* Performance Visualization */}
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-white/20 p-6 shadow-xl mb-6">
                <h3 className="text-xl font-bold text-gray-900 mb-4 korean-text">성과 분석</h3>
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <DonutChart
                      data={[
                        { 
                          label: '정답', 
                          value: quizResult.answers.filter(a => a.isCorrect).length, 
                          color: '#10B981' 
                        },
                        { 
                          label: '오답', 
                          value: quizResult.answers.filter(a => !a.isCorrect).length, 
                          color: '#EF4444' 
                        }
                      ]}
                      size={150}
                      centerContent={
                        <div className="text-center">
                          <div className="text-2xl font-bold text-gray-900">
                            {Math.round((quizResult.score / quizResult.totalPoints) * 100)}%
                          </div>
                          <div className="text-sm text-gray-600 korean-text">정답률</div>
                        </div>
                      }
                    />
                  </div>
                  <div className="flex flex-col justify-center space-y-4">
                    <div className="flex items-center space-x-3">
                      <Star className="text-yellow-500" size={20} />
                      <span className="korean-text">
                        {quizResult.score > quizResult.totalPoints * 0.9 ? "세대 이해 마스터!" :
                         quizResult.score > quizResult.totalPoints * 0.7 ? "세대 이해 전문가" :
                         quizResult.score > quizResult.totalPoints * 0.5 ? "세대 이해 학습자" : "더 많은 학습이 필요해요"}
                      </span>
                    </div>
                    <div className="text-sm text-gray-600 korean-text">
                      {currentQuestions.length}문제 중 {quizResult.answers.filter(a => a.isCorrect).length}문제 정답
                    </div>
                  </div>
                </div>
              </div>

              {/* Generation Match */}
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-white/20 p-6 shadow-xl">
                <h3 className="text-xl font-bold text-gray-900 mb-4 korean-text">세대 이해도</h3>
                <div className="space-y-3">
                  {Object.entries(quizResult.generationMatch).map(([gen, score]) => {
                    const generation = generations.find(g => g.id === gen);
                    if (!generation) return null;
                    
                    return (
                      <div key={gen} className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <span className="text-2xl">{generation.icon}</span>
                          <span className="font-medium korean-text">{generation.label}</span>
                        </div>
                        <div className="flex items-center space-x-3">
                          <div className="w-32 bg-gray-200 rounded-full h-2">
                            <div 
                              className={`bg-gradient-to-r ${generation.color} h-2 rounded-full transition-all duration-1000`}
                              style={{ width: `${score}%` }}
                            />
                          </div>
                          <span className="font-bold text-gray-700 w-12">{score}%</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Detailed Results */}
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-white/20 p-6 shadow-xl">
                <h3 className="text-xl font-bold text-gray-900 mb-4 korean-text">문제별 결과</h3>
                <div className="space-y-4">
                  {quizResult.answers.map((answer, index) => {
                    const question = currentQuestions.find(q => q.id === answer.questionId);
                    if (!question) return null;

                    return (
                      <div key={answer.questionId} className="border rounded-lg p-4">
                        <div className="flex items-start justify-between mb-2">
                          <h4 className="font-medium text-gray-900 korean-text">
                            Q{index + 1}. {question.question}
                          </h4>
                          {answer.isCorrect ? (
                            <CheckCircle size={20} className="text-green-500 flex-shrink-0 ml-2" />
                          ) : (
                            <XCircle size={20} className="text-red-500 flex-shrink-0 ml-2" />
                          )}
                        </div>
                        <div className="text-sm text-gray-600 mb-2 korean-text">
                          내 답: {question.options[answer.selectedAnswer]} 
                          {!answer.isCorrect && (
                            <span className="ml-2 text-green-600">
                              (정답: {question.options[question.correctAnswer]})
                            </span>
                          )}
                        </div>
                        <div className="text-xs text-gray-500 korean-text">
                          {question.explanation}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Insights */}
              <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-4 korean-text">💡 인사이트</h3>
                <ul className="space-y-2">
                  {quizResult.insights.map((insight, index) => (
                    <li key={index} className="text-gray-700 korean-text">• {insight}</li>
                  ))}
                </ul>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-4">
                <button
                  onClick={resetQuiz}
                  className="flex-1 bg-gradient-to-r from-purple-500 to-pink-500 text-white py-3 px-6 rounded-lg font-semibold flex items-center justify-center space-x-2 transform transition-all duration-200 hover:scale-105"
                >
                  <RotateCcw size={20} />
                  <span className="korean-text">다시 도전하기</span>
                </button>
                <button className="flex-1 bg-white border-2 border-gray-200 text-gray-700 py-3 px-6 rounded-lg font-semibold flex items-center justify-center space-x-2 transform transition-all duration-200 hover:scale-105">
                  <Users size={20} />
                  <span className="korean-text">결과 공유하기</span>
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default GenQuizPage;