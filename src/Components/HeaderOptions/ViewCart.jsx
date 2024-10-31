import React, { useEffect, useState } from 'react';
import { Card, Col } from 'react-bootstrap';
import Carousel from 'react-bootstrap/Carousel';
import { Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useDispatch, useSelector } from 'react-redux';

import { getCartData, manageProductQuantity, removeProductFromCart } from '../../actions';
import { mainSliceActions } from '../../Store/MainSlice';


const ViewCart = () => {
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const [cartProducts, SetCartProducts] = useState([]);

    //user Data
    const userData = useSelector(state => state.mainSlice.userData)

    //Login Status
    const loginStatus = useSelector(state => state.mainSlice.loginStatus)

    const getcartData = async () => {
        try {
            dispatch(mainSliceActions.showLoadingPage(true))
            SetCartProducts(await getCartData(userData.username))
            dispatch(mainSliceActions.showLoadingPage(false))
        } catch (error) {
            dispatch(mainSliceActions.showLoadingPage(false))
        }
    }

    useEffect(() => {
        getcartData();
    }, [])

    const navigateToProduct = (id) => {
        navigate(`/view_product/${id}`)
    }

    const handleProductQuantity = async (productId, productQuantity) => {
        const productData = { productId, update: productQuantity };
        manageProductQuantity(productData)
    }

    const removeProduct = async (productId) => {
        const productData = { productId, username: userData.username };
        await removeProductFromCart(productData)
        await getcartData()
    }

    const handleProceedToCheckout = () => {
        navigate('/checkout_page')
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
        <div className='bg-light p-2' style={{ minHeight: '88.1vh' }}>
            {windowWidth > 992 ? <>{cartProducts?.length ?
                <div className='d-flex justify-content-between'>
                    <div style={{ fontSize: '30px', fontWeight: '600' }}>Showing Cart:</div>
                    <Button style={{ backgroundColor: 'gold', color: 'black', float: 'right' }} onClick={handleProceedToCheckout} size='md'>Proceed to Checkout All Items ({cartProducts?.length})</Button>
                </div> : null}
                {cartProducts?.length ?
                    cartProducts.map((product, index) => {
                        return <Card className='mx-5 my-3'>
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
                                        <Card.Text id={`productPrice${index}`} style={{ fontWeight: '600' }}>
                                            Special Price: &#8377; {(Number(product.price) - ((Number(product.price) / 100) * Number(product.discount))) * product.quantity} <s style={{ fontSize: '12px' }}>{product.price * product.quantity}</s>
                                        </Card.Text>
                                    </Card.Body>
                                </div>
                                <div className="col-md-3" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-evenly' }}>
                                    <div style={{ height: '40px' }}>
                                        <Button
                                            style={{ backgroundColor: 'grey', color: 'black', width: '6vh' }}
                                            size='sm'
                                            onClick={() => {
                                                const inputElement = document.getElementById(`productQuantity${index}`);
                                                const productPrice = document.getElementById(`productPrice${index}`)
                                                const currentQuantity = parseInt(inputElement.value, 10);
                                                if (currentQuantity > 1) {
                                                    inputElement.value = currentQuantity - 1;
                                                    productPrice.innerHTML = `Special Price: &#8377; ${(Number(product.price) - ((Number(product.price) / 100) * Number(product.discount))) * inputElement.value} <s style={{ fontSize: '12px' }}>${product.price * inputElement.value}</s>`
                                                    handleProductQuantity(product.id, currentQuantity - 1)
                                                } else {
                                                    toast.error("Can't be 0");
                                                }
                                            }}
                                        >
                                            -
                                        </Button>
                                        <input
                                            value={product.quantity}
                                            id={`productQuantity${index}`}
                                            disabled
                                            style={{ textAlign: 'center', width: '8vh', margin: '5px', height: '35px' }}
                                        />
                                        <Button
                                            style={{ backgroundColor: 'grey', color: 'black', width: '6vh' }}
                                            size='sm'
                                            onClick={() => {
                                                const inputElement = document.getElementById(`productQuantity${index}`);
                                                const productPrice = document.getElementById(`productPrice${index}`)
                                                const currentQuantity = parseInt(inputElement.value, 10);
                                                if (currentQuantity < 5) {
                                                    inputElement.value = currentQuantity + 1;
                                                    productPrice.innerHTML = `Special Price: &#8377; ${(Number(product.price) - ((Number(product.price) / 100) * Number(product.discount))) * inputElement.value} <s style={{ fontSize: '12px' }}>${product.price * inputElement.value}</s>`
                                                    handleProductQuantity(product.id, currentQuantity + 1)
                                                } else {
                                                    toast.error("Can't set more than 5");
                                                }
                                            }}
                                        >
                                            +
                                        </Button>
                                    </div>
                                    <div><Button style={{ backgroundColor: 'gold', color: 'black', width: '30vh' }} onClick={() => handleBuyNow(product.id)} size='md'>Buy Now</Button></div>
                                    <div><Button style={{ backgroundColor: '#E5E5E5', color: 'black', width: '30vh' }} size='md' onClick={() => { removeProduct(product.id) }}>Remove from Cart</Button></div>
                                </div>
                            </div>
                        </Card>
                    }) :
                    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '88.1vh', flexDirection: 'column' }}>
                        <span style={{ fontSize: '30px', fontWeight: '600' }}>Your Shopping Cart is Empty &#128532;</span>
                        <span style={{ color: 'blue', padding: '10px', cursor: 'pointer' }} onClick={() => { navigate('/') }}>Continue Shopping</span>
                    </div>}
            </> : <>
                {cartProducts?.length ? <>
                    <div className='d-flex flex-column' style={{ gap: '1rem' }}>
                        <div className='fs-5 fw-bold'>Showing Cart:</div>
                        <Button variant="btn btn-outline-dark" className='fs-6' onClick={handleProceedToCheckout} size='md'>Proceed to Checkout All Items ({cartProducts?.length})</Button>
                    </div>
                    {cartProducts.map((product, index) => {
                        return (<>
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
                                            <Card.Text id={`productPrice${index}`} className={'fs-6 fw-bold'}>&#8377; {Number(product.price) - ((Number(product.price) / 100) * Number(product.discount))} <s style={{ fontSize: windowWidth > 992 ? '' : '12px' }}>{product.price}</s></Card.Text>
                                        </div>
                                    </div>
                                </Card.Body>
                                <div style={{ gridColumn: '1/3' }}>
                                    <div className='d-grid' style={{ gridTemplateColumns: '1fr 1fr 1fr' }}>
                                        <Button
                                            variant='btn btn-outline-danger'
                                            size='sm'
                                            onClick={() => {
                                                const inputElement = document.getElementById(`productQuantity${index}`);
                                                const productPrice = document.getElementById(`productPrice${index}`)
                                                const currentQuantity = parseInt(inputElement.value, 10);
                                                if (currentQuantity > 1) {
                                                    inputElement.value = currentQuantity - 1;
                                                    productPrice.innerHTML = `<div style={{ fontSize: '16px', fontWeight: 'bold' }}>
                                                        &#8377; ${(Number(product.price) - ((Number(product.price) / 100) * Number(product.discount))) * inputElement.value}
                                                        <s style="font-size:12px">
                                                            ${Number(product.price * inputElement.value)}
                                                        </s>
                                                    </div>`

                                                    handleProductQuantity(product.id, currentQuantity - 1)
                                                } else {
                                                    toast.error("Can't be 0");
                                                }
                                            }}
                                        >
                                            -
                                        </Button>
                                        <input
                                            value={product.quantity}
                                            id={`productQuantity${index}`}
                                            disabled
                                            className='text-center mx-2'
                                        />
                                        <Button
                                            variant='btn btn-outline-success'
                                            size='sm'
                                            onClick={() => {
                                                const inputElement = document.getElementById(`productQuantity${index}`);
                                                const productPrice = document.getElementById(`productPrice${index}`)
                                                const currentQuantity = parseInt(inputElement.value, 10);
                                                if (currentQuantity < 5) {
                                                    inputElement.value = currentQuantity + 1;
                                                    productPrice.innerHTML = `<div style={{ fontSize: '16px', fontWeight: 'bold' }}>
                                                    &#8377; ${(Number(product.price) - ((Number(product.price) / 100) * Number(product.discount))) * inputElement.value}
                                                        <s style="font-size:12px">
                                                            ${Number(product.price * inputElement.value)}
                                                        </s>
                                                    </div>`
                                                    handleProductQuantity(product.id, currentQuantity + 1)
                                                } else {
                                                    toast.error("Can't set more than 5");
                                                }
                                            }}
                                        >
                                            +
                                        </Button>
                                    </div>
                                    <div><Button className='w-100 my-1' style={{ backgroundColor: 'gold', color: 'black' }} onClick={() => handleBuyNow(product.id)} size='md'>Buy Now</Button></div>
                                    <div><Button className='w-100' style={{ backgroundColor: '#E5E5E5', color: 'black' }} onClick={() => { removeProduct(product.id) }}>Remove from Cart</Button></div>
                                </div>
                            </Card>
                        </>
                        )
                    })}
                </> : <>
                    <div className='d-flex justify-content-center flex-column align-items-center my-5'>
                        <span style={{ fontSize: '20px', fontWeight: '600' }}>Your Shopping Cart is Empty &#128532;</span>
                        <span style={{ color: 'blue', padding: '10px', cursor: 'pointer' }} onClick={() => { navigate('/') }}>Continue Shopping</span>
                    </div>
                </>}
            </>}
        </div>
    );
}

export default ViewCart;