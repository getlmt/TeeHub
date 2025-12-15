import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import './ImageUploader.css';

const ImageUploader = ({ title, description, onImageSelected, inputId, disabled = false, disabledMessage = "" }) => {
  const [preview, setPreview] = useState(null);

  const onDrop = useCallback((acceptedFiles) => {
    if (acceptedFiles && acceptedFiles.length > 0) {
      const file = acceptedFiles[0];
      const reader = new FileReader();
      
      reader.onload = (e) => {
        const base64String = e.target.result;
        const base64Data = base64String.split(',')[1];
        
        setPreview(base64String);
        
        onImageSelected({
          base64: base64Data,
          mimeType: file.type,
          preview: base64String,
        });
      };
      
      reader.readAsDataURL(file);
    }
  }, [onImageSelected]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.webp']
    },
    maxFiles: 1,
    disabled: disabled || preview !== null,
  });

  const handleRemove = (e) => {
    e.stopPropagation();
    setPreview(null);
    onImageSelected(null);
  };

  const handleChange = (e) => {
    e.stopPropagation();
    setPreview(null);
    onImageSelected(null);
  };

  if (disabled) {
    return (
      <div className="upload-card-modern disabled">
        <div className="upload-glow"></div>
        <div className="upload-content-modern">
          <div className="spinner-container">
            <svg className="spinner-modern" viewBox="0 0 50 50">
              <defs>
                <linearGradient id="spinner-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#06b6d4" />
                  <stop offset="50%" stopColor="#3b82f6" />
                  <stop offset="100%" stopColor="#8b5cf6" />
                </linearGradient>
              </defs>
              <circle className="spinner-path" cx="25" cy="25" r="20" fill="none" strokeWidth="3"></circle>
            </svg>
          </div>
          <h3 className="upload-title-modern">{title}</h3>
          <p className="processing-text">{disabledMessage || "Đang xử lý AI..."}</p>
        </div>
      </div>
    );
  }

  if (preview) {
    return (
      <div className="upload-card-modern preview">
        <div className="upload-glow active"></div>
        <div className="preview-wrapper">
          <img src={preview} alt="Preview" className="preview-img" />
          <div className="preview-gradient"></div>
          <div className="preview-actions-overlay">
            <div className="preview-badge">
              <svg className="badge-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M5 13l4 4L19 7" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              <span>Đã tải lên</span>
            </div>
            <div className="action-buttons-group">
              <button onClick={handleRemove} className="action-btn-modern remove" type="button">
                <svg className="btn-icon-modern" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M3 6h18M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2" strokeLinecap="round" strokeLinejoin="round"/>
                  <line x1="10" y1="11" x2="10" y2="17" strokeLinecap="round"/>
                  <line x1="14" y1="11" x2="14" y2="17" strokeLinecap="round"/>
                </svg>
                <span>Xóa ảnh</span>
              </button>
              <button onClick={handleChange} {...getRootProps()} className="action-btn-modern change" type="button">
                <svg className="btn-icon-modern" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M21.5 2v6h-6M2.5 22v-6h6M2 11.5a10 10 0 0118.8-4.3M22 12.5a10 10 0 01-18.8 4.2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                <span>Đổi ảnh khác</span>
              </button>
            </div>
          </div>
        </div>
        <input {...getInputProps()} id={inputId} />
      </div>
    );
  }

  return (
    <div className="upload-card-modern">
      <div className="upload-glow"></div>
      <div className="upload-header-modern">
        <p className="upload-category">{title}</p>
        <p className="upload-description-modern">{description}</p>
      </div>
      
      <div {...getRootProps()} className={`dropzone-modern ${isDragActive ? 'active' : ''}`}>
        <input {...getInputProps()} id={inputId} />
        <div className="dropzone-content">
          <div className="icon-wrapper-modern">
            <svg className="upload-icon-modern" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M17 8l-5-5-5 5M12 3v12" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            {isDragActive && (
              <>
                <div className="pulse-ring"></div>
                <div className="pulse-ring delay-1"></div>
              </>
            )}
          </div>
          
          <div className="dropzone-text">
            <p className="dropzone-main-text">
              {isDragActive ? 'Thả ảnh vào đây ngay!' : 'Kéo thả ảnh hoặc'}
            </p>
            {!isDragActive && (
              <button type="button" className="select-btn-modern">
                <svg className="btn-icon-small-modern" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M9 13h6m-3-3v6m5 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                <span className="btn-text-gradient">Chọn ảnh từ máy</span>
              </button>
            )}
          </div>
          
          <div className="file-hint-modern">
            <svg className="hint-icon-modern" viewBox="0 0 24 24" fill="currentColor">
              <circle cx="12" cy="12" r="10" opacity="0.15"/>
              <path d="M12 16v-4m0-4h.01M22 12c0 5.523-4.477 10-10 10S2 17.523 2 12 6.477 2 12 2s10 4.477 10 10z" fill="none" stroke="currentColor" strokeWidth="1.5"/>
            </svg>
            <span>PNG, JPG, JPEG, WEBP • Tối đa 10MB</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ImageUploader;
