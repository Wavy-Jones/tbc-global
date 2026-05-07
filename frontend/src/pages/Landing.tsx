import { Link } from 'react-router-dom'
import { CheckCircle, Clock, Shield, Users, TrendingUp, Phone, Mail, MapPin, ArrowRight, Star, Zap, Award, Lock, Target, Smartphone, CreditCard, DollarSign } from 'lucide-react'

export function Landing() {
  return (
    <div className="min-h-screen bg-white">

      {/* ===== HERO SECTION - ULTRA PREMIUM ===== */}
      <section className="relative min-h-screen flex items-center bg-gradient-to-br from-gray-900 via-gray-800 to-emerald-900 text-white overflow-hidden">
        {/* Animated background effects */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-96 h-96 bg-green-500/30 rounded-full blur-3xl animate-pulse" />
          <div className="absolute top-1/2 -left-40 w-96 h-96 bg-emerald-500/20 rounded-full blur-3xl animate-pulse" style={{animationDelay: '1s'}} />
          <div className="absolute bottom-20 right-1/3 w-64 h-64 bg-green-400/20 rounded-full blur-3xl animate-pulse" style={{animationDelay: '2s'}} />
        </div>

        {/* Grid pattern overlay */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:64px_64px]" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 relative z-10">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            
            {/* Left: Content */}
            <div className="space-y-8">
              {/* Trust Badge with animation */}
              <div className="inline-flex items-center gap-3 bg-white/10 backdrop-blur-md border border-white/20 text-white px-5 py-3 rounded-full shadow-2xl animate-fade-in">
                <div className="flex -space-x-2">
                  {['bg-green-500', 'bg-emerald-500', 'bg-teal-500'].map((color, i) => (
                    <div key={i} className={`w-8 h-8 ${color} rounded-full border-2 border-white flex items-center justify-center text-xs font-bold`}>
                      {['10', '5K', '★'][i]}
                    </div>
                  ))}
                </div>
                <span className="text-sm font-semibold">Trusted by 10,000+ customers</span>
              </div>

              {/* Main headline */}
              <div className="space-y-4">
                <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black leading-tight">
                  Your Money,
                  <span className="block bg-gradient-to-r from-green-400 via-emerald-400 to-teal-400 bg-clip-text text-transparent animate-gradient">
                    Your Way
                  </span>
                </h1>
                <p className="text-xl sm:text-2xl text-gray-300 max-w-xl leading-relaxed">
                  Get <span className="text-white font-bold">instant loans up to R5,000</span> delivered to your account in hours. 
                  No paperwork, no hassle, just results.
                </p>
              </div>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <Link to="/register" 
                  className="group relative px-8 py-5 bg-gradient-to-r from-green-500 via-emerald-500 to-teal-500 rounded-2xl font-bold text-lg shadow-2xl hover:shadow-green-500/50 transition-all duration-300 hover:scale-105 overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-r from-green-600 via-emerald-600 to-teal-600 opacity-0 group-hover:opacity-100 transition-opacity" />
                  <span className="relative flex items-center justify-center gap-3">
                    <Zap className="animate-pulse" size={24} />
                    Get Your Loan Now
                    <ArrowRight className="group-hover:translate-x-1 transition-transform" size={24} />
                  </span>
                </Link>
                
                <a href="#how-it-works" 
                  className="px-8 py-5 bg-white/10 backdrop-blur-md border-2 border-white/30 hover:bg-white/20 rounded-2xl font-semibold text-lg transition-all duration-200 flex items-center justify-center gap-2">
                  <Clock size={20} /> 2-Hour Approval
                </a>
              </div>

              {/* Stats row */}
              <div className="grid grid-cols-3 gap-6 pt-8">
                {[
                  { icon: <Users className="text-green-400" size={24} />, value: '10,000+', label: 'Happy Customers' },
                  { icon: <TrendingUp className="text-green-400" size={24} />, value: 'R5,000', label: 'Max Loan' },
                  { icon: <Clock className="text-green-400" size={24} />, value: '< 24hrs', label: 'Payout' },
                ].map((stat, i) => (
                  <div key={i} className="text-center space-y-2">
                    <div className="flex justify-center">{stat.icon}</div>
                    <p className="text-3xl font-black">{stat.value}</p>
                    <p className="text-sm text-gray-400">{stat.label}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Right: 3D Phone Mockup & Card */}
            <div className="relative hidden lg:block">
              {/* Main card mockup */}
              <div className="relative">
                {/* Floating elements */}
                <div className="absolute -top-14 -left-8 bg-green-500 text-white px-6 py-3 rounded-2xl shadow-2xl font-bold animate-float">
                  ✓ NCR Approved
                </div>
                <div className="absolute -bottom-14 -right-8 bg-white text-gray-900 px-6 py-3 rounded-2xl shadow-2xl font-bold animate-float" style={{animationDelay: '1s'}}>
                  Fast Payout
                </div>

                {/* Main glassmorphic card */}
                <div className="relative bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-2xl border border-white/20 rounded-3xl p-8 shadow-2xl transform hover:scale-105 transition-transform duration-500">
                  {/* Logo section */}
                  <div className="flex items-center gap-4 mb-8">
                    <div className="bg-white rounded-2xl p-3 shadow-xl">
                      <img src="/logo.jpeg" alt="TBC" className="h-16 w-16 object-contain" />
                    </div>
                    <div>
                      <p className="text-white font-black text-xl">TBC Global</p>
                      <p className="text-gray-400 text-sm">Smart Finance</p>
                    </div>
                  </div>

                  {/* Amount display */}
                  <div className="bg-gradient-to-br from-green-500/30 to-emerald-600/30 backdrop-blur-sm border border-green-400/50 rounded-2xl p-8 mb-6 shadow-xl">
                    <p className="text-gray-300 text-sm mb-2 uppercase tracking-wide">Available Credit</p>
                    <p className="text-6xl font-black text-white mb-3">R5,000</p>
                    <div className="flex items-center gap-2 text-green-400 text-sm font-semibold">
                      <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                      Ready to use • 2hr approval
                    </div>
                  </div>

                  {/* Features grid */}
                  <div className="grid grid-cols-2 gap-4">
                    {[
                      { icon: <Smartphone size={20} />, label: 'Mobile First' },
                      { icon: <Lock size={20} />, label: 'Secure' },
                      { icon: <Zap size={20} />, label: 'Instant' },
                      { icon: <CreditCard size={20} />, label: 'Easy Repay' },
                    ].map((item, i) => (
                      <div key={i} className="flex items-center gap-3 bg-white/5 backdrop-blur-sm rounded-xl p-3 border border-white/10">
                        <div className="text-green-400">{item.icon}</div>
                        <span className="text-sm font-medium text-gray-300">{item.label}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center pt-2">
            <div className="w-1 h-3 bg-white rounded-full animate-pulse" />
          </div>
        </div>
      </section>

      {/* ===== TRUST BADGES WITH IMAGES ===== */}
      <section className="py-8 bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex flex-wrap justify-center items-center gap-12">
            {[
              { icon: <Shield className="text-green-600" size={24} />, text: 'NCR Registered', subtext: 'Licensed Provider' },
              { icon: <Lock className="text-green-600" size={24} />, text: 'Bank-Level Security', subtext: '256-bit SSL' },
              { icon: <Award className="text-green-600" size={24} />, text: '16+ Years', subtext: 'Industry Experience' },
            ].map((badge, i) => (
              <div key={i} className="flex items-center gap-3 group">
                <div className="bg-green-50 rounded-xl p-3 group-hover:bg-green-100 transition-colors">
                  {badge.icon}
                </div>
                <div>
                  <p className="font-bold text-gray-900 text-sm">{badge.text}</p>
                  <p className="text-gray-500 text-xs">{badge.subtext}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== HOW IT WORKS - WITH IMAGES ===== */}
      <section id="how-it-works" className="py-32 px-4 bg-gradient-to-b from-gray-50 to-white relative overflow-hidden">
        {/* Background decoration */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-green-100 rounded-full blur-3xl opacity-30" />
        
        <div className="max-w-7xl mx-auto relative">
          {/* Section header */}
          <div className="text-center mb-20">
            <div className="inline-flex items-center gap-2 bg-green-100 text-green-700 px-5 py-2 rounded-full font-bold text-sm mb-6">
              <Zap size={16} /> SIMPLE & FAST
            </div>
            <h2 className="text-5xl md:text-6xl font-black text-gray-900 mb-6">
              Get Your Loan in
              <span className="bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent"> 3 Easy Steps</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              No paperwork. No waiting in queues. Just fast, simple loans delivered to your account.
            </p>
          </div>

          {/* Steps with illustrations */}
          <div className="grid lg:grid-cols-3 gap-12 relative">
            {/* Connecting line */}
            <div className="hidden lg:block absolute top-32 left-0 right-0 h-1 bg-gradient-to-r from-green-200 via-emerald-200 to-teal-200" style={{top: '180px'}} />

            {[
              {
                step: '01',
                icon: <Smartphone size={40} className="text-green-600" />,
                title: 'Apply Online',
                description: 'Complete our smart application form on any device. Takes just 5 minutes.',
                features: ['100% online', 'Mobile friendly', 'Auto-save progress'],
                time: '5 min',
                image: '📱'
              },
              {
                step: '02',
                icon: <Shield size={40} className="text-green-600" />,
                title: 'Instant Review',
                description: 'Our AI system reviews your application instantly. Get approved in under 2 hours.',
                features: ['AI-powered', 'Real-time decision', 'SMS notification'],
                time: '< 2 hrs',
                image: '🤖'
              },
              {
                step: '03',
                icon: <DollarSign size={40} className="text-green-600" />,
                title: 'Receive Funds',
                description: 'Money deposited directly to your bank account. Same day guaranteed.',
                features: ['Direct deposit', 'Same-day payout', 'Track transfer'],
                time: 'Same day',
                image: '💰'
              },
            ].map((step, idx) => (
              <div key={step.step} className="relative group">
                {/* Step card */}
                <div className="relative bg-white rounded-3xl p-8 shadow-xl border-2 border-gray-100 hover:border-green-300 hover:shadow-2xl transition-all duration-500 hover:-translate-y-2">
                  
                  {/* Step number badge */}
                  <div className="absolute -top-6 left-8 bg-gradient-to-r from-green-500 to-emerald-600 text-white font-black px-5 py-2 rounded-full text-sm shadow-lg z-10">
                    STEP {step.step}
                  </div>

                  {/* Time badge */}
                  <div className="absolute -top-4 right-8 bg-gray-900 text-white text-xs font-bold px-4 py-2 rounded-full shadow-lg">
                    {step.time}
                  </div>

                  {/* Large emoji/icon */}
                  <div className="text-8xl text-center my-8 transform group-hover:scale-110 transition-transform">
                    {step.image}
                  </div>

                  {/* Icon in badge */}
                  <div className="flex justify-center mb-6">
                    <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-5 shadow-md group-hover:shadow-lg transition-shadow">
                      {step.icon}
                    </div>
                  </div>

                  {/* Content */}
                  <h3 className="text-2xl font-black text-gray-900 mb-3 text-center">{step.title}</h3>
                  <p className="text-gray-600 mb-6 text-center leading-relaxed">{step.description}</p>

                  {/* Feature list */}
                  <div className="space-y-3 bg-gray-50 rounded-2xl p-5">
                    {step.features.map((feature, i) => (
                      <div key={i} className="flex items-center gap-3 text-sm">
                        <div className="bg-green-500 rounded-lg p-1 shrink-0">
                          <CheckCircle size={14} className="text-white" />
                        </div>
                        <span className="text-gray-700 font-medium">{feature}</span>
                      </div>
                    ))}
                  </div>

                  {/* Progress dots */}
                  <div className="flex justify-center gap-2 mt-6 pt-6 border-t border-gray-100">
                    {[0,1,2].map(i => (
                      <div key={i} className={`w-2.5 h-2.5 rounded-full transition-all ${i === idx ? 'bg-green-500 w-8' : 'bg-gray-200'}`} />
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Bottom CTA */}
          <div className="text-center mt-16">
            <Link to="/register" 
              className="inline-flex items-center gap-3 bg-gradient-to-r from-gray-900 to-gray-800 hover:from-gray-800 hover:to-gray-700 text-white font-bold px-10 py-5 rounded-2xl shadow-2xl hover:shadow-3xl transition-all duration-300 hover:scale-105 text-lg">
              <Zap size={24} />
              Start Your Application
              <ArrowRight size={24} />
            </Link>
            <p className="text-gray-500 text-sm mt-4">No credit check required to apply</p>
          </div>
        </div>
      </section>

      {/* ===== LOAN CALCULATOR - INTERACTIVE ===== */}
      <section className="py-32 px-4 bg-gradient-to-br from-gray-900 to-emerald-900 text-white relative overflow-hidden">
        {/* Animated background */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-green-500 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-emerald-500 rounded-full blur-3xl animate-pulse" style={{animationDelay: '1.5s'}} />
        </div>

        <div className="max-w-4xl mx-auto relative z-10 text-center">
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm text-white px-5 py-2 rounded-full font-bold text-sm mb-8">
            <Target size={16} /> INSTANT CALCULATOR
          </div>
          
          <h2 className="text-4xl md:text-5xl font-black mb-6">
            See Your Loan Details
            <span className="block text-green-400 mt-2">Before You Apply</span>
          </h2>
          
          <p className="text-xl text-gray-300 mb-12 max-w-2xl mx-auto">
            Use our calculator to see exactly what you'll pay. No surprises, complete transparency.
          </p>

          {/* Calculator card */}
          <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-10 shadow-2xl">
            <div className="grid md:grid-cols-2 gap-8 text-left">
              <div>
                <p className="text-green-400 font-semibold mb-3">Loan Amount</p>
                <p className="text-5xl font-black mb-2">R100 - R5,000</p>
                <p className="text-gray-400 text-sm">Adjust to your needs</p>
              </div>
              <div>
                <p className="text-green-400 font-semibold mb-3">Repayment Term</p>
                <p className="text-5xl font-black mb-2">1 - 24 months</p>
                <p className="text-gray-400 text-sm">Flexible options</p>
              </div>
            </div>

            <div className="mt-10 pt-8 border-t border-white/20">
              <Link to="/apply" 
                className="inline-flex items-center gap-3 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-bold px-10 py-5 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 text-lg">
                Calculate My Loan
                <ArrowRight size={24} />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ===== PRODUCTS - PREMIUM CARDS WITH IMAGES ===== */}
      <section id="products" className="py-32 px-4 bg-white relative">
        <div className="max-w-7xl mx-auto">
          {/* Section header */}
          <div className="text-center mb-20">
            <div className="inline-flex items-center gap-2 bg-gray-900 text-white px-5 py-2 rounded-full font-bold text-sm mb-6">
              <CreditCard size={16} /> OUR PRODUCTS
            </div>
            <h2 className="text-5xl md:text-6xl font-black text-gray-900 mb-6">
              Choose Your
              <span className="bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent"> Financial Solution</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Flexible products designed for every financial need
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">

            {/* Personal Loans - Hero product */}
            <div className="relative lg:col-span-1 group">
              <div className="absolute inset-0 bg-gradient-to-r from-green-400 to-emerald-500 rounded-3xl blur-xl opacity-20 group-hover:opacity-40 transition-opacity" />
              
              <div className="relative bg-gradient-to-br from-green-50 via-white to-emerald-50 rounded-3xl p-10 shadow-2xl border-2 border-green-200 hover:shadow-3xl transition-all duration-500 hover:-translate-y-2 h-full flex flex-col">
                {/* Header */}
                <div className="flex items-start justify-between mb-8">
                  <div className="bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl p-5 shadow-xl">
                    <TrendingUp size={36} className="text-white" />
                  </div>
                  <span className="bg-green-500 text-white text-xs font-black px-4 py-2 rounded-full shadow-lg">
                    MOST POPULAR
                  </span>
                </div>

                {/* Emoji/visual */}
                <div className="text-7xl text-center my-6">💸</div>

                {/* Title */}
                <h3 className="text-3xl font-black text-gray-900 mb-3">Personal Loans</h3>
                <p className="text-gray-600 mb-8">Fast cash when you need it most</p>

                {/* Pricing */}
                <div className="bg-white rounded-2xl p-6 mb-8 shadow-md border border-green-100">
                  <p className="text-green-600 font-semibold text-sm mb-2">Loan Range</p>
                  <p className="text-5xl font-black text-gray-900 mb-2">R100 - R5,000</p>
                  <p className="text-gray-500 text-sm">Instant approval available</p>
                </div>

                {/* Features */}
                <ul className="space-y-4 mb-8 flex-grow">
                  {[
                    '⚡ 2-hour approval time',
                    '💰 Flexible 1-24 month terms',
                    '📱 100% online process',
                    '🔒 Secure & transparent',
                    '✓ No hidden fees',
                  ].map(f => (
                    <li key={f} className="flex items-center gap-3 text-gray-700 font-medium">
                      <div className="bg-green-500 rounded-lg p-1.5 shrink-0">
                        <CheckCircle size={16} className="text-white" />
                      </div>
                      {f}
                    </li>
                  ))}
                </ul>

                {/* CTA */}
                <Link to="/register" 
                  className="block w-full text-center bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-black py-5 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 text-lg">
                  Apply Now →
                </Link>
              </div>
            </div>

            {/* Investment */}
            <div className="relative group">
              <div className="relative bg-white rounded-3xl p-10 shadow-xl border-2 border-gray-200 hover:border-amber-300 hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 h-full flex flex-col">
                <div className="flex items-start justify-between mb-8">
                  <div className="bg-gradient-to-br from-amber-400 to-amber-600 rounded-2xl p-5 shadow-lg">
                    <Award size={36} className="text-white" />
                  </div>
                </div>

                <div className="text-7xl text-center my-6">📈</div>

                <h3 className="text-3xl font-black text-gray-900 mb-3">Investments</h3>
                <p className="text-gray-600 mb-8">Grow your wealth steadily</p>

                <div className="bg-amber-50 rounded-2xl p-6 mb-8 border border-amber-200">
                  <p className="text-amber-600 font-semibold text-sm mb-2">Monthly Returns</p>
                  <p className="text-5xl font-black text-gray-900 mb-2">2% / month</p>
                  <p className="text-gray-500 text-sm">Compound interest</p>
                </div>

                <ul className="space-y-4 mb-8 flex-grow">
                  {[
                    'From R10,000 minimum',
                    '12-month fixed term',
                    'Monthly payouts',
                    'Transparent reporting',
                    'Secure investment',
                  ].map(f => (
                    <li key={f} className="flex items-center gap-3 text-gray-700 font-medium">
                      <div className="bg-amber-500 rounded-lg p-1.5 shrink-0">
                        <CheckCircle size={16} className="text-white" />
                      </div>
                      {f}
                    </li>
                  ))}
                </ul>

                <a href="#contact" 
                  className="block w-full text-center bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white font-black py-5 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
                  Learn More →
                </a>
              </div>
            </div>

            {/* Joint Ventures */}
            <div className="relative group">
              <div className="relative bg-white rounded-3xl p-10 shadow-xl border-2 border-gray-200 hover:border-gray-400 hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 h-full flex flex-col">
                <div className="flex items-start justify-between mb-8">
                  <div className="bg-gradient-to-br from-gray-700 to-gray-900 rounded-2xl p-5 shadow-lg">
                    <Users size={36} className="text-white" />
                  </div>
                </div>

                <div className="text-7xl text-center my-6">🤝</div>

                <h3 className="text-3xl font-black text-gray-900 mb-3">Joint Ventures</h3>
                <p className="text-gray-600 mb-8">Partner for higher returns</p>

                <div className="bg-gray-50 rounded-2xl p-6 mb-8 border border-gray-200">
                  <p className="text-gray-600 font-semibold text-sm mb-2">Profit Share</p>
                  <p className="text-5xl font-black text-gray-900 mb-2">Up to 25%</p>
                  <p className="text-gray-500 text-sm">Per month</p>
                </div>

                <ul className="space-y-4 mb-8 flex-grow">
                  {[
                    'From R50,000 minimum',
                    'Fully managed by TBC',
                    'Regular distributions',
                    'Full transparency',
                    'Proven track record',
                  ].map(f => (
                    <li key={f} className="flex items-center gap-3 text-gray-700 font-medium">
                      <div className="bg-gray-700 rounded-lg p-1.5 shrink-0">
                        <CheckCircle size={16} className="text-white" />
                      </div>
                      {f}
                    </li>
                  ))}
                </ul>

                <a href="#contact" 
                  className="block w-full text-center bg-gradient-to-r from-gray-800 to-gray-900 hover:from-gray-700 hover:to-gray-800 text-white font-black py-5 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
                  Contact Us →
                </a>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ===== WHY CHOOSE US - WITH VISUALS ===== */}
      <section className="py-32 px-4 bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <div className="inline-flex items-center gap-2 bg-green-100 text-green-700 px-5 py-2 rounded-full font-bold text-sm mb-6">
              <Star size={16} /> WHY TBC GLOBAL
            </div>
            <h2 className="text-5xl md:text-6xl font-black text-gray-900 mb-6">
              We're Not Your Average
              <span className="bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent"> Loan Company</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Built with modern technology and customer-first thinking. Here's what makes us different.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { emoji: '⚡', icon: <Zap size={32} />, title: 'Lightning Fast', desc: '2-hour approval, same-day payout', gradient: 'from-yellow-400 to-orange-500' },
              { emoji: '🔒', icon: <Shield size={32} />, title: 'Fort Knox Security', desc: 'Bank-level 256-bit encryption', gradient: 'from-blue-500 to-indigo-600' },
              { emoji: '💎', icon: <Target size={32} />, title: 'Crystal Clear', desc: 'Zero hidden fees or surprises', gradient: 'from-green-500 to-emerald-600' },
              { emoji: '🏆', icon: <Award size={32} />, title: '16+ Years Strong', desc: 'Proven industry expertise', gradient: 'from-purple-500 to-pink-600' },
            ].map((item, idx) => (
              <div key={idx} className="group relative">
                <div className="relative bg-white rounded-3xl p-8 shadow-xl border-2 border-gray-100 hover:border-green-300 hover:shadow-2xl transition-all duration-500 hover:-translate-y-3 text-center">
                  {/* Large emoji */}
                  <div className="text-6xl mb-6 transform group-hover:scale-125 transition-transform duration-300">
                    {item.emoji}
                  </div>
                  
                  {/* Icon badge */}
                  <div className={`inline-flex bg-gradient-to-br ${item.gradient} text-white rounded-2xl p-4 shadow-lg mb-6`}>
                    {item.icon}
                  </div>
                  
                  <h3 className="text-xl font-black text-gray-900 mb-3">{item.title}</h3>
                  <p className="text-gray-600 leading-relaxed">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== TESTIMONIALS - MODERN DESIGN ===== */}
      <section className="py-32 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <div className="inline-flex items-center gap-2 bg-gray-900 text-white px-5 py-2 rounded-full font-bold text-sm mb-6">
              <Star size={16} fill="currentColor" /> REVIEWS
            </div>
            <h2 className="text-5xl md:text-6xl font-black text-gray-900 mb-6">
              Loved by
              <span className="bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent"> 10,000+ Customers</span>
            </h2>
            <p className="text-xl text-gray-600">Real stories from real people</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              { name: 'Thabo Mokoena', location: 'Johannesburg', rating: 5, text: "Applied at 9am, money in my account by noon. The fastest loan service I've ever used. Highly recommend!", avatar: '👨🏿' },
              { name: 'Nomsa Khumalo', location: 'Pretoria', rating: 5, text: "Professional, fast, and transparent. No hidden fees, just honest service. TBC Global is simply the best!", avatar: '👩🏿' },
              { name: 'Sipho Dlamini', location: 'Cape Town', rating: 5, text: "Been using TBC for 2 years. Always reliable, always on time. They've helped me through tough times.", avatar: '🧑🏿' },
            ].map((review, idx) => (
              <div key={idx} className="group relative">
                <div className="relative bg-gradient-to-br from-gray-50 to-white rounded-3xl p-8 shadow-xl border-2 border-gray-100 hover:border-green-300 hover:shadow-2xl transition-all duration-500 hover:-translate-y-2">
                  {/* Stars */}
                  <div className="flex gap-1 mb-6">
                    {Array(review.rating).fill(0).map((_, i) => (
                      <Star key={i} size={20} className="text-amber-400" fill="currentColor" />
                    ))}
                  </div>
                  
                  {/* Quote */}
                  <p className="text-gray-700 mb-8 leading-relaxed text-lg italic">
                    "{review.text}"
                  </p>
                  
                  {/* Author */}
                  <div className="flex items-center gap-4 pt-6 border-t border-gray-200">
                    <div className="text-5xl">{review.avatar}</div>
                    <div>
                      <p className="font-black text-gray-900 text-lg">{review.name}</p>
                      <p className="text-gray-500 text-sm">{review.location}</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Trust score */}
          <div className="mt-16 text-center">
            <div className="inline-flex items-center gap-4 bg-green-50 border-2 border-green-200 rounded-2xl px-8 py-5">
              <div className="flex gap-1">
                {Array(5).fill(0).map((_, i) => (
                  <Star key={i} size={28} className="text-amber-400" fill="currentColor" />
                ))}
              </div>
              <div className="text-left">
                <p className="font-black text-3xl text-gray-900">4.9/5</p>
                <p className="text-gray-600 text-sm">from 1,200+ reviews</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== FINAL CTA - BOLD & DYNAMIC ===== */}
      <section className="relative py-32 px-4 bg-gradient-to-br from-gray-900 via-emerald-900 to-gray-900 text-white overflow-hidden">
        {/* Animated background */}
        <div className="absolute inset-0">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-green-500/30 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-emerald-500/30 rounded-full blur-3xl animate-pulse" style={{animationDelay: '1s'}} />
        </div>

        <div className="max-w-5xl mx-auto text-center relative z-10">
          <div className="inline-flex items-center gap-2 bg-green-500/20 backdrop-blur-sm border border-green-400/30 text-green-400 px-5 py-2 rounded-full font-bold text-sm mb-8">
            <Zap size={16} /> GET STARTED TODAY
          </div>
          
          <h2 className="text-5xl md:text-7xl font-black mb-8 leading-tight">
            Your Financial Freedom
            <span className="block bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent">Starts Right Now</span>
          </h2>
          
          <p className="text-2xl text-gray-300 mb-12 max-w-3xl mx-auto leading-relaxed">
            Join thousands of South Africans who've already discovered a smarter way to borrow.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-6 justify-center mb-12">
            <Link to="/register" 
              className="group relative inline-flex items-center justify-center gap-4 bg-gradient-to-r from-green-500 via-emerald-500 to-teal-500 hover:from-green-600 hover:via-emerald-600 hover:to-teal-600 text-white font-black py-6 px-12 rounded-2xl shadow-2xl hover:shadow-green-500/50 transition-all duration-300 hover:scale-110 text-2xl overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
              <Zap className="animate-pulse" size={32} />
              <span>Apply in 5 Minutes</span>
              <ArrowRight className="group-hover:translate-x-2 transition-transform" size={32} />
            </Link>
          </div>
          
          <div className="flex flex-wrap justify-center gap-8 text-gray-400 text-sm">
            <div className="flex items-center gap-2">
              <CheckCircle size={16} className="text-green-400" /> No paperwork required
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle size={16} className="text-green-400" /> 2-hour approval
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle size={16} className="text-green-400" /> Same-day payout
            </div>
          </div>
        </div>
      </section>

      {/* ===== CONTACT - PREMIUM CARDS ===== */}
      <section id="contact" className="py-32 px-4 bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-5xl font-black text-gray-900 mb-6">Get in Touch</h2>
            <p className="text-xl text-gray-600">We're here to help you succeed</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              { emoji: '📞', icon: <Phone size={32} />, label: 'Phone', value: '+27 69 341 7270', sub: 'Mon–Fri, 8am–5pm', gradient: 'from-blue-500 to-blue-600' },
              { emoji: '✉️', icon: <Mail size={32} />, label: 'Email', value: 'info@tbcglobal.co.za', sub: 'Reply within 24 hours', gradient: 'from-purple-500 to-purple-600' },
              { emoji: '📍', icon: <MapPin size={32} />, label: 'Office', value: 'Pretoria, Gauteng', sub: 'South Africa', gradient: 'from-pink-500 to-pink-600' },
            ].map((item, idx) => (
              <div key={idx} className="group relative">
                <div className="relative bg-white rounded-3xl p-10 shadow-xl border-2 border-gray-100 hover:border-green-300 hover:shadow-2xl transition-all duration-500 hover:-translate-y-3 text-center">
                  {/* Large emoji */}
                  <div className="text-7xl mb-6 transform group-hover:scale-125 transition-transform">
                    {item.emoji}
                  </div>
                  
                  {/* Icon badge */}
                  <div className={`inline-flex bg-gradient-to-br ${item.gradient} text-white rounded-2xl p-4 shadow-lg mb-6`}>
                    {item.icon}
                  </div>
                  
                  <h3 className="font-black text-xl text-gray-900 mb-3">{item.label}</h3>
                  <p className="font-bold text-gray-900 text-lg mb-2">{item.value}</p>
                  <p className="text-gray-500 text-sm">{item.sub}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== FOOTER - SLEEK ===== */}
      <footer className="bg-gray-900 text-white py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between gap-8 pb-10 border-b border-gray-800">
            {/* Logo */}
            <div className="flex items-center gap-4">
              <div className="bg-white rounded-2xl p-3 shadow-xl">
                <img src="/logo.jpeg" alt="TBC" className="h-12 w-12 object-contain" />
              </div>
              <div>
                <p className="font-black text-2xl">TBC Global Finance</p>
                <p className="text-gray-400">Smart Financial Solutions</p>
              </div>
            </div>

            {/* Links */}
            <div className="flex gap-8 text-gray-400">
              <a href="#" className="hover:text-white transition-colors font-medium">Privacy</a>
              <a href="#" className="hover:text-white transition-colors font-medium">Terms</a>
              <a href="#contact" className="hover:text-white transition-colors font-medium">Contact</a>
            </div>
          </div>

          <div className="pt-10 text-center text-gray-500 text-sm">
            <p>© 2026 <strong>TBC Global Ltd.</strong> • NCR Registered Credit Provider • All Rights Reserved</p>
            <p>Developed by <strong>INFNT Solutions</strong></p>
          </div>
        </div>
      </footer>

    </div>
  )
}
