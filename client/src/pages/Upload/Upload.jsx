import React, { useState } from 'react';
import './upload.css';
import { useNavigate } from 'react-router-dom';
import Navbar from '../../components/Navbar/Navbar';

export default function Upload() {
  const [image, setImage] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        alert('Please upload a valid image file.');
        return;
      }

      if (file.size > 5 * 1024 * 1024) {
        alert('File size should be less than 5MB.');
        return;
      }

      setImage(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleCancel = () => {
    setImage(null);
    setPreviewUrl(null);
  };

  const handleUpload = async () => {
    if (!image) {
      alert('No image selected!');
      return;
    }

    setLoading(true);

    const formData = new FormData();
    formData.append('image', image);

    try {
      const response = await fetch('http://localhost:5000/predict', {
        method: 'POST',
        body: formData,
      });

      let data;
      try {
        data = await response.json();
      } catch {
        throw new Error('Invalid JSON response from server');
      }

      if (data.error) {
        alert(`Error from server: ${data.error}`);
      } else {
        console.log("📍 Navigating to /result with data:", data);
        navigate('/result', { state: { result: data } });
      }
    } catch (err) {
      console.error('Upload error:', err);
      alert('Something went wrong while uploading: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      <div className="upload-container">
        <h2>Upload an Image for Analysis</h2>

        <label className="upload-drop-area">
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            hidden
          />
          <div className="upload-box">
            <span>Click or drag file to this area to upload</span>
          </div>
        </label>

        <p className="upload-format">Formats accepted: JPG, PNG (Max 5MB)</p>

        <div className="sample-template">
          <p>If you do not have a file you can use the sample below:</p>
          <button className="template-button">
            <i className="fa fa-download"></i> Download Sample Template
          </button>
        </div>

        {previewUrl && (
          <div className="preview">
            <img src={previewUrl} alt="Preview" />
          </div>
        )}

        {loading && <p className="loading-text">Analyzing image, please wait...</p>}

        <div className="action-buttons">
          <button className="cancel-button" onClick={handleCancel} disabled={loading}>
            Cancel
          </button>
          <button className="continue-button" onClick={handleUpload} disabled={loading}>
            {loading ? 'Analyzing...' : 'Analyze'}
          </button>
        </div>
      </div>
    </>
  );
}
