// src/pages/Home.jsx
import { FaArrowRight, FaCalendarAlt, FaShieldAlt, FaTools, FaMicrochip, FaCogs, FaAward } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import Hero from '../components/Hero';

const Home = () => {
  return (
    <div className="bg-gray-50">
      <Hero />

      {/* STATS SECTION - GLASS OVERLAY */}
      <section className="relative -mt-10 z-20 container mx-auto px-4">
        <div className="glass grid grid-cols-2 md:grid-cols-4 gap-8 p-8 rounded-2xl border border-white/50 shadow-2xl">
          <div className="text-center px-4 md:border-r border-gray-100 last:border-0">
            <div className="text-3xl md:text-4xl font-extrabold text-blue-600 mb-1">15+</div>
            <div className="text-xs md:text-sm font-medium text-gray-500 uppercase tracking-wider">Years Experience</div>
          </div>
          <div className="text-center px-4 md:border-r border-gray-100 last:border-0">
            <div className="text-3xl md:text-4xl font-extrabold text-blue-600 mb-1">10k+</div>
            <div className="text-xs md:text-sm font-medium text-gray-500 uppercase tracking-wider">Happy Clients</div>
          </div>
          <div className="text-center px-4 md:border-r border-gray-100 last:border-0">
            <div className="text-3xl md:text-4xl font-extrabold text-blue-600 mb-1">5k+</div>
            <div className="text-xs md:text-sm font-medium text-gray-500 uppercase tracking-wider">Spare Parts</div>
          </div>
          <div className="text-center px-4">
            <div className="text-3xl md:text-4xl font-extrabold text-blue-600 mb-1">24/7</div>
            <div className="text-xs md:text-sm font-medium text-gray-500 uppercase tracking-wider">Service Support</div>
          </div>
        </div>
      </section>

      {/* CORE SERVICES SECTION (CAR REPAIR) */}
      <section className="section-padding bg-white">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center gap-12 md:gap-16">
            <div className="w-full md:w-1/2 relative group">
              <div className="absolute -inset-4 bg-blue-600/10 rounded-2xl group-hover:bg-blue-600/20 transition-all duration-500"></div>
              <img
                src="/images/repair.png"
                alt="Car Repair Service"
                className="relative rounded-2xl shadow-2xl object-cover h-[300px] md:h-[500px] w-full transform transition-transform duration-500 group-hover:scale-[1.02]"
              />
              <div className="absolute -bottom-6 -right-6 glass p-6 rounded-xl hidden md:block">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center text-white text-xl">
                    <FaAward />
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900 leading-none">Certified</h4>
                    <p className="text-xs text-gray-500 mt-1">Maintenance Center</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="w-full md:w-1/2">
              <span className="text-blue-600 font-bold tracking-widest uppercase text-sm mb-4 block">Our Expertise</span>
              <h2 className="text-3xl md:text-5xl font-bold mb-6 md:mb-8 leading-tight text-gray-900">
                Precision Engineering for <span className="text-blue-600">Your Vehicle</span>
              </h2>
              <p className="text-gray-600 text-lg mb-8 leading-relaxed">
                At PrimeAuto, we don't just fix cars; we restore performance. Our expert technicians use state-of-the-art diagnostic tools to ensure every component of your vehicle meets the highest standards of safety and efficiency.
              </p>

              <ul className="space-y-4 mb-10">
                {[
                  { icon: <FaTools />, text: "Professional Engine Diagnostics" },
                  { icon: <FaShieldAlt />, text: "Comprehensive Safety Inspections" },
                  { icon: <FaCalendarAlt />, text: "Flexible Maintenance Scheduling" }
                ].map((item, i) => (
                  <li key={i} className="flex items-center gap-4 text-gray-700 font-medium">
                    <span className="w-8 h-8 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center text-sm">
                      {item.icon}
                    </span>
                    {item.text}
                  </li>
                ))}
              </ul>

              <Link to="/booking" className="inline-flex items-center gap-2 bg-gray-900 text-white px-8 py-4 rounded-xl font-bold hover:bg-black transition-all shadow-lg hover:shadow-xl hover:-translate-y-1">
                Book a Service
                <FaArrowRight />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* SPARE PARTS SHOWCASE (NEW SECTION) */}
      <section className="section-padding bg-gray-900 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-1/2 h-full bg-blue-600/10 blur-[120px] rounded-full"></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="flex flex-col md:flex-row items-center gap-12 md:gap-16">
            <div className="w-full md:w-1/2 order-2 md:order-1">
              <span className="text-cyan-400 font-bold tracking-widest uppercase text-sm mb-4 block">Premium Inventory</span>
              <h2 className="text-3xl md:text-5xl font-bold mb-6 md:mb-8 leading-tight">
                Authentic Spare Parts for <br />
                <span className="text-gradient">Ultimate Performance</span>
              </h2>
              <p className="text-gray-400 text-lg mb-8">
                Every repair is only as good as the parts used. We source 100% genuine components from global manufacturers, backed by full warranties. From performance upgrades to essential fixes, we have it all.
              </p>

              <div className="grid grid-cols-2 gap-6 mb-10">
                <div className="p-4 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 transition-colors">
                  <FaMicrochip className="text-cyan-400 text-2xl mb-3" />
                  <h4 className="font-bold mb-1">Advanced Tech</h4>
                  <p className="text-xs text-gray-500 uppercase">Sensors & Electronics</p>
                </div>
                <div className="p-4 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 transition-colors">
                  <FaCogs className="text-cyan-400 text-2xl mb-3" />
                  <h4 className="font-bold mb-1">Heavy Duty</h4>
                  <p className="text-xs text-gray-500 uppercase">Pistons & Transmission</p>
                </div>
              </div>

              <Link to="/products" className="inline-flex items-center gap-2 bg-white text-gray-900 px-8 py-4 rounded-xl font-bold hover:bg-gray-100 transition-all shadow-lg hover:shadow-white/20 hover:-translate-y-1">
                Browse Full Catalog
                <FaArrowRight />
              </Link>
            </div>

            <div className="w-full md:w-1/2 order-1 md:order-2 group">
              <img
                src="/images/spare-parts.png"
                alt="Premium Spare Parts"
                className="rounded-3xl shadow-2xl border border-white/10 transform transition-transform duration-700 group-hover:rotate-2 group-hover:scale-105"
              />
            </div>
          </div>
        </div>
      </section>

      {/* SERVICE CENTER SHOWCASE */}
      <section className="py-24 bg-white overflow-hidden">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4 text-gray-900">World-Class Service Center</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">Visit our state-of-the-art facility equipped with the latest technology and professional lounges for your convenience.</p>
          </div>

          <div className="relative group mx-auto max-w-5xl">
            <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-cyan-500 rounded-3xl blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200"></div>
            <img
              src="/images/service-center.png"
              alt="PrimeAuto Service Center"
              className="relative rounded-3xl shadow-2xl w-full h-[450px] object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent rounded-3xl flex items-end p-12">
              <div className="text-white">
                <h3 className="text-3xl font-bold mb-2 uppercase">PrimeAuto Hub</h3>
                <p className="text-gray-300 max-w-md">248 Premium Garage Street, Automotive Valley. Open daily from 8 AM to 9 PM.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA SECTION */}
      <section className="py-20 bg-blue-600 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-96 h-96 bg-white rounded-full -translate-x-1/2 -translate-y-1/2 blur-3xl"></div>
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-white rounded-full translate-x-1/2 translate-y-1/2 blur-3xl"></div>
        </div>

        <div className="container mx-auto px-4 text-center relative z-10">
          <h2 className="text-4xl md:text-5xl font-extrabold text-white mb-6">Experience Better Driving Today</h2>
          <p className="text-xl text-blue-100 mb-10 max-w-2xl mx-auto font-medium">Whether you need a rare part or an expert's eye, we are here to help you get back on the road safely.</p>
          <div className="flex flex-wrap gap-6 justify-center">
            <Link
              to="/products"
              className="bg-white text-blue-600 px-10 py-4 rounded-xl font-bold hover:shadow-2xl transition duration-300 transform hover:-translate-y-1"
            >
              Order Parts
            </Link>
            <Link
              to="/booking"
              className="bg-transparent border-2 border-white text-white px-10 py-4 rounded-xl font-bold hover:bg-white hover:text-blue-600 transition duration-300 transform hover:-translate-y-1"
            >
              Schedule Service
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
