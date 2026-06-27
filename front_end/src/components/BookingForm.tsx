
    // src/components/BookingForm.tsx
import React, { useState } from 'react';
import { apiServices } from '../api/services';

export const BookingForm: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '', email: '', date: '', time: '', guests: 1
  });
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const hours = Array.from({ length: 11 }, (_, i) => `${i + 13}:00`);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);
    setError(null);
    setLoading(true);

    try {
      await apiServices.createReservation({
        name: formData.name,
        email: formData.email,
        date: formData.date,
        time: formData.time,
        guests: Number(formData.guests)
      });
      setMessage('تم استلام طلبك بنجاح، يرجى تفقّد إيميلك عند موافقة الإدارة.');
      setFormData({ name: '', email: '', date: '', time: '', guests: 1 });
    } catch (err: any) {
      setError(err.message || 'حدث خطأ أثناء الحجز');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card mt-2">
      <h2 className="mb-1">📅 حجز طاولة</h2>
      
      {message && <div className="alert alert-success">{message}</div>}
      {error && <div className="alert alert-error">{error}</div>}
      
      <form onSubmit={handleSubmit} className="form-group">
        <input className="input-field" type="text" name="name" value={formData.name} onChange={handleChange} placeholder="الاسم الكريم" required />
        <input className="input-field" type="email" name="email" value={formData.email} onChange={handleChange} placeholder="البريد الإلكتروني" required />
        <input className="input-field" type="date" name="date" value={formData.date} onChange={handleChange} required />
        
        <select className="input-field" name="time" value={formData.time} onChange={handleChange} required>
          <option value="" disabled>اختر الوقت (ساعات حصراً)</option>
          {hours.map(h => <option key={h} value={h}>{h}</option>)}
        </select>
        
        <input className="input-field" type="number" name="guests" min="1" max="20" value={formData.guests} onChange={handleChange} placeholder="عدد الزوار" required />
       
        <button type="submit" disabled={loading} className="btn btn-primary" style={{ marginTop: '10px' }}>
          {loading ? 'جاري الإرسال...' : 'تأكيد الحجز'}
        </button>
      </form>
    </div>
  );
};