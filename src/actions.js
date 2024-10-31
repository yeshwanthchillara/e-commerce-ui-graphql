import { toast } from "react-toastify";
import { mainSliceActions } from "./Store/MainSlice";
import apiCaller from "./utils/apiCaller";
import { debounce } from "./utils/utilites";

export const proxy = process.env.NODE_ENV === 'development' ? `${process.env.REACT_APP_PROXY}/api/v1` : '/api/v1';

// TOken Verification
const parseJwt = (token) => {
  try {
    return JSON.parse(atob(token.split('.')[1]));
  } catch (e) {
    return null;
  }
};

// -----------------User Actions-------------------

// SignUp
export const signupSubmit = async (userData, navigate) => {
  const formData = new FormData();
  formData.append("name", userData.name);
  formData.append("username", userData.username);
  formData.append("password", userData.password);
  formData.append("email", userData.email);

  try {
    await apiCaller.post('/register', formData);
    setTimeout(() => {
      navigate("/login", { replace: true });
      toast.info("Please Login");
    }, 1500);
  } catch (error) {
    console.error("Error:", error);
  }
};

// Login
export const loginSubmit = async (loginData, navigate, dispatch) => {
  const formData = new FormData();
  formData.append("username", loginData.username);
  formData.append("password", loginData.password);
  try {
    const response = await apiCaller.post('/login', formData);
    if (response?.token) {
      localStorage.removeItem('token')
      localStorage.setItem("token", response?.token);
      dispatch(mainSliceActions.loggedUserData(response?.userDetails));
      setTimeout(() => {
        navigate("/");
      }, 1000);
    }
  } catch (error) {
    toast.error(error);
    console.error("Error:", error);
  }
};

//Forgot Password
export const forgotPasswordSubmit = async (username) => {
  try {
    const formData = new FormData();
    formData.append("username", username.toLowerCase());
    const response = apiCaller.post('/forgot-password', formData)
    if (!response.ok) {
      return response
    }
  } catch (error) {
    console.error("Error:", error);
  }
};

// Oauth Verification
export const oAuthVerification = async (G_Key, navigate, dispatch) => {
  try {
    const formData = new FormData();
    formData.append("gkey", G_Key);
    const response = await fetch(`${proxy}/user-verification`, {
      method: "POST",
      body: formData,
    });

    let resResult;
    await response.json().then((result) => (resResult = result));

    if (!response.ok) {
      throw resResult.message;
    } else {
      localStorage.setItem("token", resResult?.token);
      dispatch(mainSliceActions.loggedUserData(resResult?.userDetails));
      setTimeout(() => {
        navigate("/");
        toast.success("Login Successful");
      }, 1000);
    }
  } catch (error) {
    toast.error(error);
    console.error("Error:", error);
  }
};

//Forgot Username
export const forgotUsernameSubmit = async (email) => {
  try {
    const formData = new FormData();
    formData.append("email", email.toLowerCase());
    const response = await apiCaller.post('/forgot-username', formData);
    return response
  } catch (error) {
    console.error("Error:", error);
  }
};

// change Password
export const changePassword = async (data) => {
  try {
    const formData = new FormData();
    formData.append('currentPassword', data.currentPassword)
    formData.append('newPassword', data.newPassword)
    const response = await apiCaller.put('/change-password', formData);
    return response
  } catch (error) {
    console.error("Error:", error);
  }
}

// add Address to User Data
export const addAddress = async (userAndAddressData, showAddAddressModal, dispatch) => {
  try {
    const { firstName, lastName, address, landmark, state, city, pincode, phoneNumber } = userAndAddressData;

    const formData = new FormData();
    formData.append('firstName', firstName)
    formData.append('lastName', lastName)
    formData.append('address', address)
    formData.append('state', state)
    formData.append('landmark', landmark)
    formData.append('city', city)
    formData.append('pincode', pincode)
    formData.append('phoneNumber', phoneNumber)

    await apiCaller.post('/add-address', formData);
    await getUserAddress(dispatch)
    showAddAddressModal(false)
  } catch (error) {
    if (error) {
      toast.error('Unable to Add Address' + error)
    }
  }
}

// get All Address
export const getUserAddress = async (dispatch) => {
  try {
    const response = await apiCaller.get('/get-address');
    dispatch(mainSliceActions.loggedUserAddress(response?.data || []));
  } catch (error) {
    console.log('Error: ' + error)
  }
}

// Edit Address
export const editAddress = async (editData, showAddAddressModal, dispatch) => {
  try {
    const formData = new FormData();
    formData.append('addressId', editData.addressId)
    formData.append('firstName', editData.firstName)
    formData.append('lastName', editData.lastName)
    formData.append('address', editData.address)
    formData.append('state', editData.state)
    formData.append('landmark', editData.landmark)
    formData.append('city', editData.city)
    formData.append('pincode', editData.pincode)
    formData.append('phoneNumber', editData.phoneNumber)

    await apiCaller.put('/edit-address', formData);
    await getUserAddress(dispatch);
    showAddAddressModal(false)
  } catch (error) {
    console.log('Error: ' + error)
  }
}

// Delete Address
export const deleteAddress = async (editData, dispatch) => {
  try {
    await apiCaller.delete('/remove-address/' + editData?.addressId);
    await getUserAddress(dispatch);
  } catch (error) {
    if (error) {
      toast.error('Unable to Delete Address' + error)
    }
  }
}

//-------------------- Product Functions ---------------------------------------

// Create Product
export const createProduct = async (productData, setShowConfirmationModal, navigate) => {
  try {
    const productInfo = productData.props

    const formData = new FormData();
    formData.append('productName', productInfo.productName)
    formData.append('description', productInfo.description)
    formData.append('discount', productInfo.discount)
    productInfo.images.map(image => formData.append('images', image))
    formData.append('manufacturer', productInfo.manufacturer)
    formData.append('price', productInfo.price)
    formData.append('productType', productInfo.productType)
    formData.append('techSpecifications', JSON.stringify(productInfo.techSpecs))
    formData.append('typeNewOrRefurbished', productInfo.typeNR)
    formData.append('inventoryStock', productInfo.stock)

    const response = await apiCaller.post('/create-product', formData);
    if (response?.status) {
      setShowConfirmationModal(false)
      navigate('/', { replace: true })
    }
  } catch (error) {
    toast.error("Unable to Publish" + error);
    console.error("Error:", error);
  }
}

// get Search Data
export const getSearchInputData = async () => {
  try {
    const response = await apiCaller.get('/product-search-data');
    return response.data
  } catch (error) {
    console.log('Error: ' + error)
  }
}

// const Get all Products
export const getAllProducts = async (filter) => {
  try {
    const response = await apiCaller.get(`/get-all-products/${filter || ''}`);
    return response.data
  } catch (error) {
    console.error("Error:", error);
  }
}

//get Product
export const getProduct = async (id) => {
  try {
    if (!id) throw 'Invalid ID'
    const response = await apiCaller.get(`/get-product/${id}`);
    return response.data
  } catch (error) {
    console.log('Error: ' + error)
  }
}

// get myAds
export const getMyAds = async () => {
  try {
    const response = await apiCaller.get('/get-my-ads');
    return response?.data
  } catch (error) {
    console.error("Error:", error);
  }
}

//Edit Product
export const editProduct = async (productData, setShowEditConfirmationModal, setShowEditProduct, navigate) => {
  try {
    const formData = new FormData();
    formData.append('id', productData.id)
    formData.append('productName', productData.productName)
    formData.append('description', productData.description)
    formData.append('discount', productData.discount)
    productData.images.map(image => formData.append('images', image))
    formData.append('manufacturer', productData.manufacturer)
    formData.append('price', productData.price)
    formData.append('productType', productData.productType)
    formData.append('techSpecs', JSON.stringify(productData.techSpecs))
    formData.append('typeNewRefurbished', productData.typeNR)
    formData.append('Stock', productData.stock)

    const response = await apiCaller.put('/edit-product', formData)
    setShowEditConfirmationModal(false);
    setShowEditProduct(false);
    navigate('/my_ads', { replace: true });
    return response.data

  } catch (error) {
    console.error("Error:", error);
  }
}

//user Review
export const userRatingToProduct = async (ratingData) => {
  try {
    if (!ratingData.id) throw 'Invalid ID'

    const formData = new FormData();
    formData.append('id', ratingData.id)
    formData.append('starRating', ratingData.starRating)
    formData.append('review', ratingData.review)

    const response = await apiCaller.post('/product-review', formData);
    return response.data;
  } catch (error) {
    if (error) {
      toast.error('Unable to Review' + error)
    }
  }
}

//Add to Cart
export const addToCart = async (userAndProduct) => {
  try {
    const formData = new FormData();
    formData.append('productId', userAndProduct.id)
    const response = await apiCaller.post('/add-to-cart', formData);
    return response?.data
  } catch (error) {
    console.error('Error: ' + error)
  }
}

//get Cart Data
export const getCartData = async (username) => {
  try {
    const response = await apiCaller.get('/get-cart');
    return response.data
  } catch (error) {
    console.log('Error: ' + error)
  }
}

//Manage Quanity of product in Cart
export const manageProductQuantity = debounce(async (userProductDataAndQuantity) => {
  try {
    console.log('Hello')
    const formData = new FormData();
    formData.append('productId', userProductDataAndQuantity.productId);
    formData.append('updateQuantityBy', userProductDataAndQuantity.update)

    const response = await apiCaller.put('/update-cart-quantity', formData);
    return response?.data
  } catch (error) {
    console.log('Error: ' + error)
  }
}, 500)

//Remove Product from Cart
export const removeProductFromCart = async (productAndUserData) => {
  try {
    const response = await apiCaller.delete(`/remove-cart/${productAndUserData?.productId}`)
    return response?.data
  } catch (error) {
    console.log('Error: ' + error)
  }
}

// Add Product to Wishlist
export const addProductToWishlist = async (userAndProduct) => {
  try {
    const formData = new FormData();
    formData.append('productId', userAndProduct.id)
    const response = apiCaller.post('/add-to-wishlist', formData)
    return response?.data
  } catch (error) {
    console.log('Error: ' + error)
  }
}

//get wishlist Products
export const getWishlistData = async (username) => {
  try {
    const response = await apiCaller.get('/get-wishlist');
    return response.data
  } catch (error) {
    console.log('Error: ' + error)
  }
}

//Remove Product from Wishlist
export const removeProductFromWishlist = async (productAndUserData) => {
  try {
    const response = await apiCaller.delete(`/remove-wishlist/${productAndUserData.productId}`)
    return response.data
  } catch (error) {
    if (error) {
      toast.error('Unable to Remove' + error)
    }
  }
}

// get search Data
export const getSearchData = async (searchTerm) => {
  try {
    const response = await apiCaller.get(`/search/${searchTerm}`);
    return response?.data;
  } catch (error) {
    console.error('Error: ' + error)
  }
}

//Code to Apply COUPONS
export const verifyCoupon = async (couponCode) => {
  return new Promise(async (resolve, reject) => {
    try {
      const formData = new FormData();
      formData.append('couponCode', couponCode)
      const response = await apiCaller.post('/verify-coupon', formData);
      resolve(response?.data)
    } catch (error) {
      reject(error)
      console.log('Error: ' + error)
    }
  })
}

//Place Order
export const placeOrder = async (bookingDetails) => {
  return new Promise(async (resolve, reject) => {
    try {
      const formData = new FormData();
      formData.append('productId', bookingDetails.productId)
      formData.append('shippingAddressId', bookingDetails.shippingAddressId)
      formData.append('couponCode', bookingDetails.couponCode)
      formData.append('paymentMode', bookingDetails.paymentMode)
      formData.append('buyingQuantity', bookingDetails.buyingQuantity)

      const response = await apiCaller.post('/place-order', formData);
      resolve(response?.data);
    } catch (error) {
      if (error) {
        reject(error)
      }
    }
  })
}

//get Order Details 
export const getOrderDetails = async (orderData) => {
  try {
    const response = await apiCaller.get(`/get-order/${orderData.orderId}`);
    return response?.data
  } catch (error) {
    if (error) {
      toast.error('Unable to get Order Details' + error)
    }
  }
}

//get All Orders
export const getAllOrders = async (username, cancelled = false) => {
  try {
    const response = await apiCaller.get(`/get-All-Orders?cancelled=${cancelled}`)
    return response?.data
  } catch (error) {
    console.log('Error: ' + error)
  }
}

//Cancel Order
export const cancelOrder = async (orderData) => {
  try {
    const formData = new FormData();
    formData.append('orderId', orderData.orderId)

    const response = await apiCaller.post('/cancel-order', formData);
    if (response) {
      setTimeout(() => {
        window.location.reload()
      }, 1000)
      return response?.data;
    }
  } catch (error) {
    console.log('Error: ' + error)
  }
}

//Book all items in cart
export const checkoutAllItems = async (orderData) => {
  try {
    const formData = new FormData();
    formData.append('products', JSON.stringify(orderData.products))
    const response = await apiCaller.post('/checkout-all', formData);
    return response?.data
  } catch (error) {
    console.log('Error: ' + error)
  }
}

// Generate Receipt
export const generateReceipt = async (orderDetails) => {
  try {
    const result = await apiCaller.get(`/generate-receipt/${orderDetails.orderId}`, { responseType: 'blob' })
    if (result) {

      // Create a link element
      const link = document.createElement('a');

      // Create a Blob URL for the blob
      const blobUrl = URL.createObjectURL(result);

      // Set the link's href to the Blob URL
      link.href = blobUrl;

      // Set the link's download attribute to the desired file name
      link.download = 'Order Receipt.pdf';

      // Append the link to the document body
      document.body.appendChild(link);

      // Trigger a click on the link to start the download
      link.click();

      // Remove the link from the document
      document.body.removeChild(link);

      // Revoke the Blob URL to free up resources
      URL.revokeObjectURL(blobUrl);
    }
  } catch (error) {
    console.log('Error: ' + error)
  }
};
