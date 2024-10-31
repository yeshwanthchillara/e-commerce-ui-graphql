import React, { useEffect, useState } from 'react';
import { Spinner } from 'react-bootstrap';


const SpinnerPage = () => {
    return (<div className="d-flex justify-content-center align-items-center" style={{ top: 0, left: 0, height: '100vh', position: 'fixed', width: '100vw', background: 'rgba(15, 15, 15, 0.8)', zIndex: 100}}>
        <Spinner className="spinner-border text-light" animation="border" role="status">
            <span className="sr-only">Loading...</span>
        </Spinner>
    </div>
    );
};

export default SpinnerPage;