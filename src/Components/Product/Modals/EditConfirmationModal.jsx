import React, { useState } from "react";
import { Modal, Button } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { editProduct } from '../../../actions'
import { useNavigate } from "react-router-dom";

function EditConfirmationModal(props) {
    const navigate = useNavigate()

    const updateAd = () => {
        editProduct(props.props, props.setShowEditConfirmationModal, props.setShowEditProduct, navigate)
    };

    return (
        <>
            <Modal show={true}>
                <Modal.Header>
                    <Modal.Title>Confrim Details</Modal.Title>
                </Modal.Header>
                <Modal.Body style={{ padding: '0rem 0.5rem' }}>
                    <div
                        className="w-100"
                        style={{
                            display: "grid",
                            gridTemplateColumns: "1.8fr 3fr",
                            gap: "10px",
                        }}
                    >
                        <div style={{ fontWeight: '600' }}>Product Name : </div>
                        <div>{props.props.productName}</div>
                        <div style={{ fontWeight: '600' }}>Description:</div>
                        <div> {props.props.description}</div>
                        <div style={{ fontWeight: '600' }}>Type (N/R) :</div>
                        <div>{props.props.typeNR}</div>
                        <div style={{ fontWeight: '600' }}>Product Type :</div>
                        <div>{props.props.productType}</div>
                        <div style={{ fontWeight: '600' }}>Manufacturer :</div>
                        <div>{props.props.manufacturer}</div>
                        <div style={{ fontWeight: '600' }}>Inventory Stock:</div>
                        <div>{props.props.stock}</div>
                        <div style={{ fontWeight: '600' }}>Price :</div>
                        <div>{props.props.price}</div>
                        <div style={{ fontWeight: '600' }}>Discount:</div>
                        <div> {props.props.discount}</div>
                        <div style={{ fontWeight: '600' }}>Technical Specifications:</div>
                        <div style={{ display: 'grid', gridTemplateColumns: '1.8fr 3fr', gap: '10px' }}>
                            {props.props.techSpecs.map(spec => {
                                return <>
                                    <div style={{ wordWrap: 'break-word', fontWeight: '600' }}>{spec.key} :</div>
                                    <div style={{ wordWrap: 'break-word' }}>{spec.value}</div>
                                </>
                            })}
                        </div>
                        <div style={{ fontWeight: '600' }}>Images:</div>
                        <div>
                            {props?.props?.images.length > 0 ? props.props.images.map((image, i) => {
                                return <div key={i}>
                                    <img
                                        src={URL.createObjectURL(image)}
                                        alt="Product Image"
                                        width="190"
                                        height="190"
                                        className="m-1 p-1"
                                        style={{ borderRadius: '1rem', border: '1px solid grey', objectFit: 'contain' }}
                                    />
                                </div>
                            }) : <div>Images Not Updated</div>}
                        </div>
                    </div>
                </Modal.Body>
                <Modal.Footer>
                    <Button
                        variant="secondary"
                        onClick={() => {
                            props.setShowEditConfirmationModal(false);
                        }}
                    >
                        Back to Edit
                    </Button>
                    <Button variant="dark" onClick={updateAd}>
                        Update
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    );
}

export default EditConfirmationModal;
