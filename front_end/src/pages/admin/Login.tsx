
// src/pages/admin/Login.tsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiServices } from '../../api/services';
import '../../App.css';

export const Login: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const data = await apiServices.adminLogin({ username, password });
      localStorage.setItem('admin_token', data.token);
      localStorage.setItem('admin_user', data.username);
      navigate('/admin/dashboard');
    } catch (err: any) {
      setError(err.message || 'بيانات الدخول غير صحيحة');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: 'var(--bg-light)' }}>
      <div className="card" style={{ width: '100%', maxWidth: '400px' }}>
        <h2 className="text-center mb-2">🔐 تسجيل دخول الإدارة</h2>
        
        {error && <div className="alert alert-error">{error}</div>}
        
        <form onSubmit={handleLogin} className="form-group">
          <input className="input-field" type="text" placeholder="اسم المستخدم" value={username} onChange={(e) => setUsername(e.target.value)} required />
          <input className="input-field" type="password" placeholder="كلمة المرور" value={password} onChange={(e) => setPassword(e.target.value)} required />
          
          <button type="submit" disabled={loading} className="btn btn-primary" style={{ marginTop: '10px' }}>
            {loading ? 'جاري التحقق...' : 'تسجيل الدخول'}
          </button>
        </form>
      </div>
    </div>
  );
};