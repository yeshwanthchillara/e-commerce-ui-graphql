import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faStar } from "@fortawesome/free-solid-svg-icons"
import noFillStar from '../../assets/star-no-fill.svg'

const UserRatingStars = ({ product }) => {
    return <div className="d-flex" style={{ gap: '0.20rem' }}>
        <div className="d-flex align-items-center">
            {product.userRating > 0 ? <FontAwesomeIcon icon={faStar} /> : <img src={noFillStar} width={17} />}
            {product.userRating > 1 ? <FontAwesomeIcon icon={faStar} /> : <img src={noFillStar} width={17} />}
            {product.userRating > 2 ? <FontAwesomeIcon icon={faStar} /> : <img src={noFillStar} width={17} />}
            {product.userRating > 3 ? <FontAwesomeIcon icon={faStar} /> : <img src={noFillStar} width={17} />}
            {product.userRating > 4 ? <FontAwesomeIcon icon={faStar} /> : <img src={noFillStar} width={17} />}
        </div>
        <h6 className="m-0 px-2">{window.innerWidth > 992 ? `${product?.reviews?.length} Reviews` : `(${product?.reviews?.length})`}</h6>
    </div>
}

export default UserRatingStars