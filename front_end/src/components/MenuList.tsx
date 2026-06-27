
// src/components/MenuList.tsx
import React from 'react';
import type { Dish } from '../types';

interface Props {
  menu: Dish[];
}

export const MenuList: React.FC<Props> = ({ menu }) => {
  return (
    <div className="card">
      <h2 className="mb-1">📜 قائمة الطعام والأسعار</h2>
      
      {!Array.isArray(menu) || menu.length === 0 ? (
        <p style={{ color: 'var(--text-muted)' }}>لا توجد أطباق متاحة حالياً أو هناك مشكلة في جلب البيانات.</p>
      ) : (
        <ul className="menu-list">
          {menu.map((dish) => (
            <li key={dish.id} className="menu-item">
              <span style={{ fontSize: '1.1rem' }}>{dish.dishName}</span>
              <span className="price-tag">{dish.price} ل.س</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};