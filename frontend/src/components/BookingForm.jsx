// src/components/BookingForm.jsx
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Input from './primary/Input';
import TextArea from './primary/TextArea';
import Button from './primary/Button';
import TimeSlotPicker from './TimeSlotPicker';
import { createBooking } from '../services/bookingService';
import { getAllServices } from '../services/serviceService';
import { useAuth } from '../context/AuthContext';

const BookingForm = ({ serviceId = null }) => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [services, setServices] = useState([]);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: '',
    serviceId: serviceId || '',
    date: '',
    timeSlot: '',
    vehicleNumber: '',
    vehicleModel: '',
    message: '',
  });

  // Update form data if user becomes available (e.g. on mount/refresh)
  useEffect(() => {
    if (user) {
      setFormData(prev => ({
        ...prev,
        name: user.name,
        email: user.email
      }));
    }
  }, [user]);

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(null);

  // Fetch services for dropdown if serviceId not provided
  useEffect(() => {
    if (!serviceId) {
      const fetchServices = async () => {
        try {
          const data = await getAllServices();
          const activeServices = data.filter(s => s.isActive);
          setServices(activeServices);
        } catch (err) {
          console.error('Failed to fetch services:', err);
        }
      };
      fetchServices();
    }
  }, [serviceId]);


  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSlotSelect = (slot) => {
    setFormData((prev) => ({
      ...prev,
      timeSlot: slot,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate time slot is selected
    if (!formData.timeSlot) {
      setError('Please select a time slot');
      return;
    }

    setLoading(true);
    setError(null);

    // Map frontend fields to backend expectations
    const bookingData = {
      customerName: formData.name,
      customerEmail: formData.email,
      customerPhone: formData.phone,
      serviceId: formData.serviceId,
      bookingDate: formData.date,
      startTime: formData.timeSlot,
      vehicleNumber: formData.vehicleNumber,
      vehicleModel: formData.vehicleModel,
      notes: formData.message
    };

    try {
      const response = await createBooking(bookingData);
      console.log('Booking response:', response);
      setSuccess(true);

      // Reset form
      setFormData({
        name: '',
        email: '',
        phone: '',
        serviceId: serviceId || '',
        date: '',
        timeSlot: '',
        vehicleNumber: '',
        vehicleModel: '',
        message: '',
      });

      // Redirect after 3 seconds
      setTimeout(() => {
        navigate('/services');
      }, 3000);
    } catch (err) {
      const errorMsg = err.response?.data?.message || 'Failed to create booking. Please try again.';
      setError(errorMsg);
      console.error('Booking error:', err);
    } finally {
      setLoading(false);
    }
  };

  // Get minimum date (today)
  const today = new Date().toISOString().split('T')[0];

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-lg p-6">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Book a Service</h2>

      {success && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
          <p className="font-semibold">Booking submitted successfully!</p>
          <p className="text-sm">We'll contact you soon to confirm your appointment.</p>
        </div>
      )}

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input
          label="Full Name"
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          placeholder="John Doe"
          required
        />

        <Input
          label="Email"
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="john@example.com"
          required
        />

        <Input
          label="Phone Number"
          type="tel"
          name="phone"
          value={formData.phone}
          onChange={handleChange}
          placeholder="+1 234 567 8900"
          required
        />

        <div className="grid grid-cols-2 gap-2">
          <Input
            label="Vehicle Model"
            type="text"
            name="vehicleModel"
            value={formData.vehicleModel}
            onChange={handleChange}
            placeholder="Toyota Corolla"
            required
          />
          <Input
            label="Vehicle Number"
            type="text"
            name="vehicleNumber"
            value={formData.vehicleNumber}
            onChange={handleChange}
            placeholder="ABC-1234"
            required
          />
        </div>

        {/* Service Selection Dropdown */}
        {!serviceId && services.length > 0 && (
          <div className="mb-4">
            <label htmlFor="serviceId" className="block text-gray-700 font-semibold mb-2">
              Select Service <span className="text-red-500">*</span>
            </label>
            <select
              id="serviceId"
              name="serviceId"
              value={formData.serviceId}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Choose a service...</option>
              {services.map((service) => (
                <option key={service._id} value={service._id}>
                  {service.name} - ${service.price}
                </option>
              ))}
            </select>
          </div>
        )}

        <Input
          label="Preferred Date"
          type="date"
          name="date"
          value={formData.date}
          onChange={handleChange}
          min={today}
          required
        />
      </div>

      {/* Time Slot Picker */}
      <div className="md:col-span-2 mb-4">
        <TimeSlotPicker
          selectedDate={formData.date}
          serviceId={formData.serviceId}
          selectedSlot={formData.timeSlot}
          onSlotSelect={handleSlotSelect}
        />
      </div>

      <TextArea
        label="Additional Message"
        name="message"
        value={formData.message}
        onChange={handleChange}
        placeholder="Any specific requirements or concerns..."
        rows={4}
      />

      <Button
        type="submit"
        variant="primary"
        disabled={loading || success}
        className="w-full"
      >
        {loading ? 'Submitting...' : success ? 'Booking Confirmed!' : 'Submit Booking'}
      </Button>
    </form>
  );
};

export default BookingForm;