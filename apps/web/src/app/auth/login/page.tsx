'use client';

import { useState } from 'react';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    // Demo login
    if (email === 'admin@shop.com' && password === 'admin123') {
      // Store auth token
      localStorage.setItem('auth_token', 'demo-token-123');
      localStorage.setItem('user', JSON.stringify({
        id: '1',
        email: 'admin@shop.com',
        name: 'Admin User',
        role: 'admin'
      }));
      window.location.href = localStorage.getItem('redirectAfterLogin') || '/admin';
      localStorage.removeItem('redirectAfterLogin');
    } else if (email === 'user@shop.com' && password === 'user123') {
      localStorage.setItem('auth_token', 'demo-token-456');
      localStorage.setItem('user', JSON.stringify({
        id: '2',
        email: 'user@shop.com',
        name: 'John Doe',
        role: 'customer'
      }));

      // Seed test orders if not exist
      if (!localStorage.getItem('orders_seeded')) {
        const testOrders = [
          { id: 'ord-001', userId: '2', items: [{ id: '6c2b7e46-863a-43ac-a093-dad13dd0acf6', name: 'iPad Air M2', price: 599, image: 'https://picsum.photos/400/400?random=1', quantity: 1 }, { id: '98f7e7bc-bbbc-4e6c-a542-4b2ed93db896', name: 'Nike Air Max 90', price: 129, image: 'https://picsum.photos/400/400?random=2', quantity: 2 }], total: 857, status: 'delivered', date: '۱۴۰۴/۰۴/۱۰' },
          { id: 'ord-002', userId: '2', items: [{ id: 'e4c19cd5-5452-449e-8e76-21a61505d2b6', name: 'Sony WH-1000XM5', price: 349, image: 'https://picsum.photos/400/400?random=3', quantity: 1 }], total: 349, status: 'shipped', date: '۱۴۰۴/۰۴/۱۵' },
          { id: 'ord-003', userId: '2', items: [{ id: '9bdee628-fadf-4b2e-b68b-26cc4c07e7ca', name: 'MacBook Pro M3', price: 1999, image: 'https://picsum.photos/400/400?random=4', quantity: 1 }], total: 1999, status: 'pending', date: '۱۴۰۴/۰۴/۱۸' },
          { id: 'ord-004', userId: '2', items: [{ id: '6c2b7e46-863a-43ac-a093-dad13dd0acf6', name: 'iPad Air M2', price: 599, image: 'https://picsum.photos/400/400?random=1', quantity: 1 }], total: 599, status: 'delivered', date: '۱۴۰۴/۰۳/۲۰' },
          { id: 'ord-005', userId: '2', items: [{ id: '98f7e7bc-bbbc-4e6c-a542-4b2ed93db896', name: 'Nike Air Max 90', price: 129, image: 'https://picsum.photos/400/400?random=2', quantity: 3 }], total: 387, status: 'shipped', date: '۱۴۰۴/۰۳/۲۲' },
          { id: 'ord-006', userId: '2', items: [{ id: 'e4c19cd5-5452-449e-8e76-21a61505d2b6', name: 'Sony WH-1000XM5', price: 349, image: 'https://picsum.photos/400/400?random=3', quantity: 2 }], total: 698, status: 'pending', date: '۱۴۰۴/۰۳/۲۵' },
          { id: 'ord-007', userId: '2', items: [{ id: '9bdee628-fadf-4b2e-b68b-26cc4c07e7ca', name: 'MacBook Pro M3', price: 1999, image: 'https://picsum.photos/400/400?random=4', quantity: 1 }], total: 1999, status: 'delivered', date: '۱۴۰۴/۰۳/۲۸' },
          { id: 'ord-008', userId: '2', items: [{ id: '6c2b7e46-863a-43ac-a093-dad13dd0acf6', name: 'iPad Air M2', price: 599, image: 'https://picsum.photos/400/400?random=1', quantity: 1 }, { id: 'e4c19cd5-5452-449e-8e76-21a61505d2b6', name: 'Sony WH-1000XM5', price: 349, image: 'https://picsum.photos/400/400?random=3', quantity: 1 }], total: 948, status: 'shipped', date: '۱۴۰۴/۰۳/۳۰' },
          { id: 'ord-009', userId: '2', items: [{ id: '98f7e7bc-bbbc-4e6c-a542-4b2ed93db896', name: 'Nike Air Max 90', price: 129, image: 'https://picsum.photos/400/400?random=2', quantity: 1 }], total: 129, status: 'cancelled', date: '۱۴۰۴/۰۲/۰۵' },
          { id: 'ord-010', userId: '2', items: [{ id: '9bdee628-fadf-4b2e-b68b-26cc4c07e7ca', name: 'MacBook Pro M3', price: 1999, image: 'https://picsum.photos/400/400?random=4', quantity: 1 }, { id: '98f7e7bc-bbbc-4e6c-a542-4b2ed93db896', name: 'Nike Air Max 90', price: 129, image: 'https://picsum.photos/400/400?random=2', quantity: 2 }], total: 2257, status: 'delivered', date: '۱۴۰۴/۰۲/۱۰' },
          { id: 'ord-011', userId: '2', items: [{ id: '6c2b7e46-863a-43ac-a093-dad13dd0acf6', name: 'iPad Air M2', price: 599, image: 'https://picsum.photos/400/400?random=1', quantity: 2 }], total: 1198, status: 'pending', date: '۱۴۰۴/۰۲/۱۵' },
          { id: 'ord-012', userId: '2', items: [{ id: 'e4c19cd5-5452-449e-8e76-21a61505d2b6', name: 'Sony WH-1000XM5', price: 349, image: 'https://picsum.photos/400/400?random=3', quantity: 1 }], total: 349, status: 'shipped', date: '۱۴۰۴/۰۲/۱۸' },
          { id: 'ord-013', userId: '2', items: [{ id: '98f7e7bc-bbbc-4e6c-a542-4b2ed93db896', name: 'Nike Air Max 90', price: 129, image: 'https://picsum.photos/400/400?random=2', quantity: 1 }], total: 129, status: 'delivered', date: '۱۴۰۴/۰۲/۲۰' },
          { id: 'ord-014', userId: '2', items: [{ id: '9bdee628-fadf-4b2e-b68b-26cc4c07e7ca', name: 'MacBook Pro M3', price: 1999, image: 'https://picsum.photos/400/400?random=4', quantity: 1 }], total: 1999, status: 'delivered', date: '۱۴۰۴/۰۲/۲۵' },
          { id: 'ord-015', userId: '2', items: [{ id: '6c2b7e46-863a-43ac-a093-dad13dd0acf6', name: 'iPad Air M2', price: 599, image: 'https://picsum.photos/400/400?random=1', quantity: 1 }], total: 599, status: 'cancelled', date: '۱۴۰۴/۰۱/۰۵' },
          { id: 'ord-016', userId: '2', items: [{ id: 'e4c19cd5-5452-449e-8e76-21a61505d2b6', name: 'Sony WH-1000XM5', price: 349, image: 'https://picsum.photos/400/400?random=3', quantity: 2 }, { id: '98f7e7bc-bbbc-4e6c-a542-4b2ed93db896', name: 'Nike Air Max 90', price: 129, image: 'https://picsum.photos/400/400?random=2', quantity: 1 }], total: 827, status: 'shipped', date: '۱۴۰۴/۰۱/۱۰' },
          { id: 'ord-017', userId: '2', items: [{ id: '9bdee628-fadf-4b2e-b68b-26cc4c07e7ca', name: 'MacBook Pro M3', price: 1999, image: 'https://picsum.photos/400/400?random=4', quantity: 1 }, { id: '6c2b7e46-863a-43ac-a093-dad13dd0acf6', name: 'iPad Air M2', price: 599, image: 'https://picsum.photos/400/400?random=1', quantity: 1 }], total: 2598, status: 'pending', date: '۱۴۰۴/۰۱/۱۵' },
          { id: 'ord-018', userId: '2', items: [{ id: '98f7e7bc-bbbc-4e6c-a542-4b2ed93db896', name: 'Nike Air Max 90', price: 129, image: 'https://picsum.photos/400/400?random=2', quantity: 4 }], total: 516, status: 'delivered', date: '۱۴۰۴/۰۱/۲۰' },
          { id: 'ord-019', userId: '2', items: [{ id: 'e4c19cd5-5452-449e-8e76-21a61505d2b6', name: 'Sony WH-1000XM5', price: 349, image: 'https://picsum.photos/400/400?random=3', quantity: 1 }], total: 349, status: 'delivered', date: '۱۴۰۳/۱۲/۲۵' },
          { id: 'ord-020', userId: '2', items: [{ id: '6c2b7e46-863a-43ac-a093-dad13dd0acf6', name: 'iPad Air M2', price: 599, image: 'https://picsum.photos/400/400?random=1', quantity: 1 }, { id: '98f7e7bc-bbbc-4e6c-a542-4b2ed93db896', name: 'Nike Air Max 90', price: 129, image: 'https://picsum.photos/400/400?random=2', quantity: 3 }], total: 986, status: 'shipped', date: '۱۴۰۳/۱۲/۲۸' },
          { id: 'ord-021', userId: '2', items: [{ id: '9bdee628-fadf-4b2e-b68b-26cc4c07e7ca', name: 'MacBook Pro M3', price: 1999, image: 'https://picsum.photos/400/400?random=4', quantity: 1 }], total: 1999, status: 'pending', date: '۱۴۰۳/۱۲/۱۰' },
          { id: 'ord-022', userId: '2', items: [{ id: 'e4c19cd5-5452-449e-8e76-21a61505d2b6', name: 'Sony WH-1000XM5', price: 349, image: 'https://picsum.photos/400/400?random=3', quantity: 1 }, { id: '98f7e7bc-bbbc-4e6c-a542-4b2ed93db896', name: 'Nike Air Max 90', price: 129, image: 'https://picsum.photos/400/400?random=2', quantity: 2 }], total: 607, status: 'delivered', date: '۱۴۰۳/۱۲/۱۵' },
          { id: 'ord-023', userId: '2', items: [{ id: '6c2b7e46-863a-43ac-a093-dad13dd0acf6', name: 'iPad Air M2', price: 599, image: 'https://picsum.photos/400/400?random=1', quantity: 1 }], total: 599, status: 'shipped', date: '۱۴۰۳/۱۲/۱۸' },
          { id: 'ord-024', userId: '2', items: [{ id: '9bdee628-fadf-4b2e-b68b-26cc4c07e7ca', name: 'MacBook Pro M3', price: 1999, image: 'https://picsum.photos/400/400?random=4', quantity: 1 }, { id: 'e4c19cd5-5452-449e-8e76-21a61505d2b6', name: 'Sony WH-1000XM5', price: 349, image: 'https://picsum.photos/400/400?random=3', quantity: 1 }], total: 2348, status: 'cancelled', date: '۱۴۰۳/۱۲/۲۰' },
          { id: 'ord-025', userId: '2', items: [{ id: '98f7e7bc-bbbc-4e6c-a542-4b2ed93db896', name: 'Nike Air Max 90', price: 129, image: 'https://picsum.photos/400/400?random=2', quantity: 1 }], total: 129, status: 'delivered', date: '۱۴۰۳/۱۲/۲۲' },
          { id: 'ord-026', userId: '2', items: [{ id: '6c2b7e46-863a-43ac-a093-dad13dd0acf6', name: 'iPad Air M2', price: 599, image: 'https://picsum.photos/400/400?random=1', quantity: 2 }, { id: '9bdee628-fadf-4b2e-b68b-26cc4c07e7ca', name: 'MacBook Pro M3', price: 1999, image: 'https://picsum.photos/400/400?random=4', quantity: 1 }], total: 3197, status: 'pending', date: '۱۴۰۳/۱۱/۳۰' },
          { id: 'ord-027', userId: '2', items: [{ id: 'e4c19cd5-5452-449e-8e76-21a61505d2b6', name: 'Sony WH-1000XM5', price: 349, image: 'https://picsum.photos/400/400?random=3', quantity: 1 }], total: 349, status: 'shipped', date: '۱۴۰۳/۱۱/۲۵' },
          { id: 'ord-028', userId: '2', items: [{ id: '98f7e7bc-bbbc-4e6c-a542-4b2ed93db896', name: 'Nike Air Max 90', price: 129, image: 'https://picsum.photos/400/400?random=2', quantity: 2 }, { id: '6c2b7e46-863a-43ac-a093-dad13dd0acf6', name: 'iPad Air M2', price: 599, image: 'https://picsum.photos/400/400?random=1', quantity: 1 }], total: 857, status: 'delivered', date: '۱۴۰۳/۱۱/۲۰' },
          { id: 'ord-029', userId: '2', items: [{ id: '9bdee628-fadf-4b2e-b68b-26cc4c07e7ca', name: 'MacBook Pro M3', price: 1999, image: 'https://picsum.photos/400/400?random=4', quantity: 1 }], total: 1999, status: 'delivered', date: '۱۴۰۳/۱۱/۱۵' },
          { id: 'ord-030', userId: '2', items: [{ id: 'e4c19cd5-5452-449e-8e76-21a61505d2b6', name: 'Sony WH-1000XM5', price: 349, image: 'https://picsum.photos/400/400?random=3', quantity: 1 }, { id: '98f7e7bc-bbbc-4e6c-a542-4b2ed93db896', name: 'Nike Air Max 90', price: 129, image: 'https://picsum.photos/400/400?random=2', quantity: 1 }], total: 478, status: 'pending', date: '۱۴۰۳/۱۱/۱۰' },
          { id: 'ord-031', userId: '2', items: [{ id: '6c2b7e46-863a-43ac-a093-dad13dd0acf6', name: 'iPad Air M2', price: 599, image: 'https://picsum.photos/400/400?random=1', quantity: 1 }], total: 599, status: 'delivered', date: '۱۴۰۳/۱۱/۰۵' },
          { id: 'ord-032', userId: '2', items: [{ id: '98f7e7bc-bbbc-4e6c-a542-4b2ed93db896', name: 'Nike Air Max 90', price: 129, image: 'https://picsum.photos/400/400?random=2', quantity: 2 }], total: 258, status: 'shipped', date: '۱۴۰۳/۱۱/۰۱' },
          { id: 'ord-033', userId: '2', items: [{ id: '9bdee628-fadf-4b2e-b68b-26cc4c07e7ca', name: 'MacBook Pro M3', price: 1999, image: 'https://picsum.photos/400/400?random=4', quantity: 1 }], total: 1999, status: 'pending', date: '۱۴۰۳/۱۰/۲۸' },
          { id: 'ord-034', userId: '2', items: [{ id: 'e4c19cd5-5452-449e-8e76-21a61505d2b6', name: 'Sony WH-1000XM5', price: 349, image: 'https://picsum.photos/400/400?random=3', quantity: 1 }, { id: '6c2b7e46-863a-43ac-a093-dad13dd0acf6', name: 'iPad Air M2', price: 599, image: 'https://picsum.photos/400/400?random=1', quantity: 1 }], total: 948, status: 'delivered', date: '۱۴۰۳/۱۰/۲۵' },
          { id: 'ord-035', userId: '2', items: [{ id: '98f7e7bc-bbbc-4e6c-a542-4b2ed93db896', name: 'Nike Air Max 90', price: 129, image: 'https://picsum.photos/400/400?random=2', quantity: 1 }], total: 129, status: 'cancelled', date: '۱۴۰۳/۱۰/۲۰' },
          { id: 'ord-036', userId: '2', items: [{ id: '9bdee628-fadf-4b2e-b68b-26cc4c07e7ca', name: 'MacBook Pro M3', price: 1999, image: 'https://picsum.photos/400/400?random=4', quantity: 1 }, { id: 'e4c19cd5-5452-449e-8e76-21a61505d2b6', name: 'Sony WH-1000XM5', price: 349, image: 'https://picsum.photos/400/400?random=3', quantity: 1 }], total: 2348, status: 'shipped', date: '۱۴۰۳/۱۰/۱۵' },
          { id: 'ord-037', userId: '2', items: [{ id: '6c2b7e46-863a-43ac-a093-dad13dd0acf6', name: 'iPad Air M2', price: 599, image: 'https://picsum.photos/400/400?random=1', quantity: 3 }], total: 1797, status: 'delivered', date: '۱۴۰۳/۱۰/۱۰' },
          { id: 'ord-038', userId: '2', items: [{ id: '98f7e7bc-bbbc-4e6c-a542-4b2ed93db896', name: 'Nike Air Max 90', price: 129, image: 'https://picsum.photos/400/400?random=2', quantity: 5 }], total: 645, status: 'pending', date: '۱۴۰۳/۱۰/۰۵' },
          { id: 'ord-039', userId: '2', items: [{ id: 'e4c19cd5-5452-449e-8e76-21a61505d2b6', name: 'Sony WH-1000XM5', price: 349, image: 'https://picsum.photos/400/400?random=3', quantity: 2 }], total: 698, status: 'delivered', date: '۱۴۰۳/۱۰/۰۱' },
          { id: 'ord-040', userId: '2', items: [{ id: '9bdee628-fadf-4b2e-b68b-26cc4c07e7ca', name: 'MacBook Pro M3', price: 1999, image: 'https://picsum.photos/400/400?random=4', quantity: 1 }], total: 1999, status: 'delivered', date: '۱۴۰۳/۰۹/۲۵' },
          { id: 'ord-041', userId: '2', items: [{ id: '6c2b7e46-863a-43ac-a093-dad13dd0acf6', name: 'iPad Air M2', price: 599, image: 'https://picsum.photos/400/400?random=1', quantity: 1 }, { id: '98f7e7bc-bbbc-4e6c-a542-4b2ed93db896', name: 'Nike Air Max 90', price: 129, image: 'https://picsum.photos/400/400?random=2', quantity: 2 }], total: 857, status: 'shipped', date: '۱۴۰۳/۰۹/۲۰' },
          { id: 'ord-042', userId: '2', items: [{ id: 'e4c19cd5-5452-449e-8e76-21a61505d2b6', name: 'Sony WH-1000XM5', price: 349, image: 'https://picsum.photos/400/400?random=3', quantity: 1 }], total: 349, status: 'pending', date: '۱۴۰۳/۰۹/۱۵' },
          { id: 'ord-043', userId: '2', items: [{ id: '9bdee628-fadf-4b2e-b68b-26cc4c07e7ca', name: 'MacBook Pro M3', price: 1999, image: 'https://picsum.photos/400/400?random=4', quantity: 1 }, { id: '98f7e7bc-bbbc-4e6c-a542-4b2ed93db896', name: 'Nike Air Max 90', price: 129, image: 'https://picsum.photos/400/400?random=2', quantity: 3 }], total: 2386, status: 'cancelled', date: '۱۴۰۳/۰۹/۱۰' },
          { id: 'ord-044', userId: '2', items: [{ id: '6c2b7e46-863a-43ac-a093-dad13dd0acf6', name: 'iPad Air M2', price: 599, image: 'https://picsum.photos/400/400?random=1', quantity: 1 }], total: 599, status: 'delivered', date: '۱۴۰۳/۰۹/۰۵' },
          { id: 'ord-045', userId: '2', items: [{ id: 'e4c19cd5-5452-449e-8e76-21a61505d2b6', name: 'Sony WH-1000XM5', price: 349, image: 'https://picsum.photos/400/400?random=3', quantity: 1 }, { id: '6c2b7e46-863a-43ac-a093-dad13dd0acf6', name: 'iPad Air M2', price: 599, image: 'https://picsum.photos/400/400?random=1', quantity: 1 }], total: 948, status: 'shipped', date: '۱۴۰۳/۰۹/۰۱' },
          { id: 'ord-046', userId: '2', items: [{ id: '98f7e7bc-bbbc-4e6c-a542-4b2ed93db896', name: 'Nike Air Max 90', price: 129, image: 'https://picsum.photos/400/400?random=2', quantity: 2 }], total: 258, status: 'delivered', date: '۱۴۰۳/۰۸/۲۸' },
          { id: 'ord-047', userId: '2', items: [{ id: '9bdee628-fadf-4b2e-b68b-26cc4c07e7ca', name: 'MacBook Pro M3', price: 1999, image: 'https://picsum.photos/400/400?random=4', quantity: 1 }], total: 1999, status: 'pending', date: '۱۴۰۳/۰۸/۲۵' },
          { id: 'ord-048', userId: '2', items: [{ id: 'e4c19cd5-5452-449e-8e76-21a61505d2b6', name: 'Sony WH-1000XM5', price: 349, image: 'https://picsum.photos/400/400?random=3', quantity: 1 }], total: 349, status: 'delivered', date: '۱۴۰۳/۰۸/۲۰' },
          { id: 'ord-049', userId: '2', items: [{ id: '6c2b7e46-863a-43ac-a093-dad13dd0acf6', name: 'iPad Air M2', price: 599, image: 'https://picsum.photos/400/400?random=1', quantity: 1 }, { id: '98f7e7bc-bbbc-4e6c-a542-4b2ed93db896', name: 'Nike Air Max 90', price: 129, image: 'https://picsum.photos/400/400?random=2', quantity: 2 }], total: 857, status: 'shipped', date: '۱۴۰۳/۰۸/۱۵' },
          { id: 'ord-050', userId: '2', items: [{ id: '9bdee628-fadf-4b2e-b68b-26cc4c07e7ca', name: 'MacBook Pro M3', price: 1999, image: 'https://picsum.photos/400/400?random=4', quantity: 1 }], total: 1999, status: 'delivered', date: '۱۴۰۳/۰۸/۱۰' },
        ];
        localStorage.setItem('orders', JSON.stringify(testOrders));
        localStorage.removeItem('orders_seeded');
        localStorage.setItem('orders_seeded', 'true');
      }

      // Seed test locations if not exist
      if (!localStorage.getItem('locations_seeded')) {
        const testLocations = [
          { id: 'loc-001', title: 'خانه', address: 'خیابان ولیعصر، نبش کوچه گل، پلاک ۱۲، واحد ۳', city: 'تهران', postalCode: '1234567890', phone: '09123456789', isDefault: true },
          { id: 'loc-002', title: 'محل کار', address: 'خیابان مدرس، برج اداری طبقه ۵، واحد ۵۰۲', city: 'تهران', postalCode: '0987654321', phone: '09351234567', isDefault: false },
        ];
        localStorage.setItem('locations_2', JSON.stringify(testLocations));
        localStorage.setItem('locations_seeded', 'true');
      }

      window.location.href = localStorage.getItem('redirectAfterLogin') || '/account';
      localStorage.removeItem('redirectAfterLogin');
    } else {
      setError('ایمیل یا رمز عبور اشتباه است');
    }
  };

  return (
    <div style={{ 
      minHeight: '100vh', 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center',
      background: '#f8fafc'
    }}>
      <div style={{
        width: '100%',
        maxWidth: '400px',
        padding: '40px',
        background: 'white',
        borderRadius: '12px',
        boxShadow: '0 4px 24px rgba(0,0,0,0.1)'
      }}>
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <h1 style={{ fontSize: '24px', fontWeight: 700, color: '#0f172a', margin: 0 }}>
            ShopHub
          </h1>
          <p style={{ color: '#64748b', marginTop: '8px' }}>
            وارد حساب خود شوید
          </p>
        </div>

        {error && (
          <div style={{ 
            background: '#fef2f2', 
            color: '#dc2626', 
            padding: '12px', 
            borderRadius: '8px', 
            marginBottom: '16px',
            fontSize: '14px'
          }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', marginBottom: '6px', fontSize: '14px', fontWeight: 500, color: '#374151' }}>
              ایمیل
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@shop.com"
              style={{
                width: '100%',
                padding: '12px',
                border: '1px solid #e5e7eb',
                borderRadius: '8px',
                fontSize: '16px',
                outline: 'none'
              }}
            />
          </div>

          <div style={{ marginBottom: '24px' }}>
            <label style={{ display: 'block', marginBottom: '6px', fontSize: '14px', fontWeight: 500, color: '#374151' }}>
              رمز عبور
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="admin123"
              style={{
                width: '100%',
                padding: '12px',
                border: '1px solid #e5e7eb',
                borderRadius: '8px',
                fontSize: '16px',
                outline: 'none'
              }}
            />
          </div>

          <button
            type="submit"
            style={{
              width: '100%',
              padding: '12px',
              background: '#2563eb',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              fontSize: '16px',
              fontWeight: 600,
              cursor: 'pointer'
            }}
          >
            ورود
          </button>
        </form>

        <div style={{ marginTop: '24px', padding: '16px', background: '#f8fafc', borderRadius: '8px', fontSize: '13px', color: '#64748b' }}>
          <strong>حساب‌های demo:</strong><br />
          <strong>ادمین:</strong> admin@shop.com / admin123<br />
          <strong>کاربر:</strong> user@shop.com / user123
        </div>
      </div>
    </div>
  );
}
