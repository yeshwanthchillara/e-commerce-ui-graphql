import React, { useState, useEffect, useRef } from "react";
import { Modal, Button } from "react-bootstrap";
import { Form } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { addAddress, editAddress } from "../../../actions";

function AddUpdateAddressModal(props) {
    const dispatch = useDispatch();

    const [states, setStates] = useState([]);
    const [cities, setCities] = useState([]);

    const [isCityInvalid, setCityIsInvalid] = useState(false);

    const [firstName, setFirstName] = useState(props?.Address?.firstName ? props?.Address?.firstName : '');
    const [lastName, setLastName] = useState(props?.Address?.lastName ? props?.Address?.lastName : '');
    const [address, setAddress] = useState(props?.Address?.address ? props?.Address?.address : '');
    const [landmark, setLandmark] = useState(props?.Address?.landmark ? props?.Address?.landmark : '')
    const [state, setState] = useState(props?.Address?.state ? props?.Address?.state : '');
    const [city, setCity] = useState(props?.Address?.city ? props?.Address?.city : '');
    const [pincode, setPincode] = useState(props?.Address?.pincode ? props?.Address?.pincode : '');
    const [phoneNumber, setPhoneNumber] = useState(props?.Address?.phoneNumber ? props?.Address?.phoneNumber : '')

    console.log("props ==>", props?.Address?.id);

    const userData = useSelector(state => state.mainSlice.userData)

    const handleSubmit = () => {
        if ([null, undefined, ''].includes(firstName || lastName || address || landmark || state || city || pincode || phoneNumber)) {
            toast.error('Please Fill all the data')
        } else {
            const userAndAddressData = {
                firstName,
                lastName,
                address,
                landmark,
                state,
                city,
                pincode,
                phoneNumber
            }
            if (!props?.Address?.id) {
                addAddress(userAndAddressData, props.setShowAddAddressModal, dispatch)
            } else {
                editAddress({ addressId: props?.Address?.id, ...userAndAddressData }, props.setShowAddAddressModal, dispatch)
            }
        }
    }

    useEffect(() => {
        if (state) {
            fetchCityData()
        }
    }, [state])

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch('https://countriesnow.space/api/v0.1/countries/states', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        country: 'India',
                    }),
                });

                if (!response.ok) {
                    throw new Error('Failed to fetch states');
                }

                const data = await response.json();
                setStates(data.data.states);
            } catch (error) {
                toast.error(error.message);
            }
        };

        fetchData();
    }, []);

    const fetchCityData = async () => {
        try {
            const response = await fetch('https://countriesnow.space/api/v0.1/countries/state/cities', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    country: 'India',
                    state: state || 'Telangana'
                }),
            });

            if (!response.ok) {
                throw new Error('Failed to fetch Cities');
            }

            const data = await response.json();
            setCities(data.data);
        } catch (error) {
            toast.error(error.message);
        }
    };

    // Function to validate city selection
    const cityValidator = () => {
        if (state == '') {
            setCityIsInvalid(true)
        }
    };

    return (
        <>
            <Modal show={true}>
                <Modal.Header>
                    <Modal.Title>{props?.Address?.id ? 'Update' : "Add"} Address</Modal.Title>
                </Modal.Header>
                <Modal.Body style={{ fontWeight: '600' }}>
                    <div className="d-grid" style={{ gap: '20px', gridTemplateColumns: '1fr 1fr', marginBottom: '20px', fontWeight: '600' }}>
                        <Form.Group>
                            <Form.Label>First Name</Form.Label>
                            <Form.Control value={firstName} onChange={(e) => { setFirstName(e.target.value) }} type="text" placeholder="Johnny" />
                        </Form.Group>
                        <Form.Group>
                            <Form.Label>Last Name</Form.Label>
                            <Form.Control value={lastName} onChange={(e) => { setLastName(e.target.value) }} type="text" placeholder="Depp" />
                        </Form.Group>
                    </div>
                    <Form.Group className="mb-3">
                        <Form.Label>Full Address</Form.Label>
                        <Form.Control as="textarea" rows={3} value={address} onChange={(e) => { setAddress(e.target.value) }} />
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <Form.Label>Land Mark</Form.Label>
                        <Form.Control type="text" placeholder="Near Starbucks" value={landmark} onChange={(e) => { setLandmark(e.target.value) }} />
                    </Form.Group>
                    <div className="d-grid" style={{ gap: '20px', gridTemplateColumns: '1fr 1fr', marginBottom: '20px', fontWeight: '600' }}>
                        <Form.Group>
                            <Form.Label>State</Form.Label>
                            <Form.Select size="sm" value={state} onChange={(e) => {
                                setState(e.target.value);
                                fetchCityData()
                                setCity('')
                                setCityIsInvalid(false)
                            }}>
                                <option value={''}>Select State</option>
                                {states.map(state => {
                                    return <option value={state.name}>{state.name}</option>
                                })}
                            </Form.Select>
                        </Form.Group>
                        <Form.Group>
                            <Form.Label>City</Form.Label>
                            <Form.Select size="sm" value={city} onClick={() => { cityValidator() }} onChange={(e) => { setCity(e.target.value) }} isInvalid={isCityInvalid}>
                                <option value={null}>Select City</option>
                                {cities.map(city => {
                                    return <option value={city}>{city}</option>
                                })}
                            </Form.Select>
                            <Form.Control.Feedback type='invalid'>
                                Please Select State First
                            </Form.Control.Feedback>
                        </Form.Group>
                    </div>
                    <div className="d-grid" style={{ gap: '20px', gridTemplateColumns: '1fr 1fr', marginBottom: '20px', fontWeight: '600' }}>
                        <Form.Group className="mb-3">
                            <Form.Label>Pin Code</Form.Label>
                            <Form.Control type='Number' value={pincode} onChange={(e) => { setPincode(e.target.value) }} placeholder="500123" />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Phone Number</Form.Label>
                            <Form.Control type='Number' value={phoneNumber} onChange={(e) => { setPhoneNumber(e.target.value) }} placeholder="98XXXXXXX19" />
                        </Form.Group>
                    </div>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => { props.setShowAddAddressModal(false) }} >
                        Cancel
                    </Button>
                    <Button variant="primary" onClick={handleSubmit}>
                        {props?.Address?.id ? 'Update' : "Add"}
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    );
}

export default AddUpdateAddressModal;
