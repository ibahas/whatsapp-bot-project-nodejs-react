import { motion } from "framer-motion";
import { Hero, Features, DemoSection, CTA } from "../components/landing";

export default function Home() {
  return (
    <div className="bg-gradient-to-br from-blue-50 to-indigo-50">
      <Hero />

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <Features />

        <div className="py-20 px-4">
          <div className="max-w-7xl mx-auto bg-white rounded-3xl shadow-2xl p-8">
            <DemoSection />
          </div>
        </div>

        <CTA />
      </motion.div>
    </div>
  );
}
