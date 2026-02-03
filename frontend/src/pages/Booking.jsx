// src/pages/Booking.jsx
import { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import BookingForm from '../components/BookingForm';
import PageHeader from '../components/PageHeader';
import { useAuth } from '../context/AuthContext';

const Booking = () => {
  const { serviceId } = useParams();
  const { isAuthenticated, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      navigate(`/login?redirect=/booking${serviceId ? `/${serviceId}` : ''}`);
    }
  }, [isAuthenticated, loading, navigate, serviceId]);

  if (loading) return <div className="pt-32 text-center text-gray-500">Verifying session...</div>;
  if (!isAuthenticated) return null;

  return (
    <div>
      <PageHeader
        title="Book a Service"
        subtitle="Schedule your vehicle maintenance with us"
      />

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-3xl mx-auto">
          <BookingForm serviceId={serviceId} />
        </div>
      </div>
    </div>
  );
};

export default Booking;