

// src/pages/Home.tsx
import React, { useEffect, useState } from 'react';
import { MenuList } from '../components/MenuList';
import { BookingForm } from '../components/BookingForm';
import { apiServices } from '../api/services';
import type { Dish } from '../types';
import '../App.css'; // تأكد من استدعاء الستايل هنا

export const Home: React.FC = () => {
  const [menu, setMenu] = useState<Dish[]>([]);

  useEffect(() => {
    apiServices.getMenu()
      .then(data => setMenu(data))
      .catch(err => console.error("Error fetching menu:", err));
  }, []);

  return (
    <div className="container">
      <header className="text-center mb-2">
        <h1 style={{ color: 'var(--primary)' }}>🍽️ مطعمنا الاحترافي</h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '1.2rem' }}>
          أهلاً بك! يمكنك تصفح المنيو وحجز طاولتك مباشرة.
        </p>
      </header>
      
      <MenuList menu={menu} />
      <BookingForm />
    </div>
  );
};