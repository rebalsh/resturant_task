
// src/pages/admin/Dashboard.tsx
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiServices } from '../../api/services';
import type { Reservation, Dish } from '../../types';
import '../../App.css';

export const Dashboard: React.FC = () => {
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [menu, setMenu] = useState<Dish[]>([]);
  const [newDish, setNewDish] = useState({ dishName: '', price: '' });
  
  // حالات جديدة لإدارة التعديل المدمج والإشعارات
  const [editingDishId, setEditingDishId] = useState<string | null>(null);
  const [editName, setEditName] = useState<string>(''); // تعديل: إضافة حالة لتعديل الاسم
  const [editPrice, setEditPrice] = useState<number | ''>('');
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (!localStorage.getItem('admin_token')) {
      navigate('/admin/login');
      return;
    }
    loadData();
  }, [navigate]);

  // دالة لعرض الإشعارات تختفي تلقائياً
  const showToast = (message: string, type: 'success' | 'error') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const loadData = async () => {
    try {
      const resData = await apiServices.getReservations();
      const menuData = await apiServices.getMenu();
      setReservations(Array.isArray(resData) ? resData : []);
      setMenu(Array.isArray(menuData) ? menuData : []);
    } catch (err: any) {
      showToast(err.message || 'فشل في تحميل البيانات', 'error');
    }
  };

  const handleStatusChange = async (id: string, status: 'pending' | 'confirmed' | 'cancelled') => {
    const previousReservations = [...reservations];
    setReservations(prev => prev.map(res => res.id === id ? { ...res, status } : res));
    
    try {
      await apiServices.updateReservationStatus(id, status);
      showToast('تم تحديث حالة الحجز بنجاح', 'success');
    } catch (err: any) {
      setReservations(previousReservations); // التراجع في حال الفشل (Rollback)
      showToast(err.message || 'فشل في تحديث الحالة', 'error');
    }
  };

  const handleAddDish = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const addedDish = await apiServices.addDish({ dishName: newDish.dishName, price: Number(newDish.price) });
      setMenu(prev => [addedDish, ...prev]);
      setNewDish({ dishName: '', price: '' });
      showToast('تمت إضافة الطبق بنجاح', 'success');
    } catch (err: any) {
      showToast(err.message || 'فشل إضافة الطبق', 'error');
    }
  };

  // دوال التعديل المدمج (Inline Editing)
  const startEditing = (dish: Dish) => {
    setEditingDishId(dish.id);
    setEditName(dish.dishName); // تعديل: تعيين الاسم الحالي عند بدء التعديل
    setEditPrice(dish.price);
  };

  const cancelEditing = () => {
    setEditingDishId(null);
    setEditName('');
    setEditPrice('');
  };

  const saveDishData = async (id: string) => {
    if (!editName.trim()) {
      showToast('يرجى إدخال اسم طبق صالح', 'error');
      return;
    }
    if (editPrice === '' || isNaN(Number(editPrice)) || Number(editPrice) <= 0) {
      showToast('يرجى إدخال سعر صالح وموجب', 'error');
      return;
    }

    const updatedPrice = Number(editPrice);
    const updatedName = editName.trim();
    const previousMenu = [...menu];
    
    // Optimistic Update (تحديث فوري بالواجهة)
    setMenu(prev => prev.map(dish => dish.id === id ? { ...dish, dishName: updatedName, price: updatedPrice } : dish));
    setEditingDishId(null);

    try {
      await apiServices.updateDish(id, { dishName: updatedName, price: updatedPrice });
      showToast('تم تحديث البيانات بنجاح', 'success');
    } catch (err: any) {
      setMenu(previousMenu); // Rollback في حال الفشل
      showToast(err.message || 'فشل في تحديث البيانات', 'error');
    }
  };

  // دالة حذف الطبق
  const handleDeleteDish = async (id: string) => {
    if (!window.confirm('هل أنت متأكد من رغبتك في حذف هذا الطبق؟')) return;

    const previousMenu = [...menu];
    // Optimistic Update (حذف فوري من الواجهة)
    setMenu(prev => prev.filter(dish => dish.id !== id));

    try {
      await apiServices.deleteDish(id);
      showToast('تم حذف الطبق بنجاح', 'success');
    } catch (err: any) {
      setMenu(previousMenu); // Rollback في حال الفشل
      showToast(err.message || 'فشل في حذف الطبق', 'error');
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate('/admin/login');
  };

  const getStatusBadge = (status: string) => {
    switch(status) {
      case 'confirmed': return <span className="badge badge-confirmed">مؤكد</span>;
      case 'cancelled': return <span className="badge badge-cancelled">ملغى</span>;
      default: return <span className="badge badge-pending">قيد الانتظار</span>;
    }
  };

  return (
    <div className="dashboard-layout">
      {/* نظام الإشعارات العائم */}
      {toast && (
        <div style={{
          position: 'fixed', top: '20px', left: '50%', transform: 'translateX(-50%)',
          zIndex: 1000, padding: '10px 20px', borderRadius: '8px', fontWeight: 'bold',
          backgroundColor: toast.type === 'success' ? '#10b981' : '#ef4444',
          color: 'white', boxShadow: 'var(--shadow)', transition: 'all 0.3s'
        }}>
          {toast.message}
        </div>
      )}

      <header className="dashboard-header">
        <h2 style={{ margin: 0 }}>💼 لوحة تحكم الإدارة</h2>
        <button onClick={handleLogout} className="btn btn-danger">تسجيل الخروج</button>
      </header>

      <div className="container" style={{ maxWidth: '1200px' }}>
        {/* الحجوزات */}
        <div className="card">
          <h3 className="mb-1">📅 جدول الحجوزات القادمة</h3>
          <div className="table-responsive">
            <table className="data-table">
              <thead>
                <tr>
                  <th>الاسم</th>
                  <th>الإيميل</th>
                  <th>التاريخ والوقت</th>
                  <th>الزوار</th>
                  <th>الحالة</th>
                  <th>العمليات</th>
                </tr>
              </thead>
              <tbody>
                {reservations.length === 0 ? (
                  <tr><td colSpan={6} className="text-center">لا توجد حجوزات مسجلة حالياً.</td></tr>
                ) : (
                  reservations.map((res) => (
                    <tr key={res.id}>
                      <td>{res.name}</td>
                      <td>{res.email}</td>
                      <td><strong style={{color: 'var(--primary)'}}>{res.date}</strong> - {res.time}</td>
                      <td>{res.guests} أشخاص</td>
                      <td>{getStatusBadge(res.status)}</td>
                      <td>
                        {res.status === 'pending' && (
                          <div style={{ display: 'flex', gap: '8px' }}>
                            <button onClick={() => handleStatusChange(res.id, 'confirmed')} className="btn btn-success btn-sm">موافقة</button>
                            <button onClick={() => handleStatusChange(res.id, 'cancelled')} className="btn btn-danger btn-sm">إلغاء</button>
                          </div>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* إدارة المنيو */}
        <div className="card mt-2">
          <h3 className="mb-1">📝 إدارة قائمة الطعام (المنيو)</h3>
          
          <form onSubmit={handleAddDish} style={{ display: 'flex', gap: '10px', marginBottom: '20px', flexWrap: 'wrap' }}>
            <input className="input-field" style={{ flex: '1', minWidth: '200px' }} type="text" placeholder="اسم الطبق" value={newDish.dishName} onChange={(e) => setNewDish({ ...newDish, dishName: e.target.value })} required />
            <input className="input-field" style={{ width: '150px' }} type="number" placeholder="السعر" value={newDish.price} onChange={(e) => setNewDish({ ...newDish, price: e.target.value })} required />
            <button type="submit" className="btn btn-primary">إضافة طبق</button>
          </form>

          <ul className="menu-list">
            {menu.map((dish) => (
              <li key={dish.id} className="menu-item" style={{ maxWidth: '700px' }}>
                
                {/* منطق التعديل المدمج الشامل (اسم + سعر) */}
                {editingDishId === dish.id ? (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', width: '100%' }}>
                    <input 
                      type="text" 
                      className="input-field" 
                      style={{ flex: '2', padding: '0.4rem' }} 
                      value={editName} 
                      onChange={(e) => setEditName(e.target.value)} 
                    />
                    <input 
                      type="number" 
                      className="input-field" 
                      style={{ flex: '1', width: '90px', padding: '0.4rem' }} 
                      value={editPrice} 
                      onChange={(e) => setEditPrice(Number(e.target.value))} 
                    />
                    <button onClick={() => saveDishData(dish.id)} className="btn btn-success btn-sm">حفظ</button>
                    <button onClick={cancelEditing} className="btn btn-danger btn-sm">إلغاء</button>
                  </div>
                ) : (
                  <>
                    <span style={{ fontSize: '1.1rem', fontWeight: '500' }}>{dish.dishName}</span>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                      <span className="price-tag">{dish.price} ل.س</span>
                      <button onClick={() => startEditing(dish)} className="btn btn-warning btn-sm">تعديل</button>
                      <button onClick={() => handleDeleteDish(dish.id)} className="btn btn-danger btn-sm">حذف</button>
                    </div>
                  </>
                )}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};