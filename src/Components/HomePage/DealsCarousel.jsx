import Carousel from 'react-bootstrap/Carousel';

import deals1 from '../../assets/deals1.jpg'
import deals2 from '../../assets/deals2.jpg'
import deals3 from '../../assets/deals3.jpg'

import MW1 from '../../assets/mw-a.png'
import MW2 from '../../assets/mw-b.jpg'
import MW3 from '../../assets/mb-c.jpg'

const MobileImages = [MW1, MW2, MW3]

const DealsCarousel = () => {
    return (
        <>
            <Carousel fade>
                {MobileImages.map(img => {
                    return <Carousel.Item>
                        <img
                            className="d-block w-100"
                            src={img}
                            alt="Second slide"
                            style={{ height: window.innerWidth < 992 ? "200px" : "490px", objectFit: window.innerWidth < 992 ? "cover" : "cover" }}
                        />
                    </Carousel.Item>
                })}
            </Carousel>
        </>
    )
}

export default DealsCarousel;