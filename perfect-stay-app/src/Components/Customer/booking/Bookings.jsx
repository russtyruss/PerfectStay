import React, { useState, useEffect } from 'react';
import { Calendar, Search, Filter, Hotel, Clock, CheckCircle, XCircle, Eye } from 'lucide-react';
import { useNavigate } from "react-router-dom";
import api from '../../../api/axios';

export default function Bookings() {
  const [bookings, setBookings] = useState([]);
  const [filteredBookings, setFilteredBookings] = useState([]);
  // eslint-disable-next-line
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  

  const navigate = useNavigate();

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        setLoading(true);

        const user = JSON.parse(sessionStorage.getItem("user"));
        const customerId = user?.id;

        if (!customerId) {
          console.error("No logged-in customer.");
          return;
        }

        // ⬅ CALL THE NEW ENDPOINT
        const response = await api.get(`/bookings/customer/${customerId}/with-room`);

        // Response is already structured with booking + room info
        setBookings(response.data);
        setFilteredBookings(response.data);

      } catch (error) {
        console.error("Error fetching bookings:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, []);

  
  useEffect(() => {
  const syncCompletedBookings = async () => {
    const today = new Date();

    const completed = bookings.filter(b => {
      const checkOut = new Date(b.checkOutDate);
      return (
        checkOut < today &&
        b.bookingStatus !== "COMPLETED" &&
        b.bookingStatus !== "CANCELLED"
      );
    });

    for (const booking of completed) {
      try {
        await api.put(`/bookings/mark-completed/${booking.id}`);

        // ✅ Update UI instantly after success
        setBookings(prev =>
          prev.map(b =>
            b.id === booking.id
              ? { ...b, bookingStatus: "COMPLETED" }
              : b
          )
        );

      } catch (err) {
        console.error("Failed to auto-complete booking:", booking.id, err);
      }
    }
  };

  if (bookings.length > 0) {
    syncCompletedBookings();
  }

}, [bookings]);


  useEffect(() => {
    filterBookings();
    // eslint-disable-next-line
  }, [searchTerm, statusFilter, bookings]);

  const filterBookings = () => {
    let filtered = [...bookings];

    if (searchTerm) {
      filtered = filtered.filter(booking =>
        booking.bookingConfirmationCode?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        booking.room?.roomType?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        booking.guestFullName?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (statusFilter !== 'all') {
      const today = new Date();
      filtered = filtered.filter(booking => {
        const checkIn = new Date(booking.checkInDate);
        const checkOut = new Date(booking.checkOutDate);

        switch (statusFilter) {
          case 'upcoming':
            return checkIn > today;
          case 'current':
            return checkIn <= today && checkOut >= today;
          case 'past':
            return checkOut < today;
          case 'cancelled':
            return booking.bookingStatus === 'CANCELLED';
          default:
            return true;
        }
      });
    }

    setFilteredBookings(filtered);
  };

  const getBookingStatus = (booking) => {
    const today = new Date();
    const checkIn = new Date(booking.checkInDate);
    const checkOut = new Date(booking.checkOutDate);

    if (booking.bookingStatus === 'CANCELLED') {
      return { label: 'Cancelled', color: 'bg-red-100 text-red-800 border-red-200', icon: XCircle };
    }
    if (checkOut < today) {
      return { label: 'Completed', color: 'bg-gray-100 text-gray-800 border-gray-200', icon: CheckCircle };
    }
    if (checkIn <= today && checkOut >= today) {
      return { label: 'Current', color: 'bg-blue-100 text-blue-800 border-blue-200', icon: Clock };
    }
    return { label: 'Upcoming', color: 'bg-green-100 text-green-800 border-green-200', icon: Calendar };
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const handleViewDetails = (booking) => {
    navigate("/home/booking-summary", {
    state: { booking: booking }
  });
};

  return (
    <div className="min-h-screen bg-white py-12 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-blue-600 to-green-600 rounded-3xl mb-4 shadow-2xl">
            <Hotel className="h-10 w-10 text-white" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-3">
            My <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-green-600">Bookings</span>
          </h1>
          <p className="text-xl text-gray-600">Manage and view your hotel reservations</p>
        </div>

        {/* Search and Filter */}
        <div className="bg-white rounded-3xl shadow-xl p-6 mb-8 border border-gray-200">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search by confirmation code, room type, or name..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-4 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
              />
            </div>

            <div className="relative">
              <Filter className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full pl-12 pr-4 py-4 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 appearance-none bg-white transition-all"
              >
                <option value="all">All Bookings</option>
                <option value="upcoming">Upcoming</option>
                <option value="current">Current</option>
                <option value="past">Past</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>
          </div>
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-2xl shadow-lg p-6 border-l-4 border-blue-500">
            <p className="text-3xl font-bold text-blue-600 mb-1">{bookings.length}</p>
            <p className="text-sm text-gray-600 font-medium">Total Bookings</p>
          </div>
          <div className="bg-white rounded-2xl shadow-lg p-6 border-l-4 border-green-500">
            <p className="text-3xl font-bold text-green-600 mb-1">
              {bookings.filter(b => new Date(b.checkInDate) > new Date()).length}
            </p>
            <p className="text-sm text-gray-600 font-medium">Upcoming</p>
          </div>
          <div className="bg-white rounded-2xl shadow-lg p-6 border-l-4 border-green-500">
            <p className="text-3xl font-bold text-green-600 mb-1">
              {bookings.filter(b => {
                const today = new Date();
                return new Date(b.checkInDate) <= today && new Date(b.checkOutDate) >= today;
              }).length}
            </p>
            <p className="text-sm text-gray-600 font-medium">Current</p>
          </div>
          <div className="bg-white rounded-2xl shadow-lg p-6 border-l-4 border-gray-500">
            <p className="text-3xl font-bold text-gray-600 mb-1">
              {bookings.filter(b => new Date(b.checkOutDate) < new Date()).length}
            </p>
            <p className="text-sm text-gray-600 font-medium">Completed</p>
          </div>
        </div>

        {/* Bookings List */}
        {filteredBookings.length === 0 ? (
          <div className="bg-white rounded-3xl shadow-xl p-12 text-center">
            <Hotel className="h-20 w-20 text-gray-400 mx-auto mb-4" />
            <h3 className="text-2xl font-bold text-gray-900 mb-2">No bookings found</h3>
            <p className="text-gray-600 mb-6">
              {searchTerm || statusFilter !== 'all'
                ? 'Try adjusting your search or filter criteria'
                : 'You haven\'t made any bookings yet'}
            </p>
            <button
              onClick={() => navigate('/')}
              className="bg-gradient-to-r from-blue-600 to-green-600 text-white px-8 py-3 rounded-xl hover:from-blue-700 hover:to-green-700 transition-all font-semibold shadow-lg"
            >
              Browse Rooms
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredBookings.map((booking) => {
              const status = getBookingStatus(booking);
              const StatusIcon = status.icon;
              
              return (
                <div
                  key={booking.id}
                  className="bg-white rounded-3xl shadow-lg hover:shadow-2xl transition-all p-6 border border-gray-200"
                >
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
                    {/* Confirmation Code & Status */}
                    <div className="lg:col-span-3">
                      <p className="text-xs text-gray-500 font-semibold uppercase mb-1">Confirmation</p>
                      <p className="text-lg font-bold text-gray-900 font-mono mb-2">
                        {booking.bookingConfirmationCode}
                      </p>
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold border ${status.color}`}>
                        <StatusIcon className="h-3 w-3 mr-1" />
                        {status.label}
                      </span>
                    </div>

                    {/* Room Info */}
                    <div className="lg:col-span-3">
                      <div className="flex items-center mb-2">
                        <Hotel className="h-4 w-4 text-blue-600 mr-2" />
                        <p className="text-xs text-gray-500 font-semibold uppercase">Room</p>
                      </div>
                      <p className="text-lg font-bold text-gray-900">{booking.room?.roomType}</p>
                      <p className="text-sm text-gray-600">₱{booking.room?.pricePerNight}/night</p>
                    </div>

                    {/* Dates */}
                    <div className="lg:col-span-3">
                      <div className="flex items-center mb-2">
                        <Calendar className="h-4 w-4 text-green-600 mr-2" />
                        <p className="text-xs text-gray-500 font-semibold uppercase">Dates</p>
                      </div>
                      <p className="text-sm font-semibold text-gray-900">
                        {formatDate(booking.checkInDate)}
                      </p>
                      <p className="text-sm text-gray-600">
                        to {formatDate(booking.checkOutDate)}
                      </p>
                    </div>

                    {/* Price & Actions */}
                    <div className="lg:col-span-3 flex flex-col items-end">
                      <div className="flex items-center mb-3">
                        <span className="text-2xl text-green-600">₱</span>
                        <p className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-emerald-600">
                          {booking.totalPrice}
                        </p>
                      </div>
                      <button
                        onClick={() => handleViewDetails(booking)}
                        className="bg-gradient-to-r from-blue-600 to-green-600 text-white px-6 py-2 rounded-xl hover:from-blue-700 hover:to-green-700 transition-all font-semibold flex items-center shadow-lg"
                      >
                        <Eye className="h-4 w-4 mr-2" />
                        View Details
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

      </div>
    </div>
  );
}