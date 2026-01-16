'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import {
  GraduationCap,
  BookOpen,
  Users,
  Award,
  Clock,
  ArrowRight,
  Phone,
  Mail,
  MapPin,
  ChevronRight,
  ChevronLeft,
  ChevronDown,
  Search,
  Heart,
  HandHelping,
  UsersRound,
  Menu,
  X
} from 'lucide-react'

// Hero slides data
const heroSlides = [
  {
    id: 1,
    gradient: 'linear-gradient(135deg, #003366 0%, #004080 50%, #002244 100%)',
    title: 'Bienvenue à l\'École des Membres',
    subtitle: 'Une Année de Foi Grandissante',
    description: 'Rejoignez notre communauté spirituelle et grandissez dans votre foi avec l\'Église du Plein Évangile Ramah',
  },
  {
    id: 2,
    gradient: 'linear-gradient(135deg, #C8102E 0%, #a00d25 100%)',
    title: 'Grandir • Servir • Appartenir',
    subtitle: 'Nos Trois Piliers Fondamentaux',
    description: 'Développez votre foi, mettez vos talents au service de la communauté et intégrez-vous dans la famille spirituelle',
  },
  {
    id: 3,
    gradient: 'linear-gradient(135deg, #b5985b 0%, #8a7344 100%)',
    title: 'Formation Complète',
    subtitle: '12 Chapitres de Croissance Spirituelle',
    description: 'Un programme structuré pour comprendre les fondements de notre communauté sous la direction de l\'Apôtre Narcisse Majila',
  },
]

// Programme cards data
const programmes = [
  {
    id: 1,
    title: 'Fondements de la Membership',
    gradient: 'linear-gradient(135deg, #003366 0%, #004080 100%)',
    icon: BookOpen,
  },
  {
    id: 2,
    title: 'Études Avancées',
    gradient: 'linear-gradient(135deg, #C8102E 0%, #a00d25 100%)',
    icon: GraduationCap,
  },
  {
    id: 3,
    title: 'Certification',
    gradient: 'linear-gradient(135deg, #b5985b 0%, #8a7344 100%)',
    icon: Award,
  },
  {
    id: 4,
    title: 'Vie Communautaire',
    gradient: 'linear-gradient(135deg, #0ea5e9 0%, #0284c7 100%)',
    icon: UsersRound,
  },
]

// News articles data
const newsArticles = [
  {
    id: 1,
    date: '15 Janvier 2026',
    title: 'Inscription Ouverte pour la Session 2026',
    excerpt: 'Les inscriptions pour la nouvelle session de l\'École des Membres sont maintenant ouvertes. Rejoignez-nous pour une année de croissance spirituelle.',
    gradient: 'linear-gradient(135deg, #003366 0%, #004080 100%)',
  },
  {
    id: 2,
    date: '10 Janvier 2026',
    title: 'Retraite Spirituelle Annuelle',
    excerpt: 'Notre retraite spirituelle annuelle aura lieu le mois prochain. Une occasion unique de renforcer votre foi et votre connexion avec Dieu.',
    gradient: 'linear-gradient(135deg, #C8102E 0%, #a00d25 100%)',
  },
  {
    id: 3,
    date: '5 Janvier 2026',
    title: 'Témoignages des Diplômés',
    excerpt: 'Découvrez les témoignages inspirants de nos anciens élèves et comment l\'École des Membres a transformé leur vie spirituelle.',
    gradient: 'linear-gradient(135deg, #b5985b 0%, #8a7344 100%)',
  },
  {
    id: 4,
    date: '1 Janvier 2026',
    title: 'Message du Nouvel An',
    excerpt: 'L\'Apôtre Narcisse Majila partage son message d\'espoir et de bénédiction pour cette nouvelle année.',
    gradient: 'linear-gradient(135deg, #0ea5e9 0%, #0284c7 100%)',
  },
]

export default function Home() {
  const [currentSlide, setCurrentSlide] = useState(0)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')

  // Auto-advance carousel
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length)
    }, 6000)
    return () => clearInterval(timer)
  }, [])

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % heroSlides.length)
  }

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + heroSlides.length) % heroSlides.length)
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Top Utility Bar */}
      <div className="top-bar">
        <div className="container mx-auto px-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-6">
              <span className="flex items-center gap-2">
                <Phone className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">+27 12 000 0000</span>
              </span>
              <span className="flex items-center gap-2">
                <Mail className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">info@ecoledemembres.com</span>
              </span>
            </div>
            <div className="flex items-center gap-4">
              <Link href="/student/login" className="hover:underline">Portail Étudiant</Link>
              <span className="text-white/40">|</span>
              <Link href="/login" className="hover:underline">Portail Staff</Link>
            </div>
          </div>
        </div>
      </div>

      {/* Main Header */}
      <header className="header-up">
        <div className="container mx-auto px-6">
          <div className="flex items-center justify-between py-4">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-3">
              <div className="w-14 h-14 rounded-lg bg-[#003366] flex items-center justify-center">
                <GraduationCap className="h-8 w-8 text-white" />
              </div>
              <div>
                <span className="text-xl font-bold text-[#003366] block leading-tight">
                  École des Membres
                </span>
                <span className="text-xs text-gray-500">Église du Plein Évangile Ramah</span>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center gap-8">
              <Link href="#" className="nav-up-item active">Accueil</Link>
              <div className="nav-item relative group">
                <button className="nav-up-item flex items-center gap-1">
                  Programmes <ChevronDown className="h-4 w-4" />
                </button>
                <div className="mega-dropdown">
                  <div className="mega-dropdown-content">
                    <div className="mega-dropdown-section">
                      <h4>Nos Cours</h4>
                      <ul>
                        <li><Link href="#">Fondements de la Membership</Link></li>
                        <li><Link href="#">Attentes du Pasteur</Link></li>
                        <li><Link href="#">Conduite de Culte</Link></li>
                        <li><Link href="#">Vie Communautaire</Link></li>
                      </ul>
                    </div>
                    <div className="mega-dropdown-section">
                      <h4>Chapitres</h4>
                      <ul>
                        <li><Link href="#">Chapitre 1-3: Introduction</Link></li>
                        <li><Link href="#">Chapitre 4-6: Fondements</Link></li>
                        <li><Link href="#">Chapitre 7-9: Croissance</Link></li>
                        <li><Link href="#">Chapitre 10-12: Service</Link></li>
                      </ul>
                    </div>
                    <div className="mega-dropdown-section">
                      <h4>Ressources</h4>
                      <ul>
                        <li><Link href="#">Catalogue des Cours</Link></li>
                        <li><Link href="#">Calendrier</Link></li>
                        <li><Link href="#">Téléchargements</Link></li>
                      </ul>
                    </div>
                    <div className="mega-dropdown-section">
                      <h4>Support</h4>
                      <ul>
                        <li><Link href="#">FAQ</Link></li>
                        <li><Link href="#">Contactez-nous</Link></li>
                        <li><Link href="#">Aide en Ligne</Link></li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
              <div className="nav-item relative group">
                <button className="nav-up-item flex items-center gap-1">
                  À Propos <ChevronDown className="h-4 w-4" />
                </button>
                <div className="mega-dropdown">
                  <div className="mega-dropdown-content">
                    <div className="mega-dropdown-section">
                      <h4>Notre Histoire</h4>
                      <ul>
                        <li><Link href="#">Vision & Mission</Link></li>
                        <li><Link href="#">Leadership</Link></li>
                        <li><Link href="#">Témoignages</Link></li>
                      </ul>
                    </div>
                    <div className="mega-dropdown-section">
                      <h4>L'Église Ramah</h4>
                      <ul>
                        <li><Link href="#">Apôtre Narcisse Majila</Link></li>
                        <li><Link href="#">Notre Communauté</Link></li>
                        <li><Link href="#">Ministères</Link></li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
              <Link href="#campus" className="nav-up-item">Vie du Campus</Link>
              <Link href="#contact" className="nav-up-item">Contact</Link>
            </nav>

            {/* Right Side */}
            <div className="flex items-center gap-4">
              <button className="search-btn-up">
                <Search className="h-5 w-5" />
              </button>
              <Link
                href="/student/login"
                className="hidden md:inline-flex btn-up-primary"
              >
                Se Connecter
              </Link>

              {/* Mobile Menu Button */}
              <button
                className="lg:hidden p-2 text-[#003366]"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              >
                {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden border-t border-gray-200 bg-white">
            <nav className="container mx-auto px-6 py-4 space-y-4">
              <Link href="#" className="block text-[#003366] font-medium">Accueil</Link>
              <Link href="#programmes" className="block text-gray-600">Programmes</Link>
              <Link href="#about" className="block text-gray-600">À Propos</Link>
              <Link href="#campus" className="block text-gray-600">Vie du Campus</Link>
              <Link href="#contact" className="block text-gray-600">Contact</Link>
              <Link href="/student/login" className="btn-up-primary inline-block">Se Connecter</Link>
            </nav>
          </div>
        )}
      </header>

      <main>
        {/* Hero Carousel */}
        <section className="hero-carousel">
          {heroSlides.map((slide, index) => (
            <div
              key={slide.id}
              className={`hero-slide ${index === currentSlide ? 'active' : ''}`}
              style={{ background: slide.gradient }}
            >
              <div className="hero-slide-content">
                <p className="text-lg mb-2 opacity-90">{slide.subtitle}</p>
                <h1 className="hero-slide-title">{slide.title}</h1>
                <p className="hero-slide-subtitle">{slide.description}</p>
                <Link href="/student/register" className="btn-up-primary">
                  En Savoir Plus <ArrowRight className="h-4 w-4 ml-2" />
                </Link>
              </div>
            </div>
          ))}

          {/* Navigation Arrows */}
          <button onClick={prevSlide} className="hero-arrow hero-arrow-left">
            <ChevronLeft className="h-6 w-6" />
          </button>
          <button onClick={nextSlide} className="hero-arrow hero-arrow-right">
            <ChevronRight className="h-6 w-6" />
          </button>

          {/* Dots */}
          <div className="hero-dots">
            {heroSlides.map((_, index) => (
              <button
                key={index}
                className={`hero-dot ${index === currentSlide ? 'active' : ''}`}
                onClick={() => setCurrentSlide(index)}
              />
            ))}
          </div>
        </section>

        {/* Course Search Bar */}
        <section className="search-bar-up">
          <div className="search-bar-container">
            <span className="search-bar-label">Trouver un cours</span>
            <input
              type="text"
              placeholder="ex. Fondements de la Membership"
              className="search-bar-input"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <button className="search-bar-btn">
              <Search className="h-4 w-4 mr-2" />
              Rechercher
            </button>
            <Link href="/student/courses" className="search-bar-btn-secondary">
              Parcourir Tous les Cours
            </Link>
          </div>
        </section>

        {/* Programme Cards */}
        <section id="programmes" className="py-16">
          <div className="container mx-auto px-6">
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {programmes.map((programme) => {
                const Icon = programme.icon
                return (
                  <Link key={programme.id} href="/student/courses" className="programme-card group">
                    <div
                      className="programme-card-image"
                      style={{ background: programme.gradient }}
                    >
                      <div className="absolute inset-0 flex items-center justify-center">
                        <Icon className="h-16 w-16 text-white/30" />
                      </div>
                    </div>
                    <div className="programme-card-overlay" />
                    <div className="programme-card-label">
                      {programme.title}
                    </div>
                  </Link>
                )
              })}
            </div>
          </div>
        </section>

        {/* About Section - Three Pillars */}
        <section id="about" className="about-section">
          <div className="container mx-auto px-6">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-[#003366] mb-4">
                À Propos de l'École des Membres
              </h2>
              <p className="text-gray-600 max-w-3xl mx-auto text-lg leading-relaxed">
                Bienvenue à vous tous qui avez choisi de faire de Ramah votre foyer spirituel.
                L'École des Membres est votre guide pour comprendre les fondements de notre communauté
                sous la direction de l'Apôtre Narcisse Majila.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {/* Grandir */}
              <div className="about-pillar">
                <div className="about-pillar-icon">
                  <Heart className="h-10 w-10" />
                </div>
                <h3 className="about-pillar-title">Grandir</h3>
                <p className="about-pillar-text">
                  Développer votre foi à travers les enseignements et la pratique quotidienne de la Parole de Dieu.
                </p>
              </div>

              {/* Servir */}
              <div className="about-pillar">
                <div className="about-pillar-icon" style={{ background: '#C8102E' }}>
                  <HandHelping className="h-10 w-10" />
                </div>
                <h3 className="about-pillar-title" style={{ color: '#C8102E' }}>Servir</h3>
                <p className="about-pillar-text">
                  Mettre vos talents au service de la communauté et de Dieu avec dévouement et humilité.
                </p>
              </div>

              {/* Appartenir */}
              <div className="about-pillar">
                <div className="about-pillar-icon" style={{ background: '#b5985b' }}>
                  <UsersRound className="h-10 w-10" />
                </div>
                <h3 className="about-pillar-title" style={{ color: '#b5985b' }}>Appartenir</h3>
                <p className="about-pillar-text">
                  S'intégrer pleinement dans la famille spirituelle et construire des liens solides avec la communauté.
                </p>
              </div>
            </div>

            {/* Quote */}
            <div className="mt-16 text-center">
              <blockquote className="text-xl italic text-gray-600 max-w-2xl mx-auto">
                "La vraie foi marche toujours avec l'obéissance."
              </blockquote>
              <p className="mt-4 text-[#003366] font-semibold">
                — Direction Pastorale, Église du Plein Évangile Ramah
              </p>
            </div>
          </div>
        </section>

        {/* Statistics Bar */}
        <section className="stats-bar">
          <div className="container mx-auto px-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              <div className="stat-item">
                <div className="stat-number">95%</div>
                <div className="stat-label">Taux de Réussite</div>
              </div>
              <div className="stat-item">
                <div className="stat-number">500+</div>
                <div className="stat-label">Étudiants</div>
              </div>
              <div className="stat-item">
                <div className="stat-number">12</div>
                <div className="stat-label">Chapitres</div>
              </div>
              <div className="stat-item">
                <div className="stat-number">25+</div>
                <div className="stat-label">Enseignants</div>
              </div>
            </div>
          </div>
        </section>

        {/* News Section */}
        <section id="campus" className="py-16 bg-white">
          <div className="container mx-auto px-6">
            <div className="flex items-center justify-between mb-12">
              <div>
                <h2 className="text-3xl font-bold text-[#003366]">
                  Actualités & Événements
                </h2>
                <p className="text-gray-600 mt-2">
                  Restez informé des dernières nouvelles de notre communauté
                </p>
              </div>
              <Link href="#" className="btn-up-outline hidden md:inline-flex">
                Voir Toutes les Actualités
              </Link>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {newsArticles.map((article) => (
                <article key={article.id} className="news-card">
                  <div
                    className="news-card-image"
                    style={{ background: article.gradient }}
                  />
                  <div className="news-card-content">
                    <p className="news-card-date">{article.date}</p>
                    <h3 className="news-card-title">{article.title}</h3>
                    <p className="news-card-excerpt">{article.excerpt}</p>
                  </div>
                </article>
              ))}
            </div>

            <div className="mt-8 text-center md:hidden">
              <Link href="#" className="btn-up-outline">
                Voir Toutes les Actualités
              </Link>
            </div>
          </div>
        </section>

        {/* Call to Action */}
        <section className="py-16 bg-[#f8fafc]">
          <div className="container mx-auto px-6">
            <div className="bg-white rounded-lg shadow-lg p-8 md:p-12">
              <div className="grid md:grid-cols-2 gap-8 items-center">
                <div>
                  <h2 className="text-2xl md:text-3xl font-bold text-[#003366] mb-4">
                    Prêt à Commencer Votre Parcours Spirituel?
                  </h2>
                  <p className="text-gray-600 mb-6 leading-relaxed">
                    Rejoignez notre communauté d'apprenants et faites le premier pas vers
                    l'accomplissement de vos objectifs spirituels. L'inscription est rapide et facile.
                  </p>
                  <div className="flex flex-wrap gap-4">
                    <Link href="/student/register" className="btn-up-secondary">
                      S'inscrire Maintenant
                      <ArrowRight className="h-4 w-4 ml-2" />
                    </Link>
                    <Link href="#contact" className="btn-up-outline">
                      Nous Contacter
                    </Link>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-6">
                  <div className="text-center p-4 bg-[#f8fafc] rounded-lg">
                    <Clock className="h-8 w-8 text-[#003366] mx-auto mb-2" />
                    <div className="text-2xl font-bold text-[#003366]">24/7</div>
                    <div className="text-sm text-gray-600">Accès en Ligne</div>
                  </div>
                  <div className="text-center p-4 bg-[#f8fafc] rounded-lg">
                    <BookOpen className="h-8 w-8 text-[#C8102E] mx-auto mb-2" />
                    <div className="text-2xl font-bold text-[#C8102E]">100%</div>
                    <div className="text-sm text-gray-600">Cours en Ligne</div>
                  </div>
                  <div className="text-center p-4 bg-[#f8fafc] rounded-lg">
                    <Award className="h-8 w-8 text-[#b5985b] mx-auto mb-2" />
                    <div className="text-2xl font-bold text-[#b5985b]">Gratuit</div>
                    <div className="text-sm text-gray-600">Inscription</div>
                  </div>
                  <div className="text-center p-4 bg-[#f8fafc] rounded-lg">
                    <Users className="h-8 w-8 text-[#0ea5e9] mx-auto mb-2" />
                    <div className="text-2xl font-bold text-[#0ea5e9]">5+</div>
                    <div className="text-sm text-gray-600">Années d'Expérience</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="footer-up">
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 pb-8">
            {/* Logo Column */}
            <div>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 rounded-lg bg-white/10 flex items-center justify-center">
                  <GraduationCap className="h-7 w-7 text-white" />
                </div>
                <div>
                  <span className="font-bold text-white block">École des Membres</span>
                  <span className="text-xs text-white/60">Ramah Full Gospel Church</span>
                </div>
              </div>
              <p className="text-white/70 text-sm leading-relaxed">
                Faites d'aujourd'hui un jour qui compte. Grandissez dans votre foi avec notre communauté spirituelle.
              </p>
            </div>

            {/* Core Functions */}
            <div>
              <h4 className="footer-up-title">Fonctions Principales</h4>
              <ul className="footer-up-links">
                <li><Link href="/student/courses">Étudier</Link></li>
                <li><Link href="#">Enseignement</Link></li>
                <li><Link href="#">Communauté</Link></li>
                <li><Link href="#">Ressources</Link></li>
              </ul>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="footer-up-title">Liens Rapides</h4>
              <ul className="footer-up-links">
                <li><Link href="#">Conseils Spirituels</Link></li>
                <li><Link href="#contact">Contact</Link></li>
                <li><Link href="#">Support</Link></li>
                <li><Link href="#">FAQ</Link></li>
              </ul>
            </div>

            {/* Contact Us */}
            <div id="contact">
              <h4 className="footer-up-title">Contactez-Nous</h4>
              <ul className="space-y-3">
                <li className="flex items-center gap-3 text-white/70 text-sm">
                  <Phone className="h-4 w-4" />
                  +27 12 000 0000
                </li>
                <li className="flex items-center gap-3 text-white/70 text-sm">
                  <Mail className="h-4 w-4" />
                  info@ecoledemembres.com
                </li>
                <li className="flex items-start gap-3 text-white/70 text-sm">
                  <MapPin className="h-4 w-4 mt-0.5" />
                  <span>123 Rue de l'Éducation<br />Pretoria, Afrique du Sud</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="footer-up-bottom">
          <div className="container mx-auto px-6">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              <p className="text-white/60 text-sm">
                &copy; {new Date().getFullYear()} École des Membres - Église du Plein Évangile Ramah. Tous droits réservés.
              </p>
              <div className="flex items-center gap-6">
                <Link href="#">Politique de Confidentialité</Link>
                <Link href="#">Conditions d'Utilisation</Link>
                <Link href="#">Mentions Légales</Link>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
