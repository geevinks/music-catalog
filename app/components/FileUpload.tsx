'use client';
import { useState, useCallback } from 'react';

export default function FileUpload({ 
  type, 
  onUpload, 
  label 
}: { 
  type: 'cover' | 'audio'; 
  onUpload: (path: string) => void; 
  label?: string;
}) {
  const [uploading, setUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [error, setError] = useState('');

  const upload = async (file: File) => {
    setUploading(true);
    setError('');
    
    const fd = new FormData();
    fd.append('file', file);
    fd.append('type', type);
    
    const res = await fetch('/api/upload', { method: 'POST', body: fd });
    const data = await res.json();
    
    if (data.success) {
      onUpload(data.path);
    } else {
      setError(data.error || 'Ошибка загрузки');
    }
    
    setUploading(false);
  };

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') setDragActive(true);
    else if (e.type === 'dragleave') setDragActive(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files?.[0]) upload(e.dataTransfer.files[0]);
  }, []);

  return (
    <div>
      <div 
        style={{
          border: `2px dashed ${dragActive ? '#3b82f6' : '#ccc'}`,
          borderRadius: '8px',
          padding: '16px',
          textAlign: 'center',
          backgroundColor: dragActive ? '#eff6ff' : 'transparent'
        }}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <input 
          type="file" 
          id={`upload-${type}`} 
          style={{ display: 'none' }}
          accept={type === 'audio' ? 'audio/*' : 'image/*'}
          onChange={e => e.target.files?.[0] && upload(e.target.files[0])} 
        />
        <label htmlFor={`upload-${type}`} style={{ cursor: 'pointer', color: '#3b82f6' }}>
          {uploading ? 'Загрузка...' : (label || (type === 'cover' ? 'Загрузить обложку' : 'Загрузить аудио'))}
        </label>
        <p style={{ fontSize: '12px', color: '#666', marginTop: '8px' }}>
          или перетащите файл сюда
        </p>
      </div>
      {error && <p style={{ color: 'red', marginTop: '4px', fontSize: '14px' }}>{error}</p>}
    </div>
  );
}