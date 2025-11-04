import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Languages, Brain, MessageCircle, Users, Zap, Heart, TrendingUp } from 'lucide-react';

const HomePage: React.FC = () => {
  const features = [
    {
      icon: Languages,
      title: 'ZLang - 신조어 변환',
      description: 'AI가 세대별 언어를 자연스럽게 번역해드립니다',
      link: '/zlang',
      gradient: 'from-blue-500 to-cyan-500',
    },
    {
      icon: Brain,
      title: 'GenQuiz - 세대공감 퀴즈',
      description: '재미있는 퀴즈로 다른 세대를 이해해보세요',
      link: '/genquiz',
      gradient: 'from-purple-500 to-pink-500',
    },
    {
      icon: MessageCircle,
      title: 'TalkBridge - 대화 리포터',
      description: '대화를 분석하고 소통 개선점을 제안드립니다',
      link: '/talkbridge',
      gradient: 'from-green-500 to-emerald-500',
    },
  ];

  const stats = [
    { icon: Users, label: '참여자', value: '300+', description: '활발한 커뮤니티' },
    { icon: Zap, label: '번역 완료', value: '1,500+', description: '신조어 변환' },
    { icon: Heart, label: '만족도', value: '95%', description: '사용자 만족' },
    { icon: TrendingUp, label: '성장률', value: '200%', description: '월별 증가' },
  ];

  return (
    <div className="min-h-screen pb-20 md:pb-0">
      {/* Hero Section */}
      <section className="relative overflow-hidden px-4 py-16 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="mb-8"
            >
              <h1 className="text-4xl sm:text-6xl font-bold korean-text">
                <span className="block text-gray-900 mb-2">세대를 잇는</span>
                <span className="block bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                  AI 소통 플랫폼
                </span>
              </h1>
              <p className="mt-6 text-xl text-gray-600 max-w-3xl mx-auto korean-text">
                Generation Bridge는 AI 기술로 세대 간 언어·문화·감정 격차를 해소하고,
                <br />
                공감 기반의 소통을 돕는 혁신적인 플랫폼입니다.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="flex flex-col sm:flex-row gap-4 justify-center items-center"
            >
              <Link
                to="/zlang"
                className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-8 py-4 rounded-lg font-semibold text-lg transform transition-all duration-200 hover:scale-105 hover:shadow-lg shadow-xl"
              >
                플랫폼 체험하기
              </Link>
              <button className="bg-white/90 text-gray-800 px-8 py-4 rounded-lg font-semibold text-lg border border-gray-200 transform transition-all duration-200 hover:scale-105 hover:shadow-lg">
                데모 영상 보기
              </button>
            </motion.div>
          </div>
        </div>

        {/* Enhanced Floating Elements */}
        <motion.div 
          className="absolute top-20 left-10 w-20 h-20 bg-gradient-to-r from-blue-400 to-blue-600 rounded-full opacity-70"
          animate={{ 
            y: [0, -20, 0],
            rotate: [0, 180, 360],
            scale: [1, 1.1, 1]
          }}
          transition={{ 
            duration: 6, 
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <motion.div 
          className="absolute top-40 right-10 w-16 h-16 bg-gradient-to-r from-purple-400 to-purple-600 rounded-full opacity-70"
          animate={{ 
            y: [0, -15, 0],
            x: [0, 10, 0],
            scale: [1, 0.9, 1]
          }}
          transition={{ 
            duration: 4, 
            repeat: Infinity,
            ease: "easeInOut",
            delay: 0.5
          }}
        />
        <motion.div 
          className="absolute bottom-20 left-1/4 w-12 h-12 bg-gradient-to-r from-pink-400 to-pink-600 rounded-full opacity-70"
          animate={{ 
            y: [0, -10, 0],
            rotate: [0, -180, -360]
          }}
          transition={{ 
            duration: 5, 
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1
          }}
        />
        <motion.div 
          className="absolute top-1/3 right-1/4 w-8 h-8 bg-gradient-to-r from-green-400 to-emerald-600 rounded-full opacity-60"
          animate={{ 
            scale: [1, 1.3, 1],
            opacity: [0.6, 0.9, 0.6]
          }}
          transition={{ 
            duration: 3, 
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1.5
          }}
        />
      </section>

      {/* Features Section */}
      <section className="px-4 py-16 sm:px-6 lg:px-8 bg-white/50">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4 korean-text">
              3가지 핵심 서비스
            </h2>
            <p className="text-xl text-gray-600 korean-text">
              각 세대의 특성을 이해하고 소통을 돕는 AI 도구들
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                >
                  <Link
                    to={feature.link}
                    className="block h-full p-8 bg-white/80 backdrop-blur-sm rounded-2xl border border-white/20 transform transition-all duration-300 hover:scale-105 hover:shadow-xl group"
                  >
                    <div className={`w-16 h-16 bg-gradient-to-r ${feature.gradient} rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                      <Icon size={32} className="text-white" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-3 korean-text">
                      {feature.title}
                    </h3>
                    <p className="text-gray-600 korean-text">
                      {feature.description}
                    </p>
                  </Link>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="px-4 py-16 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4 korean-text">
              실시간 성과 지표
            </h2>
            <p className="text-xl text-gray-600 korean-text">
              지속적으로 성장하는 세대소통 플랫폼
            </p>
          </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {stats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="text-center p-6 bg-white/80 backdrop-blur-sm rounded-xl border border-white/20 transform transition-all duration-300 hover:scale-105"
                >
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center mx-auto mb-4">
                    <Icon size={24} className="text-white" />
                  </div>
                  <div className="text-3xl font-bold text-gray-900 mb-1">
                    {stat.value}
                  </div>
                  <div className="text-sm font-semibold text-gray-700 mb-1 korean-text">
                    {stat.label}
                  </div>
                  <div className="text-xs text-gray-500 korean-text">
                    {stat.description}
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="px-4 py-16 sm:px-6 lg:px-8 bg-gradient-to-r from-blue-500 via-purple-600 to-pink-600">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-6 korean-text">
              지금 바로 시작해보세요
            </h2>
            <p className="text-xl text-white/90 mb-8 korean-text">
              "기술은 세대를 잇는 다리입니다" - 더 나은 소통을 위한 첫 걸음을 내딛어보세요
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/zlang"
                className="bg-white text-purple-600 px-8 py-4 rounded-lg font-semibold text-lg transform transition-all duration-200 hover:scale-105 hover:shadow-lg"
              >
                ZLang 체험하기
              </Link>
              <Link
                to="/genquiz"
                className="bg-white/20 text-white px-8 py-4 rounded-lg font-semibold text-lg border border-white/30 transform transition-all duration-200 hover:scale-105 hover:bg-white/30"
              >
                GenQuiz 시작하기
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;