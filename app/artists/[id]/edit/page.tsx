'use client';
import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';

export default function EditArtistPage() {
  const params = useParams();
  const router = useRouter();
  const [name, setName] = useState('');
  const [country, setCountry] = useState('');
  const [birthYear, setBirthYear] = useState('');
  const [isActive, setIsActive] = useState(true);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetch(`/api/artists/${params.id}`)
      .then(res => res.json())
      .then(data => {
        setName(data.name);
        setCountry(data.country);
        setBirthYear(data.birthYear?.toString() || '');
        setIsActive(data.isActive);
        setLoading(false);
      })
      .catch(() => setError('Ошибка загрузки'));
  }, [params.id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    const res = await fetch(`/api/artists/${params.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name,
        country,
        birthYear: birthYear ? parseInt(birthYear) : null,
        isActive,
      }),
    });
    if (res.ok) {
      router.push(`/artists/${params.id}`);
    } else {
      const data = await res.json();
      setError(data.error || 'Ошибка');
      setSaving(false);
    }
  };

  if (loading) return <div>Загрузка...</div>;

  return (
    <div>
      <h1>Редактирование исполнителя</h1>
      {error && <div style={{ color: 'red' }}>{error}</div>}
      <form onSubmit={handleSubmit}>
        <div>
          <label>Имя *</label>
          <input
            type="text"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>
        <div>
          <label>Страна *</label>
          <input
            type="text"
            required
            value={country}
            onChange={(e) => setCountry(e.target.value)}
          />
        </div>
        <div>
          <label>Год основания</label>
          <input
            type="number"
            value={birthYear}
            onChange={(e) => setBirthYear(e.target.value)}
          />
        </div>
        <div>
          <label>
            <input
              type="checkbox"
              checked={isActive}
              onChange={(e) => setIsActive(e.target.checked)}
            />
            Активен
          </label>
        </div>
        <button type="submit" disabled={saving}>
          {saving ? 'Сохранение...' : 'Сохранить'}
        </button>
      </form>
    </div>
  );
}