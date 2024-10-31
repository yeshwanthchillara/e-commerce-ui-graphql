import React, { useEffect, useState } from "react";
import { Modal, Button, Card, Dropdown } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { getUserAddress } from '../../actions';

import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';

function TechnicianRequestModal(props) {
    const dispatch = useDispatch()
    const [selectedAddress, setSelectedAddress] = useState({});
    const [requestedTech, setRequestedTech] = useState(false)

    const userData = useSelector(state => state.mainSlice.userData)
    const userAddress = useSelector(state => state.mainSlice.userAddress)

    useEffect(() => {
        setRequestedTech(false)
        getUserAddress(dispatch)
    }, [])

    useEffect(() => {
        if (!!userAddress[0]) { setSelectedAddress(userAddress[0]) } else { setSelectedAddress({}) }
    }, [userAddress])

    let allAddress;
    if (userAddress) {
        allAddress = [...userAddress]
    } else {
        allAddress = []
    }

    return (
        <>
            <Modal show={true}>
                <Modal.Header>
                    <Modal.Title>Profile Details</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {
                        requestedTech ? <div style={{fontWeight:'600'}}> Sorry, No Technician Found Around you</div> :
                            <Form>
                                <Form.Group as={Row} className="mb-3">
                                    <Form.Label column sm="2">
                                        Name:
                                    </Form.Label>
                                    <Col sm="10">
                                        <Form.Control plaintext readOnly defaultValue={userData.name} />
                                    </Col>
                                </Form.Group>
                                <Form.Group as={Row} className="mb-3">
                                    <Form.Label column sm="2">
                                        Email:
                                    </Form.Label>
                                    <Col sm="10">
                                        <Form.Control plaintext readOnly defaultValue={userData.email} />
                                    </Col>
                                </Form.Group>
                                <Form.Group as={Row} className="mb-3">
                                    <div style={{ fontWeight: '600', fontSize: '20px', paddingBottom: '10px' }}>
                                        Address:
                                    </div>
                                    {selectedAddress?.firstName ?
                                        <div className="d-flex" style={{ flexDirection: 'column', paddingBottom: '10px' }}>
                                            <span style={{ fontSize: '18px', fontWeight: '600' }}>{selectedAddress.firstName + ' ' + selectedAddress.lastName}</span>
                                            <span>{selectedAddress.address} - {selectedAddress.city}</span>
                                            <span>{selectedAddress.state} - {selectedAddress.pincode}</span>
                                            <span>LandMark: {selectedAddress.landmark}</span>
                                            <span>Contact: {selectedAddress.phoneNumber}</span>
                                        </div>
                                        :
                                        <div>
                                            Please Select Address
                                        </div>
                                    }
                                    <div style={{ display: 'flex', gap: '20px' }}>
                                        <Dropdown onSelect={(e) => { setSelectedAddress(allAddress[e]) }}>
                                            <Dropdown.Toggle variant="success" id="dropdown-basic" disabled={allAddress.length === 0}>
                                                Change Address
                                            </Dropdown.Toggle>
                                            <Dropdown.Menu>
                                                {allAddress.length > 0 &&
                                                    allAddress.map((address, index) => {
                                                        return (
                                                            <>
                                                                <Dropdown.Item eventKey={index} key={index}>
                                                                    <div className="d-flex" style={{ flexDirection: 'column' }}>
                                                                        <span style={{ fontSize: '18px', fontWeight: '600' }}>{address.firstName + ' ' + address.lastName}</span>
                                                                        <span>{address.address} - {address.city}</span>
                                                                        <span>{address.state} - {address.pincode}</span>
                                                                        <span>LandMark: {address.landmark}</span>
                                                                        <span>Contact: {address.phoneNumber}</span>
                                                                    </div>
                                                                </Dropdown.Item>
                                                                {allAddress.length !== index + 1 && <Dropdown.Divider />}
                                                            </>
                                                        );
                                                    })}
                                            </Dropdown.Menu>
                                        </Dropdown>
                                    </div>
                                </Form.Group>
                            </Form>
                    }
                </Modal.Body>
                <Modal.Footer>
                    <Button
                        variant="primary"
                        onClick={() => {props.setShowTechnicianRequestModal(false)}}
                    >
                        close
                    </Button>
                    <Button variant="secondary" onClick={() => {setTimeout(() => {setRequestedTech(true)}, 2000) }}>
                        Request Technician
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    );
}

export default TechnicianRequestModal;
