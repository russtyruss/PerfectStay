import React, { useState } from 'react';
import { Calendar, Users, DollarSign, Eye, X, CheckCircle, Clock, XCircle } from 'lucide-react';

export default function BookingsTable({ bookings, onCancelBooking }) {
  const [selectedBooking, setSelectedBooking] = useState(null);

  const getBookingStatus = (booking) => {
    const today = new Date();
    const checkIn = new Date(booking.checkInDate);
    const checkOut = new Date(booking.checkOutDate);

    if (booking.status === 'CANCELLED') {
      return { label: 'Cancelled', color: 'bg-red-100 text-red-800', icon: XCircle };
    }
    if (checkOut < today) {
      return { label: 'Completed', color: 'bg-gray-100 text-gray-800', icon: CheckCircle };
    }
    if (checkIn <= today && checkOut >= today) {
      return { label: 'Current', color: 'bg-blue-100 text-blue-800', icon: CheckCircle };
    }
    return { label: 'Upcoming', color: 'bg-green-100 text-green-800', icon: Clock };
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const canCancelBooking = (booking) => {
    const checkIn = new Date(booking.checkInDate);
    const today = new Date();
    return checkIn > today && booking.status !== 'CANCELLED';
  };

  return (
    <>
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Confirmation Code
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Room Type
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Check-in
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Check-out
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Guests
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Total
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {bookings.map((booking) => {
                const status = getBookingStatus(booking);
                const StatusIcon = status.icon;
                return (
                  <tr key={booking.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {booking.bookingConfirmationCode}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{booking.room?.roomType}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900 flex items-center">
                        <Calendar className="h-4 w-4 mr-2 text-gray-400" />
                        {formatDate(booking.checkInDate)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900 flex items-center">
                        <Calendar className="h-4 w-4 mr-2 text-gray-400" />
                        {formatDate(booking.checkOutDate)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900 flex items-center">
                        <Users className="h-4 w-4 mr-2 text-gray-400" />
                        {booking.numOfAdults + booking.numOfChildren}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900 flex items-center">
                        <DollarSign className="h-4 w-4 text-gray-400" />
                        {booking.totalPrice?.toFixed(2)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${status.color}`}>
                        <StatusIcon className="h-3 w-3 mr-1" />
                        {status.label}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => setSelectedBooking(booking)}
                          className="text-indigo-600 hover:text-indigo-900 flex items-center"
                        >
                          <Eye className="h-4 w-4 mr-1" />
                          View
                        </button>
                        {canCancelBooking(booking) && (
                          <button
                            onClick={() => onCancelBooking(booking.id)}
                            className="text-red-600 hover:text-red-900 flex items-center"
                          >
                            <X className="h-4 w-4 mr-1" />
                            Cancel
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {selectedBooking && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-96 overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-start mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Booking Details</h2>
                <button
                  onClick={() => setSelectedBooking(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-2">Confirmation Code</h3>
                  <p className="text-lg font-semibold text-gray-900">
                    {selectedBooking.bookingConfirmationCode}
                  </p>
                </div>

                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-2">Room Type</h3>
                  <p className="text-lg text-gray-900">{selectedBooking.room?.roomType}</p>
                </div>

                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-2">Check-in Date</h3>
                  <p className="text-lg text-gray-900">{formatDate(selectedBooking.checkInDate)}</p>
                </div>

                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-2">Check-out Date</h3>
                  <p className="text-lg text-gray-900">{formatDate(selectedBooking.checkOutDate)}</p>
                </div>

                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-2">Guest Name</h3>
                  <p className="text-lg text-gray-900">{selectedBooking.guestFullName}</p>
                </div>

                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-2">Email</h3>
                  <p className="text-lg text-gray-900">{selectedBooking.guestEmail}</p>
                </div>

                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-2">Phone</h3>
                  <p className="text-lg text-gray-900">{selectedBooking.guestPhone}</p>
                </div>

                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-2">Number of Guests</h3>
                  <p className="text-lg text-gray-900">
                    {selectedBooking.numOfAdults} Adults, {selectedBooking.numOfChildren} Children
                  </p>
                </div>

                <div className="md:col-span-2">
                  <h3 className="text-sm font-medium text-gray-500 mb-2">Total Price</h3>
                  <p className="text-2xl font-bold text-indigo-600">
                    ${selectedBooking.totalPrice?.toFixed(2)}
                  </p>
                </div>
              </div>

              <div className="mt-6 flex justify-end">
                <button
                  onClick={() => setSelectedBooking(null)}
                  className="px-6 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}