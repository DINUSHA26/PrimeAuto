// src/pages/Services.jsx
import { useState, useEffect } from 'react';
import { getAllServices } from '../services/serviceService';
import ServiceCard from '../components/ServiceCard';
import PageHeader from '../components/PageHeader';
import { FaFilter } from 'react-icons/fa';

const Services = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showInactive, setShowInactive] = useState(false);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        setLoading(true);
        const data = await getAllServices();
        console.log('Services fetched:', data); // Debug log
        setServices(data);
        setError(null);
      } catch (err) {
        console.error('Failed to fetch services:', err);
        setError('Failed to load services. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchServices();
  }, []);

  // Filter services based on active status
  const filteredServices = showInactive 
    ? services 
    : services.filter(service => service.isActive);

  if (loading) {
    return (
      <div>
        <PageHeader 
          title="Our Services" 
          subtitle="Professional automotive services for your vehicle"
        />
        <div className="container mx-auto px-4 py-8">
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div>
        <PageHeader 
          title="Our Services" 
          subtitle="Professional automotive services for your vehicle"
        />
        <div className="container mx-auto px-4 py-8">
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded text-center">
            {error}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <PageHeader 
        title="Our Services" 
        subtitle="Professional automotive services for your vehicle"
      />

      <div className="container mx-auto px-4 py-8">
        {/* Filter Toggle */}
        <div className="mb-6 flex items-center gap-4">
          <button
            onClick={() => setShowInactive(!showInactive)}
            className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition duration-300"
          >
            <FaFilter />
            <span>
              {showInactive ? 'Show Active Only' : 'Show All Services'}
            </span>
          </button>
          <span className="text-gray-600">
            Showing {filteredServices.length} of {services.length} services
          </span>
        </div>

        {/* Services Grid */}
        {filteredServices.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-600 text-lg">
              No {showInactive ? '' : 'active '}services available at the moment.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredServices.map((service) => (
              <ServiceCard key={service._id} service={service} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Services;