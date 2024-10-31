import { useEffect, useState } from "react"
import check_solid from '../../assets/check_solid.svg'
import { Button, Card } from "react-bootstrap"
import { useSelector } from "react-redux"

import ViewOrder from "./ViewOrder"
import { useParams } from "react-router-dom"
import { getOrderDetails } from "../../actions"

const OrderPlaced = () => {
    const userData = useSelector(state => state.mainSlice.userData)
    const [orderData, setOrderData] = useState({});

    const { id } = useParams();

    useEffect(() => {
        const orderDetails = async () => {
            setOrderData(await getOrderDetails({ orderId: id }))
        }
        orderDetails()
    }, [id])

    return (
        <>
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
                    <Card.Body style={{ fontSize: '20px', fontWeight: '600' }}>
                        <div style={{ marginBottom: '10px' }}>
                            <u>Order Details:</u>
                        </div>
                        <div>
                            {orderData?.id && <ViewOrder props={orderData} />}
                        </div>
                    </Card.Body>
                </Card>
            </div>
        </>
    )
}

export default OrderPlaced