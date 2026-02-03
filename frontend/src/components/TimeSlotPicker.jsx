// src/components/TimeSlotPicker.jsx
import { useState, useEffect } from 'react';
import { FaClock, FaCheck, FaExclamationCircle } from 'react-icons/fa';
import { getAvailability } from '../services/bookingService';

const TimeSlotPicker = ({ selectedDate, serviceId, selectedSlot, onSlotSelect }) => {
    const [availableSlots, setAvailableSlots] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchAvailability = async () => {
            if (!selectedDate || !serviceId) return;

            setLoading(true);
            setError(null);
            try {
                const data = await getAvailability(serviceId, selectedDate);
                let slots = data.availableSlots || [];

                // Filter out past slots if selected date is today
                const todayStr = new Date().toISOString().split('T')[0];
                if (selectedDate === todayStr) {
                    const now = new Date();
                    const currentHour = now.getHours();
                    const currentMinute = now.getMinutes();

                    slots = slots.filter(slot => {
                        const [hourStr, minuteStr] = slot.startTime.split(':');
                        const slotHour = parseInt(hourStr, 10);
                        const slotMinute = parseInt(minuteStr, 10);

                        if (slotHour > currentHour) return true;
                        if (slotHour === currentHour && slotMinute > currentMinute) return true;
                        return false;
                    });
                }

                setAvailableSlots(slots);
            } catch (err) {
                console.error('Failed to fetch availability:', err);
                setError('Failed to load available slots. Please try again.');
                setAvailableSlots([]);
            } finally {
                setLoading(false);
            }
        };

        fetchAvailability();
    }, [selectedDate, serviceId]);

    if (!selectedDate) {
        return (
            <div className="bg-blue-50/50 p-8 rounded-2xl text-center border-2 border-dashed border-blue-100">
                <FaClock className="text-4xl mx-auto mb-3 text-blue-300" />
                <p className="text-blue-600 font-medium text-lg">Select a date to unlock time slots</p>
                <p className="text-blue-400 text-sm mt-1">We'll show you the best available times for your service</p>
            </div>
        );
    }

    if (loading) {
        return (
            <div className="bg-white p-8 rounded-2xl text-center shadow-inner border border-gray-100">
                <div className="relative w-12 h-12 mx-auto mb-4">
                    <div className="absolute inset-0 rounded-full border-4 border-blue-50 border-t-blue-600 animate-spin"></div>
                </div>
                <p className="text-gray-500 font-medium">Scanning availability...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="bg-red-50 p-8 rounded-2xl text-center text-red-600 border border-red-100">
                <FaExclamationCircle className="text-4xl mx-auto mb-3 opacity-50" />
                <p className="font-bold">Oops! Something went wrong</p>
                <p className="text-sm mt-1">{error}</p>
            </div>
        );
    }

    return (
        <div className="animate-in fade-in slide-in-from-bottom-2 duration-500">
            <div className="flex items-center justify-between mb-4">
                <label className="text-gray-900 font-bold text-lg flex items-center gap-2">
                    Pick a Time
                    <span className="text-red-500 text-sm">*</span>
                </label>
                <span className="text-xs font-medium text-gray-400 uppercase tracking-wider">
                    {availableSlots.length} Slots Found
                </span>
            </div>

            {availableSlots.length === 0 ? (
                <div className="bg-orange-50 p-6 rounded-2xl border border-orange-100 text-center">
                    <p className="text-orange-700 font-semibold mb-1">No slots available</p>
                    <p className="text-orange-600/70 text-sm">This day is fully booked or has no operating hours. Try another date.</p>
                </div>
            ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                    {availableSlots.map((slot) => {
                        const isFull = slot.availableBays === 0;
                        const isSelected = selectedSlot === slot.startTime;

                        return (
                            <button
                                key={slot.startTime}
                                type="button"
                                onClick={() => !isFull && onSlotSelect(slot.startTime)}
                                disabled={isFull}
                                className={`
                  p-4 rounded-xl border-2 font-bold transition-all duration-300 relative overflow-hidden group
                  ${isSelected
                                        ? 'bg-blue-600 text-white border-blue-600 shadow-lg shadow-blue-600/30'
                                        : !isFull
                                            ? 'bg-white text-gray-700 border-gray-100 hover:border-blue-500 hover:shadow-md'
                                            : 'bg-gray-50 text-gray-300 border-gray-100 cursor-not-allowed opacity-60'
                                    }
                `}
                            >
                                {!isFull && !isSelected && (
                                    <div className="absolute top-0 right-0 w-8 h-8 bg-blue-50 -mr-4 -mt-4 rotate-45 group-hover:bg-blue-100 transition-colors"></div>
                                )}

                                <div className="flex flex-col items-center relative z-10">
                                    <span className="text-base">{slot.displayTime}</span>
                                    {isFull ? (
                                        <span className="text-[10px] mt-1 bg-red-100 text-red-600 px-2 py-0.5 rounded-full">Fully Booked</span>
                                    ) : (
                                        <span className={`text-[10px] mt-1 ${isSelected ? 'text-blue-100' : 'text-gray-400'}`}>
                                            {slot.availableBays} bays free
                                        </span>
                                    )}
                                    {isSelected && (
                                        <div className="absolute top-0 right-0 -mr-2 -mt-2">
                                            <FaCheck className="text-[10px]" />
                                        </div>
                                    )}
                                </div>
                            </button>
                        );
                    })}
                </div>
            )}

            {/* Modern Legend */}
            {availableSlots.length > 0 && (
                <div className="flex flex-wrap gap-6 mt-6 p-4 bg-gray-50 rounded-xl border border-gray-100">
                    <div className="flex items-center gap-2">
                        <div className="w-3 h-3 bg-white border-2 border-gray-200 rounded-full"></div>
                        <span className="text-xs font-semibold text-gray-500 uppercase tracking-tight">Available</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-3 h-3 bg-blue-600 rounded-full"></div>
                        <span className="text-xs font-semibold text-gray-500 uppercase tracking-tight">Selected</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-3 h-3 bg-gray-200 rounded-full opacity-60"></div>
                        <span className="text-xs font-semibold text-gray-500 uppercase tracking-tight">Full</span>
                    </div>
                </div>
            )}
        </div>
    );
};

export default TimeSlotPicker;
