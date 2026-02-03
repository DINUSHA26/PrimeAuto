// src/pages/About.jsx
import PageHeader from '../components/PageHeader';
import { FaUsers, FaAward, FaTools, FaHandshake } from 'react-icons/fa';

const About = () => {
  return (
    <div>
      <PageHeader 
        title="About PrimeAuto" 
        subtitle="Your trusted partner in automotive solutions"
      />

      <div className="container mx-auto px-4 py-12">
        {/* Company Overview */}
        <div className="max-w-4xl mx-auto mb-16">
          <h2 className="text-3xl font-bold mb-6 text-center">Who We Are</h2>
          <p className="text-gray-700 text-lg leading-relaxed mb-4">
            PrimeAuto has been serving the automotive community for over 15 years, providing high-quality spare parts and professional maintenance services. We pride ourselves on offering genuine parts, expert advice, and reliable service to keep your vehicle running at its best.
          </p>
          <p className="text-gray-700 text-lg leading-relaxed">
            Our team of certified technicians and automotive experts are dedicated to ensuring customer satisfaction through quality products, competitive pricing, and exceptional service.
          </p>
        </div>

        {/* Values Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          <div className="text-center">
            <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <FaAward className="text-blue-600 text-3xl" />
            </div>
            <h3 className="text-xl font-bold mb-2">Quality Assured</h3>
            <p className="text-gray-600">
              Only genuine and certified automotive parts
            </p>
          </div>

          <div className="text-center">
            <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <FaUsers className="text-blue-600 text-3xl" />
            </div>
            <h3 className="text-xl font-bold mb-2">Expert Team</h3>
            <p className="text-gray-600">
              Certified technicians with years of experience
            </p>
          </div>

          <div className="text-center">
            <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <FaTools className="text-blue-600 text-3xl" />
            </div>
            <h3 className="text-xl font-bold mb-2">Professional Service</h3>
            <p className="text-gray-600">
              State-of-the-art equipment and techniques
            </p>
          </div>

          <div className="text-center">
            <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <FaHandshake className="text-blue-600 text-3xl" />
            </div>
            <h3 className="text-xl font-bold mb-2">Customer First</h3>
            <p className="text-gray-600">
              Your satisfaction is our top priority
            </p>
          </div>
        </div>

        {/* Stats Section */}
        <div className="bg-blue-600 text-white rounded-lg p-8 mb-16">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold mb-2">15+</div>
              <div className="text-blue-100">Years in Business</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">10,000+</div>
              <div className="text-blue-100">Happy Customers</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">5,000+</div>
              <div className="text-blue-100">Parts in Stock</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">50+</div>
              <div className="text-blue-100">Expert Technicians</div>
            </div>
          </div>
        </div>

        {/* Mission & Vision */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-gray-50 p-8 rounded-lg">
            <h3 className="text-2xl font-bold mb-4">Our Mission</h3>
            <p className="text-gray-700 leading-relaxed">
              To provide our customers with premium quality automotive parts and services at competitive prices, while maintaining the highest standards of professionalism and customer care.
            </p>
          </div>

          <div className="bg-gray-50 p-8 rounded-lg">
            <h3 className="text-2xl font-bold mb-4">Our Vision</h3>
            <p className="text-gray-700 leading-relaxed">
              To be the most trusted and reliable automotive parts supplier and service provider, known for excellence, innovation, and unwavering commitment to customer satisfaction.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;