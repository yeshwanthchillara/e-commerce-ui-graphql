import React, { useEffect, useState } from 'react';
import { Card } from 'react-bootstrap';
import Carousel from 'react-bootstrap/Carousel';
import { useNavigate, useParams } from 'react-router-dom';

import { getSearchData } from '../../actions';
import { useDispatch } from 'react-redux';
import { mainSliceActions } from '../../Store/MainSlice';

import UserRatingStars from '../Utils/UserRatingStars';

const SearchResult = () => {
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const [searchProducts, SetSearchProducts] = useState([]);

    const { query } = useParams();

    const searchData = async () => {
        try {
            dispatch(mainSliceActions.showLoadingPage(true))
            SetSearchProducts(await getSearchData(query))
            dispatch(mainSliceActions.showLoadingPage(false))
        } catch (error) {
            dispatch(mainSliceActions.showLoadingPage(false))
        }
    }

    useEffect(() => {
        searchData();
    }, [query])

    const navigateToProduct = (id) => {
        navigate(`/view_product/${id}`)
    }

    const windowWidth = window.innerWidth;

    return (
        <div className='p-2' style={{ minHeight: '88.1vh', backgroundColor: '#E5E5E5', display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <div>
                <div style={{ fontSize: '20px', fontWeight: '600' }}>Showing Results of <span style={{ color: 'red' }}>{query}</span>:</div>
            </div>
            {searchProducts?.length ?
                searchProducts.map((product, index) => {
                    return (window.innerWidth > 992 ? <Card>
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
                            <div className="col-md-8" onClick={() => { navigateToProduct(product.id) }}>
                                <Card.Body>
                                    <Card.Title>{product.productName}</Card.Title>
                                    <Card.Text>{product.description}</Card.Text>
                                    <Card.Text style={{ color: 'red', fontWeight: '1000' }}>Flat {product.discount}% Discount</Card.Text>
                                    <Card.Text id={`productPrice${index}`} style={{ fontWeight: '600' }}>
                                        Special Price: &#8377; {(Number(product.price) - ((Number(product.price) / 100) * Number(product.discount)))} <s style={{ fontSize: '12px' }}>{product.price}</s>
                                    </Card.Text>
                                </Card.Body>
                            </div>
                        </div>
                    </Card> : <>
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
                        </Card>
                    </>)
                }) :
                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '88.1vh', flexDirection: 'column' }}>
                    <span style={{ fontSize: '30px', fontWeight: '600' }}>No Products found &#128532;</span>
                    <span style={{ color: 'blue', padding: '10px', cursor: 'pointer' }} onClick={() => { navigate('/') }}>Continue Shopping</span>
                </div>}
        </div>
    );
}

export default SearchResult;