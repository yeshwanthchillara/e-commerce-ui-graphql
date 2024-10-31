import { useSelector } from "react-redux";
import { Routes, Route } from "react-router-dom";

import Home from "./Home.js";
import Signup from "./Components/Auth/SignUp.jsx";
import Login from "./Components/Auth/Login.jsx";
import ForgotPassword from "./Components/Auth/ForgotPassword.jsx";
import ForgotUsername from "./Components/Auth/ForgotUsername.jsx";
import Header from "./Components/Header.jsx";
import Footer from "./Components/Footer.jsx";

import ProductSellingPage from "./Components/Product/ProductSelling.jsx";
import MyAds from "./Components/HeaderOptions/MyAds.jsx";
import ViewProduct from "./Components/Product/ViewProduct.jsx";
import ViewCart from "./Components/HeaderOptions/ViewCart.jsx";
import ViewWishlist from "./Components/HeaderOptions/ViewWishlist.jsx";
import SearchResult from "./Components/Search/SearchResult.jsx";
import BookOrder from "./Components/Bookings/BookOrder.jsx";

import OrderPlaced from "./Components/Bookings/OrderPlaced.jsx";

import YourOrders from "./Components/Bookings/YourOrders.jsx";
import CancelledorReturnOrders from "./Components/Bookings/CancelledorReturnOrders.jsx";
import CheckoutAllPage from "./Components/Bookings/CheckoutAllPage.jsx";

import SpinnerPage from './Components/Utils/SpinnerPage.jsx';

import './App.css'

function App() {
  const loginStatus = useSelector(state => state.mainSlice.loginStatus)
  const showLoadingPage = useSelector(state => state.mainSlice.showLoadingPage)

  return (
    <div className="app">
      <Header />
      {!!showLoadingPage && <SpinnerPage />}
      <Routes>
        <Route path="/" element={<Home />}></Route>
        <Route path="/forgot-username" element={<ForgotUsername />}></Route>
        <Route path="/sign-up" element={<Signup />}></Route>
        <Route path="/login" element={<Login />}></Route>
        <Route path="/forgot-password" element={<ForgotPassword />}></Route>
        <Route path='/view_product/:id' element={<ViewProduct />}></Route>
        <Route path='/search/:query' element={<SearchResult />}></Route>
        {loginStatus && <Route path="/sell_your_product" element={<ProductSellingPage />}></Route>}
        {loginStatus && <Route path="/my_ads" element={<MyAds />}></Route>}
        {loginStatus && <Route path='/show_cart' element={<ViewCart />}></Route>}
        {loginStatus && <Route path='/show_wishlist' element={<ViewWishlist />}></Route>}
        {loginStatus && <Route path='/your_orders' element={<YourOrders />}></Route>}
        {loginStatus && <Route path='/book_now/:id' element={<BookOrder />}></Route>}
        {loginStatus && <Route path='/order_placed/:id' element={<OrderPlaced />}></Route>}
        {loginStatus && <Route path='/cancelled_returned' element={<CancelledorReturnOrders />}></Route>}
        {loginStatus && <Route path='/checkout_page' element={<CheckoutAllPage />}></Route>}
      </Routes>
      <Footer />
    </div>
  );
}

export default App;
