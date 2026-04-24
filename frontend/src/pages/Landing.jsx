import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Sprout, SearchCheck, TrendingUp, ShieldCheck, ChevronRight } from 'lucide-react';
import './Landing.css';

const Landing = () => {
  return (
    <div className="landing-container">
      {/* Hero Section */}
      <section className="hero-section">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="hero-badge"
        >
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-primary-600"></span>
          </span>
          Next-Gen AI for Indian Agriculture
        </motion.div>

        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="hero-title"
        >
          Smarter Planning, <br />
          <span className="gradient-text">Better Yields</span>
        </motion.h1>

        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="hero-description"
        >
          Empowering farmers with AI-driven crop recommendations and harvest decisions, 
          fully validated by agricultural experts for maximum reliability.
        </motion.p>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="hero-actions"
        >
          <Link to="/register" className="btn btn-primary btn-hero-primary group">
            Start Your Journey
            <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Link>
          <Link to="/login" className="btn btn-hero-outline">
            Farmer Login
          </Link>
        </motion.div>
      </section>

      {/* Features Grid */}
      <section className="features-section container">
        {[
          {
            icon: Sprout,
            title: "Smart Planning",
            desc: "ML-driven crop suggestions based on your soil profile and climate.",
            color: "blue"
          },
          {
            icon: SearchCheck,
            title: "Quality Grading",
            desc: "Instant harvest grading using industry-standard moisture and damage rules.",
            color: "emerald"
          },
          {
            icon: TrendingUp,
            title: "Market Insights",
            desc: "Predictive price trends to help you decide when to store or sell.",
            color: "orange"
          },
          {
            icon: ShieldCheck,
            title: "Expert Trust",
            desc: "Every automated insight is double-checked by certified agronomists.",
            color: "purple"
          }
        ].map((f, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1 }}
            className="glass-card feature-card group"
          >
            <div className="feature-icon-wrapper">
              <f.icon className="w-7 h-7" />
            </div>
            <h3 className="feature-title">{f.title}</h3>
            <p className="feature-desc">{f.desc}</p>
          </motion.div>
        ))}
      </section>
    </div>
  );
};

export default Landing;
