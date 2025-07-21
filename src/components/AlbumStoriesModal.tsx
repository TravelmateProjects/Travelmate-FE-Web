import React, { useState, useEffect } from 'react';
import Modal from 'react-bootstrap/Modal';

interface AlbumStoriesModalProps {
  show: boolean;
  onHide: () => void;
  images: { _id?: string; url: string }[];
  albumName?: string;
}

const AlbumStoriesModal: React.FC<AlbumStoriesModalProps> = ({ show, onHide, images, albumName }) => {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    if (show) setCurrent(0);
  }, [show, images]);

  if (!images || images.length === 0) return null;

  const goNext = () => setCurrent((prev) => (prev + 1) % images.length);
  const goPrev = () => setCurrent((prev) => (prev - 1 + images.length) % images.length);

  return (
    <Modal show={show} onHide={onHide} centered size="lg" backdrop style={{ background: 'rgba(0,0,0,0.85)' }}>
      <Modal.Body style={{ padding: 0, background: 'rgba(0,0,0,0.95)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: 400 }}>
        {/* Progress bar */}
        <div style={{ display: 'flex', gap: 4, width: '100%', justifyContent: 'center', margin: '16px 0 8px 0' }}>
          {images.map((img, idx) => (
            <div key={img._id || idx} style={{ flex: 1, height: 4, borderRadius: 2, background: idx <= current ? '#0dcaf0' : '#444', transition: 'background 0.2s' }} />
          ))}
        </div>
        {/* Image */}
        <div style={{ position: 'relative', width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <button onClick={goPrev} style={{ position: 'absolute', left: 0, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: '#fff', fontSize: 32, cursor: 'pointer', zIndex: 2, padding: 8 }}>&#8592;</button>
          <img
            src={images[current].url}
            alt={`story-img-${current}`}
            style={{ maxHeight: 420, maxWidth: '90vw', borderRadius: 16, boxShadow: '0 4px 32px rgba(0,0,0,0.25)' }}
          />
          <button onClick={goNext} style={{ position: 'absolute', right: 0, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: '#fff', fontSize: 32, cursor: 'pointer', zIndex: 2, padding: 8 }}>&#8594;</button>
        </div>
        {/* Album name and counter */}
        <div style={{ color: '#fff', marginTop: 16, fontWeight: 600, fontSize: 18, textAlign: 'center' }}>{albumName}</div>
        <div style={{ color: '#aaa', fontSize: 14, marginTop: 2 }}>{current + 1} / {images.length}</div>
      </Modal.Body>
    </Modal>
  );
};

export default AlbumStoriesModal;
