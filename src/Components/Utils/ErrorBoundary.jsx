import React, { useState, useEffect } from 'react';
import './ErrorBoundary.css';
import ErroFound from './../../assets/errorFound.png'
import Offline from './../../assets/offline_new.png';

function ErrorBoundary({ children }) {
    const [hasError, setHasError] = useState(false);
    const [isOnline, setIsOnline] = useState(navigator.onLine);

    useEffect(() => {
        const handleError = () => {
            setHasError(true);
        };

        const handleOnline = () => {
            setIsOnline(true);
        };

        const handleOffline = () => {
            setIsOnline(false);
        };

        // Listen for errors during rendering
        window.addEventListener('error', handleError);

        // Listen for online/offline events
        window.addEventListener('online', handleOnline);
        window.addEventListener('offline', handleOffline);

        // Cleanup functions to remove listeners
        return () => {
            window.removeEventListener('error', handleError);
            window.removeEventListener('online', handleOnline);
            window.removeEventListener('offline', handleOffline);
        };
    }, []);

    if (!isOnline) {
        return (
            <div className="error-container">
                <img src={Offline} alt="You're Offline" width={800}/>
                <h3 className="error-message">Please check your internet connection and try again.</h3>
            </div>
        );
    }

    if (hasError) {
        return (
            <div className="error-container">
                <img src={ErroFound} alt="error-found" />
                <h3 className="error-message">Something went wrong. Please try again later.</h3>
                <h6 className="error-message">please drop a mail to yeshwanth.ch.naidu@gmail.com</h6>
            </div>
        );
    }

    return children;
}

export default ErrorBoundary;

