import React, { useEffect, useState } from 'react';
import { Card } from 'react-bootstrap';
import Carousel from 'react-bootstrap/Carousel';
import { Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

import { getWishlistData, addToCart, removeProductFromWishlist } from '../../actions';
import { mainSliceActions } from '../../Store/MainSlice';


const ViewWishlist = () => {
    const navigate = useNavigate()
    const dispatch = useDispatch();

    const [wishlistProducts, SetWishlistProducts] = useState([]);

    //Login Status
    const loginStatus = useSelector(state => state.mainSlice.loginStatus)

    //user Data
    const userData = useSelector(state => state.mainSlice.userData)

    const setWishlistData = async () => {
        try {
            dispatch(mainSliceActions.showLoadingPage(true))
            SetWishlistProducts(await getWishlistData())
            dispatch(mainSliceActions.showLoadingPage(false))
        } catch (error) {
            dispatch(mainSliceActions.showLoadingPage(false))
        }
    }

    useEffect(() => {
        setWishlistData();
    }, [])

    const navigateToProduct = (id) => {
        navigate(`/view_product/${id}`)
    }

    const handleAddToCart = async (productId) => {
        if (loginStatus) {
            const AddProduct = { id: productId, username: userData.username };
            addToCart(AddProduct)
        } else {
            navigate('/login')
        }
    }

    const handleRemoveFromWIshlist = async (productId) => {
        const productData = { productId, username: userData.username };
        await removeProductFromWishlist(productData)
        await setWishlistData()
    }

    const handleBuyNow = async (productId) => {
        if (loginStatus) {
            navigate(`/book_now/${productId}`)
        } else {
            navigate('/login')
        }
    }

    const windowWidth = window.innerWidth;

    return (
        <div className='p-2' style={{ minHeight: '88.1vh', backgroundColor: '#E5E5E5', display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {wishlistProducts?.length ?
                <div>
                    <div style={{ fontSize: '20px', fontWeight: '600' }}>Showing WishList:</div>
                </div> : null}
            {wishlistProducts?.length ?
                wishlistProducts.map((product, index) => {
                    return (windowWidth > 992 ? (<Card>
                        <div className="row no-gutters">
                            <div className="col-md-3" onClick={() => { navigateToProduct(product.id) }}>
                                <Carousel fade>
                                    {product.images.map(imgUrl => {
                                        return (
                                            <Carousel.Item onClick={() => { navigateToProduct(product.id) }} style={{ marginLeft: '30px' }}>
                                                <Card.Img variant="top" src={imgUrl}
                                                    style={{
                                                        width: '300px',
                                                        height: '200px',
                                                        maxWidth: "300px",
                                                        maxHeight: "200px",
                                                        objectFit: "contain",
                                                    }} />
                                            </Carousel.Item>
                                        )
                                    })}
                                </Carousel>
                            </div>
                            <div className="col-md-6" onClick={() => { navigateToProduct(product.id) }}>
                                <Card.Body>
                                    <Card.Title>{product.productName}</Card.Title>
                                    <Card.Text>{product.description}</Card.Text>
                                    <Card.Text style={{ color: 'red', fontWeight: '1000' }}>Flat {product.discount}% Discount</Card.Text>
                                    <Card.Text style={{ fontWeight: '600' }}>Special Price: &#8377; {Number(product.price) - ((Number(product.price) / 100) * Number(product.discount))} <s style={{ fontSize: '12px' }}>{product.price}</s></Card.Text>
                                </Card.Body>
                            </div>
                            <div className="col-md-3" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-evenly' }}>
                                <div><Button style={{ backgroundColor: 'gold', color: 'black', width: '30vh' }} size='md' onClick={() => { handleBuyNow(product.id) }}>Buy Now</Button></div>
                                <div><Button style={{ backgroundColor: '#E5E5E5', color: 'black', width: '30vh' }} size='md' onClick={() => { handleAddToCart(product.id) }}>Add to Cart</Button></div>
                                <div><Button style={{ backgroundColor: '#E5E5E5', color: 'black', width: '30vh' }} size='md' onClick={() => { handleRemoveFromWIshlist(product.id) }}>Remove From WishList</Button></div>
                            </div>
                        </div>
                    </Card>) : <>
                        <Card className='cursor-pointer d-grid my-1 flex-row' style={{ gridTemplateColumns: '1fr 1fr', gap: '0.25rem' }}>
                            <Card.Header>
                                <Carousel fade>
                                    {product.images.map(imgUrl => {
                                        return (
                                            <Carousel.Item onClick={() => { navigateToProduct(product.id) }} interval={3000}>
                                                <Card.Img src={imgUrl}
                                                    style={{
                                                        width: '10rem',
                                                        height: '8rem',
                                                        objectFit: "contain",
                                                    }} />
                                            </Carousel.Item>
                                        )
                                    })}
                                </Carousel>
                            </Card.Header>
                            <Card.Body className="px-0" onClick={() => { navigateToProduct(product.id) }} style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-evenly' }}>
                                <div style={{ marginBottom: windowWidth < 992 ? '' : '10px' }}>
                                    <Card.Title className={`${windowWidth < 992 ? 'fs-6' : ''} mb-0`} style={{ fontWeight: '600' }}>{product.productName}</Card.Title>
                                    <Card.Text className={`${windowWidth < 992 ? 'd-none' : ''} mb-0`}>{product.description}</Card.Text>
                                </div>
                                <div>
                                    <div class="d-flex justify-content-start align-items-center">
                                        {product?.userRating > 0 ? <UserRatingStars product={product} /> : <>No Reviews</>}
                                    </div>
                                    <div className='d-flex'>
                                        <Card.Text className={`${windowWidth < 992 ? 'fs-6' : ''} mb-0 mr-1 fw-bold`} style={{ color: 'red' }}>-{product.discount}%</Card.Text>
                                        <Card.Text className={'fs-6 fw-bold'}>&#8377; {Number(product.price) - ((Number(product.price) / 100) * Number(product.discount))} <s style={{ fontSize: windowWidth > 992 ? '' : '12px' }}>{product.price}</s></Card.Text>
                                    </div>
                                </div>
                            </Card.Body>
                            <div><Button className='w-100 my-1' style={{ backgroundColor: 'gold', color: 'black' }} onClick={() => { handleBuyNow(product.id) }}>Buy Now</Button></div>
                            <div><Button className='w-100 my-1' style={{ backgroundColor: '#E5E5E5', color: 'black' }} onClick={() => { handleAddToCart(product.id) }}>Add to Cart</Button></div>
                            <div style={{ gridColumn: '1/3' }}>
                                <div><Button className='w-100 my-1' style={{ backgroundColor: '#E5E5E5', color: 'black' }} onClick={() => { handleRemoveFromWIshlist(product.id) }}>Remove from wishlist</Button></div>
                            </div>
                        </Card>
                    </>)
                }) :
                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '88.1vh', flexDirection: 'column' }}>
                    <span style={{ fontSize: '20px', fontWeight: '600' }}>Your Wishlist is Empty &#128532;</span>
                    <span style={{ color: 'blue', padding: '10px', cursor: 'pointer' }} onClick={() => { navigate('/') }}>Continue Shopping</span>
                </div>}
        </div>
    );
}

export default ViewWishlist;