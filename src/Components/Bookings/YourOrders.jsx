import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { useNavigate } from "react-router-dom"
import { getAllOrders } from "../../actions"
import { Card } from "react-bootstrap"
import ViewOrder from "./ViewOrder"
import { mainSliceActions } from "../../Store/MainSlice"

const YourOrders = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [orders, setOrders] = useState([])
    const userData = useSelector(state => state.mainSlice.userData)

    useEffect(() => {
        const getOrders = async () => {
            try {
                dispatch(mainSliceActions.showLoadingPage(true))
                setOrders(await getAllOrders(userData.username))
                dispatch(mainSliceActions.showLoadingPage(false))
            } catch (error) {
                dispatch(mainSliceActions.showLoadingPage(false))
            }
        }
        getOrders();
    }, [])

    return (<>
        <div style={{ minHeight: '88.1vh', backgroundColor: '#E5E5E5', display: 'flex', flexDirection: 'column', gap: '30px', padding: '10px' }}>
            {orders?.length ?
                <div>
                    <div style={{ fontSize: '30px', fontWeight: '600' }}>Your Orders:</div>
                </div> : null}
            {orders?.length ?
                orders.reverse().map((orderData, index) => {
                    return <Card key={index} style={{ padding: '15px' }}>
                        <ViewOrder props={orderData} />
                    </Card>
                }) :
                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '88.1vh', flexDirection: 'column' }}>
                    <span style={{ fontSize: '30px', fontWeight: '600' }}>No Orders Found &#128532;</span>
                    <span style={{ color: 'blue', padding: '10px', cursor: 'pointer' }} onClick={() => { navigate('/') }}>Continue Shopping</span>
                </div>}
        </div>
    </>
    )
}

export default YourOrders