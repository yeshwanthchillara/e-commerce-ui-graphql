import { useState } from "react";
import { Button, Col, Row } from "react-bootstrap";
import Form from "react-bootstrap/Form";
import InputGroup from "react-bootstrap/InputGroup";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

import { mainSliceActions } from "../../Store/MainSlice";
import ConfirmationModal from "./Modals/ConfirmationModal";

import './Product.css'

const ProductSellingPage = (props) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [productName, setProductName] = useState("");
  const [description, setDescription] = useState("");
  const [typeNR, setTypeNR] = useState("new");
  const [price, setPrice] = useState("");
  const [discount, setDiscount] = useState(0);
  const [productType, setProductType] = useState("");
  const [manufacturer, setManufacturer] = useState("");
  const [images, setImages] = useState([]);
  const [techSpecs, settechSpecs] = useState([{ key: "", value: "" }]);
  const [stock, setStock] = useState();
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);

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
    setShowConfirmationModal(true);
  };

  return (<>
    {/* Mobile View */}
    {window.innerWidth < 992 ? <Col className="bg-light m-0 p-0 product-selling-page">
      <Row className="text-dark fs-5 d-flex justify-content-center text-center m-0 py-2 fw-bold">
        Product Selling Page
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
                setTypeNR("New");
              }}
              checked
            />
            <Form.Check
              inline
              label="Refurbished"
              name="group1"
              type={'radio'}
              className="d-flex align-items-center mx-3"
              onChange={() => {
                setTypeNR("Refurbished");
              }}
            />
          </Form.Group>
          <Form.Group className="mb-2 px-2 fw-bold">
            <Form.Label>Product Type</Form.Label>
            <Form.Select className="fs-6" onChange={(e) => setProductType(e.target.value)}>
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
              placeholder="Product Manufacturer"
            />
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
            <Form.Label>Please Choose Images</Form.Label>
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
      {/* Computer/Laptop View */}
      <div>
        <div style={{ width: "98.9vw", display: "flex", justifyContent: "center" }}>
          <div className="productSellingMain">
            <h3 style={{ marginBottom: "10px" }}>
              <u>Product Selling Page</u>
            </h3>
            <div>
              <h4>Enter Product Details</h4>
            </div>
            <div>
              <InputGroup className="mb-3">
                <InputGroup.Text id="inputGroup-sizing-default">
                  Product Name
                </InputGroup.Text>
                <Form.Control
                  onChange={(e) => {
                    setProductName(e.target.value);
                  }}
                  aria-label="Default"
                  aria-describedby="inputGroup-sizing-default"
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
                    setTypeNR("New");
                  }}
                  name="flexRadioDefault"
                  id="flexRadioDefault1"
                  checked
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
                <InputGroup.Text id="inputGroup-sizing-default">
                  Manufacturer/Brand
                </InputGroup.Text>
                <Form.Control
                  onChange={(e) => {
                    setManufacturer(e.target.value);
                  }}
                  aria-label="Default"
                  aria-describedby="inputGroup-sizing-default"
                />
              </InputGroup>
            </div>
            <div>
              <div className="d-flex" style={{ gap: "10px" }}>
                {!!images.length &&
                  images.map((image, index) => (
                    <div key={index} className="image-container">
                      <div>
                        <img
                          src={URL.createObjectURL(image)}
                          alt="preview"
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
                <InputGroup.Text id="inputGroup-sizing-default">
                  Inventory Stock
                </InputGroup.Text>
                <Form.Control
                  aria-label="Default"
                  type="Number"
                  onChange={(e) => {
                    setStock(e.target.value);
                  }}
                  aria-describedby="inputGroup-sizing-default"
                />
              </InputGroup>
              <InputGroup className="mb-3">
                <InputGroup.Text id="inputGroup-sizing-default">
                  Price (Rs)
                </InputGroup.Text>
                <Form.Control
                  aria-label="Default"
                  type="Number"
                  onChange={(e) => {
                    setPrice(e.target.value);
                  }}
                  aria-describedby="inputGroup-sizing-default"
                />
              </InputGroup>
              <InputGroup className="mb-3">
                <InputGroup.Text id="inputGroup-sizing-default">
                  Discount (if any in %)
                </InputGroup.Text>
                <Form.Control
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
                  confirm('Are you sure if you want to cancel') ? navigate('/') : null
                }}
              >
                Cancel
              </button>
              <Button variant="outline-success" onClick={onHandleSubmit}>
                Submit Details
              </Button>
            </div>
          </div>
        </div>
        <div>
        </div>
      </div>
    </>}
    {showConfirmationModal && (
      <ConfirmationModal
        props={{
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
        setShowConfirmationModal={setShowConfirmationModal}
      />
    )}
  </>);
};

export default ProductSellingPage;
