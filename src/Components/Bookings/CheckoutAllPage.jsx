import { useEffect, useState } from "react"
import Card from 'react-bootstrap/Card';
import Form from 'react-bootstrap/Form';
import Dropdown from 'react-bootstrap/Dropdown';
import { useDispatch, useSelector } from "react-redux"
import { getProduct } from "../../actions";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "react-bootstrap";
import check_solid from '../../assets/check_solid.svg'

import { getUserAddress, verifyCoupon, placeOrder, getCartData, checkoutAllItems } from "../../actions";

import AddUpdateAddressModal from "../Product/Modals/AddUpdateAddressModal";
import { toast } from "react-toastify";
import { mainSliceActions } from "../../Store/MainSlice";

const CheckoutAllPage = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [cartData, setCartData] = useState([]);
    const [showOrderPlacedMessage, setShowOrderPlacedMessage] = useState(false);

    const [showAddAddressModal, setShowAddAddressModal] = useState(false)
    const [selectedAddress, setSelectedAddress] = useState({});

    const userAddress = useSelector(state => state.mainSlice.userAddress)
    const userData = useSelector(state => state.mainSlice.userData)

    const [couponCode, setCouponCode] = useState(null)
    const [couponDiscount, setCouponDiscount] = useState(0);
    const [couponInvalid, setCouponInvalid] = useState(false)
    const [couponMessage, setCouponMessage] = useState('')

    const getcartData = async () => {
        dispatch(mainSliceActions.showLoadingPage(true))
        setCartData(await getCartData(userData.username))
        dispatch(mainSliceActions.showLoadingPage(false))
    }

    useEffect(() => {
        getUserAddress(dispatch);
        getcartData();
    }, [])

    useEffect(() => {
        if (!!userAddress[0]) { setSelectedAddress(userAddress[0]) } else { setSelectedAddress({}) }
    }, [userAddress])

    let allAddress;
    if (userAddress) {
        allAddress = [...userAddress]
    } else {
        allAddress = []
    }

    const applyCoupon = async () => {
        if ([null, undefined, ''].includes(couponCode?.trim())) return toast.error('Invalid Coupon Code')
        dispatch(mainSliceActions.showLoadingPage(true))
        verifyCoupon(couponCode).then(res => {
            if (res?.discount) {
                setCouponDiscount(Number(res.discount))
                setCouponMessage(res.message)
                setCouponInvalid(false)
                dispatch(mainSliceActions.showLoadingPage(false))
            }
        }).catch((err) => {
            setCouponDiscount(0)
            setCouponInvalid(true)
            setCouponMessage(err)
            dispatch(mainSliceActions.showLoadingPage(false))
        })
    }

    const handlePlaceOrder = async () => {
        //generate Product Data
        dispatch(mainSliceActions.showLoadingPage(true))
        const cartPayloadData = cartData.map(productData => {
            const bookingDetails = {
                productId: productData.id,
                shippingAddressId: selectedAddress.id,
                couponCode: couponCode || '',
                paymentMode: 'Cash On Delivery',
                buyingQuantity: productData.quantity,
            };
            return bookingDetails
        })
        await checkoutAllItems({ username: userData.username, products: cartPayloadData }).then((res) => {
            if (res) {
                setShowOrderPlacedMessage(true);
                setTimeout(() => {
                    { navigate(`/your_orders`) }
                }, 1000)
            }
        }).catch(err => {
            console.log('Error: ' + err)
        })
        dispatch(mainSliceActions.showLoadingPage(false))
    }

    const priceAfterDiscount = (cartData.reduce((accumulator, product) => { return accumulator + product.price * product.quantity }, 0)) - cartData.reduce((accumulator, product) => { return accumulator + ((product.price / 100 * product.discount)) * product.quantity }, 0);
    const couponDiscountFinal = priceAfterDiscount / 100 * couponDiscount;
    return <>
        {cartData?.length ?
            <div style={{ backgroundColor: 'white', minHeight: '87vh' }}>
                {window.innerWidth > 992 ? <>
                    <div style={{ padding: '20px' }}>
                        <h4 style={{ fontWeight: '600' }}>CheckOut All Items:</h4>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                                {cartData.map((product) => {
                                    return (
                                        <Card>
                                            <Card.Body>
                                                <div className="d-grid" style={{ gridTemplateColumns: '1fr 2fr' }}>
                                                    <div>
                                                        <img variant="top" src={product.images[0]}
                                                            style={{
                                                                width: '100%',
                                                                display: 'block',
                                                                height: '40vh',
                                                                maxWidth: "100%",
                                                                maxHeight: "30vh",
                                                                objectFit: 'contain',
                                                                padding: '10px'
                                                            }} />
                                                    </div>
                                                    <div>
                                                        <Card.Title>{product.productName}</Card.Title>
                                                        <Card.Text>
                                                            {product.description}
                                                        </Card.Text>
                                                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '10px', fontWeight: '600' }}>
                                                            <div>Buying Quantity: </div>
                                                            <div>{product.quantity}</div>
                                                        </div>
                                                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '10px', fontWeight: '600' }}>
                                                            <div>Actual Price: </div>
                                                            <div>{product.price}</div>
                                                        </div>
                                                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '10px', fontWeight: '600' }}>
                                                            <div>Discount: </div>
                                                            <div>{product.price / 100 * product.discount} - ({product.discount}%)</div></div>
                                                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '10px', fontWeight: '600' }}>
                                                            <div>Final Price (x{product.quantity}):</div>
                                                            <div>{(product.price - (product.price / 100 * product.discount)) * product.quantity}</div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </Card.Body>
                                        </Card>
                                    )
                                })}
                            </div>
                            {showOrderPlacedMessage ?
                                <div>
                                    <div style={{ minHeight: '87.5vh', backgroundColor: 'white' }}>
                                        <Card>
                                            <Card.Title className="d-flex" style={{ flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
                                                <div>
                                                    <img src={check_solid} alt='Order Placed' width='150px' style={{ padding: '30px' }} />
                                                </div>
                                                <div>
                                                    <strong>Thank You {userData?.name}, Order Placed </strong>
                                                </div>
                                            </Card.Title>
                                        </Card>
                                    </div>
                                </div>
                                :
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                                    <div style={{ display: 'grid', gap: '20px', gridTemplateColumns: '1fr 1fr' }}>
                                        <Card>
                                            <Card.Body style={{ display: 'flex', gap: '20px', flexDirection: 'column' }}>
                                                <div>
                                                    <div style={{ fontWeight: '600', fontSize: '20px', paddingBottom: '20px' }}>
                                                        <u>Price Details:</u>
                                                    </div>
                                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                                                        <div style={{ fontSize: '18px', fontWeight: '600', display: 'grid', gridTemplateColumns: '7fr 1fr 6fr', width: '300px' }}>
                                                            <span>Total Price</span>
                                                            <span>:</span>
                                                            <span>{cartData.reduce((accumulator, product) => { return accumulator + product.price * product.quantity }, 0)}</span>
                                                        </div>
                                                        <div style={{ color: 'green', fontSize: '18px', fontWeight: '600', display: 'grid', gridTemplateColumns: '7fr 1fr 6fr', width: '300px' }}>
                                                            <span>Discount</span>
                                                            <span>:</span>
                                                            <span>-{cartData.reduce((accumulator, product) => { return accumulator + ((product.price / 100 * product.discount)) * product.quantity }, 0)}</span>
                                                        </div>
                                                        <div style={{ color: 'green', fontSize: '18px', fontWeight: '600', display: 'grid', gridTemplateColumns: '7fr 1fr 6fr', width: '300px' }}>
                                                            <span>Coupon Discount</span>
                                                            <span>:</span>
                                                            <span>{couponDiscountFinal}</span>
                                                        </div>
                                                        <div style={{ fontSize: '18px', fontWeight: '600', display: 'grid', gridTemplateColumns: '7fr 1fr 6fr', width: '300px' }}>
                                                            <span>Delivery</span>
                                                            <span>:</span>
                                                            <span>0</span>
                                                        </div>
                                                        <div style={{ fontSize: '18px', fontWeight: '600', display: 'grid', gridTemplateColumns: '7fr 1fr 6fr', width: '300px' }}>
                                                            <span>Final Price</span>
                                                            <span>:</span>
                                                            <span>{priceAfterDiscount - couponDiscountFinal}</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </Card.Body>
                                        </Card>
                                        <Card>
                                            <Card.Body>
                                                <div style={{ marginLeft: '40px' }}>
                                                    <div style={{ marginBottom: '90px' }}>
                                                        <h5>Apply Coupon:</h5>
                                                        <Form.Group>
                                                            <Form.Control onChange={(e) => { setCouponCode(e.target.value) }} value={couponCode} isInvalid={couponInvalid} isValid={couponDiscount > 0 ? !couponInvalid : false} />
                                                            <Form.Control.Feedback type="invalid">
                                                                {couponMessage}
                                                            </Form.Control.Feedback>
                                                            <Form.Control.Feedback type="valid">
                                                                {couponMessage}
                                                            </Form.Control.Feedback>
                                                        </Form.Group>
                                                        <Button style={{ backgroundColor: 'White', fontWeight: '600', color: 'black', width: '25vh', float: 'left', marginTop: '20px' }} onClick={applyCoupon} disabled={[null, undefined, ''].includes(couponCode?.trim())}>
                                                            Apply Coupon
                                                        </Button>
                                                    </div>
                                                    <div style={{ fontWeight: '600', fontSize: '20px', paddingBottom: '20px' }}>
                                                        <u>Payment Type:</u>
                                                    </div>
                                                    <div style={{ display: 'flex', alignItems: 'center', marginLeft: '20px' }}>
                                                        <Form.Check.Input type='radio' isValid defaultChecked style={{ marginBottom: '3px' }} />
                                                        <Form.Check.Label style={{ fontWeight: '600', fontSize: '20px', }}>Cash on Delivery</Form.Check.Label>
                                                    </div>
                                                    <Button style={{ backgroundColor: 'gold', color: 'black', width: '30vh', marginTop: '20px' }} onClick={handlePlaceOrder}>
                                                        Place Order
                                                    </Button>
                                                </div>
                                            </Card.Body>
                                        </Card>
                                    </div>
                                    <Card>
                                        <Card.Body>
                                            <div style={{ fontWeight: '600', fontSize: '20px', paddingBottom: '10px' }}>
                                                Address:
                                            </div>
                                            {selectedAddress?.firstName ?
                                                <div className="d-flex" style={{ flexDirection: 'column', paddingBottom: '10px' }}>
                                                    <span style={{ fontSize: '18px', fontWeight: '600' }}>{selectedAddress.firstName + ' ' + selectedAddress.lastName}</span>
                                                    <span>{selectedAddress.address} - {selectedAddress.city}</span>
                                                    <span>{selectedAddress.state} - {selectedAddress.pincode}</span>
                                                    <span>LandMark: {selectedAddress.landmark}</span>
                                                    <span>Contact: {selectedAddress.phoneNumber}</span>
                                                </div>
                                                :
                                                <div>
                                                    Please Add Adress
                                                </div>
                                            }
                                            <div style={{ display: 'flex', gap: '20px' }}>
                                                <Dropdown onSelect={(e) => { setSelectedAddress(allAddress[e]) }}>
                                                    <Dropdown.Toggle variant="success" id="dropdown-basic" disabled={allAddress.length === 0}>
                                                        Change Address
                                                    </Dropdown.Toggle>
                                                    <Dropdown.Menu>
                                                        {allAddress.length > 0 &&
                                                            allAddress.map((address, index) => {
                                                                return (
                                                                    <>
                                                                        <Dropdown.Item eventKey={index} key={index}>
                                                                            <div className="d-flex" style={{ flexDirection: 'column' }}>
                                                                                <span style={{ fontSize: '18px', fontWeight: '600' }}>{address.firstName + ' ' + address.lastName}</span>
                                                                                <span>{address.address} - {address.city}</span>
                                                                                <span>{address.state} - {address.pincode}</span>
                                                                                <span>LandMark: {address.landmark}</span>
                                                                                <span>Contact: {address.phoneNumber}</span>
                                                                            </div>
                                                                        </Dropdown.Item>
                                                                        {allAddress.length !== index + 1 && <Dropdown.Divider />}
                                                                    </>
                                                                );
                                                            })}
                                                    </Dropdown.Menu>
                                                </Dropdown>
                                                <Button onClick={() => { setShowAddAddressModal(true) }}>
                                                    Add New Address
                                                </Button>
                                            </div>
                                        </Card.Body>
                                    </Card>
                                </div>
                            }
                        </div>
                    </div>
                </> : <div className="bg-light">
                    {showOrderPlacedMessage ?
                        <>
                            <div className="fs-6 fw-bold p-2">Checkout All Page:</div>
                            <div className="mx-2">
                                {cartData.map((product) => {
                                    return (
                                        <Card className="m-1">
                                            <Card.Body>
                                                <div>
                                                    <div>
                                                        <img variant="top" src={product.images[0]}
                                                            style={{
                                                                width: '100%',
                                                                display: 'block',
                                                                objectFit: 'contain',
                                                                padding: '10px'
                                                            }} />
                                                    </div>
                                                    <div>
                                                        <Card.Title className="fs-5">{product.productName}</Card.Title>
                                                        <hr></hr>
                                                        <div>
                                                            <div style={{ display: 'grid', gridTemplateColumns: '2fr 2fr', gap: '10px', fontWeight: '600' }}>
                                                                <div>Buying Quantity: </div>
                                                                <div>{product.quantity}</div>
                                                            </div>
                                                            <div style={{ display: 'grid', gridTemplateColumns: '2fr 2fr', gap: '10px', fontWeight: '600' }}>
                                                                <div>Actual Price: </div>
                                                                <div>{product.price}</div>
                                                            </div>
                                                            <div style={{ display: 'grid', gridTemplateColumns: '2fr 2fr', gap: '10px', fontWeight: '600' }}>
                                                                <div>Discount: </div>
                                                                <div>{product.price / 100 * product.discount} - ({product.discount}%)</div></div>
                                                            <div style={{ display: 'grid', gridTemplateColumns: '2fr 2fr', gap: '10px', fontWeight: '600' }}>
                                                                <div>Final Price (x{product.quantity}):</div>
                                                                <div>{(product.price - (product.price / 100 * product.discount)) * product.quantity}</div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </Card.Body>
                                        </Card>
                                    )
                                })}
                            </div>
                            <hr></hr>
                            <div className="px-3 mx-2">
                                <div style={{ fontWeight: '600', fontSize: '18px', paddingBottom: '10px' }}>Price Details:</div>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                                    <div style={{ fontSize: '16px', fontWeight: '600', display: 'grid', gridTemplateColumns: '7fr 1fr 6fr' }}>
                                        <span>Total Price</span>
                                        <span>:</span>
                                        <span>{cartData.reduce((accumulator, product) => { return accumulator + product.price * product.quantity }, 0)}</span>
                                    </div>
                                    <div style={{ fontSize: '16px', fontWeight: '600', display: 'grid', gridTemplateColumns: '7fr 1fr 6fr' }}>
                                        <span>Discount</span>
                                        <span>:</span>
                                        <span>-{cartData.reduce((accumulator, product) => { return accumulator + ((product.price / 100 * product.discount)) * product.quantity }, 0)}</span>
                                    </div>
                                    <div style={{ color: 'green', fontSize: '16px', fontWeight: '600', display: 'grid', gridTemplateColumns: '7fr 1fr 6fr' }}>
                                        <span>Coupon Discount</span>
                                        <span>:</span>
                                        <span>{couponDiscountFinal}</span>
                                    </div>
                                    <div style={{ fontSize: '16px', fontWeight: '600', display: 'grid', gridTemplateColumns: '7fr 1fr 6fr' }}>
                                        <span>Delivery</span>
                                        <span>:</span>
                                        <span>0</span>
                                    </div>
                                    <div style={{ fontSize: '16px', fontWeight: '600', display: 'grid', gridTemplateColumns: '7fr 1fr 6fr' }}>
                                        <span>Final Price</span>
                                        <span>:</span>
                                        <span>{priceAfterDiscount - couponDiscountFinal}</span>
                                    </div>
                                </div>
                            </div>
                            <hr></hr>
                            <div className="mx-3">
                                <div>
                                    <h6 className="fw-bold fs-6">Apply Coupon:</h6>
                                    <Form.Group>
                                        <Form.Control onChange={(e) => { setCouponCode(e.target.value) }} value={couponCode} isInvalid={couponInvalid} isValid={couponDiscount > 0 ? !couponInvalid : false} />
                                        <Form.Control.Feedback type="invalid">
                                            {couponMessage}
                                        </Form.Control.Feedback>
                                        <Form.Control.Feedback type="valid">
                                            {couponMessage}
                                        </Form.Control.Feedback>
                                    </Form.Group>
                                    <Button variant="btn btn-success" className="my-2" onClick={applyCoupon} disabled={[null, undefined, ''].includes(couponCode?.trim())}>
                                        Apply Coupon
                                    </Button>
                                </div>
                            </div>
                            <hr></hr>
                            <div className="d-flex align-items-center mx-3" style={{ gap: '3rem' }}>
                                <div style={{ fontWeight: '600', fontSize: '18px' }}>
                                    Payment Type:
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center' }}>
                                    <Form.Check.Input type='radio' isValid defaultChecked />
                                    <Form.Check.Label style={{ fontWeight: '600', fontSize: '16px', }}>Cash on Delivery</Form.Check.Label>
                                </div>
                            </div>
                            <hr></hr>
                            <div className="mx-3">
                                <div>
                                    <div style={{ fontWeight: '600', fontSize: '20px', paddingBottom: '10px' }}>
                                        Address:
                                    </div>
                                    {selectedAddress?.firstName ?
                                        <div className="d-flex" style={{ flexDirection: 'column', paddingBottom: '10px' }}>
                                            <span style={{ fontSize: '18px', fontWeight: '600' }}>{selectedAddress.firstName + ' ' + selectedAddress.lastName}</span>
                                            <span>{selectedAddress.address} - {selectedAddress.city}</span>
                                            <span>{selectedAddress.state} - {selectedAddress.pincode}</span>
                                            <span>LandMark: {selectedAddress.landmark}</span>
                                            <span>Contact: {selectedAddress.phoneNumber}</span>
                                        </div>
                                        :
                                        <div>
                                            Please Add Adress
                                        </div>
                                    }
                                    <div style={{ display: 'flex', gap: '20px' }}>
                                        <Dropdown onSelect={(e) => { setSelectedAddress(allAddress[e]) }}>
                                            <Dropdown.Toggle variant="success" id="dropdown-basic" disabled={allAddress.length === 0}>
                                                Change Address
                                            </Dropdown.Toggle>
                                            <Dropdown.Menu>
                                                {allAddress.length > 0 &&
                                                    allAddress.map((address, index) => {
                                                        return (
                                                            <>
                                                                <Dropdown.Item eventKey={index} key={index}>
                                                                    <div className="d-flex" style={{ flexDirection: 'column' }}>
                                                                        <span style={{ fontSize: '18px', fontWeight: '600' }}>{address.firstName + ' ' + address.lastName}</span>
                                                                        <span>{address.address} - {address.city}</span>
                                                                        <span>{address.state} - {address.pincode}</span>
                                                                        <span>LandMark: {address.landmark}</span>
                                                                        <span>Contact: {address.phoneNumber}</span>
                                                                    </div>
                                                                </Dropdown.Item>
                                                                {allAddress.length !== index + 1 && <Dropdown.Divider />}
                                                            </>
                                                        );
                                                    })}
                                            </Dropdown.Menu>
                                        </Dropdown>
                                        <Button onClick={() => { setShowAddAddressModal(true) }}>
                                            Add New Address
                                        </Button>
                                    </div>
                                </div>
                            </div>
                            <hr></hr>
                            <div className="p-2">
                                <Button style={{ backgroundColor: 'gold', color: 'black', width: '100%' }} onClick={handlePlaceOrder}>
                                    Place Order
                                </Button>
                            </div>
                        </> : <>
                            <div>
                                <div style={{ minHeight: '87.5vh', backgroundColor: 'white' }}>
                                    <Card>
                                        <Card.Title className="d-flex" style={{ flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
                                            <div>
                                                <img src={check_solid} alt='Order Placed' width='150px' style={{ padding: '30px' }} />
                                            </div>
                                            <div>
                                                <strong>Thank You {userData?.name}, Order Placed </strong>
                                            </div>
                                        </Card.Title>
                                        <hr></hr>
                                        <div className="d-flex justify-content-center" onClick={() => navigate('/your_orders')}>
                                            <Button variant="btn btn-outline-success">View Your Orders</Button>
                                        </div>
                                        <hr></hr>
                                        <Card.Body>
                                            <div className="mx-2">
                                                {cartData.map((product) => {
                                                    return (
                                                        <Card className="m-1">
                                                            <Card.Body>
                                                                <div>
                                                                    <div>
                                                                        <img variant="top" src={product.images[0]}
                                                                            style={{
                                                                                width: '100%',
                                                                                display: 'block',
                                                                                objectFit: 'contain',
                                                                                padding: '10px'
                                                                            }} />
                                                                    </div>
                                                                    <div>
                                                                        <Card.Title className="fs-5">{product.productName}</Card.Title>
                                                                        <hr></hr>
                                                                        <div>
                                                                            <div style={{ display: 'grid', gridTemplateColumns: '2fr 2fr', gap: '10px', fontWeight: '600' }}>
                                                                                <div>Buying Quantity: </div>
                                                                                <div>{product.quantity}</div>
                                                                            </div>
                                                                            <div style={{ display: 'grid', gridTemplateColumns: '2fr 2fr', gap: '10px', fontWeight: '600' }}>
                                                                                <div>Actual Price: </div>
                                                                                <div>{product.price}</div>
                                                                            </div>
                                                                            <div style={{ display: 'grid', gridTemplateColumns: '2fr 2fr', gap: '10px', fontWeight: '600' }}>
                                                                                <div>Discount: </div>
                                                                                <div>{product.price / 100 * product.discount} - ({product.discount}%)</div></div>
                                                                            <div style={{ display: 'grid', gridTemplateColumns: '2fr 2fr', gap: '10px', fontWeight: '600' }}>
                                                                                <div>Final Price (x{product.quantity}):</div>
                                                                                <div>{(product.price - (product.price / 100 * product.discount)) * product.quantity}</div>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </Card.Body>
                                                        </Card>
                                                    )
                                                })}
                                            </div>

                                        </Card.Body>
                                    </Card>
                                </div>
                            </div> :
                        </>
                    }
                </div>}
                {showAddAddressModal && <AddUpdateAddressModal setShowAddAddressModal={setShowAddAddressModal} />}
            </div > : null
        }
    </>
}

export default CheckoutAllPage