import { Link } from 'react-router-dom'
import { CheckCircle, Clock, Shield, Users, TrendingUp, Phone, Mail, MapPin, ArrowRight, Star } from 'lucide-react'

export function Landing() {
  return (
    <div className="min-h-screen">

      {/* ===== HERO ===== */}
      <section className="bg-gradient-to-br from-[#1e3a5f] via-[#1e4976] to-[#1e3a5f] text-white py-24 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-amber-500/20 border border-amber-400/30 text-amber-300 text-sm font-medium px-4 py-1.5 rounded-full mb-6">
            <Star size={14} fill="currentColor" /> Trusted by thousands of South Africans
          </div>
          <h1 className="text-5xl md:text-6xl font-black mb-6 leading-tight">
            Fast Loans.<br />
            <span className="text-amber-400">Real Solutions.</span>
          </h1>
          <p className="text-xl text-blue-200 mb-10 max-w-2xl mx-auto">
            Get up to <span className="text-white font-bold">R5,500</span> in your account within hours.
            100% online. No queues. No hassle.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/register" className="btn-gold text-lg">
              Apply Now — It's Free
            </Link>
            <a href="#how-it-works" className="btn-secondary border-white text-white hover:bg-white/10 text-lg">
              How It Works
            </a>
          </div>

          {/* Trust Stats */}
          <div className="grid grid-cols-3 gap-8 mt-16 pt-12 border-t border-white/10 max-w-2xl mx-auto">
            {[
              { value: '10,000+', label: 'Happy Customers' },
              { value: 'R5,500', label: 'Max Loan Amount' },
              { value: '< 24hrs', label: 'Payout Time' },
            ].map(stat => (
              <div key={stat.label}>
                <p className="text-3xl font-black text-amber-400">{stat.value}</p>
                <p className="text-blue-300 text-sm mt-1">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== HOW IT WORKS ===== */}
      <section id="how-it-works" className="py-20 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="text-3xl font-black text-gray-900 mb-3">How It Works</h2>
            <p className="text-gray-500 text-lg">Get your loan in 3 simple steps</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { step: '01', icon: <Users size={28} />, title: 'Apply Online', desc: 'Complete our simple online application in under 5 minutes. No paperwork needed.' },
              { step: '02', icon: <Shield size={28} />, title: 'Quick Review', desc: 'Our team reviews your application and checks affordability — usually within 2 hours.' },
              { step: '03', icon: <TrendingUp size={28} />, title: 'Get Your Money', desc: 'Once approved, funds are transferred directly to your bank account. Same day!' },
            ].map(item => (
              <div key={item.step} className="relative text-center p-8 rounded-2xl bg-gray-50 border border-gray-100 hover:border-blue-200 hover:shadow-lg transition-all">
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-amber-500 text-white text-xs font-black px-3 py-1 rounded-full">
                  STEP {item.step}
                </div>
                <div className="w-16 h-16 bg-blue-700 rounded-2xl flex items-center justify-center text-white mx-auto mb-5 mt-2">
                  {item.icon}
                </div>
                <h3 className="text-xl font-bold mb-3">{item.title}</h3>
                <p className="text-gray-500">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== PRODUCTS ===== */}
      <section id="products" className="py-20 px-4 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="text-3xl font-black text-gray-900 mb-3">Our Products</h2>
            <p className="text-gray-500 text-lg">Financial solutions tailored for you</p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">

            {/* Personal Loans */}
            <div className="card hover:shadow-lg transition-shadow border-2 border-blue-100">
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mb-4">
                <TrendingUp className="text-blue-700" size={24} />
              </div>
              <h3 className="text-xl font-bold mb-2">Personal Loans</h3>
              <p className="text-gray-500 text-sm mb-4">Quick cash for any emergency or need</p>
              <ul className="space-y-2 mb-6">
                {['R500 to R5,500', 'Repay in 1–24 months', 'Payout within 24 hours', 'Online application', 'Transparent fees'].map(f => (
                  <li key={f} className="flex items-center gap-2 text-sm text-gray-600">
                    <CheckCircle size={16} className="text-green-500 shrink-0" /> {f}
                  </li>
                ))}
              </ul>
              <Link to="/register" className="btn-primary w-full text-center block text-sm">
                Apply Now
              </Link>
            </div>

            {/* Investment */}
            <div className="card hover:shadow-lg transition-shadow border-2 border-amber-200 relative overflow-hidden">
              <div className="absolute top-4 right-4 bg-amber-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">POPULAR</div>
              <div className="w-12 h-12 bg-amber-100 rounded-xl flex items-center justify-center mb-4">
                <TrendingUp className="text-amber-600" size={24} />
              </div>
              <h3 className="text-xl font-bold mb-2">Investments</h3>
              <p className="text-gray-500 text-sm mb-4">Grow your money with us</p>
              <ul className="space-y-2 mb-6">
                {['From R50,000', '2% compound interest/month', '12-month fixed term', 'Paid to your bank account', 'Transparent reporting'].map(f => (
                  <li key={f} className="flex items-center gap-2 text-sm text-gray-600">
                    <CheckCircle size={16} className="text-green-500 shrink-0" /> {f}
                  </li>
                ))}
              </ul>
              <a href="#contact" className="btn-gold w-full text-center block text-sm">
                Learn More
              </a>
            </div>

            {/* Joint Ventures */}
            <div className="card hover:shadow-lg transition-shadow border-2 border-purple-100">
              <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mb-4">
                <Users className="text-purple-700" size={24} />
              </div>
              <h3 className="text-xl font-bold mb-2">Joint Ventures</h3>
              <p className="text-gray-500 text-sm mb-4">Partner with us for bigger returns</p>
              <ul className="space-y-2 mb-6">
                {['From R100,000', 'Up to 25% monthly profit share', 'Fully managed by TBC', 'Regular income', 'You stay in control'].map(f => (
                  <li key={f} className="flex items-center gap-2 text-sm text-gray-600">
                    <CheckCircle size={16} className="text-green-500 shrink-0" /> {f}
                  </li>
                ))}
              </ul>
              <a href="#contact" className="btn-secondary w-full text-center block text-sm">
                Contact Us
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ===== WHY US ===== */}
      <section className="py-20 px-4 bg-[#1e3a5f] text-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="text-3xl font-black mb-3">Why Choose TBC Global?</h2>
            <p className="text-blue-300 text-lg">We're different. Here's why.</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: <Clock size={24} />, title: 'Fast Approval', desc: 'Get a decision within 2 hours of applying.' },
              { icon: <Shield size={24} />, title: 'Secure & Safe', desc: 'Your data is encrypted and protected.' },
              { icon: <CheckCircle size={24} />, title: 'Transparent', desc: 'No hidden fees. Know exactly what you pay.' },
              { icon: <Users size={24} />, title: 'Personal Touch', desc: 'Real people who care about your situation.' },
            ].map(item => (
              <div key={item.title} className="bg-white/5 border border-white/10 rounded-2xl p-6 text-center hover:bg-white/10 transition-colors">
                <div className="w-12 h-12 bg-amber-500 rounded-xl flex items-center justify-center mx-auto mb-4">
                  {item.icon}
                </div>
                <h3 className="font-bold text-lg mb-2">{item.title}</h3>
                <p className="text-blue-300 text-sm">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== TESTIMONIALS ===== */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="text-3xl font-black text-gray-900 mb-3">What Customers Say</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { name: 'Thabo M.', location: 'Johannesburg', rating: 5, text: 'Applied at 9am and had money in my account by noon. Absolutely incredible service!' },
              { name: 'Nomsa K.', location: 'Pretoria', rating: 5, text: 'Easy online process, very professional staff. TBC Global is the best loan company I\'ve used.' },
              { name: 'Sipho D.', location: 'Cape Town', rating: 5, text: 'Been a customer for 2 years. Always reliable, always on time. Wouldn\'t go anywhere else.' },
            ].map(review => (
              <div key={review.name} className="card border border-gray-100">
                <div className="flex gap-0.5 mb-3">
                  {Array(review.rating).fill(0).map((_, i) => (
                    <Star key={i} size={16} className="text-amber-400" fill="currentColor" />
                  ))}
                </div>
                <p className="text-gray-600 text-sm mb-4 italic">"{review.text}"</p>
                <div>
                  <p className="font-bold text-gray-900">{review.name}</p>
                  <p className="text-gray-400 text-sm">{review.location}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== CTA ===== */}
      <section className="py-20 px-4 bg-amber-50 border-y border-amber-100">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-4xl font-black text-gray-900 mb-4">Ready to Apply?</h2>
          <p className="text-gray-600 text-lg mb-8">Join thousands of South Africans who trust TBC Global for their financial needs.</p>
          <Link to="/register" className="btn-gold text-lg inline-flex items-center gap-2">
            Get Started Today <ArrowRight size={20} />
          </Link>
          <p className="text-gray-400 text-sm mt-4">Free to apply. No obligation. Decision in minutes.</p>
        </div>
      </section>

      {/* ===== CONTACT ===== */}
      <section id="contact" className="py-20 px-4 bg-white">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-black text-gray-900 mb-3">Contact Us</h2>
            <p className="text-gray-500">We're here to help</p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { icon: <Phone size={24} />, label: 'Phone', value: '+27 69 341 7270', sub: 'Mon–Fri, 8am–5pm' },
              { icon: <Mail size={24} />, label: 'Email', value: 'info@tbcglobal.co.za', sub: 'We reply within 24hrs' },
              { icon: <MapPin size={24} />, label: 'Office', value: 'Pretoria, Gauteng', sub: 'South Africa' },
            ].map(item => (
              <div key={item.label} className="card text-center border border-gray-100">
                <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center mx-auto mb-4 text-blue-700">
                  {item.icon}
                </div>
                <p className="font-bold text-gray-900 mb-1">{item.value}</p>
                <p className="text-gray-400 text-sm">{item.sub}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== FOOTER ===== */}
      <footer className="bg-[#172844] text-white py-10 px-4">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-amber-500 rounded-lg flex items-center justify-center font-black text-sm">TBC</div>
            <span className="font-bold">TBC Global</span>
          </div>
          <p className="text-blue-400 text-sm text-center">
            © 2026 TBC Global Ltd. Registered Credit Provider | NCR Registered
          </p>
          <div className="flex gap-6 text-sm text-blue-400">
            <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-white transition-colors">Terms & Conditions</a>
          </div>
        </div>
      </footer>

    </div>
  )
}
