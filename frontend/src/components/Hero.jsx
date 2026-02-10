// src/components/Hero.jsx
import { Link } from 'react-router-dom';
import { FaArrowRight, FaPlay } from 'react-icons/fa';

const Hero = () => {
  return (
    <div className="relative h-[80vh] min-h-[600px] flex items-center overflow-hidden">
      {/* Background Image with Overlay */}
      <div
        className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat transition-transform duration-1000 transform scale-105 hover:scale-100"
        style={{ backgroundImage: "url('/images/hero.png')" }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 to-transparent"></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-2 bg-blue-600/20 md:backdrop-blur-sm border border-blue-500/30 px-4 py-2 rounded-full text-blue-400 font-medium mb-6 animate-float">
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-blue-500"></span>
            </span>
            Premium Automotive Solutions
          </div>

          <h1 className="text-4xl md:text-6xl lg:text-7xl font-extrabold mb-6 leading-tight text-white">
            Drive with <span className="text-blue-500">Confidence</span>,
            Service with <span className="text-cyan-400">Excellence</span>
          </h1>

          <p className="text-lg md:text-xl mb-10 text-gray-300 leading-relaxed max-w-2xl">
            Experience the future of automotive care. From genuine high-performance spare parts to expert diagnostic services, PrimeAuto is your ultimate partner on the road.
          </p>

          <div className="flex flex-col sm:flex-row gap-5">
            <Link
              to="/products"
              className="group bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-xl font-bold transition-all duration-300 flex items-center justify-center gap-3 shadow-lg shadow-blue-600/30 hover:shadow-blue-600/50"
            >
              Explore Spare Parts
              <FaArrowRight className="group-hover:translate-x-1 transition-transform" />
            </Link>

            <Link
              to="/booking"
              className="bg-white/10 backdrop-blur-md border border-white/20 text-white px-8 py-4 rounded-xl font-bold hover:bg-white/20 transition-all duration-300 flex items-center justify-center gap-3"
            >
              Book Specialist
              <FaPlay className="text-sm" />
            </Link>
          </div>

          <div className="mt-12 grid grid-cols-2 lg:grid-cols-3 gap-8 border-t border-white/10 pt-8">
            <div>
              <div className="text-3xl font-bold text-white">15k+</div>
              <div className="text-sm text-gray-400">Satisfied Clients</div>
            </div>
            <div className="hidden lg:block w-px h-10 bg-white/10 absolute left-1/3"></div>
            <div>
              <div className="text-3xl font-bold text-white">24/7</div>
              <div className="text-sm text-gray-400">Support Ready</div>
            </div>
            <div className="hidden lg:block w-px h-10 bg-white/10 absolute left-2/3"></div>
            <div className="col-span-2 lg:col-span-1">
              <div className="text-3xl font-bold text-white">100%</div>
              <div className="text-sm text-gray-400">Genuine Parts</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;