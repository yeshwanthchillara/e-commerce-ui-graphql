import React, { useEffect, useMemo, useState } from 'react';
import Carousel from 'react-bootstrap/Carousel';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import { getAllProducts } from '../../actions';
import notFoundImage from '../../assets/notfound.jpg'
import { useNavigate, useParams } from 'react-router-dom';
import { Row, Col } from 'react-bootstrap'
import UserRatingStars from '../Utils/UserRatingStars';

const CategoryProductCards = (props) => {
    const navigate = useNavigate();
    const [productData, setProductData] = useState([]);
    const { id } = useParams()

    useEffect(() => {
        const { category } = props

        const getProductData = async () => {
            const data = await getAllProducts(category);
            console.log(data)
            setProductData(data.filter(p => p.id !== parseInt(id)))
        }
        getProductData();
    }, [id])

    const navigateToProduct = (id) => {
        navigate(`/view_product/${id}`)
    }

    const windowWidth = window.innerWidth

    return (
        <>
            {windowWidth < 992 ? <>
                <div className='d-flex align-items-center justify-content-center flex-column w-100 p-0'>
                    {productData?.length ? productData.map(product => {
                        return (
                            <Card className='cursor-pointer d-grid my-1 flex-row' style={{ gridTemplateColumns: '1fr 1fr', gap: '0.25rem', width: '100%' }}
                                onClick={() => {
                                    // make window go back to top
                                    window.scrollTo({
                                        top: 0,
                                        left: 0,
                                        behavior: 'smooth'
                                    });
                                    return navigateToProduct(product.id)
                                }}>
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
                    }) :
                        <div className='w-100'>
                            <span className='d-flex' style={{ justifyContent: 'center', padding: '2rem', fontSize: '1.5rem', fontWeight: '500', textAlign: 'center' }}>Sorry No Related Products Found</span>
                        </div>}
                </div>
            </> : <>
                <Row style={{ width: '100%' }}>
                    {productData?.length ? productData.map(product => {
                        return <Card style={{ width: '18rem' }} className='m-2'>
                            <Carousel fade>
                                {product.images.map(imgUrl => {
                                    return (
                                        <Carousel.Item className="d-flex justify-content-center p-1" onClick={() => {
                                            // make window go back to top
                                            window.scrollTo({
                                                top: 0,
                                                left: 0,
                                                behavior: 'smooth'
                                            });
                                            return navigateToProduct(product.id)
                                        }}>
                                            <Card.Img variant="top" src={imgUrl}
                                                style={{
                                                    width: '15rem',
                                                    height: '12rem',
                                                    objectFit: "contain",
                                                }} />
                                        </Carousel.Item>
                                    )
                                })}
                            </Carousel>
                            <Card.Body style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }} onClick={() => {
                                // make window go back to top
                                window.scrollTo({
                                    top: 0,
                                    left: 0,
                                    behavior: 'smooth'
                                });
                                return navigateToProduct(product.id)
                            }}>
                                <div style={{ marginBottom: '10px' }}>
                                    <Card.Title>{product.productName}</Card.Title>
                                </div>
                                <div class="d-flex justify-content-start align-items-center">
                                    {product?.userRating > 0 ? <UserRatingStars product={product} /> : <>No Reviews</>}
                                </div>
                                <div style={{ display: 'grid', gridTemplateRows: '1fr 1fr', }}>
                                    <Card.Text style={{ color: 'red', fontWeight: '1000' }}>Flat {product.discount}% Discount</Card.Text>
                                    <Card.Text style={{ fontWeight: '600' }}>Special Price: &#8377; {Number(product.price) - ((Number(product.price) / 100) * Number(product.discount))} <s style={{ fontSize: '12px' }}>{product.price}</s></Card.Text>
                                </div>
                            </Card.Body>
                        </Card>
                    }) : <>
                        <div className='w-100'>
                            <span className='d-flex' style={{ justifyContent: 'center', padding: '2rem', fontSize: '1.5rem', fontWeight: '500', textAlign: 'center' }}>Sorry No Related Products Found</span>
                        </div></>}
                </Row>
            </>}
        </>
    );
}

export default CategoryProductCards

