import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Landing from './Components/Owner/landing/Landing'
import Login from './Components/Login';
import Register from './Components/Register';
import BecomeHost from './Components/Owner/host/BecomeHost';
import Home from './Components/Customer/Navbar/Home';
import CustomerDashboard from './Components/Customer/CustomerDashboard';
import Room from './Components/Customer/room/Room'
import Bookings from './Components/Customer/booking/Bookings';
import BookingSummary from './Components/Customer/booking/BookingSummary';
import Checkout from './Components/Customer/booking/Checkout';
import BookingSucces from './Components/Customer/booking/BookingSuccess'
import Profile from './Components/Customer/profile/Profile'
import CheckoutSummary from './Components/Customer/booking/CheckoutSummary';
import HostDashboard from './Components/Owner/host/HostDashboard';
import OwnerHotelDetails from './Components/Owner/OwnerHotelDetails';
import OwnerRoomBookings from './Components/Owner/OwnerRoomBookings';
import BookingSessionCleaner from './Components/BookingSessionCleaner';
import HostNavBar from './Components/Owner/layout/HostNavbar';
import OwnerProfile from './Components/Owner/profile/OwnerProfile';
import ProtectedRoute from './Components/ProtectedRoute';

export default function PerfectStay() {
  return (
    <Router>
        <BookingSessionCleaner /> 
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/become-host" element={<BecomeHost />} />

        {/* Protected routes for owner */}
        <Route element={<ProtectedRoute />}>
          <Route path="/owner" element={<HostNavBar />} >
            <Route path="owner-dashboard" element={<HostDashboard />} />
            <Route path="hotel/:id" element={<OwnerHotelDetails />} />
            <Route path="room-bookings/:roomId" element={<OwnerRoomBookings />} />
            <Route path="profile" element={<OwnerProfile />} /> 
          </Route>
        </Route>
        
        {/* Parent layout with navbar */}
        <Route element={<ProtectedRoute />}>  
          <Route path="/home" element={<Home />}>
            <Route index element={<CustomerDashboard />} />  {/* default page */}
            <Route path="customer-dashboard" element={<CustomerDashboard />} />
            <Route path="room/:id" element={<Room />} />
            <Route path="bookings" element={<Bookings />}/>
            <Route path="booking-summary"  element={<BookingSummary/>}/>
            <Route path="checkout" element={<Checkout />} />
            <Route path="booking-success"  element={<BookingSucces/>}/>
            <Route path="profile"  element={<Profile/>}/>
            <Route path="checkout-summary"  element={<CheckoutSummary/>}/>
          </Route>
        </Route>
      </Routes>
    </Router>
  );
}
