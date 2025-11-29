import React, { useEffect, useState } from 'react';
import { CheckCircle, Calendar, Home, Mail, Printer, Users, MapPin, Phone, Sparkles } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function BookingSuccess({ onNavigate }) {
  const [booking, setBooking] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const confirmedBooking = sessionStorage.getItem('confirmedBooking');
    if (confirmedBooking) {
      setBooking(JSON.parse(confirmedBooking));
    } else {
      // For testing: Use sample booking data if none exists
      const sampleBooking = {
        bookingConfirmationCode: 'PS2024-ABC123',
        guestEmail: 'john.doe@example.com',
        guestFullName: 'John Doe',
        guestPhone: '+1 (234) 567-8900',
        checkInDate: '2025-01-15',
        checkOutDate: '2025-01-20',
        numOfAdults: 2,
        numOfChildren: 1,
        totalPrice: 1250,
        room: {
          roomType: 'Deluxe Ocean View Suite'
        }
      };
      setBooking(sampleBooking);
    }
  }, [onNavigate]);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const handlePrint = () => {
    window.print();
  };

  const user = JSON.parse(sessionStorage.getItem("user"));

  if (!booking) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Success Animation */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-32 h-32 bg-gradient-to-r from-green-500 to-emerald-600 rounded-full mb-6 shadow-2xl animate-bounce">
            <CheckCircle className="h-20 w-20 text-white" />
          </div>
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-3">
            Booking <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-emerald-600">Confirmed!</span>
          </h1>
          <p className="text-2xl text-gray-600 mb-2">Your dream vacation awaits</p>
          <div className="flex items-center justify-center text-gray-500">
            <Sparkles className="h-5 w-5 mr-2 text-yellow-500" />
            <span>Get ready for an amazing experience</span>
          </div>
        </div>

        {/* Confirmation Card */}
        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden border-2 border-green-200 mb-8">
          {/* Header with Confirmation Code */}
          <div className="bg-gradient-to-r from-green-600 to-emerald-600 px-8 py-8 text-center">
            <p className="text-green-100 text-sm font-semibold uppercase tracking-wider mb-2">
              Confirmation Code
            </p>
            <p className="text-5xl font-bold text-white tracking-widest font-mono">
              {booking.confirmationCode}
            </p>

            {/* implement sending email later */}
            <p className="text-green-100 text-sm mt-4 flex items-center justify-center">
              <Mail className="h-4 w-4 mr-2" />
              Confirmation sent to {booking.guestEmail}
            </p>
          </div>

          {/* Booking Details */}
          <div className="p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              {/* Room Info */}
              <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl p-6">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center">
                    <Home className="h-6 w-6 text-white" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm text-gray-600 font-medium">Room Type</p>
                    <p className="text-xl font-bold text-gray-900">{booking?.room?.roomType}</p>
                  </div>
                </div>
              </div>

              {/* Guest Info */}
              <div className="bg-gradient-to-br from-green-50 to-teal-50 rounded-2xl p-6">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-green-600 rounded-xl flex items-center justify-center">
                    <Users className="h-6 w-6 text-white" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm text-gray-600 font-medium">Guest Name</p>
                    <p className="text-xl font-bold text-gray-900">{user.fullName}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Dates and Details */}
            <div className="space-y-4 mb-8">
              <div className="flex items-center justify-between py-4 border-b border-gray-200">
                <div className="flex items-center">
                  <Calendar className="h-5 w-5 text-blue-600 mr-3" />
                  <div>
                    <p className="text-sm text-gray-600 font-medium">Check-in</p>
                    <p className="text-lg font-bold text-gray-900">{formatDate(booking.checkInDate)}</p>
                    <p className="text-sm text-gray-500">From 3:00 PM</p>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between py-4 border-b border-gray-200">
                <div className="flex items-center">
                  <Calendar className="h-5 w-5 text-purple-600 mr-3" />
                  <div>
                    <p className="text-sm text-gray-600 font-medium">Check-out</p>
                    <p className="text-lg font-bold text-gray-900">{formatDate(booking.checkOutDate)}</p>
                    <p className="text-sm text-gray-500">Until 11:00 AM</p>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between py-4 border-b border-gray-200">
                <div className="flex items-center">
                  <Users className="h-5 w-5 text-green-600 mr-3" />
                  <span className="text-gray-700 font-medium">Number of Guests</span>
                </div>
                <span className="text-lg font-bold text-gray-900">
                  {booking.numberOfguests}
                </span>
              </div>

              <div className="flex items-center justify-between py-4 border-b border-gray-200">
                <div className="flex items-center">
                  <Phone className="h-5 w-5 text-orange-600 mr-3" />
                  <span className="text-gray-700 font-medium">Contact Phone</span>
                </div>
                <span className="text-lg font-bold text-gray-900">{user.phoneNumber}</span>
              </div>
            </div>

            {/* Total Amount */}
            <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl p-6 border-2 border-green-200">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-gray-600 font-medium mb-1">Total Amount Paid</p>
                  <p className="text-sm text-gray-500">Including all taxes and fees</p>
                </div>
                <p className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-emerald-600">
                  ₱{booking.totalPrice}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Important Information */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-8 border border-yellow-200">
          <div className="flex items-start mb-4">
            <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center mr-4 flex-shrink-0">
              <MapPin className="h-5 w-5 text-yellow-600" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Important Information</h3>
              <ul className="space-y-2 text-gray-700">
                <li className="flex items-start">
                  <span className="text-green-600 mr-2">✓</span>
                  <span>Check-in time: 3:00 PM | Check-out time: 11:00 AM</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-600 mr-2">✓</span>
                  <span>Please bring a valid ID and your confirmation code</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-600 mr-2">✓</span>
                  <span>Free cancellation up to 24 hours before check-in</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-600 mr-2">✓</span>
                  <span>Complimentary Wi-Fi and parking included</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <button
            onClick={() => navigate('/home/bookings')}
            className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-4 px-6 rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all font-semibold flex items-center justify-center shadow-lg"
          >
            <Calendar className="h-5 w-5 mr-2" />
            View All Bookings
          </button>
          
          <button
            onClick={() => navigate('/home')}
            className="bg-white border-2 border-gray-300 text-gray-800 py-4 px-6 rounded-xl hover:bg-gray-50 transition-all font-semibold flex items-center justify-center shadow-lg"
          >
            <Home className="h-5 w-5 mr-2" />
            Back to Home
          </button>
          
          <button
            onClick={handlePrint}
            className="bg-white border-2 border-gray-300 text-gray-800 py-4 px-6 rounded-xl hover:bg-gray-50 transition-all font-semibold flex items-center justify-center shadow-lg"
          >
            <Printer className="h-5 w-5 mr-2" />
            Print Confirmation
          </button>
        </div>

        {/* Support Info */}
        <div className="mt-8 text-center bg-white rounded-2xl p-6 shadow-lg">
          <p className="text-gray-600 mb-2 font-medium">Need Assistance?</p>
          <p className="text-sm text-gray-600">
            Contact us at{' '}
            <span className="text-blue-600 font-semibold cursor-pointer">support@perfectstay.com</span>
            {' '}or call{' '}
            <span className="text-blue-600 font-semibold cursor-pointer">+1 (234) 567-890</span>
          </p>
          <p className="text-xs text-gray-500 mt-2">We're available 24/7 to help you</p>
        </div>
      </div>
    </div>
  );
}