import React from 'react';
import './Hero.css';
import { useNavigate } from 'react-router-dom';

export default function Hero() {
    const navigate = useNavigate();

    const handleClick = () => {
        navigate('/upload');
    };

    return (
        <div className='hero'>
            <div className='content_div'>
                <h1>Precision <span className='green'>Diagnosis</span> at your fingertips</h1>
                <h3>Bringing clinical diagnosis at your doorstep</h3>
                <button onClick={handleClick}>Upload  Image</button>
            </div>
            <div className='image_div'>
                <img src="./med.jpg" alt="medical representation" />
            </div>
        </div>
    );
}
