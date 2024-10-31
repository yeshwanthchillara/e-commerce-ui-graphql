import React, { useEffect, useState } from 'react';
import Carousel from 'react-bootstrap/Carousel';
import Card from 'react-bootstrap/Card';
import { getAllProducts } from '../../actions';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { mainSliceActions } from '../../Store/MainSlice';
import { Row, Col } from 'react-bootstrap';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar } from '@fortawesome/free-solid-svg-icons';
import noFillStar from '../../assets/star-no-fill.svg'
import UserRatingStars from '../Utils/UserRatingStars';

const ProductCard = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [productData, setProductData] = useState([]);
    const [windowWidth, setWindowWidth] = useState(window.innerWidth);

    useEffect(() => {
        const getProductData = async () => {
            try {
                dispatch(mainSliceActions.showLoadingPage(true));
                setProductData(await getAllProducts());
                dispatch(mainSliceActions.showLoadingPage(false));
            } catch (error) {
                console.error('Error fetching product data:', error);
                dispatch(mainSliceActions.showLoadingPage(false));
            }
        }
        getProductData();

        // Function to update windowWidth state with current window width
        const updateWindowWidth = () => {
            setWindowWidth(window.innerWidth);
        };

        // Add event listener to resize event
        window.addEventListener('resize', updateWindowWidth);

        // Remove event listener on component unmount
        return () => {
            window.removeEventListener('resize', updateWindowWidth);
        };
    }, [])

    const navigateToProduct = (id) => {
        navigate(`/view_product/${id}`)
    }

    return (
        <>
            < div className='d-flex justify-content-start text-start text-light w-100 p-1' > Latest on Placart</div >
            {windowWidth < 992 ? <div className='d-flex align-items-center justify-content-center flex-column w-100'>
                {productData?.length && productData.map(product => {
                    return (
                        <Card className='cursor-pointer d-grid my-1 flex-row' style={{ gridTemplateColumns: '1fr 1fr', gap: '0.25rem', width: '95%' }}>
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
                        </Card>
                    )
                })}
            </div > : <div className='d-flex align-items-center justify-content-center flex-column w-100'>
                <Row md={12} className='w-100 m-2 mx-4'>
                    {productData?.length && productData.map(product => {
                        return (
                            <Col md={2} as={Card} className='cursor-pointer m-2' style={{ width: '16.4rem', gap: '0.25rem' }}>
                                <Card.Header>
                                    <Carousel fade>
                                        {product.images.map(imgUrl => {
                                            return (
                                                <Carousel.Item onClick={() => { navigateToProduct(product.id) }} interval={3000} className=' d-flex justify-content-center'>
                                                    <Card.Img src={imgUrl}
                                                        style={{
                                                            width: '12rem',
                                                            height: '10rem',
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
                                    </div>
                                    <div>
                                        <div class="d-flex justify-content-start align-items-center">
                                            {product?.userRating > 0 ?
                                                <UserRatingStars product={product} />
                                                : <>No Reviews</>
                                            }
                                        </div>
                                        <Card.Text className={`${windowWidth < 992 ? 'fs-6' : 'fw-bold'} mb-0`} style={{ color: 'red' }}>Flat {product.discount}% Discount</Card.Text>
                                        <Card.Text className={windowWidth < 992 ? 'fs-6' : 'fw-bold'}>SP: &#8377; {Number(product.price) - ((Number(product.price) / 100) * Number(product.discount))} <s style={{ fontSize: windowWidth > 992 ? '' : '12px' }}>{product.price}</s></Card.Text>
                                    </div>
                                </Card.Body>
                            </Col>
                        )
                    })}
                </Row>
            </div>}
        </>
    );
}

export default ProductCard

