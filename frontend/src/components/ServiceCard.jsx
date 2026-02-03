// src/components/ServiceCard.jsx
import { Link } from 'react-router-dom';
import { FaTools, FaArrowRight, FaClock } from 'react-icons/fa';

const ServiceCard = ({ service }) => {
  // Format duration from minutes to readable format
  const formatDuration = (minutes) => {
    if (minutes < 60) {
      return `${minutes} min`;
    }
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return mins > 0 ? `${hours}h ${mins}min` : `${hours}h`;
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition duration-300 border border-gray-100">
      {/* Service Icon */}
      <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
        {service.icon ? (
          <img src={service.icon} alt={service.name} className="w-10 h-10" />
        ) : (
          <FaTools className="text-blue-600 text-2xl" />
        )}
      </div>

      {/* Service Info */}
      <h3 className="text-xl font-bold text-gray-800 mb-2">{service.name}</h3>
      <p className="text-gray-600 mb-4 line-clamp-3">
        {service.description || 'Professional automotive service'}
      </p>

      {/* Price and Duration */}
      <div className="mb-6 space-y-2">
        <div className="flex justify-between items-center">
          <span className="text-gray-600 font-medium">Price:</span>
          <span className="text-2xl font-bold text-blue-600">
            ${service.price.toFixed(2)}
          </span>
        </div>
        
        <div className="flex justify-between items-center">
          <span className="text-gray-600 font-medium flex items-center gap-1">
            <FaClock className="text-gray-500" />
            Duration:
          </span>
          <span className="text-gray-700 font-semibold">
            {formatDuration(service.duration)}
          </span>
        </div>
      </div>

      {/* Active Status Badge */}
      {!service.isActive && (
        <div className="mb-4">
          <span className="bg-red-100 text-red-700 px-3 py-1 rounded-full text-sm font-semibold">
            Currently Unavailable
          </span>
        </div>
      )}

      {/* Book Button */}
      <Link
        to={`/booking/${service._id}`}
        className={`w-full py-3 px-4 rounded-lg transition duration-300 flex items-center justify-center gap-2 font-semibold ${
          service.isActive
            ? 'bg-blue-600 text-white hover:bg-blue-700'
            : 'bg-gray-300 text-gray-500 cursor-not-allowed pointer-events-none'
        }`}
      >
        {service.isActive ? (
          <>
            Book Now
            <FaArrowRight />
          </>
        ) : (
          'Unavailable'
        )}
      </Link>
    </div>
  );
};

export default ServiceCard;