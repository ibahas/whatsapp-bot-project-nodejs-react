import { motion } from 'framer-motion';
import { Hero, Features, Pricing, Testimonials } from '../../components/landing';

const LandingPage = () => {
  return (
    <div className="bg-gradient-to-b from-blue-50 to-white">
      {/* Hero Section */}
      <motion.section 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="py-20 text-center"
      >
        <h1 className="text-6xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          حوّل تواصلك مع العملاء عبر واتساب
        </h1>
        <p className="mt-4 text-xl text-gray-600">
          نظام متكامل لإدارة المراسلات، الحملات التسويقية، وتحليل النتائج
        </p>
        <div className="mt-8 flex justify-center gap-4">
          <button className="bg-blue-600 text-white px-8 py-3 rounded-full hover:bg-blue-700 transition-all">
            ابدأ مجانًا
          </button>
          <button className="border-2 border-blue-600 text-blue-600 px-8 py-3 rounded-full hover:bg-blue-50">
            شاهد الفيديو
          </button>
        </div>
      </motion.section>

      {/* Features Grid */}
      <Features />

      {/* Interactive Demo Section */}
      <div className="my-20 p-8 bg-white rounded-3xl shadow-xl mx-auto max-w-6xl">
        <h2 className="text-4xl font-bold text-center mb-8">جرب النظام الآن</h2>
        <div className="grid md:grid-cols-2 gap-8">
          <div className="space-y-4">
            <DemoChatInterface />
          </div>
          <div className="space-y-4">
            <DemoAnalytics />
          </div>
        </div>
      </div>

      {/* Pricing Section */}
      <Pricing />

      {/* Testimonials */}
      <Testimonials />
    </div>
  );
};