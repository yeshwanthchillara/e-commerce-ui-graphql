import { Button, Row, Col, Card } from "react-bootstrap"
import { useNavigate } from "react-router-dom"
import moment from "moment/moment"
import { cancelOrder, generateReceipt } from "../../actions"
import { useSelector } from "react-redux"
import cancelledImage from '../../assets/cancelled.png'

const ViewOrder = (props) => {
    const navigate = useNavigate();

    const userData = useSelector(state => state.mainSlice.userData)

    const orderData = props.props;
    const shippingAddress = orderData?.shippingAddress

    const handleDownloadReceipt = async (orderId) => {
        await generateReceipt({ username: userData.username, orderId })
    }

    const windowWidth = window.innerWidth

    return (<>
        {props?.props?.id && windowWidth > 992 ?
            <div style={{ display: 'grid', gridTemplateColumns: '3fr 2fr' }}>
                <div>
                    <div style={{ marginBottom: '10px' }}>Product Details:</div>
                    <div style={{ display: 'grid', gridTemplateColumns: '2fr 3fr', gap: '30px' }}>
                        <div>
                            <img variant="top" src={orderData.image}
                                style={{
                                    display: 'block',
                                    height: '40vh',
                                    maxWidth: "100%",
                                    maxHeight: "50vh",
                                    objectFit: 'contain',
                                    border: '1px solid black',
                                    borderRadius: '20px'
                                }} />
                            <Button variant='light' style={{ marginTop: '20px', color: 'blue' }} onClick={() => { navigate(`/view_product/${orderData?.productId}`) }}>
                                View Details
                            </Button>
                        </div>
                        <div style={{ fontSize: '17px' }}>
                            <div style={{ display: 'grid', gridTemplateColumns: '5fr 1fr 10fr' }}>
                                <span>Order Id</span>
                                <span>:</span>
                                <span>{orderData?.id}</span>
                            </div>
                            <div style={{ display: 'grid', gridTemplateColumns: '5fr 1fr 10fr' }}>
                                <span>Order Date</span>
                                <span>:</span>
                                <span>{moment(orderData?.orderedOn).format('DD-MM-YYYY')}</span>
                            </div>
                            <div style={{ display: 'grid', gridTemplateColumns: '5fr 1fr 10fr' }}>
                                <span>Product Name</span>
                                <span>:</span>
                                <span>{orderData?.productName}</span>
                            </div>
                            <div style={{ display: 'grid', gridTemplateColumns: '5fr 1fr 10fr' }}>
                                <span>Coupon Code</span>
                                <span>:</span>
                                <span>{orderData?.couponCode}</span>
                            </div>
                            <div style={{ display: 'grid', gridTemplateColumns: '5fr 1fr 10fr' }}>
                                <span>Quantity</span>
                                <span>:</span>
                                <span>{orderData?.buyingQuantity || 'Not Found'}</span>
                            </div>
                            <div style={{ display: 'grid', gridTemplateColumns: '5fr 1fr 10fr' }}>
                                <span>Final Amount</span>
                                <span>:</span>
                                <span>{orderData?.finalPrice}</span>
                            </div>
                            <div style={{ display: 'grid', gridTemplateColumns: '5fr 1fr 10fr' }}>
                                <span>Payment Mode</span>
                                <span>:</span>
                                <span>{orderData?.paymentMode}</span>
                            </div>
                            <div style={{ display: 'grid', gridTemplateColumns: '5fr 1fr 10fr' }}>
                                <span>Payment Id</span>
                                <span>:</span>
                                <span>{orderData?.paymentId || 'N/A'}</span>
                            </div>
                            <div style={{ display: 'grid', gridTemplateColumns: '5fr 1fr 10fr' }}>
                                <span>Shipping Address:</span>
                                <span>:</span>
                                <div className="d-flex" style={{ fontSize: '15px', flexDirection: 'column', paddingBottom: '10px' }}>
                                    <span style={{ fontSize: '18px', fontWeight: '600' }}>{shippingAddress?.firstName + ' ' + shippingAddress?.lastName}</span>
                                    <span>{shippingAddress?.address} - {shippingAddress?.city}</span>
                                    <span>{shippingAddress?.state} - {shippingAddress?.pincode}</span>
                                    <span>LandMark: {shippingAddress?.landmark}</span>
                                </div>
                            </div>
                            <div style={{ display: 'grid', gridTemplateColumns: '5fr 1fr 10fr' }}>
                                <span>Contact</span>
                                <span>:</span>
                                <span>{shippingAddress?.phoneNumber}</span>
                            </div>
                        </div>
                    </div>
                </div>
                <div>
                    <div>
                        Track package:
                        <div>
                            {!props?.props?.cancelled ?
                                <div className="row px-3">
                                    <div className="col">
                                        <ul id="progressbar" >
                                            <li className={`${moment() >= moment(orderData?.orderedOn) ? 'active step0' : 'step0'}`} id="step1">PLACED</li>
                                            <li className={`${moment() >= moment(orderData?.orderedOn).add(1, 'days') ? 'active step0 text-center' : 'step0 text-center'}`} id="step2">SHIPPED</li>
                                            <li className={`${moment() >= moment(orderData?.orderedOn).add(2, 'days') ? 'active step0  text-muted text-right' : 'step0  text-muted text-right'}`} id="step3">DELIVERED</li>
                                        </ul>
                                    </div>
                                </div> :
                                <div className="d-flex justify-content-center p-5">
                                    <div style={{
                                        backgroundImage: `url('${cancelledImage}')`,
                                        backgroundSize: 'cover',
                                        width: '10rem',
                                        height: '10rem'
                                    }}>
                                    </div>
                                </div>}
                        </div>
                    </div>
                    <div style={{ display: 'flex', justifyContent: "center" }}>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', width: '40%' }}>
                            <Button variant="warning" onClick={() => { handleDownloadReceipt(orderData.id) }}>Download Receipt</Button>
                            {(!orderData.cancelled && moment() <= moment(orderData?.orderedOn).add(2, 'days')) ? <Button variant="danger" onClick={() => { cancelOrder({ username: userData.username, orderId: orderData.id }) }}>Cancel</Button> : null}
                            <Button variant="dark" onClick={() => { window.open(`https://mail.google.com/mail/?view=cm&fs=1&tf=1&to=${orderData.sellerContact}`, '_blank') }}>Contact Seller</Button>
                        </div>
                    </div>
                </div>
            </div > : <div>
                <div className="d-flex justify-content-between align-items-center py-2">
                    <div className="fw-bold">Product Details:</div>
                    <Button variant='btn btn-dark p-0 px-2' onClick={() => { navigate(`/view_product/${orderData?.productId}`) }}>
                        View Product Details
                    </Button>
                </div>
                <div>
                    <img variant="top" src={orderData.image}
                        style={{
                            padding: '0.2rem',
                            height: '12rem',
                            width: '100%',
                            objectFit: 'contain',
                            border: '1px solid black',
                            borderRadius: '1rem'
                        }} />
                </div>
                <hr></hr>
                <div className="fs-6 p-2" style={{ position: 'relative' }}>
                    {props?.props?.cancelled && <div style={{
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        position: 'absolute',
                        width: '100%',
                        height: '100%',
                        padding: '2rem'
                    }}>
                        <div style={{
                            backgroundImage: `url('${cancelledImage}')`,
                            backgroundSize: 'cover',
                            backgroundPosition: 'center',
                            opacity: '0.3',
                            width: '100%',
                            height: '80%'
                        }}>
                        </div>
                    </div>}
                    <div style={{ display: 'grid', gridTemplateColumns: '5fr 1fr 10fr' }}>
                        <span>Order Id</span>
                        <span>:</span>
                        <span>{orderData?.id}</span>
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '5fr 1fr 10fr' }}>
                        <span>Order Date</span>
                        <span>:</span>
                        <span>{moment(orderData?.orderedOn).format('DD-MM-YYYY')}</span>
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '5fr 1fr 10fr' }}>
                        <span>Product Name</span>
                        <span>:</span>
                        <span>{orderData?.productName}</span>
                    </div>
                    {orderData?.couponCode && <div style={{ display: 'grid', gridTemplateColumns: '5fr 1fr 10fr' }}>
                        <span>Coupon Code</span>
                        <span>:</span>
                        <span>{orderData?.couponCode}</span>
                    </div>}
                    <div style={{ display: 'grid', gridTemplateColumns: '5fr 1fr 10fr' }}>
                        <span>Quantity</span>
                        <span>:</span>
                        <span>{orderData?.buyingQuantity || 'Not Found'}</span>
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '5fr 1fr 10fr' }}>
                        <span>Final Amount</span>
                        <span>:</span>
                        <span>{orderData?.finalPrice}</span>
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '5fr 1fr 10fr' }}>
                        <span>Payment Mode</span>
                        <span>:</span>
                        <span>{orderData?.paymentMode}</span>
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '5fr 1fr 10fr' }}>
                        <span>Payment Id</span>
                        <span>:</span>
                        <span>{orderData?.paymentId || 'N/A'}</span>
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '5fr 1fr 10fr' }}>
                        <span>Shipping Address:</span>
                        <span>:</span>
                        <div className="d-flex" style={{ fontSize: '15px', flexDirection: 'column', paddingBottom: '10px' }}>
                            <span style={{ fontSize: '18px', fontWeight: '600' }}>{shippingAddress?.firstName + ' ' + shippingAddress?.lastName}</span>
                            <span>{shippingAddress?.address} - {shippingAddress?.city}</span>
                            <span>{shippingAddress?.state} - {shippingAddress?.pincode}</span>
                            <span>LandMark: {shippingAddress?.landmark}</span>
                        </div>
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '5fr 1fr 10fr' }}>
                        <span>Contact</span>
                        <span>:</span>
                        <span>{shippingAddress?.phoneNumber}</span>
                    </div>
                </div>
                <hr></hr>
                <div>
                    <div>
                        <span className="fw-bold p-2">Track package:</span>
                        <div>
                            {!props?.props?.cancelled ?
                                <div className="row px-3">
                                    <div className="col">
                                        <ul id="progressbar" >
                                            <li className={`${moment() >= moment(orderData?.orderedOn) ? 'active step0' : 'step0'}`} id="step1">PLACED</li>
                                            <li className={`${moment() >= moment(orderData?.orderedOn).add(1, 'days') ? 'active step0 text-center' : 'step0 text-center'}`} id="step2">SHIPPED</li>
                                            <li className={`${moment() >= moment(orderData?.orderedOn).add(2, 'days') ? 'active step0  text-muted text-right' : 'step0  text-muted text-right'}`} id="step3">DELIVERED</li>
                                        </ul>
                                    </div>
                                </div> :
                                <div>
                                </div>}
                        </div>
                    </div>
                    <div style={{ display: 'flex', justifyContent: "center" }}>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', width: '100%' }}>
                            <Button variant="warning" onClick={() => { handleDownloadReceipt(orderData.id) }}>Download Receipt</Button>
                            {(!orderData.cancelled && moment() <= moment(orderData?.orderedOn).add(2, 'days')) ? <Button variant="danger" onClick={() => { cancelOrder({ username: userData.username, orderId: orderData.id }) }}>Cancel</Button> : null}
                            <Button variant="dark" onClick={() => { window.open(`https://mail.google.com/mail/?view=cm&fs=1&tf=1&to=${orderData.sellerContact}`, '_blank') }}>Contact Seller</Button>
                        </div>
                    </div>
                </div>
            </div>
        }
    </>
    )
}

export default ViewOrder