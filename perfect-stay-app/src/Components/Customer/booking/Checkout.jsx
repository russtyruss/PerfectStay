import React, { useState, useEffect } from 'react';
import { CreditCard, Lock, AlertCircle, Shield, Home, Smartphone, ArrowLeft, } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import PointsRedeemModal from './checkout_components/PointsRedeemModal'
import api from '../../../api/axios';

export default function Checkout() {
  const [booking, setBooking] = useState(null);
  const [room, setRoom] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
   // eslint-disable-next-line
    const [discountedTotal, setDiscountedTotal] = useState(null);
    const [showPointsModal, setShowPointsModal] = useState(false);
  // const user = JSON.parse(localStorage.getItem("user"));
  // const userId = user?.id;
  // const role = user?.userType;


  useEffect(() => {
  const user = JSON.parse(sessionStorage.getItem("user"));
  console.log("Logged in user ID:", user?.id);
  }, []);

  const [paymentMethod, setPaymentMethod] = useState("card");

  const [paymentData, setPaymentData] = useState({
    cardNumber: '',
    cardName: '',
    expiryDate: '',
    cvv: '',
    billingAddress: '',
    city: '',
    zipCode: '',
    country: '',
    gcashName: '',
    gcashNumber: ''
  });

  const navigate = useNavigate();

  // get data from session storage
  useEffect(() => {
    const data = sessionStorage.getItem("checkoutBooking");

    if (data) {
      const parsed = JSON.parse(data);

      // parsed.room + parsed.booking come from your BookingSidebar
      setRoom(parsed.room);
      setBooking(parsed.booking);
    } else {
      // fallback mock data
      setBooking({
        checkInDate: "2025-11-05",
        checkOutDate: "2025-11-09",
        nights: 4,
        guestCount: 2,
        totalPrice: 12000
      });

      setRoom({
        roomType: "Premium Suite",
        pricePerNight: 3000
      });
    }
  }, []);

  const handleChange = (e) => {
    let { name, value } = e.target;

    if (paymentMethod === "card") {
      if (name === 'cardNumber') {
        value = value.replace(/\s/g, '').replace(/(\d{4})/g, '$1 ').trim();
        if (value.length > 19) return;
      }
      if (name === 'expiryDate') {
        value = value.replace(/\D/g, '').replace(/(\d{2})(\d)/, '$1/$2');
        if (value.length > 5) return;
      }
      if (name === 'cvv') {
        value = value.replace(/\D/g, '');
        if (value.length > 4) return;
      }
    }

    if (name === "gcashNumber") {
      value = value.replace(/\D/g, '').slice(0, 11);
    }

    setPaymentData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const validatePayment = () => {
    if (paymentMethod === "card") {
      if (paymentData.cardNumber.replace(/\s/g, '').length !== 16) {
        setError('Please enter a valid 16-digit card number');
        return false;
      }
      if (!paymentData.expiryDate.match(/^\d{2}\/\d{2}$/)) {
        setError('Please enter expiry date in MM/YY format');
        return false;
      }
      if (paymentData.cvv.length < 3) {
        setError('Please enter a valid CVV');
        return false;
      }
      return true;
    }

    if (paymentMethod === "gcash") {
      if (paymentData.gcashName.trim().length < 3) {
        setError("Please enter the GCash account name");
        return false;
      }
      if (paymentData.gcashNumber.length !== 11) {
        setError("Please enter a valid 11-digit GCash number");
        return false;
      }
      return true;
    }
      if (paymentMethod === "cash") {
      return true; // ✅ NO validation required
  }
  };

const handleSubmit = async (e) => {
  e.preventDefault();
  setError("");

  if (!validatePayment()) return;
  setLoading(true);

  let bookingId = null; // ✅ we need this for rollback

  try {
    const saved = JSON.parse(sessionStorage.getItem("checkoutBooking"));
    console.log("checkoutBooking data:", saved);
    if (!saved) throw new Error("No booking in session");

    const bookingRequest = {
      checkInDate: saved.booking.checkInDate,
      checkOutDate: saved.booking.checkOutDate,
      totalPrice: saved.booking.totalPrice,
      numberOfguests: saved.booking.guestCount,
      bookingStatus: paymentMethod === "cash" ? "PENDING" : "CONFIRMED",
      customerId: saved.booking.customerId,
      roomId: saved.booking.roomId,
      numberOfNights: saved.booking.nights
    };

    console.log("SENDING TO BACKEND:", bookingRequest);

    const response = await api.post("/bookings", bookingRequest);
    bookingId = response.data.id; // ✅ store for rollback

    const bookingWithRoomInfo = {
      ...response.data,
      room: {
        roomType: saved.room.roomType,
        roomId: saved.booking.roomId
      }
    };

    const paymentPayload = {
      bookingId,
      amount: saved.booking.totalPrice,
      paymentMethodType:
        paymentMethod === "card"
          ? "CREDIT_CARD"
          : paymentMethod === "gcash"
          ? "GCASH"
          : "CASH",

      cardNumber:
        paymentMethod === "card"
          ? paymentData.cardNumber.replace(/\s/g, "")
          : null,

      expiryDate: paymentMethod === "card" ? paymentData.expiryDate : null,
      cvv: paymentMethod === "card" ? paymentData.cvv : null,

      gcashNumber:
        paymentMethod === "gcash" ? paymentData.gcashNumber : null
    };

    if (paymentMethod !== "cash") {
      await api.post("/payments/process", paymentPayload);
    }

    // ✅ ONLY SAVED IF BOTH BOOKING + PAYMENT PASSED
    sessionStorage.setItem(
      "confirmedBooking",
      JSON.stringify(bookingWithRoomInfo)
    );

    navigate("/home/booking-success");

  } catch (err) {
    console.error("FULL ERROR:", err.response?.data || err.message);

    // ✅ ✅ ✅ ROLLBACK: DELETE BOOKING IF PAYMENT FAILED
    if (bookingId) {
      try {
        await api.delete(`/bookings/safe-delete/${bookingId}`);
        console.warn("Booking rolled back due to failed payment");
      } catch (rollbackErr) {
        console.error("ROLLBACK FAILED:", rollbackErr);
      }
    }

    setError(
      err.response?.data?.message ||
      err.response?.data ||
      "Payment failed. Booking was not completed."
    );

  } finally {
    setLoading(false);
  }
};

    //cancel button
  const handleCancel = () => {
    sessionStorage.removeItem("checkoutBooking");
    sessionStorage.removeItem("confirmedBooking");
    navigate("/home/customer-dashboard");
  };

  const getCardType = (number) => {
    const clean = number.replace(/\s/g, '');
    if (clean.startsWith('4')) return 'Visa';
    if (clean.startsWith('5')) return 'Mastercard';
    if (clean.startsWith('3')) return 'Amex';
    return null;
  };


    const handleOpenPoints = () => {
        setShowPointsModal(true);
      };

    const handleRedeemConfirm = (finalPrice) => {
    setDiscountedTotal(finalPrice);

    setBooking(prev => ({
      ...prev,
      totalPrice: finalPrice
    }));

    const saved = sessionStorage.getItem("checkoutBooking");
    if (saved) {
      const data = JSON.parse(saved);
      data.booking.totalPrice = finalPrice;
      sessionStorage.setItem("checkoutBooking", JSON.stringify(data));
    }

    setShowPointsModal(false);
  };




  if (!booking || !room) return null;

  return (
    <div className="min-h-screen bg-white py-12 px-4">
      <div className="max-w-6xl mx-auto">
                      {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center text-white hover:opacity-90 mb-8 font-semibold transition-all bg-gradient-to-r from-blue-600 to-green-600 px-3 py-2 rounded-lg shadow-md"
        >
          <ArrowLeft className="h-5 w-5 mr-2" />
          Back
        </button>

        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-green-600 to-blue-600 rounded-3xl mb-4 shadow-2xl">
            <Lock className="h-10 w-10 text-white" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-3">
            Secure <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-blue-600">Checkout</span>
          </h1>
          <p className="text-xl text-gray-600">Your payment is encrypted and secure</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* Payment Form */}
          <div className="lg:col-span-2">

            {/* Security Badge */}
            <div className="bg-gradient-to-r from-blue-50 to-green-50 border-2 border-blue-200 rounded-2xl p-5 flex items-center mb-6 shadow-sm">
              <Shield className="h-10 w-10 text-blue-600 mr-4" />
              <div>
                <p className="font-bold text-blue-900 text-lg">256-bit SSL Encryption</p>
                <p className="text-sm text-blue-700">Your payment information is fully protected</p>
              </div>
            </div>

            {/* Payment Method Toggle */}
            <div className="flex mb-6 rounded-xl overflow-hidden border border-gray-200">
              <button
                onClick={() => setPaymentMethod("card")}
                className={`flex-1 py-3 font-semibold ${paymentMethod === "card" ? "bg-blue-600 text-white" : "bg-white text-gray-600"}`}
              >
                Credit Card
              </button>

              <button
                onClick={() => setPaymentMethod("gcash")}
                className={`flex-1 py-3 font-semibold ${paymentMethod === "gcash" ? "bg-blue-600 text-white" : "bg-white text-gray-600"}`}
              >
                GCash
              </button>

              <button
                onClick={() => setPaymentMethod("cash")}
                className={`flex-1 py-3 font-semibold ${
                  paymentMethod === "cash"
                    ? "bg-blue-600 text-white"
                    : "bg-white text-gray-600"
                }`}
              >
                Cash
              </button>
            </div>


            {/* CARD OR GCASH FORM */}
            <div className="bg-white rounded-3xl shadow-2xl p-8 border border-gray-100">

              {error && (
                <div className="mb-6 bg-red-50 border-l-4 border-red-500 rounded-xl p-4 flex items-start">
                  <AlertCircle className="h-5 w-5 text-red-600 mt-0.5 mr-3 flex-shrink-0" />
                  <p className="text-sm font-semibold text-red-800">{error}</p>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">

                {paymentMethod === "card" && (
                  <>
                    <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                      <CreditCard className="h-6 w-6 mr-3 text-blue-600" />
                      Payment Details
                    </h2>

                    {/* Card Number */}
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-3">Card Number</label>
                      <div className="relative">
                        <input
                          type="text"
                          name="cardNumber"
                          value={paymentData.cardNumber}
                          onChange={handleChange}
                          placeholder="1234 5678 9012 3456"
                          className="w-full px-4 py-4 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500"
                        />
                        {getCardType(paymentData.cardNumber) && (
                          <span className="absolute right-4 top-1/2 transform -translate-y-1/2 text-xs font-bold text-blue-600 bg-blue-100 px-3 py-1 rounded-full">
                            {getCardType(paymentData.cardNumber)}
                          </span>
                        )}

                      </div>
                    </div>

                    {/* Cardholder Name */}
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-3">Cardholder Name</label>
                      <input
                        type="text"
                        name="cardName"
                        value={paymentData.cardName}
                        onChange={handleChange}
                        placeholder="John Doe"
                        className="w-full px-4 py-4 border-2 border-gray-200 rounded-xl focus:ring-blue-500"
                      />
                    </div>

                    {/* Expiry & CVV */}
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-3">Expiry Date</label>
                        <input
                          type="text"
                          name="expiryDate"
                          value={paymentData.expiryDate}
                          onChange={handleChange}
                          placeholder="MM/YY"
                          className="w-full px-4 py-4 border-2 border-gray-200 rounded-xl focus:ring-blue-500"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-3">CVV</label>
                        <input
                          type="text"
                          name="cvv"
                          value={paymentData.cvv}
                          onChange={handleChange}
                          placeholder="123"
                          className="w-full px-4 py-4 border-2 border-gray-200 rounded-xl focus:ring-blue-500"
                        />
                      </div>
                    </div>
                  </>
                )}

                {/* GCASH FORM */}
                {paymentMethod === "gcash" && (
                  <>
                    <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                      <Smartphone className="h-6 w-6 mr-3 text-blue-600" />
                      GCash Payment
                    </h2>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-3">GCash Name</label>
                      <input
                        type="text"
                        name="gcashName"
                        value={paymentData.gcashName}
                        onChange={handleChange}
                        placeholder="Juan Dela Cruz"
                        className="w-full px-4 py-4 border-2 border-gray-200 rounded-xl focus:ring-blue-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-3">GCash Number</label>
                      <input
                        type="text"
                        name="gcashNumber"
                        value={paymentData.gcashNumber}
                        onChange={handleChange}
                        placeholder="09XXXXXXXXX"
                        className="w-full px-4 py-4 border-2 border-gray-200 rounded-xl focus:ring-blue-500"
                      />
                    </div>

                    <p className="text-xs text-blue-600 mt-2">
                      You will receive a confirmation text after payment is processed.
                    </p>
                  </>
                )}

                {/* CASH PAYMENT */}
                {paymentMethod === "cash" && (
                  <>
                    <h2 className="text-2xl font-bold text-gray-900 mb-6">
                      Cash Payment Instructions
                    </h2>

                    <div className="bg-yellow-50 border border-yellow-300 rounded-xl p-5 space-y-3 text-sm text-gray-800">
                      <p className="font-semibold">Pay at the front desk upon arrival.</p>

                      <p>
                        Reference number will be generate once you press Complete Booking.
                      </p>
                      <p>
                        Present your reference number to the cashier:
                      </p>

                      <ul className="list-disc pl-5 space-y-1 text-gray-700">
                        <li>Bring a valid government ID</li>
                        <li>Payment must be settled before room check-in</li>
                        <li>Unpaid bookings may be cancelled after 12 hours</li>
                      </ul>
                    </div>
                  </>
                )}
                {/* Terms */}
                <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
                  <div className="flex items-start">
                    <input type="checkbox" required className="h-5 w-5" />
                    <label className="ml-3 text-sm text-gray-700">
                      I agree to cancellation policy
                    </label>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-green-600 to-blue-600 text-white py-5 px-6 rounded-xl font-bold flex justify-center items-center"
                >
                  {loading ? (
                    <>
                      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white mr-3"></div>
                      Processing...
                    </>
                  ) : (
                    <>
                      <Lock className="h-5 w-5 mr-2" />
                      Complete Booking - ₱{booking.totalPrice}
                    </>
                  )}
                </button>
              </form>
            </div>


          </div>

          {/* Right Side Summary – unchanged */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-3xl shadow-2xl p-8 sticky top-4">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">Booking Summary</h3>

              <div className="space-y-4 mb-6">
                <div className="flex justify-between pb-4 border-b">
                  <span className="text-gray-600 font-medium flex items-center">
                    <Home className="h-4 w-4 mr-2" /> Room
                  </span>
                  <span className="font-bold">{room.roomType}</span>
                </div>

                <div className="flex justify-between pb-4 border-b">
                  <span className="text-gray-600">Nights</span>
                  <span className="font-semibold">{booking.nights}</span>
                </div>

                <div className="flex justify-between pb-4 border-b">
                  <span className="text-gray-600">Price per Night</span>
                  <span className="font-semibold">₱{room.pricePerNight}</span>
                </div>
              </div>

              <div className="bg-gradient-to-r from-blue-50 to-green-50 rounded-xl p-4 mb-4">
                <div className="flex justify-between items-center">
                  <span className="text-lg font-bold">Total Amount</span>
                  <span className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-green-600">
                    ₱{booking.totalPrice}
                  </span>
                </div>

                              <button
                onClick={handleOpenPoints}
                className="w-full py-3 mt-4 bg-yellow-500 text-white rounded-xl font-semibold 
                          shadow hover:bg-yellow-600 transition"
              >
                APPLY POINTS
              </button>
                              {/* Points Redeem Modal */}
                    <PointsRedeemModal
                        isOpen={showPointsModal}
                        onClose={() => setShowPointsModal(false)}
                        totalPrice={booking.totalPrice}
                        onConfirm={handleRedeemConfirm}
                    />
              </div>

              <button
                onClick={handleCancel}
                className="w-full mt-6 py-4 bg-white border-2 border-gray-300 text-gray-800 
                          rounded-2xl hover:bg-gray-100 transition-all font-semibold 
                          flex items-center justify-center shadow-md"
              >
                <Home className="h-5 w-5 mr-2" />
                Cancel & Return Home
              </button>

              <div className="text-xs text-gray-500 text-center mt-6">
                <p>✓ Free cancellation 24hrs before check-in</p>
                <p className="mt-1">✓ No hidden fees</p>
              </div>
              

            </div>
            
          </div>

        </div>

      </div>

    </div>
  );
}
