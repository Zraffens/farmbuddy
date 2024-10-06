import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "../ui/Button";
import { Input } from "../ui/Input";
import { Card, CardContent } from "../ui/Card";
import {
  Users,
  Calendar,
  Star,
  ArrowRight,
  Droplets,
  ChevronDown,
} from "lucide-react";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "../ui/Accordion";

import Hero from "../custom/hero";

const FeatureCard = ({ icon: Icon, title, description }) => {
  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      transition={{ type: "spring", stiffness: 300 }}
    >
      <Card className="h-full">
        <CardContent className="flex flex-col items-center space-y-4 p-6">
          <div>
            <Icon className="h-16 w-16 text-green-600" />
          </div>
          <h3 className="text-xl text-center font-bold">{title}</h3>
          <p className="text-gray-600 text-center">{description}</p>
        </CardContent>
      </Card>
    </motion.div>
  );
};

const StepCard = ({ number, title, description }) => (
  <motion.div
    initial={{ opacity: 0, y: 50 }}
    whileInView={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5, delay: number * 0.2 }}
    className="flex flex-col items-center space-y-3 border-2 border-gray-200 rounded-2xl p-6 bg-white shadow-lg hover:shadow-xl transition-shadow duration-300"
  >
    <motion.div
      whileHover={{ scale: 1.1 }}
      className="w-16 h-16 rounded-full bg-green-600 text-white flex items-center justify-center text-2xl font-bold"
    >
      {number}
    </motion.div>
    <h3 className="text-xl font-bold text-black">{title}</h3>
    <p className="text-gray-600 text-center">{description}</p>
  </motion.div>
);

const FAQItem = ({ question, answer, value }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <AccordionItem value={value} className="mb-4">
      <AccordionTrigger
        onClick={() => setIsOpen(!isOpen)}
        className="flex justify-between items-center w-full text-left p-4 rounded-lg bg-white shadow-md hover:bg-gray-50 transition-all duration-300"
      >
        <span className="text-lg font-semibold text-gray-800">{question}</span>
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.3 }}
        >
          {/* <ChevronDown className="h-5 w-5 text-green-500" />  */}
        </motion.div>
      </AccordionTrigger>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
          >
            <AccordionContent className="p-4 bg-green-50 rounded-b-lg">
              <p className="text-gray-600">{answer}</p>
            </AccordionContent>
          </motion.div>
        )}
      </AnimatePresence>
    </AccordionItem>
  );
};

const Home = () => {
  const [showChevron, setShowChevron] = useState(true);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 100) {
        setShowChevron(false);
      } else {
        setShowChevron(true);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToFeatures = () => {
    const featuresSection = document.getElementById("features");
    if (featuresSection) {
      featuresSection.scrollIntoView({ behavior: "smooth" });
    }
  };
  const faqs = [
    {
      question: "What is FarmBuddy?",
      answer:
        "FarmBuddy is an innovative app designed to assist farmers by analyzing vast amounts of data related to weather patterns, soil conditions, and crop health. It provides personalized recommendations for irrigation, planting schedules, and more to optimize your farming practices and enhance crop yields.",
    },
    {
      question: "How does FarmBuddy gather and analyze data?",
      answer:
        "FarmBuddy utilizes a combination of historical data and real-time information from various sources, including weather forecasts, soil sensors, and satellite imagery. Our advanced algorithms process this data to generate actionable insights tailored to your specific farming needs.",
    },
    {
      question: "Is FarmBuddy suitable for all types of farms?",
      answer:
        "Yes, FarmBuddy is designed to support a wide range of farming operations, whether you're managing a small vegetable garden or a large-scale agricultural enterprise. The app provides customizable recommendations based on the specific crops you grow, your geographic location, and your unique farming practices.",
    },
  ];

  return (
    <div className="flex flex-col w-full bg-gray-50">
      <div className="min-h-screen bg-gray-100 font-poppins">
        <main>
          <section className="h-screen flex justify-center relative">
            <Hero />
            <motion.div
              className="absolute bottom-24 transform -translate-x-1/2 cursor-pointer"
              initial={{ opacity: 0, y: -20 }}
              animate={{
                opacity: showChevron ? 1 : 0,
                y: showChevron ? 0 : 20,
              }}
              transition={{ duration: 0.3 }}
              onClick={scrollToFeatures}
            >
              <ChevronDown className="h-16 w-16 text-green-500 animate-bounce" />
            </motion.div>
          </section>

          <section
            className="w-full pt-2 pb-16 flex justify-center md:pt-2 md:pb-24 lg:pt-2 lg:pb-24 bg-white"
            id="features"
          >
            <div className="container px-4 md:px-6">
              <motion.h2
                initial={{ opacity: 0, y: -50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="text-3xl text-black font-bold tracking-tighter sm:text-4xl md:text-5xl text-center mb-12"
              >
                Why Choose FarmBuddy?
              </motion.h2>
              <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-3">
                <FeatureCard
                  icon={Droplets}
                  title="Smart Irrigation Recommendations"
                  description="Receive tailored irrigation schedules based on real-time weather data and soil moisture levels to optimize water usage and enhance crop yield."
                />
                <FeatureCard
                  icon={Users}
                  title="Agricultural Experts at Your Fingertips"
                  description="Gain access to a diverse network of experienced farmers and agronomists who can guide you on best practices and innovative techniques."
                />
                <FeatureCard
                  icon={Calendar}
                  title="Advanced Weather Alerts"
                  description="Stay informed with accurate weather forecasts and alerts, helping you make proactive decisions about farming activities and protect your crops."
                />
              </div>
            </div>
          </section>

          <section
            className="w-full py-12 md:py-24 lg:py-32 bg-gradient-to-r from-green-100 to-[#6DBE45]-100 flexx"
            id="how-it-works"
          >
            <div className="container px-4 md:px-6 lg:px-40 ">
              <motion.h2
                initial={{ opacity: 0, y: -50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="text-3xl text-black font-bold tracking-tighter sm:text-4xl md:text-5xl text-center mb-12"
              >
                How It Works
              </motion.h2>
              <div className="grid gap-6 lg:grid-cols-3 ">
                <StepCard
                  number={1}
                  title="Sign Up"
                  description="Create your account and provide details about your farm to start receiving personalized data insights tailored to your specific needs"
                />
                <StepCard
                  number={2}
                  title="Receive Data-Driven Insights"
                  description="Our algorithms analyze vast datasets to provide you with actionable recommendations, ensuring you make informed decisions for your farm."
                />
                <StepCard
                  number={3}
                  title="Take Action with Confidence"
                  description="Use our insights to make timely decisions on irrigation, planting, and other key farming practices for optimal results."
                />
              </div>
            </div>
          </section>

          <section
            className="w-full hidden py-12 md:py-24 lg:py-32 bg-white "
            id="testimonials"
          >
            <div className="container px-4 md:px-6">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-center mb-8 text-black">
                What Our Users Say
              </h2>
              <div className="grid gap-8 lg:grid-cols-2">
                <Card>
                  <CardContent className="flex flex-col space-y-2 p-6">
                    <Star className="h-6 w-6 text-yellow-500" />
                    <p className="text-gray-600">
                      "FarmBuddy helped me find the perfect mentor for my career
                      transition. The video calls were incredibly insightful!"
                    </p>
                    <div className="text-right text-sm font-semibold text-gray-800">
                      - Alex J.
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="flex flex-col space-y-2 p-6">
                    <Star className="h-6 w-6 text-yellow-500" />
                    <p className="text-gray-600">
                      "The flexibility to schedule sessions at my convenience is
                      a game changer! I couldn't have done it without my
                      mentor."
                    </p>
                    <div className="text-right text-sm font-semibold text-gray-800">
                      - Jamie R.
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </section>

          <section className="w-full py-12 md:py-24 lg:py-32 bg-white" id="faq">
            <div className="container px-4 md:px-6 lg:px-40">
              <motion.h2
                initial={{ opacity: 0, y: -50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="text-3xl text-black font-bold tracking-tighter sm:text-4xl md:text-5xl text-center mb-12"
              >
                Frequently Asked Questions
              </motion.h2>
              <Accordion type="single" collapsible>
                {faqs.map((faq, index) => (
                  <FAQItem
                    key={index}
                    question={faq.question}
                    answer={faq.answer}
                    value={`item-${index}`}
                  />
                ))}
              </Accordion>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
};

export default Home;
