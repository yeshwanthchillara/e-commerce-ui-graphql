import { useEffect, useState } from "react";
import InputGroup from "react-bootstrap/InputGroup";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { getProduct, proxy } from "../../actions";
import notFoundImage from '../../assets/notfound.jpg';

import { mainSliceActions } from "../../Store/MainSlice";
import EditConfirmationModal from "./Modals/EditConfirmationModal";
import { Col, Row, Form, Button } from 'react-bootstrap'

const EditProduct = (props) => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [productName, setProductName] = useState();
    const [description, setDescription] = useState();
    const [typeNR, setTypeNR] = useState();
    const [price, setPrice] = useState();
    const [discount, setDiscount] = useState();
    const [prevImages, setPrevImages] = useState([])
    const [images, setImages] = useState([]);
    const [productType, setProductType] = useState();
    const [manufacturer, setManufacturer] = useState();
    const [techSpecs, settechSpecs] = useState([]);
    const [stock, setStock] = useState();

    const [showEditConfirmationModal, setShowEditConfirmationModal] = useState(false);

    const getProductData = async () => {
        try {
            dispatch(mainSliceActions.showLoadingPage(true))
            const product = await getProduct(props.id);
            if (product?.id) {
                const { productName, description, typeNewOrRefurbished, price, discount, images, productType, manufacturer, techSpecifications, inventoryStock } = product
                setProductName(productName);
                setDescription(description);
                setTypeNR(typeNewOrRefurbished);
                setPrice(price);
                setDiscount(discount);
                setPrevImages(images);
                setProductType(productType);
                setManufacturer(manufacturer);
                settechSpecs(techSpecifications);
                setStock(inventoryStock);
            }
        } catch (error) {
            console.log('Error: ' + error)
        } finally {
            dispatch(mainSliceActions.showLoadingPage(false))
        }
    }

    useEffect(() => {
        getProductData();
    }, [props.id])

    // function to handle adding a new key-value pair
    const handleAdd = () => {
        const values = [...techSpecs];
        values.push({ key: "", value: "" });
        settechSpecs(values);
    };

    // function to handle removing a key-value pair
    const handleRemove = (index) => {
        const values = [...techSpecs];
        values.splice(index, 1);
        settechSpecs(values);
    };

    // function to handle editing a key-value pair
    const handleEdit = (index, key, value) => {
        const values = [...techSpecs];
        values[index].key = key;
        values[index].value = value;
        settechSpecs(values);
    };

    // function to render the key-value input fields
    const rendertechSpecs = () => {
        return techSpecs.map((kv, index) => (
            <div className="d-flex w-100 m-0" style={{ gap: '10px', alignItems: 'center' }} key={`${index}`}>
                <div className="d-flex justify-content-evenly my-2" style={{ gap: '1rem' }}>
                    <div className="d-flex align-items-top p-2">
                        <span>{index + 1}</span>
                    </div>
                    <div className={window.innerWidth > 992 && "d-flex"} style={window.innerWidth > 992 ? { gap: '1rem' } : {}}>
                        <input
                            className="p-1 my-1 w-100"
                            style={{ borderRadius: '5px' }}
                            type="text"
                            placeholder="Enter Specification Name"
                            value={kv.key}
                            onChange={(e) => handleEdit(index, e.target.value, kv.value)}
                        />
                        <input
                            className="p-1 my-1  w-100"
                            style={{ borderRadius: '5px' }}
                            type="text"
                            placeholder="Enter Specification Value"
                            value={kv.value}
                            onChange={(e) => handleEdit(index, kv.key, e.target.value)}
                        />
                    </div>
                    <button className="btn btn-danger my-1" type="button" onClick={() => handleRemove(index)}>X</button>
                </div>
            </div>
        ));
    };

    const handleImageChange = (e) => {
        const selectedImages = Array.from(e.target.files);
        if (selectedImages.length > 2) return toast.error("Please Select 2 files only");
        if (images?.length < 2) { setImages([...images, ...selectedImages]) } else { alert('Already 2 Images are Selected') }
    };

    const handleRemoveImage = (index) => {
        const newImages = [...images];
        newImages.splice(index, 1);
        setImages(newImages);
    };

    const onHandleSubmit = () => {
        if (
            !productName ||
            !description ||
            !typeNR ||
            !price ||
            !discount ||
            !productType ||
            !manufacturer ||
            !images ||
            !techSpecs ||
            !stock
        ) {
            return toast.error("Please Provide all the Details");
        }
        if (discount > 99) setDiscount(99);
        if (discount < 1) setDiscount(1);
        setShowEditConfirmationModal(true);
    };

    return (
        <div>
            {window.innerWidth < 992 ? <Col className="bg-light m-0 p-0 product-selling-page">
                <Row className="text-dark fs-5 d-flex justify-content-center text-center m-0 py-2 fw-bold">
                    Product Edit Page
                </Row>
                <Row className="px-2 fw-bold mb-4"><u>Enter Product Details:</u></Row>
                <Row>
                    <Form>
                        <Form.Group className="mb-2 px-2 fw-bold">
                            <Form.Label>product Name</Form.Label>
                            <Form.Control
                                onChange={(e) => {
                                    setProductName(e.target.value);
                                }}
                                value={productName}
                                placeholder="Product Name"
                            />
                        </Form.Group>
                        <Form.Group className="mb-2 px-2 fw-bold">
                            <Form.Label>product Description</Form.Label>
                            <Form.Control
                                as="textarea"
                                onChange={(e) => {
                                    setDescription(e.target.value);
                                }}
                                value={description}
                                placeholder="Product Description"
                            />
                        </Form.Group>
                        <Form.Group className="mb-2 px-2 fw-bold d-flex flex-column">
                            <Form.Label>Type (New/Refurbished):</Form.Label>
                            <Form.Check
                                inline
                                label="New"
                                name="group1"
                                type={'radio'}
                                className="d-flex align-items-center mx-3"
                                onChange={() => {
                                    setTypeNR("new");
                                }}
                                checked={typeNR === 'new'}
                            />
                            <Form.Check
                                inline
                                label="Refurbished"
                                name="group1"
                                type={'radio'}
                                className="d-flex align-items-center mx-3"
                                onChange={() => {
                                    setTypeNR("refurbished");
                                }}
                                checked={typeNR === 'refurbished'}
                            />
                        </Form.Group>
                        <Form.Group className="mb-2 px-2 fw-bold">
                            <Form.Label>Product Type</Form.Label>
                            <Form.Select className="fs-6" onChange={(e) => setProductType(e.target.value)} value={productType}>
                                <option>Select</option>
                                <option value="office_laptops">Laptops</option>
                                <option value="gaming_laptops">Gaming Laptops</option>
                                <option value="monitor">Monitor</option>
                                <option value="processor">Processor</option>
                                <option value="ram">RAM</option>
                                <option value="ssd">SSD/Hard Drives</option>
                                <option value="smps">SMPS</option>
                                <option value="cabinet">Cabinet</option>
                                <option value="graphics_card">Graphics Card</option>
                                <option value="others">others (sound/video Capture Cards)</option>
                                <option value="mouse">Mouse</option>
                                <option value="keyboard">KeyBoard</option>
                                <option value="cooling_systems">Cooling Systems</option>
                                <option value="web_cam">Web Cam</option>
                                <option value="accessories">Computer/Laptop Accessoires</option>
                                <option value='gamepads'>Gamepads</option>
                                <option value='speakers'>Speakers</option>
                            </Form.Select>
                        </Form.Group>
                        <Form.Group className="mb-2 px-2 fw-bold">
                            <Form.Label>Manufacturer/Brand</Form.Label>
                            <Form.Control
                                onChange={(e) => {
                                    setManufacturer(e.target.value);
                                }}
                                value={manufacturer}
                                placeholder="Product Manufacturer"
                            />
                        </Form.Group>
                        {/* Prevoius Images */}
                        <Form.Group className="mb-2 px-2 fw-bold">
                            <Form.Label>Previous Images</Form.Label>
                            <div className="d-flex p-1 justify-content-evenly" style={{ gap: "10px" }}>
                                {!!prevImages.length &&
                                    prevImages.map((image, index) => (
                                        <div className="d-flex align-items-center justify-content-center" key={index} style={{ border: '1px solid grey', borderRadius: '1.5rem' }}>
                                            <div className="d-flex justify-content-center align-items-center">
                                                <img
                                                    src={image}
                                                    alt="preview"
                                                    style={{
                                                        maxWidth: "8rem",
                                                        maxHeight: "8rem",
                                                        objectFit: "contain",
                                                        margin: "5px",
                                                    }}
                                                />
                                            </div>
                                        </div>
                                    ))}
                            </div>
                        </Form.Group>
                        {/* Show Images Start */}
                        <div>
                            <div className="d-flex p-1 justify-content-evenly" style={{ gap: "10px" }}>
                                {!!images.length &&
                                    images.map((image, index) => (
                                        <div key={index} style={{ border: '1px solid grey', borderRadius: '1.5rem' }}>
                                            <div className="d-flex">
                                                <img
                                                    src={URL.createObjectURL(image)}
                                                    alt="preview"
                                                    style={{
                                                        maxWidth: "8rem",
                                                        maxHeight: "8rem",
                                                        objectFit: "contain",
                                                        margin: "5px",
                                                    }}
                                                />
                                                <div style={{ height: '100%', background: 'red', borderRadius: '1rem' }}>
                                                    <button className="text-light" onClick={(e) => { e.preventDefault(); handleRemoveImage(index) }}>
                                                        X
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                            </div>
                        </div>
                        {/* Show Images End */}
                        <Form.Group controlId="formFileMultiple" className="mb-2 px-2 fw-bold">
                            <Form.Label>Please Choose New Images</Form.Label>
                            <Form.Control type="file" multiple onChange={handleImageChange} />
                        </Form.Group>
                        <Form.Group className="mb-2 px-2 py-3 fw-bold">
                            <div className="d-flex justify-content-between align-items-center">
                                <Form.Label>Technical Specifications</Form.Label>
                                <Button style={{ backgroundColor: 'green', color: "white" }} type="button" variant="outline-success" onClick={() => handleAdd()}>Add</Button>
                            </div>
                            <div>
                                {rendertechSpecs()}
                            </div>
                        </Form.Group>
                        <Form.Group className="mb-2 px-2 fw-bold">
                            <Form.Label>Inventory Stock</Form.Label>
                            <Form.Control
                                placeholder="inventory Stock Availability"
                                type="Number"
                                onChange={(e) => {
                                    setStock(e.target.value);
                                }}
                                value={stock}
                            />
                        </Form.Group>
                        <Form.Group className="mb-2 px-2 fw-bold">
                            <Form.Label>Price (Rs)</Form.Label>
                            <Form.Control
                                placeholder="Price"
                                type="Number"
                                onChange={(e) => {
                                    setPrice(e.target.value);
                                }}
                                value={price}
                            />
                        </Form.Group>
                        <Form.Group className="mb-2 px-2 fw-bold">
                            <Form.Label>Discount (if any)</Form.Label>
                            <Form.Control
                                placeholder="Discount"
                                type="Number"
                                min={1}
                                max={99}
                                onChange={(e) => {
                                    setDiscount(e.target.value);
                                }}
                                value={discount}
                            />
                        </Form.Group>
                        <div className="d-flex w-100 justify-content-between px-3 p-1">
                            <button
                                className="btn btn-danger"
                                onClick={() => {
                                    confirm('Are you sure if you want to cancel') ? navigate('/') : null
                                }}
                            >
                                Cancel
                            </button>
                            <Button variant="outline-success" onClick={onHandleSubmit}>
                                Submit Details
                            </Button>
                        </div>
                    </Form>
                </Row>
            </Col > : <>
                <div>
                    <div className="productSellingMain" style={{ borderRadius: '10px', backgroundColor: 'white' }}>
                        <h3 style={{ marginBottom: "10px" }}>
                            <u>Product Edit Page</u>
                        </h3>
                        <div>
                            <h4>Enter Product Details</h4>
                        </div>
                        <div>
                            <InputGroup className="mb-3">
                                <InputGroup.Text>
                                    Product Name
                                </InputGroup.Text>
                                <Form.Control
                                    onChange={(e) => {
                                        setProductName(e.target.value);
                                    }}
                                    aria-label="Default"
                                    aria-describedby="inputGroup-sizing-default"
                                    value={productName}
                                />
                            </InputGroup>
                        </div>
                        <div>
                            <div className="form-group">
                                <label>Description</label>
                                <textarea
                                    onChange={(e) => {
                                        setDescription(e.target.value);
                                    }}
                                    className="form-control rounded-0"
                                    id="exampleFormControlTextarea2"
                                    rows="3"
                                    value={description}
                                ></textarea>
                            </div>
                        </div>
                        <div className="d-flex" style={{ gap: "30px" }}>
                            <label>Type (New/Refurbished):-</label>
                            <div className="form-check">
                                <input
                                    className="form-check-input"
                                    type="radio"
                                    onChange={() => {
                                        setTypeNR("new");
                                    }}
                                    name="flexRadioDefault"
                                    id="flexRadioDefault1"
                                    checked={typeNR == 'new'}
                                />
                                <label className="form-check-label">New</label>
                            </div>
                            <div className="form-check">
                                <input
                                    className="form-check-input"
                                    type="radio"
                                    onChange={() => {
                                        setTypeNR("Refurbished");
                                    }}
                                    checked={typeNR == 'Refurbished'}
                                    name="flexRadioDefault"
                                    id="flexRadioDefault2"
                                />
                                <label className="form-check-label">Refurbished</label>
                            </div>
                        </div>
                        <div>
                            <label>product type</label>
                            <select
                                className="form-select form-select-sm"
                                aria-label=".form-select-sm example"
                                value={productType}
                                onChange={(e) => {
                                    setProductType(e.target.value);
                                }}
                            >
                                <option>Select</option>
                                <option value="office_laptops">Laptops</option>
                                <option value="gaming_laptops">Gaming Laptops</option>
                                <option value="monitor">Monitor</option>
                                <option value="processor">Processor</option>
                                <option value="ram">RAM</option>
                                <option value="ssd">SSD/Hard Drives</option>
                                <option value="smps">SMPS</option>
                                <option value="cabinet">Cabinet</option>
                                <option value="graphics_card">Graphics Card</option>
                                <option value="others">
                                    others (sound/video Capture Cards){" "}
                                </option>
                                <option value="mouse">Mouse</option>
                                <option value="keyboard">KeyBoard</option>
                                <option value="cooling_systems">Cooling Systems</option>
                                <option value="web_cam">Web Cam</option>
                                <option value="accessories">Computer/Laptop Accessoires</option>
                                <option value='gamepads'>Gamepads</option>
                                <option value='speakers'>Speakers</option>
                            </select>
                        </div>
                        <div>
                            <InputGroup className="mb-3">
                                <InputGroup.Text>
                                    Manufacturer/Brand
                                </InputGroup.Text>
                                <Form.Control
                                    value={manufacturer}
                                    onChange={(e) => {
                                        setManufacturer(e.target.value);
                                    }}
                                    aria-label="Default"
                                    aria-describedby="inputGroup-sizing-default"
                                />
                            </InputGroup>
                        </div>
                        <div>
                            Previous Images (New Images Replace these Images if Added):
                            <div>
                                {prevImages.map((image, index) => {
                                    return (
                                        <img src={image} id={index} alt="Previous Image"
                                            width="150"
                                            style={{
                                                maxWidth: "100px",
                                                maxHeight: "100px",
                                                objectFit: "contain",
                                                margin: "5px",
                                            }} />
                                    )
                                })}
                            </div>
                        </div>
                        <div>
                            <div className="d-flex" style={{ gap: "10px" }}>
                                {!!images.length &&
                                    images.map((image, index) => (
                                        <div key={index} className="image-container">
                                            <div>
                                                <img
                                                    src={URL.createObjectURL(image)}
                                                    alt="Product Image"
                                                    width="250"
                                                    style={{
                                                        maxWidth: "200px",
                                                        maxHeight: "200px",
                                                        objectFit: "contain",
                                                        margin: "5px",
                                                    }}
                                                />
                                                <button
                                                    style={{ margin: "5px" }}
                                                    onClick={() => handleRemoveImage(index)}
                                                >
                                                    Remove
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                            </div>
                            <label className="form-label">Please Choose Images</label>
                            <input
                                onChange={handleImageChange}
                                className="form-control"
                                type="file"
                                multiple
                                id="formFileMultiple"
                            />
                        </div>
                        <div>
                            <div className="d-flex" style={{ alignItems: 'Center', gap: '10px' }}>
                                <label>Product Technical Specifications</label>
                                <Button style={{ backgroundColor: 'green', color: "white" }} type="button" variant="outline-success" onClick={() => handleAdd()}>Add</Button>
                            </div>
                            <div>
                                {rendertechSpecs()}
                            </div>
                        </div>
                        <div className="d-flex" style={{ gap: "30px" }}>
                            <InputGroup className="mb-3">
                                <InputGroup.Text>
                                    Inventory Stock
                                </InputGroup.Text>
                                <Form.Control
                                    value={stock}
                                    aria-label="Default"
                                    type="Number"
                                    onChange={(e) => {
                                        setStock(e.target.value);
                                    }}
                                    aria-describedby="inputGroup-sizing-default"
                                />
                            </InputGroup>
                            <InputGroup className="mb-3">
                                <InputGroup.Text>
                                    Price (Rs)
                                </InputGroup.Text>
                                <Form.Control
                                    value={price}
                                    aria-label="Default"
                                    type="Number"
                                    onChange={(e) => {
                                        setPrice(e.target.value);
                                    }}
                                    aria-describedby="inputGroup-sizing-default"
                                />
                            </InputGroup>
                            <InputGroup className="mb-3">
                                <InputGroup.Text>
                                    Discount (if any in %)
                                </InputGroup.Text>
                                <Form.Control
                                    value={discount}
                                    aria-label="Default"
                                    type="Number"
                                    min={1}
                                    max={99}
                                    onChange={(e) => {
                                        setDiscount(e.target.value);
                                    }}
                                    aria-describedby="inputGroup-sizing-default"
                                />
                            </InputGroup>
                        </div>
                        <div className="d-flex" style={{ justifyContent: "flex-end" }}>
                            <button
                                className="btn btn-danger mr-2"
                                onClick={() => {
                                    confirm('Are you sure if you want to cancel') ? props.setShowEditProduct(false) : null
                                }}
                            >
                                Cancel
                            </button>
                            <Button variant="outline-success" onClick={onHandleSubmit}>
                                Submit Details
                            </Button>
                        </div>
                    </div>
                </div></>}
            <div>
                {showEditConfirmationModal && (
                    <EditConfirmationModal
                        props={{
                            id: props.id,
                            productName,
                            description,
                            typeNR,
                            price,
                            discount,
                            productType,
                            manufacturer,
                            images,
                            techSpecs,
                            stock
                        }}
                        setShowEditConfirmationModal={setShowEditConfirmationModal}
                        setShowEditProduct={props.setShowEditProduct}
                    />
                )}
            </div>
        </div>
    );
};

export default EditProduct;
