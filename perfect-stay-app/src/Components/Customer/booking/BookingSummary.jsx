import React, { useEffect, useState } from 'react';
import { Calendar, Home, Users, Clock, Mail, Phone, ArrowLeft } from 'lucide-react';
import { useNavigate, useLocation } from "react-router-dom";
import HotelLocation from './booking-summary-components/HotelLocation';
import api from '../../../api/axios';

export default function BookingSummary() {
  const [room, setRoom] = useState(null);
  const { state } = useLocation();
  const booking = state?.booking;
  

  const navigate = useNavigate();

  useEffect(() => {
  if (booking?.room) {
    setRoom(booking.room);
  }
}, [booking]);



  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const user = JSON.parse(sessionStorage.getItem("user"));
  if (!booking || !room) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading booking details...</p>
        </div>
      </div>
    );
  }

  const handleCancelBooking = async () => {
  const confirmCancel = window.confirm("Are you sure you want to cancel this booking?");
  if (!confirmCancel) return;

  try {
    await api.put(`/bookings/cancel/${booking.id}`);

    alert("Booking successfully cancelled! Booking refunded");
    navigate("/home/bookings");
  } catch (error) {
    console.error("Cancel failed:", error);
    alert(error.response?.data || "Failed to cancel booking");
  }
};


  const isCancelDisabled = () => {
    return (
      booking.bookingStatus === "COMPLETED" ||
      booking.bookingStatus === "CANCELLED"
    );
  };

  const getCancelButtonText = () => {
    if (booking.bookingStatus === "COMPLETED") return "Booking Completed";
    if (booking.bookingStatus === "CANCELLED") return "Booking Cancelled";
    return "Cancel Booking";
  };

  const getCancelButtonClasses = () => {
    return `px-8 py-4 rounded-xl font-semibold shadow-lg transition-all ${
      isCancelDisabled()
        ? "bg-gray-300 text-gray-500 cursor-not-allowed"
        : "bg-red-600 text-white hover:bg-red-700"
    }`;
  };


  return (
    <div className="min-h-screen bg-white py-12 px-4">
      <div className="max-w-5xl mx-auto">
        {/* Back Button */}
        <button
          onClick={() => navigate('/home/bookings')}
          className="flex items-center text-white hover:opacity-90 mb-8 font-semibold transition-all bg-gradient-to-r from-blue-600 to-green-600 px-3 py-2 rounded-lg shadow-md"
        >
          <ArrowLeft className="h-5 w-5 mr-2" />
          Back to My Bookings
        </button>

        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-3">
            Booking <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-green-600">Summary</span>
          </h1>
          <p className="text-xl text-gray-600">Review your reservation details</p>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Booking Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Confirmation Code Card */}
            <div className="bg-white rounded-3xl shadow-xl p-8 border-2 border-blue-200">
              <div className="text-center">
                <p className="text-sm text-gray-600 font-semibold uppercase tracking-wider mb-2">
                  Confirmation Code
                </p>
                <p className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-green-600 tracking-wider font-mono mb-4">
                  {booking.confirmationCode}
                </p>
                <div className="inline-flex items-center px-4 py-2 bg-green-100 text-green-800 rounded-full text-sm font-semibold">
                  <Clock className="h-4 w-4 mr-2" />
                  {booking.bookingStatus}
                </div>
              </div>
            </div>

            {/* Room Information */}
            <div className="bg-white rounded-3xl shadow-xl p-8">
              <div className="flex items-center mb-6">
                <div className="w-14 h-14 bg-gradient-to-r from-blue-600 to-green-600 rounded-2xl flex items-center justify-center">
                  <Home className="h-7 w-7 text-white" />
                </div>
                <div className="ml-4">
                  <h2 className="text-2xl font-bold text-gray-900">Room Details</h2>
                  <p className="text-gray-600">Your accommodation</p>
                </div>
              </div>

              <div className="bg-gradient-to-r from-blue-50 to-green-50 rounded-2xl p-6">
                <div className="flex justify-between items-center mb-4">
                  <span className="text-gray-700 font-medium">Room Type</span>
                  <span className="text-xl font-bold text-gray-900">{room.roomType}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-700 font-medium">Price per Night</span>
                  <span className="text-xl font-bold text-blue-600">₱{room.pricePerNight}</span>
                </div>
              </div>
            </div>

            {/* Stay Dates */}
            <div className="bg-white rounded-3xl shadow-xl p-8">
              <div className="flex items-center mb-6">
                <div className="w-14 h-14 bg-gradient-to-r from-green-500 to-teal-600 rounded-2xl flex items-center justify-center">
                  <Calendar className="h-7 w-7 text-white" />
                </div>
                <div className="ml-4">
                  <h2 className="text-2xl font-bold text-gray-900">Stay Dates</h2>
                  <p className="text-gray-600">Your visit schedule</p>
                </div>
              </div>

              <div className="space-y-4">
                <div className="bg-green-50 rounded-xl p-5 border-l-4 border-green-500">
                  <p className="text-sm text-gray-600 font-semibold mb-1">Check-in</p>
                  <p className="text-lg font-bold text-gray-900">{formatDate(booking.checkInDate)}</p>
                  <p className="text-sm text-gray-600 mt-1">From 3:00 PM</p>
                </div>

                <div className="bg-orange-50 rounded-xl p-5 border-l-4 border-orange-500">
                  <p className="text-sm text-gray-600 font-semibold mb-1">Check-out</p>
                  <p className="text-lg font-bold text-gray-900">{formatDate(booking.checkOutDate)}</p>
                  <p className="text-sm text-gray-600 mt-1">Until 11:00 AM</p>
                </div>

                <div className="bg-green-50 rounded-xl p-5 border-l-4 border-green-500">
                  <p className="text-sm text-gray-600 font-semibold mb-1">Total Nights</p>
                  <p className="text-lg font-bold text-gray-900">{booking.nights || 5} Nights</p>
                </div>
              </div>
            </div>

            {/* Guest Information */}
            <div className="bg-white rounded-3xl shadow-xl p-8">
              <div className="flex items-center mb-6">
                <div className="w-14 h-14 bg-gradient-to-r from-green-600 to-pink-600 rounded-2xl flex items-center justify-center">
                  <Users className="h-7 w-7 text-white" />
                </div>
                <div className="ml-4">
                  <h2 className="text-2xl font-bold text-gray-900">Guest Information</h2>
                  <p className="text-gray-600">Contact details</p>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center py-3 border-b border-gray-200">
                  <Users className="h-5 w-5 text-green-600 mr-3" />
                  <div>
                    <p className="text-sm text-gray-600">Guest Name</p>
                    <p className="text-lg font-bold text-gray-900">{user.fullName}</p>
                  </div>
                </div>

                <div className="flex items-center py-3 border-b border-gray-200">
                  <Mail className="h-5 w-5 text-blue-600 mr-3" />
                  <div>
                    <p className="text-sm text-gray-600">Email Address</p>
                    <p className="text-lg font-semibold text-gray-900">{user.email}</p>
                  </div>
                </div>

                <div className="flex items-center py-3 border-b border-gray-200">
                  <Phone className="h-5 w-5 text-green-600 mr-3" />
                  <div>
                    <p className="text-sm text-gray-600">Phone Number</p>
                    <p className="text-lg font-semibold text-gray-900">{user.phoneNumber}</p>
                  </div>
                </div>

                <div className="flex items-center py-3">
                  <Users className="h-5 w-5 text-orange-600 mr-3" />
                  <div>
                    <p className="text-sm text-gray-600">Number of Guests</p>
                    <p className="text-lg font-semibold text-gray-900">
                      {booking.numberOfGuests}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Price Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-3xl shadow-xl p-8 sticky top-4 border border-gray-200">
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-600 rounded-xl flex items-center justify-center">
                  <span className="text-3xl text-white">₱</span>
                </div>
                <div className="ml-3">
                  <h3 className="text-xl font-bold text-gray-900">Price Summary</h3>
                </div>
              </div>

              <div className="space-y-4 mb-6">
                <div className="flex justify-between items-center pb-3 border-b border-gray-200">
                  <span className="text-gray-600">Room Rate</span>
                  <span className="font-semibold text-gray-900">₱{room.pricePerNight}/night</span>
                </div>

                <div className="flex justify-between items-center pb-3 border-b border-gray-200">
                  <span className="text-gray-600">Number of Nights</span>
                  <span className="font-semibold text-gray-900">{booking.numberOfNights}</span>
                </div>

                <div className="flex justify-between items-center pb-3 border-b border-gray-200">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="font-semibold text-gray-900">₱{booking.totalPrice}</span>
                </div>

                <div className="flex justify-between items-center pb-3 border-b border-gray-200">
                  <span className="text-gray-600">Taxes & Fees</span>
                  <span className="font-semibold text-green-600">Included</span>
                </div>
              </div>

              <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl p-5 border-2 border-green-200 mb-6">
                <div className="flex justify-between items-center">
                  <span className="text-lg font-bold text-gray-900">
                    Total Paid
                  </span>

                  <span className="flex items-center text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-green-600 to-emerald-600">
                    <span>₱</span>
                    <span>{booking.totalPrice}</span>
                  </span>
                </div>
              </div>



              <div className="space-y-2 text-xs text-gray-600">
                <p className="flex items-center">
                  <span className="text-green-600 mr-2">✓</span>
                  Free cancellation
                </p>
                <p className="flex items-center">
                  <span className="text-green-600 mr-2">✓</span>
                  No hidden fees
                </p>
                <p className="flex items-center">
                  <span className="text-green-600 mr-2">✓</span>
                  Instant confirmation
                </p>
              </div>
            </div>

            {/* Location Info */}
            <HotelLocation room={room} />
          </div>
        </div>

        {/* Bottom Actions */}
        <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={() => window.print()}
            className="px-8 py-4 bg-white border-2 border-gray-300 text-gray-800 rounded-xl hover:bg-gray-50 transition-all font-semibold shadow-lg"
          >
            Print Summary
          </button>
          <button
            onClick={handleCancelBooking}
            disabled={isCancelDisabled()}
            className={getCancelButtonClasses()}
          >
            {getCancelButtonText()}
          </button>


        </div>
      </div>
    </div>
  );
}