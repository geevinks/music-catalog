'use client';
import { useState, useCallback } from 'react';

export default function FileUpload({ type, onUpload, label }: { type: 'cover' | 'audio'; onUpload: (path: string) => void; label?: string }) {
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
        className={`border-2 border-dashed rounded-lg p-4 text-center transition ${dragActive ? 'border-gray-600 bg-blue-50' : 'border-gray-400'}`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <input type="file" id={`upload-${type}`} className="hidden" accept={type === 'audio' ? 'audio/*' : 'image/*'}
          onChange={e => e.target.files?.[0] && upload(e.target.files[0])} />
        <label htmlFor={`upload-${type}`} className="cursor-pointer text-blue-600">
          {uploading ? 'Загрузка...' : (label || (type === 'cover' ? 'Обложка' : 'Аудио'))}
        </label>
      </div>
      {error && (
        <p className="text-red-500  mt-1">{error}</p>
      )}
    </div>
  );
}