import React, { useEffect, useState } from "react";
import { Modal, Button, Card } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { changePassword, getUserAddress } from '../../../actions'
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFilePen } from "@fortawesome/free-solid-svg-icons";

import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';

import AddUpdateAddressModal from "../../Product/Modals/AddUpdateAddressModal";

import { deleteAddress } from "../../../actions";

function UserProfileModal(props) {
  const dispatch = useDispatch()

  const [showChangePassword, setShowChangePassword] = useState(false)
  const [currentPassword, setCurrentPassWord] = useState('');
  const [newPassword, setNewPassword] = useState('')
  const [confirmNewPassword, setConfrimNewPassword] = useState('');

  const [showAddAdressModal, setShowAddAddressModal] = useState(false);
  const [EditAddressData, setEditAddressData] = useState({})

  const userData = useSelector(state => state.mainSlice.userData)
  let userAddress = useSelector(state => state.mainSlice.userAddress);

  useEffect(() => {
    getUserAddress(dispatch)
  }, [])

  const ChangeBtnClicked = () => {
    if (newPassword !== confirmNewPassword) return alert('New Password and Confrim Password are not matching')
    const data = { currentPassword, newPassword }
    changePassword(data).then(res => res?.status === 'Success' ? setShowChangePassword(false) : null).catch((error) => { console.error(error) })
  };

  const handleAddressRemoveBtn = async (addressId) => {
    const confirmed = confirm('are you sure you want to Delete?');
    if (confirmed) deleteAddress({ addressId }, dispatch)
  }

  return (
    <>
      <Modal show={true}>
        <Modal.Header>
          <Modal.Title>Profile Details</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Row className="p-1">
            <Col>
              Name:
            </Col>
            <Col xs={8}>
              {userData.name}
            </Col>
          </Row>
          <Row className="p-1">
            <Col>
              Username:
            </Col>
            <Col xs={8}>
              {userData.username}
            </Col>
          </Row>
          <Row className="p-1">
            <Col>
              Email:
            </Col>
            <Col xs={8}>
              {userData.email}
            </Col>
          </Row>
          <Row className="p-1">
            <Col>
              Address:
            </Col>
            <Col xs={8} className="d-flex justify-content-end">
              <Button style={{ height: '25px', marginTop: '5px', display: 'flex', alignItems: 'center' }} onClick={() => { setShowAddAddressModal(true) }} variant="success">+</Button>
            </Col>
          </Row>
          <Form>
            {!showChangePassword && <Form.Group as={Row} className="mb-3">
              <div>
                {userAddress.length ? userAddress.map((address) => {
                  return <>
                    <Card>
                      <Card.Body style={{ display: 'grid', gridTemplateColumns: '15fr 1fr 1fr' }}>
                        <div className="d-flex" style={{ flexDirection: 'column', fontSize: '13px' }}>
                          <span style={{ fontSize: '15px', fontWeight: '600' }}>{address.firstName + ' ' + address.lastName}</span>
                          <span>{address.address} - {address.city}</span>
                          <span>{address.state} - {address.pincode}</span>
                          <span>LandMark: {address.landmark}</span>
                          <span>Contact: {address.phoneNumber}</span>
                        </div>
                        <div style={{ display: 'flex', gap: '10px', flexDirection: 'column' }}>
                          <Button variant='warning' style={{ width: '40px' }} onClick={() => { setShowAddAddressModal(true), setEditAddressData(address) }}><FontAwesomeIcon icon={faFilePen} /></Button>
                          <Button variant="danger" style={{ width: '40px' }} onClick={() => { handleAddressRemoveBtn(address?.id) }}>X</Button>
                        </div>
                      </Card.Body>
                    </Card>
                  </>
                }) : <>No Address Found</>}
              </div>
            </Form.Group>}
            {showChangePassword && <>
              <Card>
                <Card.Body style={{ display: 'grid', gridTemplateColumns: '10fr 1fr' }}>
                  <div>
                    <Form.Group as={Row} className="mb-3">
                      <Form.Label column sm="5">
                        Current Password
                      </Form.Label>
                      <Col sm="11">
                        <Form.Control type='password' onChange={(e) => { setCurrentPassWord(e.target.value) }} />
                      </Col>
                    </Form.Group>
                    <Form.Group as={Row} className="mb-3">
                      <Form.Label column sm="5">
                        New Password
                      </Form.Label>
                      <Col sm="11">
                        <Form.Control type='password' onChange={(e) => { setNewPassword(e.target.value) }} />
                      </Col>
                    </Form.Group>
                    <Form.Group as={Row} className="mb-3">
                      <Form.Label column sm="5">
                        Confrim New Password
                      </Form.Label>
                      <Col sm="11">
                        <Form.Control type='password' onChange={(e) => { setConfrimNewPassword(e.target.value) }} />
                      </Col>
                    </Form.Group>
                    <Button variant="primary" onClick={ChangeBtnClicked}>
                      Update
                    </Button>
                  </div>
                  <div>
                    <Button variant="danger" onClick={() => { setShowChangePassword(false) }}>X</Button>
                  </div>
                </Card.Body>
              </Card>
            </>}
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="primary"
            onClick={() => {
              props.setShowUserProfile(false);
            }}
          >
            close
          </Button>
          <Button variant="secondary" onClick={() => { setShowChangePassword(true) }}>
            Change Password
          </Button>
        </Modal.Footer>
      </Modal>
      {showAddAdressModal && <AddUpdateAddressModal Address={{ ...EditAddressData }} setShowAddAddressModal={setShowAddAddressModal} />}
    </>
  );
}

export default UserProfileModal;
