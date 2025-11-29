import React, { useState } from 'react';
import { Calendar, Users, Mail, Phone, User, AlertCircle, ArrowRight, Sparkles } from 'lucide-react';

export default function BookingForm() {
  const [step, setStep] = useState(1);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    checkInDate: '',
    checkOutDate: '',
    numOfAdults: 1,
    numOfChildren: 0,
    guestFullName: '',
    guestEmail: '',
    guestPhone: '',
    roomType: 'Deluxe Suite'
  });

  const navigate = (path) => {
    window.history.pushState({}, '', path);
    window.dispatchEvent(new PopStateEvent('popstate'));
  };

  const roomPrice = 250;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const calculateNights = () => {
    if (!formData.checkInDate || !formData.checkOutDate) return 0;
    const checkIn = new Date(formData.checkInDate);
    const checkOut = new Date(formData.checkOutDate);
    const nights = Math.ceil((checkOut - checkIn) / (1000 * 60 * 60 * 24));
    return nights > 0 ? nights : 0;
  };

  const calculateTotal = () => {
    return calculateNights() * roomPrice;
  };

  const handleNext = () => {
    setError('');
    
    if (step === 1) {
      if (!formData.checkInDate || !formData.checkOutDate) {
        setError('Please select check-in and check-out dates');
        return;
      }
      
      const checkIn = new Date(formData.checkInDate);
      const checkOut = new Date(formData.checkOutDate);
      
      if (checkOut <= checkIn) {
        setError('Check-out date must be after check-in date');
        return;
      }
    }
    
    if (step === 2) {
      if (!formData.guestFullName || !formData.guestEmail || !formData.guestPhone) {
        setError('Please fill in all guest information');
        return;
      }
    }
    
    setStep(step + 1);
  };

  const handleSubmit = () => {
    // Store booking data in sessionStorage
    const bookingData = {
      ...formData,
      totalPrice: calculateTotal(),
      nights: calculateNights()
    };
    
    sessionStorage.setItem('checkoutBooking', JSON.stringify(bookingData));
    sessionStorage.setItem('checkoutRoom', JSON.stringify({
      roomType: formData.roomType,
      roomPrice: roomPrice
    }));
    
    navigate('/checkout');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 py-12 px-4">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl mb-4 shadow-lg">
            <Sparkles className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-3">
            Book Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">Dream Stay</span>
          </h1>
          <p className="text-xl text-gray-600">Complete your reservation in 3 easy steps</p>
        </div>

        {/* Progress Steps */}
        <div className="mb-12">
          <div className="flex items-center justify-center">
            {[1, 2, 3].map((s, index) => (
              <React.Fragment key={s}>
                <div className="flex flex-col items-center">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg transition-all ${
                    step >= s 
                      ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg scale-110' 
                      : 'bg-gray-200 text-gray-500'
                  }`}>
                    {s}
                  </div>
                  <p className={`mt-2 text-sm font-medium ${step >= s ? 'text-blue-600' : 'text-gray-500'}`}>
                    {s === 1 ? 'Dates' : s === 2 ? 'Guest Info' : 'Review'}
                  </p>
                </div>
                {index < 2 && (
                  <div className={`w-24 h-1 mx-4 rounded-full transition-all ${
                    step > s ? 'bg-gradient-to-r from-blue-600 to-purple-600' : 'bg-gray-200'
                  }`} />
                )}
              </React.Fragment>
            ))}
          </div>
        </div>

        {/* Main Content */}
        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden border border-gray-100">
          <div className="p-8 md:p-12">
            {/* Error Message */}
            {error && (
              <div className="mb-6 bg-red-50 border-l-4 border-red-500 rounded-lg p-4 flex items-start">
                <AlertCircle className="h-5 w-5 text-red-600 mt-0.5 mr-3 flex-shrink-0" />
                <span className="text-sm font-medium text-red-800">{error}</span>
              </div>
            )}

            {/* Step 1: Dates and Room */}
            {step === 1 && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Select Your Dates</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="relative">
                    <label className="block text-sm font-semibold text-gray-700 mb-3 flex items-center">
                      <Calendar className="h-4 w-4 mr-2 text-blue-600" />
                      Check-in Date
                    </label>
                    <input
                      type="date"
                      name="checkInDate"
                      value={formData.checkInDate}
                      onChange={handleChange}
                      min={new Date().toISOString().split('T')[0]}
                      className="w-full px-4 py-4 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all text-lg"
                    />
                  </div>

                  <div className="relative">
                    <label className="block text-sm font-semibold text-gray-700 mb-3 flex items-center">
                      <Calendar className="h-4 w-4 mr-2 text-blue-600" />
                      Check-out Date
                    </label>
                    <input
                      type="date"
                      name="checkOutDate"
                      value={formData.checkOutDate}
                      onChange={handleChange}
                      min={formData.checkInDate || new Date().toISOString().split('T')[0]}
                      className="w-full px-4 py-4 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all text-lg"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-3 flex items-center">
                      <Users className="h-4 w-4 mr-2 text-blue-600" />
                      Adults
                    </label>
                    <input
                      type="number"
                      name="numOfAdults"
                      value={formData.numOfAdults}
                      onChange={handleChange}
                      min="1"
                      max="4"
                      className="w-full px-4 py-4 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all text-lg"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-3 flex items-center">
                      <Users className="h-4 w-4 mr-2 text-blue-600" />
                      Children
                    </label>
                    <input
                      type="number"
                      name="numOfChildren"
                      value={formData.numOfChildren}
                      onChange={handleChange}
                      min="0"
                      max="3"
                      className="w-full px-4 py-4 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all text-lg"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-3">
                    Room Type
                  </label>
                  <select
                    name="roomType"
                    value={formData.roomType}
                    onChange={handleChange}
                    className="w-full px-4 py-4 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all text-lg bg-white"
                  >
                    <option value="Deluxe Suite">Deluxe Suite - $250/night</option>
                    <option value="Executive Room">Executive Room - $180/night</option>
                    <option value="Presidential Suite">Presidential Suite - $400/night</option>
                  </select>
                </div>
              </div>
            )}

            {/* Step 2: Guest Information */}
            {step === 2 && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Guest Information</h2>
                
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-3 flex items-center">
                    <User className="h-4 w-4 mr-2 text-blue-600" />
                    Full Name
                  </label>
                  <input
                    type="text"
                    name="guestFullName"
                    value={formData.guestFullName}
                    onChange={handleChange}
                    placeholder="John Doe"
                    className="w-full px-4 py-4 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all text-lg"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-3 flex items-center">
                    <Mail className="h-4 w-4 mr-2 text-blue-600" />
                    Email Address
                  </label>
                  <input
                    type="email"
                    name="guestEmail"
                    value={formData.guestEmail}
                    onChange={handleChange}
                    placeholder="john@example.com"
                    className="w-full px-4 py-4 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all text-lg"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-3 flex items-center">
                    <Phone className="h-4 w-4 mr-2 text-blue-600" />
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    name="guestPhone"
                    value={formData.guestPhone}
                    onChange={handleChange}
                    placeholder="+1 234 567 8900"
                    className="w-full px-4 py-4 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all text-lg"
                  />
                </div>
              </div>
            )}

            {/* Step 3: Review */}
            {step === 3 && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Review Your Booking</h2>
                
                <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl p-6 space-y-4">
                  <div className="flex justify-between items-center border-b border-gray-200 pb-4">
                    <span className="text-gray-600 font-medium">Room Type</span>
                    <span className="font-bold text-gray-900">{formData.roomType}</span>
                  </div>
                  
                  <div className="flex justify-between items-center border-b border-gray-200 pb-4">
                    <span className="text-gray-600 font-medium">Check-in</span>
                    <span className="font-bold text-gray-900">
                      {new Date(formData.checkInDate).toLocaleDateString('en-US', { 
                        weekday: 'short', 
                        month: 'short', 
                        day: 'numeric' 
                      })}
                    </span>
                  </div>
                  
                  <div className="flex justify-between items-center border-b border-gray-200 pb-4">
                    <span className="text-gray-600 font-medium">Check-out</span>
                    <span className="font-bold text-gray-900">
                      {new Date(formData.checkOutDate).toLocaleDateString('en-US', { 
                        weekday: 'short', 
                        month: 'short', 
                        day: 'numeric' 
                      })}
                    </span>
                  </div>
                  
                  <div className="flex justify-between items-center border-b border-gray-200 pb-4">
                    <span className="text-gray-600 font-medium">Guests</span>
                    <span className="font-bold text-gray-900">
                      {parseInt(formData.numOfAdults) + parseInt(formData.numOfChildren)} Guests
                    </span>
                  </div>
                  
                  <div className="flex justify-between items-center border-b border-gray-200 pb-4">
                    <span className="text-gray-600 font-medium">Number of Nights</span>
                    <span className="font-bold text-gray-900">{calculateNights()} nights</span>
                  </div>
                  
                  <div className="flex justify-between items-center pt-2">
                    <span className="text-xl font-bold text-gray-900">Total Amount</span>
                    <span className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
                      ${calculateTotal()}
                    </span>
                  </div>
                </div>

                <div className="bg-gray-50 rounded-2xl p-6">
                  <h3 className="font-bold text-gray-900 mb-3">Guest Information</h3>
                  <div className="space-y-2 text-sm">
                    <p className="text-gray-700"><span className="font-semibold">Name:</span> {formData.guestFullName}</p>
                    <p className="text-gray-700"><span className="font-semibold">Email:</span> {formData.guestEmail}</p>
                    <p className="text-gray-700"><span className="font-semibold">Phone:</span> {formData.guestPhone}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Navigation Buttons */}
            <div className="flex justify-between mt-8 pt-8 border-t border-gray-200">
              {step > 1 && (
                <button
                  onClick={() => setStep(step - 1)}
                  className="px-8 py-4 border-2 border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-all font-semibold"
                >
                  Back
                </button>
              )}
              
              {step < 3 ? (
                <button
                  onClick={handleNext}
                  className="ml-auto px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all font-semibold flex items-center shadow-lg"
                >
                  Continue
                  <ArrowRight className="h-5 w-5 ml-2" />
                </button>
              ) : (
                <button
                  onClick={handleSubmit}
                  className="ml-auto px-8 py-4 bg-gradient-to-r from-green-600 to-blue-600 text-white rounded-xl hover:from-green-700 hover:to-blue-700 transition-all font-semibold flex items-center shadow-lg"
                >
                  Proceed to Payment
                  <ArrowRight className="h-5 w-5 ml-2" />
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}