// // src/pages/admin/Dashboard.tsx
// import React, { useEffect, useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { apiServices } from '../../api/services';
// import type { Reservation, Dish } from '../../types';

// export const Dashboard: React.FC = () => {
//   const [reservations, setReservations] = useState<Reservation[]>([]);
//   const [menu, setMenu] = useState<Dish[]>([]);
//   const [newDish, setNewDish] = useState({ dishName: '', price: '' });
//   const [error, setError] = useState<string | null>(null);
//   const navigate = useNavigate();

//   useEffect(() => {
//     if (!localStorage.getItem('admin_token')) {
//       navigate('/admin/login');
//       return;
//     }
//     loadData();
//   }, [navigate]);

//   const loadData = async () => {
//     try {
//       setError(null);
//       const resData = await apiServices.getReservations();
//       const menuData = await apiServices.getMenu();
//       setReservations(Array.isArray(resData) ? resData : []);
//       setMenu(Array.isArray(menuData) ? menuData : []);
//     } catch (err: any) {
//       setError(err.message || 'فشل في تحميل البيانات الصادرة من السيرفر');
//     }
//   };

//   // --- دوال التحديث الفوري (Optimistic Updates) ---

//   const handleStatusChange = async (id: string, status: 'pending' | 'confirmed' | 'cancelled') => {
//     // 1. تحديث الواجهة فوراً قبل حتى أن يرد السيرفر (لسرعة الاستجابة)
//     setReservations(prev => prev.map(res => res.id === id ? { ...res, status } : res));

//     // 2. إرسال الطلب للسيرفر في الخلفية
//     try {
//       await apiServices.updateReservationStatus(id, status);
//     } catch (err: any) {
//       alert(err.message);
//       loadData(); // إذا فشل السيرفر لسبب ما، نتراجع عن التحديث بالواجهة
//     }
//   };

//   const handleAddDish = async (e: React.FormEvent) => {
//     e.preventDefault();
//     try {
//       const addedDish = await apiServices.addDish({ dishName: newDish.dishName, price: Number(newDish.price) });
//       // وضع الطبق الجديد فوراً في أول المنيو على الشاشة
//       setMenu(prev => [addedDish, ...prev]);
//       setNewDish({ dishName: '', price: '' });
//     } catch (err: any) {
//       alert(err.message);
//     }
//   };

//   const handleUpdatePrice = async (id: string, currentPrice: number) => {
//     const newPrice = prompt("أدخل السعر الجديد للطبق:", currentPrice.toString());
//     if (!newPrice || isNaN(Number(newPrice))) return;

//     const updatedPrice = Number(newPrice);
    
//     // تحديث السعر على الشاشة دغري
//     setMenu(prev => prev.map(dish => dish.id === id ? { ...dish, price: updatedPrice } : dish));

//     try {
//       await apiServices.updateDishPrice(id, updatedPrice);
//     } catch (err: any) {
//       alert(err.message);
//       loadData(); // التراجع إذا حدث خطأ
//     }
//   };

//   const handleLogout = () => {
//     localStorage.clear();
//     navigate('/admin/login');
//   };

//   return (
//     <div style={{ padding: '20px', direction: 'rtl', fontFamily: 'sans-serif', color: '#fff', backgroundColor: '#16171d', minHeight: '100vh' }}>
//       <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '2px solid #ccc', paddingBottom: '10px' }}>
//         <h2>💼 لوحة تحكم الإدارة</h2>
//         <button onClick={handleLogout} style={{ backgroundColor: '#dc3545', color: '#fff', padding: '5px 15px', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>تسجيل الخروج</button>
//       </div>

//       {error && <div style={{ color: 'red', margin: '15px 0', fontWeight: 'bold' }}>⚠️ {error}</div>}

//       {/* جدول الحجوزات */}
//       <section style={{ marginTop: '30px' }}>
//         <h3>📅 جدول الحجوزات القادمة</h3>
//         <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '10px', color: '#333', backgroundColor: '#fff' }}>
//           <thead>
//             <tr style={{ backgroundColor: '#f2f2f2', textAlign: 'right' }}>
//               <th style={{ padding: '10px', border: '1px solid #ddd' }}>الاسم</th>
//               <th style={{ padding: '10px', border: '1px solid #ddd' }}>الإيميل</th>
//               <th style={{ padding: '10px', border: '1px solid #ddd' }}>التاريخ والوقت</th>
//               <th style={{ padding: '10px', border: '1px solid #ddd' }}>الزوار</th>
//               <th style={{ padding: '10px', border: '1px solid #ddd' }}>الحالة</th>
//               <th style={{ padding: '10px', border: '1px solid #ddd' }}>العمليات</th>
//             </tr>
//           </thead>
//           <tbody>
//             {reservations.length === 0 ? (
//               <tr><td colSpan={6} style={{ padding: '10px', textAlign: 'center' }}>لا توجد حجوزات مسجلة حالياً.</td></tr>
//             ) : (
//               reservations.map((res) => (
//                 <tr key={res.id}>
//                   <td style={{ padding: '10px', border: '1px solid #ddd' }}>{res.name}</td>
//                   <td style={{ padding: '10px', border: '1px solid #ddd' }}>{res.email}</td>
//                   <td style={{ padding: '10px', border: '1px solid #ddd' }}>{res.date} الساعة {res.time}</td>
//                   <td style={{ padding: '10px', border: '1px solid #ddd' }}>{res.guests}</td>
//                   <td style={{ padding: '10px', border: '1px solid #ddd', fontWeight: 'bold', color: res.status === 'confirmed' ? 'green' : res.status === 'cancelled' ? 'red' : 'orange' }}>{res.status.toUpperCase()}</td>
//                   <td style={{ padding: '10px', border: '1px solid #ddd', gap: '5px', display: 'flex' }}>
//                     {res.status === 'pending' && (
//                       <>
//                         <button onClick={() => handleStatusChange(res.id, 'confirmed')} style={{ backgroundColor: '#28a745', color: '#fff', border: 'none', padding: '5px 10px', borderRadius: '3px', cursor: 'pointer' }}>موافقة</button>
//                         <button onClick={() => handleStatusChange(res.id, 'cancelled')} style={{ backgroundColor: '#dc3545', color: '#fff', border: 'none', padding: '5px 10px', borderRadius: '3px', cursor: 'pointer' }}>إلغاء (رفض)</button>
//                       </>
//                     )}
//                   </td>
//                 </tr>
//               ))
//             )}
//           </tbody>
//         </table>
//       </section>

//       {/* إدارة المنيو */}
//       <section style={{ marginTop: '50px', borderTop: '1px solid #ccc', paddingTop: '20px' }}>
//         <h3>📝 إدارة قائمة الطعام (المنيو)</h3>
//         <form onSubmit={handleAddDish} style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
//           <input type="text" placeholder="اسم الطبق" value={newDish.dishName} onChange={(e) => setNewDish({ ...newDish, dishName: e.target.value })} required style={{ padding: '8px', color: '#333' }} />
//           <input type="number" placeholder="السعر" value={newDish.price} onChange={(e) => setNewDish({ ...newDish, price: e.target.value })} required style={{ padding: '8px', color: '#333' }} />
//           <button type="submit" style={{ backgroundColor: '#007bff', color: '#fff', border: 'none', padding: '8px 15px', borderRadius: '5px', cursor: 'pointer' }}>إضافة طبق</button>
//         </form>

//         <ul style={{ listStyle: 'none', padding: 0 }}>
//           {menu.map((dish) => (
//             <li key={dish.id} style={{ display: 'flex', justifyContent: 'space-between', padding: '10px', borderBottom: '1px solid #eee', maxWidth: '500px' }}>
//               <span>{dish.dishName} - {dish.price} ل.س</span>
//               <button onClick={() => handleUpdatePrice(dish.id, dish.price)} style={{ backgroundColor: '#ffc107', color: '#000', border: 'none', padding: '3px 8px', borderRadius: '3px', cursor: 'pointer' }}>تعديل السعر</button>
//             </li>
//           ))}
//         </ul>
//       </section>
//     </div>
//   );
// };






// // src/pages/admin/Dashboard.tsx
// import React, { useEffect, useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { apiServices } from '../../api/services';
// import type { Reservation, Dish } from '../../types';
// import '../../App.css';

// export const Dashboard: React.FC = () => {
//   const [reservations, setReservations] = useState<Reservation[]>([]);
//   const [menu, setMenu] = useState<Dish[]>([]);
//   const [newDish, setNewDish] = useState({ dishName: '', price: '' });
//   const [error, setError] = useState<string | null>(null);
//   const navigate = useNavigate();

//   useEffect(() => {
//     if (!localStorage.getItem('admin_token')) {
//       navigate('/admin/login');
//       return;
//     }
//     loadData();
//   }, [navigate]);

//   const loadData = async () => {
//     try {
//       setError(null);
//       const resData = await apiServices.getReservations();
//       const menuData = await apiServices.getMenu();
//       setReservations(Array.isArray(resData) ? resData : []);
//       setMenu(Array.isArray(menuData) ? menuData : []);
//     } catch (err: any) {
//       setError(err.message || 'فشل في تحميل البيانات الصادرة من السيرفر');
//     }
//   };

//   const handleStatusChange = async (id: string, status: 'pending' | 'confirmed' | 'cancelled') => {
//     setReservations(prev => prev.map(res => res.id === id ? { ...res, status } : res));
//     try {
//       await apiServices.updateReservationStatus(id, status);
//     } catch (err: any) {
//       alert(err.message);
//       loadData();
//     }
//   };

//   const handleAddDish = async (e: React.FormEvent) => {
//     e.preventDefault();
//     try {
//       const addedDish = await apiServices.addDish({ dishName: newDish.dishName, price: Number(newDish.price) });
//       setMenu(prev => [addedDish, ...prev]);
//       setNewDish({ dishName: '', price: '' });
//     } catch (err: any) {
//       alert(err.message);
//     }
//   };

//   const handleUpdatePrice = async (id: string, currentPrice: number) => {
//     const newPrice = prompt("أدخل السعر الجديد للطبق:", currentPrice.toString());
//     if (!newPrice || isNaN(Number(newPrice))) return;

//     const updatedPrice = Number(newPrice);
//     setMenu(prev => prev.map(dish => dish.id === id ? { ...dish, price: updatedPrice } : dish));
//     try {
//       await apiServices.updateDishPrice(id, updatedPrice);
//     } catch (err: any) {
//       alert(err.message);
//       loadData();
//     }
//   };

//   const handleLogout = () => {
//     localStorage.clear();
//     navigate('/admin/login');
//   };

//   const getStatusBadge = (status: string) => {
//     switch(status) {
//       case 'confirmed': return <span className="badge badge-confirmed">مؤكد</span>;
//       case 'cancelled': return <span className="badge badge-cancelled">ملغى</span>;
//       default: return <span className="badge badge-pending">قيد الانتظار</span>;
//     }
//   };

//   return (
//     <div className="dashboard-layout">
//       <header className="dashboard-header">
//         <h2 style={{ margin: 0 }}>💼 لوحة تحكم الإدارة</h2>
//         <button onClick={handleLogout} className="btn btn-danger">تسجيل الخروج</button>
//       </header>

//       <div className="container" style={{ maxWidth: '1200px' }}>
//         {error && <div className="alert alert-error">⚠️ {error}</div>}

//         {/* الحجوزات */}
//         <div className="card">
//           <h3 className="mb-1">📅 جدول الحجوزات القادمة</h3>
//           <div className="table-responsive">
//             <table className="data-table">
//               <thead>
//                 <tr>
//                   <th>الاسم</th>
//                   <th>الإيميل</th>
//                   <th>التاريخ والوقت</th>
//                   <th>الزوار</th>
//                   <th>الحالة</th>
//                   <th>العمليات</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {reservations.length === 0 ? (
//                   <tr><td colSpan={6} className="text-center">لا توجد حجوزات مسجلة حالياً.</td></tr>
//                 ) : (
//                   reservations.map((res) => (
//                     <tr key={res.id}>
//                       <td>{res.name}</td>
//                       <td>{res.email}</td>
//                       <td><strong style={{color: 'var(--primary)'}}>{res.date}</strong> - {res.time}</td>
//                       <td>{res.guests} أشخاص</td>
//                       <td>{getStatusBadge(res.status)}</td>
//                       <td>
//                         {res.status === 'pending' && (
//                           <div style={{ display: 'flex', gap: '8px' }}>
//                             <button onClick={() => handleStatusChange(res.id, 'confirmed')} className="btn btn-success btn-sm">موافقة</button>
//                             <button onClick={() => handleStatusChange(res.id, 'cancelled')} className="btn btn-danger btn-sm">إلغاء</button>
//                           </div>
//                         )}
//                       </td>
//                     </tr>
//                   ))
//                 )}
//               </tbody>
//             </table>
//           </div>
//         </div>

//         {/* إدارة المنيو */}
//         <div className="card mt-2">
//           <h3 className="mb-1">📝 إدارة قائمة الطعام (المنيو)</h3>
          
//           <form onSubmit={handleAddDish} style={{ display: 'flex', gap: '10px', marginBottom: '20px', flexWrap: 'wrap' }}>
//             <input className="input-field" style={{ flex: '1', minWidth: '200px' }} type="text" placeholder="اسم الطبق" value={newDish.dishName} onChange={(e) => setNewDish({ ...newDish, dishName: e.target.value })} required />
//             <input className="input-field" style={{ width: '150px' }} type="number" placeholder="السعر" value={newDish.price} onChange={(e) => setNewDish({ ...newDish, price: e.target.value })} required />
//             <button type="submit" className="btn btn-primary">إضافة طبق</button>
//           </form>

//           <ul className="menu-list">
//             {menu.map((dish) => (
//               <li key={dish.id} className="menu-item" style={{ maxWidth: '600px' }}>
//                 <span style={{ fontSize: '1.1rem', fontWeight: '500' }}>{dish.dishName}</span>
//                 <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
//                   <span className="price-tag">{dish.price} ل.س</span>
//                   <button onClick={() => handleUpdatePrice(dish.id, dish.price)} className="btn btn-warning btn-sm">تعديل السعر</button>
//                 </div>
//               </li>
//             ))}
//           </ul>
//         </div>
//       </div>
//     </div>
//   );
// };














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
    setEditPrice(dish.price);
  };

  const cancelEditing = () => {
    setEditingDishId(null);
    setEditPrice('');
  };

  const saveDishPrice = async (id: string) => {
    if (editPrice === '' || isNaN(Number(editPrice))) {
      showToast('يرجى إدخال سعر صالح', 'error');
      return;
    }

    const updatedPrice = Number(editPrice);
    const previousMenu = [...menu];
    
    // Optimistic Update
    setMenu(prev => prev.map(dish => dish.id === id ? { ...dish, price: updatedPrice } : dish));
    setEditingDishId(null);

    try {
      await apiServices.updateDishPrice(id, updatedPrice);
      showToast('تم تحديث السعر بنجاح', 'success');
    } catch (err: any) {
      setMenu(previousMenu); // Rollback
      showToast(err.message || 'فشل في تحديث السعر', 'error');
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
              <li key={dish.id} className="menu-item" style={{ maxWidth: '600px' }}>
                <span style={{ fontSize: '1.1rem', fontWeight: '500' }}>{dish.dishName}</span>
                
                {/* منطق التعديل المدمج */}
                {editingDishId === dish.id ? (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <input 
                      type="number" 
                      className="input-field" 
                      style={{ width: '100px', padding: '0.4rem' }} 
                      value={editPrice} 
                      onChange={(e) => setEditPrice(Number(e.target.value))} 
                      autoFocus
                    />
                    <button onClick={() => saveDishPrice(dish.id)} className="btn btn-success btn-sm">حفظ</button>
                    <button onClick={cancelEditing} className="btn btn-danger btn-sm">إلغاء</button>
                  </div>
                ) : (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                    <span className="price-tag">{dish.price} ل.س</span>
                    <button onClick={() => startEditing(dish)} className="btn btn-warning btn-sm">تعديل السعر</button>
                  </div>
                )}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};