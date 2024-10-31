import { React, useEffect, useState } from 'react';
import { Button } from 'react-bootstrap';
import { useNavigate, useParams } from 'react-router-dom';
import Carousel from 'react-bootstrap/Carousel';
import { useDispatch, useSelector } from 'react-redux';

import { getProduct, userRatingToProduct, addToCart, addProductToWishlist } from '../../actions';
import { mainSliceActions } from '../../Store/MainSlice';

import oopsPageNotFound from '../../assets/oopsPageNotFound.jpg'
import CategoryProductCards from './CategoryProductCards';

import { Col, Row } from 'react-bootstrap';
import UserRatingStars from '../Utils/UserRatingStars';

const ViewProduct = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const [rating, setRating] = useState(0);
    const [review, setReview] = useState('');
    const [productData, setProductData] = useState({});
    const [showProductNotFound, setShowProductNotFound] = useState(false);

    //Login Status
    const loginStatus = useSelector(state => state.mainSlice.loginStatus)
    //user Data
    const userData = useSelector(state => state.mainSlice.userData)

    const { id } = useParams();

    useEffect(() => {
        const getProductData = async (productId) => {
            try {
                dispatch(mainSliceActions.showLoadingPage(true));
                const data = await getProduct(productId);
                setProductData(data);
                dispatch(mainSliceActions.showLoadingPage(false));
                setShowProductNotFound(false);
            } catch (error) {
                console.error('Error fetching product data:', error);
                dispatch(mainSliceActions.showLoadingPage(false));
                setShowProductNotFound(true);
            }
        };

        if (id) {
            getProductData(id);
        }
    }, [id, dispatch]);

    // user Rating
    const handleRateProduct = async () => {
        try {
            const ratingData = { id: productData.id, starRating: rating, review }
            if (loginStatus && rating != 0 && productData.id) {
                const res = await userRatingToProduct(ratingData)
                if (res) {
                    setRating(0);
                    setReview('');
                    setProductData({ ...productData, reviews: [...productData?.reviews, res] })
                }
            }
        } catch (error) {
            console.log('Error: ' + error)
        }
    }

    // Add to Cart
    const handleAddToCart = () => {
        if (loginStatus) {
            const AddProduct = { id: productData.id, username: userData.username };
            addToCart(AddProduct)
        } else {
            navigate('/login')
        }
    }

    const contactSellerBtnClicked = (sellerEmail) => {
        window.open(`https://mail.google.com/mail/?view=cm&fs=1&tf=1&to=${sellerEmail}`, '_blank')
    }

    const handleAddToWishlist = () => {
        if (loginStatus) {
            const AddProduct = { id: productData.id, username: userData.username };
            addProductToWishlist(AddProduct)
        } else {
            navigate('/login')
        }
    }

    const handleBuyNow = async (productId) => {
        if (loginStatus) {
            navigate(`/book_now/${productId}`)
        } else {
            navigate('/login')
        }
    }

    return (
        <>
            {productData?.id && window.innerWidth > 992 ?
                <div style={{ minHeight: '87.5vh', backgroundColor: 'white' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', padding: '25px' }}>
                        <div>
                            <Carousel fade style={{ border: 'solid black 2px', borderRadius: '10px', margin: '15px' }}>
                                {productData.images.map((imgUrl, index) => {
                                    return (
                                        <Carousel.Item key={index}>
                                            <img variant="top" src={imgUrl} onClick={() => { window.open(imgUrl, '_blank') }}
                                                style={{
                                                    width: '100%',
                                                    display: 'block',
                                                    height: '65vh',
                                                    maxWidth: "100%",
                                                    maxHeight: "65vh",
                                                    objectFit: 'contain'
                                                }} />
                                        </Carousel.Item>
                                    )
                                })}
                            </Carousel>
                        </div>
                        <div style={{ padding: '15px' }}>
                            <div style={{ margin: '20px' }}>
                                <h3>
                                    <b>{productData.productName}</b>
                                </h3>
                            </div>
                            <div style={{ margin: '20px' }}>
                                <h6>{productData.description}</h6>
                            </div>
                            <div style={{ margin: '20px', display: ' grid', gridTemplateColumns: '1fr 1fr 1fr' }}>
                                <div>
                                    <div style={{ paddingTop: '20px' }}>
                                        <div style={{ backgroundColor: "#ADD8E6", padding: '5px', width: '180px', borderRadius: '10px', textAlign: 'center' }}>
                                            Inventory Stock : {productData.inventoryStock}
                                        </div>
                                        <div style={{ backgroundColor: "#FFCCCB", padding: '5px', marginTop: '10px', width: '180px', borderRadius: '10px', textAlign: 'center' }}>
                                            Discount : {productData.discount}%
                                        </div>
                                        <div>
                                            <div style={{ display: 'flex', fontSize: '25px', marginTop: '10px', gap: '10px' }}>
                                                <b>Price: {Number(productData.price) - ((Number(productData.price) / 100) * Number(productData.discount))}/-</b>
                                                <s style={{ fontSize: '16px', marginTop: '10px' }}>{productData.price}</s>
                                            </div>
                                            <div style={{}}>
                                                <p style={{ textAlign: 'right', fontSize: '13px', marginRight: '40px' }}>(Incl. of All Taxes)</p>
                                            </div>
                                        </div>
                                    </div>
                                    <div className='TechSpecs' style={{ marginTop: '20px' }}>
                                        <h5><b>Technical Specifications:</b></h5>
                                        <div style={{ display: 'grid', gridTemplateColumns: '4fr 1fr 5fr' }}>
                                            {productData.techSpecifications.map((spec, index) => {
                                                return (
                                                    <>
                                                        <h6>{spec.key}</h6>
                                                        <h6>:</h6>
                                                        <h6>{spec.value}</h6>
                                                    </>
                                                )
                                            })}
                                        </div>
                                    </div>
                                </div>
                                <div>
                                    <div style={{ display: 'flex', gap: '20px', alignContent: 'center', alignItems: 'center' }}>
                                        <div><b>User Ratings:</b></div>
                                        <div>
                                            {[...Array(5)].map((star, index) => {
                                                return (
                                                    <span key={index} style={{ color: Math.abs(productData.userRating) >= index + 1 ? 'RED' : 'grey', fontSize: '30px' }}>&#9733;</span>
                                                );
                                            })}
                                        </div>
                                    </div>
                                    {loginStatus && <>
                                        <div>
                                            <div><b>Add Review:</b></div>
                                            <div className="star-rating">
                                                {[...Array(5)].map((star, index) => {
                                                    index += 1;
                                                    return (
                                                        <button
                                                            type="button"
                                                            key={index}
                                                            className={index <= rating ? "on" : "off"}
                                                            onClick={() => setRating(index)}
                                                            style={{ fontSize: '30px' }}
                                                        >
                                                            <span className="star">&#9733;</span>
                                                        </button>
                                                    );
                                                })}
                                            </div>
                                            <div>
                                                <textarea value={review} onChange={(e) => { setReview(e.target.value) }} style={{ width: '90%', height: '12.8vh' }}></textarea>
                                            </div>
                                        </div>
                                        <div>
                                            <Button onClick={handleRateProduct} style={{ backgroundColor: 'gold', color: 'black' }} size='sm'>Submit Review</Button>
                                        </div>
                                    </>}
                                </div>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', alignItems: 'center' }}>
                                    <div><Button style={{ backgroundColor: 'gold', color: 'black', width: '30vh' }} size='md' onClick={() => { handleBuyNow(productData.id) }}>Buy Now</Button></div>
                                    <div><Button style={{ backgroundColor: 'gold', color: 'black', width: '30vh' }} onClick={handleAddToCart} size='md'>Add to Cart</Button></div>
                                    <div><Button style={{ backgroundColor: 'gold', color: 'black', width: '30vh' }} onClick={handleAddToWishlist} size='md'>Add to Wishlist</Button></div>
                                    <div><Button style={{ backgroundColor: 'gold', color: 'black', width: '30vh' }} onClick={() => { contactSellerBtnClicked(productData.sellerContact) }} size='md'>Contact Seller</Button></div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div>
                        <div style={{ backgroundColor: 'bisque', borderRadius: '20px', padding: '25px', height: '30vh', overflowY: 'scroll', margin: '20px' }}>
                            <div>
                                <b>User Reviews:</b>
                            </div>
                            <div style={{ padding: '10px', borderRadius: '5px' }}>
                                {productData.reviews.length > 0 ?
                                    <>
                                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 3fr 2fr', alignItems: 'center', textAlign: 'start' }}>
                                            {productData.reviews.map(review => {
                                                return <>
                                                    <b>{review.user}:</b>
                                                    <div>{review.review}</div>
                                                    <div>
                                                        {[...Array(5)].map((star, index) => {
                                                            return (
                                                                <span key={index} style={{ color: Math.abs(Number(review.rating)) >= index + 1 ? 'RED' : 'grey', fontSize: '30px' }}>&#9733;</span>
                                                            );
                                                        })}
                                                    </div>
                                                </>
                                            })}
                                        </div>
                                    </> :
                                    <div style={{ display: 'flex', justifyContent: 'center' }}>
                                        <b>No Reviews Yet</b>
                                    </div>
                                }
                            </div>
                        </div>
                    </div>
                    <div style={{ padding: '10px' }}>
                        <div style={{ padding: '25px' }}>
                            <b>Suggessted Products</b>
                        </div>
                        <>
                            <CategoryProductCards category={productData.productType} />
                        </>
                    </div>
                </div> : <></>}
            {productData?.id && window.innerWidth < 992 && <Col className='bg-light m-0'>
                <Row className='my-1' style={{ paddingTop: '0.25rem !important' }}>
                    <Carousel fade style={{ border: 'solid grey 1px', borderRadius: '1em' }}>
                        {productData.images.map((imgUrl, index) => {
                            return (
                                <Carousel.Item key={index}>
                                    <img variant="top" src={imgUrl}
                                        style={{
                                            width: '100%',
                                            display: 'block',
                                            height: '35vh',
                                            maxWidth: "100%",
                                            maxHeight: "35vh",
                                            objectFit: 'contain'
                                        }} />
                                </Carousel.Item>
                            )
                        })}
                    </Carousel>
                </Row>
                <Row>
                    <Row xs={12} className='py-2'>
                        <Col xs={8}>
                            <b>{productData.productName}</b>
                        </Col>
                        <Col xs={3}>
                            <UserRatingStars product={productData} />
                        </Col>
                    </Row>
                    <Col style={{ textAlign: 'justify' }}>
                        <h6>{productData.description}</h6>
                    </Col>
                </Row>
                <Row xs={12}>
                    <Col className='m-1 p-2 text-center text-light fw-bold' style={{ backgroundColor: "grey", borderRadius: '1rem' }}>
                        Inventory Stock : {productData.inventoryStock}
                    </Col>
                    <Col className='m-1 p-2 text-center text-light fw-bold' style={{ backgroundColor: "grey", borderRadius: '1rem' }}>
                        Discount : {productData.discount}%
                    </Col>
                    <Row className='d-grid'>
                        <div style={{ display: 'flex', fontSize: '25px', marginTop: '10px', gap: '10px' }}>
                            <b>Price: {Number(productData.price) - ((Number(productData.price) / 100) * Number(productData.discount))}/-</b>
                            <s style={{ fontSize: '16px', marginTop: '10px' }}>{productData.price}</s>
                        </div>
                        <div className='text-center'>
                            <p>(Incl. of All Taxes)</p>
                        </div>
                    </Row>
                </Row>
                <div className='d-flex justify-content-center p-0 m-0'>
                    <hr className='w-75 p-0 m-0'></hr>
                </div>
                <Row>
                    <div className='TechSpecs' style={{ marginTop: '20px' }}>
                        <h5><b>Technical Specifications:</b></h5>
                        <div style={{ display: 'grid', gridTemplateColumns: '4fr 1fr 5fr' }}>
                            {productData.techSpecifications.map((spec, index) => {
                                return (
                                    <>
                                        <h6>{spec.key}</h6>
                                        <h6>:</h6>
                                        <h6>{spec.value}</h6>
                                    </>
                                )
                            })}
                        </div>
                    </div>
                </Row>
                <div className='d-flex justify-content-center p-0 m-0'>
                    <hr className='w-75 py-1 m-0'></hr>
                </div>
                <Row className='m-0 d-grid' style={{ justifyItems: 'center' }}>
                    <Row><Button className='my-1' style={{ backgroundColor: 'gold', color: 'black' }} onClick={() => { handleBuyNow(productData.id) }}>Buy Now</Button></Row>
                    <Row><Button className='my-1' style={{ backgroundColor: 'gold', color: 'black' }} onClick={handleAddToCart} size='md'>Add to Cart</Button></Row>
                    <Row><Button className='my-1' style={{ backgroundColor: 'gold', color: 'black' }} onClick={handleAddToWishlist} size='md'>Add to Wishlist</Button></Row>
                    <Row><Button className='my-1' style={{ backgroundColor: 'gold', color: 'black' }} onClick={() => { contactSellerBtnClicked(productData.sellerContact) }} size='md'>Contact Seller</Button></Row>
                </Row>
                <div className='d-flex justify-content-center py-3 m-0'>
                    <hr className='w-75 m-0'></hr>
                </div>
                <Row className={`${!loginStatus && 'd-none'} p-1`}>
                    {loginStatus && <>
                        <div>
                            <h5 className='fw-bold'>Add Review:</h5>
                            <div>
                                {[...Array(5)].map((star, index) => {
                                    index += 1;
                                    return (
                                        <button
                                            type="button"
                                            key={index}
                                            className={index <= rating ? "on" : "off"}
                                            onClick={() => setRating(index)}
                                            style={{ fontSize: '30px' }}
                                        >
                                            <span className="star">&#9733;</span>
                                        </button>
                                    );
                                })}
                            </div>
                            <div>
                                <textarea className="w-100" value={review} onChange={(e) => { setReview(e.target.value) }} style={{ height: '12.8vh' }}></textarea>
                            </div>
                        </div>
                        <div className='d-flex justify-content-end'>
                            <Button onClick={handleRateProduct} style={{ backgroundColor: 'gold', color: 'black' }} size='sm'>Submit Review</Button>
                        </div>
                    </>}
                </Row>
                <div className={!productData?.reviews?.length ? 'd-none' : 'd-flex justify-content-center py-3 m-0'}>
                    <hr className='w-75 m-0'></hr>
                </div>
                <Row className={!productData?.reviews?.length && 'd-none'}>
                    <div className='p-3 my-1' style={{ backgroundColor: 'grey', borderRadius: '20px', overflowY: 'scroll' }}>
                        <div>
                            <b>User Reviews:</b>
                        </div>
                        <div style={{ borderRadius: '5px', overflowY: 'scroll', height: '15rem', }}>
                            {productData.reviews.length > 0 ?
                                <>
                                    <div className='p-0'>
                                        {productData.reviews.map(review => {
                                            return <div className='bg-light bg-gradient bg-opacity-50 px-2 my-1' style={{ borderRadius: '1rem' }}>
                                                <div className='d-flex align-items-center justify-content-between'>
                                                    <b>{review.user}:</b>
                                                    <div>
                                                        {[...Array(5)].map((star, index) => {
                                                            return (
                                                                <span key={index} style={{ color: Math.abs(Number(review.rating)) >= index + 1 ? 'RED' : 'grey', fontSize: '30px' }}>&#9733;</span>
                                                            );
                                                        })}
                                                    </div>
                                                </div>
                                                <div className='d-flex justify-content-end'>
                                                    <p style={{ fontSize: '0.95rem' }}>{review.review}</p>
                                                </div>
                                            </div>
                                        })}
                                    </div>
                                </> :
                                <div style={{ display: 'flex', justifyContent: 'center' }}>
                                    <b>No Reviews Yet</b>
                                </div>
                            }
                        </div>
                    </div>
                </Row>
                <div className='d-flex justify-content-center py-3 m-0'>
                    <hr className='w-75 m-0'></hr>
                </div>
                <Row className='m-0 p-0 w-100'>
                    <div className='p-0 m-0'>
                        <b>Suggessted Products</b>
                    </div>
                    <div className='p-0 m-0'>
                        <CategoryProductCards category={productData.productType} />
                    </div>
                </Row>
            </Col>}
            {showProductNotFound && <img src={oopsPageNotFound} style={{ width: '98.9vw' }} />}
        </>
    )
}

export default ViewProduct