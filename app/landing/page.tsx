"use client"

import { useState, useEffect } from "react"
import { motion, useScroll, useTransform } from "framer-motion"
import { Button } from "@/components/ui/button"
import { FernLogo } from "@/components/fern-logo"
import Link from "next/link"
import { ShoppingBag, Store, Truck, ChevronDown } from "lucide-react"

export default function LandingPage() {
  const [isVisible, setIsVisible] = useState(false)
  const { scrollY } = useScroll()
  const y1 = useTransform(scrollY, [0, 300], [0, -50])
  const opacity = useTransform(scrollY, [0, 200], [1, 0.9])

  useEffect(() => {
    setIsVisible(true)
  }, [])

  const scrollToSection = (sectionId: string) => {
    document.getElementById(sectionId)?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    })
  }

  return (
    <div className="min-h-screen bg-black overflow-hidden relative">
      {/* Floating Mixed Particles */}
      <div className="fixed inset-0 pointer-events-none z-10">
        {[...Array(15)].map((_, i) => (
          <motion.div
            key={i}
            className={`absolute w-1 h-1 rounded-full opacity-40 ${
              i % 3 === 0 ? "bg-amber-300" : i % 3 === 1 ? "bg-emerald-300" : "bg-blue-300"
            }`}
            animate={{
              x: [0, 100, 0],
              y: [0, -100, 0],
              opacity: [0.2, 0.6, 0.2],
            }}
            transition={{
              duration: 8 + i * 0.5,
              repeat: Number.POSITIVE_INFINITY,
              ease: "easeInOut",
            }}
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
          />
        ))}
      </div>

      {/* Sticky Header */}
      <motion.header
        className="fixed top-0 w-full bg-black/20 backdrop-blur-md border-b border-white/10 z-50"
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-emerald-400 to-green-500 rounded-xl flex items-center justify-center">
              <FernLogo size="sm" className="text-white" animated />
            </div>
            <span className="text-2xl font-bold text-white">Rural Drop</span>
          </div>

          <div className="flex items-center space-x-4">
            <Link href="/login">
              <Button variant="ghost" size="sm" className="text-white hover:bg-white/10">
                Login
              </Button>
            </Link>
            <Link href="/buyer/register">
              <Button size="sm" className="bg-amber-500 hover:bg-amber-600 text-black font-semibold border-0">
                Get Started
              </Button>
            </Link>
          </div>
        </div>
      </motion.header>

      {/* Hero Section with Rural Landscape */}
      <section className="relative min-h-screen flex items-center justify-center">
        <motion.div className="absolute inset-0 z-0" style={{ y: y1, opacity }}>
          <div
            className="w-full h-full bg-cover bg-center bg-no-repeat"
            style={{
              backgroundImage: `linear-gradient(rgba(0,0,0,0.4), rgba(0,0,0,0.2)), url('/images/rural-landscape.png')`,
            }}
          />
        </motion.div>

        <div className="container mx-auto px-6 text-center relative z-20">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: isVisible ? 1 : 0, y: isVisible ? 0 : 50 }}
            transition={{ duration: 1, delay: 0.3 }}
          >
            <h1 className="text-6xl md:text-8xl font-bold text-white mb-8 leading-tight tracking-tight">
              Bringing Local
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-green-500">
                Flavours Home
              </span>
            </h1>

            <p className="text-xl md:text-2xl text-white/80 mb-16 max-w-2xl mx-auto leading-relaxed font-light">
              Discover authentic local restaurants in your rural community
            </p>

            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
              {/* Buyer Button - Amber Yellow */}
              <motion.div
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                transition={{ type: "spring", stiffness: 400, damping: 17 }}
              >
                <Link href="/buyer">
                  <Button
                    size="lg"
                    className="bg-amber-500 hover:bg-amber-600 text-black px-10 py-6 text-xl font-semibold shadow-2xl border-0 rounded-2xl hover:shadow-amber-500/25"
                  >
                    <ShoppingBag className="mr-3 h-6 w-6" />
                    Order Food
                  </Button>
                </Link>
              </motion.div>

              {/* Vendor Button - Forest Green */}
              <motion.div
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                transition={{ type: "spring", stiffness: 400, damping: 17 }}
              >
                <Link href="/vendor/register">
                  <Button
                    size="lg"
                    className="bg-green-700 hover:bg-green-800 text-white px-10 py-6 text-xl font-semibold shadow-2xl border-0 rounded-2xl hover:shadow-green-700/25"
                  >
                    <Store className="mr-3 h-6 w-6" />
                    Join as Restaurant
                  </Button>
                </Link>
              </motion.div>

              {/* Driver Button - Electric Blue */}
              <motion.div
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                transition={{ type: "spring", stiffness: 400, damping: 17 }}
              >
                <Link href="/driver/register">
                  <Button
                    size="lg"
                    className="bg-blue-500 hover:bg-blue-600 text-white px-10 py-6 text-xl font-semibold shadow-2xl border-0 rounded-2xl hover:shadow-blue-500/25"
                  >
                    <Truck className="mr-3 h-6 w-6" />
                    Drive with Us
                  </Button>
                </Link>
              </motion.div>
            </div>
          </motion.div>

          <motion.div
            className="absolute bottom-12 left-1/2 transform -translate-x-1/2"
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
          >
            <button
              onClick={() => scrollToSection("portals")}
              className="text-white/60 hover:text-white transition-colors"
            >
              <ChevronDown className="h-10 w-10" />
            </button>
          </motion.div>
        </div>
      </section>

      {/* Simple Portal Links Section */}
      <section id="portals" className="py-20 bg-gradient-to-b from-black to-gray-900">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-8">Choose Your Portal</h2>
            <p className="text-white/60 mb-12 text-lg">Already have an account? Access your portal directly</p>

            <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
              {/* Buyer Portal Card - Amber Theme */}
              <Link href="/buyer">
                <motion.div
                  whileHover={{ scale: 1.05, y: -5 }}
                  className="bg-gradient-to-br from-amber-500/20 to-orange-500/20 backdrop-blur-sm border border-amber-500/30 rounded-3xl p-8 text-center cursor-pointer"
                >
                  <ShoppingBag className="h-16 w-16 text-amber-400 mx-auto mb-4" />
                  <h3 className="text-2xl font-bold text-white mb-2">Order Now</h3>
                  <p className="text-white/70">Browse & order food</p>
                </motion.div>
              </Link>

              {/* Vendor Portal Card - Forest Green Theme */}
              <Link href="/vendor">
                <motion.div
                  whileHover={{ scale: 1.05, y: -5 }}
                  className="bg-gradient-to-br from-green-700/20 to-emerald-600/20 backdrop-blur-sm border border-green-600/30 rounded-3xl p-8 text-center cursor-pointer"
                >
                  <Store className="h-16 w-16 text-green-400 mx-auto mb-4" />
                  <h3 className="text-2xl font-bold text-white mb-2">Vendor Portal</h3>
                  <p className="text-white/70">Manage your restaurant</p>
                </motion.div>
              </Link>

              {/* Driver Portal Card - Electric Blue Theme */}
              <Link href="/driver">
                <motion.div
                  whileHover={{ scale: 1.05, y: -5 }}
                  className="bg-gradient-to-br from-blue-500/20 to-cyan-500/20 backdrop-blur-sm border border-blue-500/30 rounded-3xl p-8 text-center cursor-pointer"
                >
                  <Truck className="h-16 w-16 text-blue-400 mx-auto mb-4" />
                  <h3 className="text-2xl font-bold text-white mb-2">Driver Portal</h3>
                  <p className="text-white/70">Manage deliveries</p>
                </motion.div>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-black border-t border-white/10 py-12">
        <div className="container mx-auto px-6 text-center">
          <div className="flex items-center justify-center space-x-3 mb-6">
            <div className="w-8 h-8 bg-gradient-to-br from-emerald-400 to-green-500 rounded-lg flex items-center justify-center">
              <FernLogo size="sm" className="text-white" />
            </div>
            <span className="text-xl font-bold text-white">Rural Drop</span>
          </div>
          <div className="mb-4">
            <Link href="/" className="text-white/40 hover:text-white/60 transition-colors text-sm">
              Preview Mode - Switch Roles
            </Link>
          </div>
          <p className="text-white/60">Made with ❤️ for rural communities</p>
        </div>
      </footer>
    </div>
  )
}
