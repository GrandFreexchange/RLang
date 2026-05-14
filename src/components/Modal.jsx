import React, { useState, useEffect } from 'react';

export default function Modal({ isOpen, onClose, onSubmit, title, placeholder }) {
  const [value, setValue] = useState('');

  // Reset value when modal opens
  useEffect(() => {
    if (isOpen) setValue('');
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (value.trim()) {
      onSubmit(value.trim());
      onClose();
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content animate-slide-up">
        <h3 style={{ fontSize: '1.25rem', marginBottom: '1rem' }}>{title}</h3>
        <form onSubmit={handleSubmit}>
          <input 
            type="text" 
            className="input-field" 
            placeholder={placeholder}
            value={value}
            onChange={e => setValue(e.target.value)}
            autoFocus
          />
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
            <button type="button" className="btn btn-secondary" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn btn-primary" disabled={!value.trim()}>Create</button>
          </div>
        </form>
      </div>
    </div>
  );
}
