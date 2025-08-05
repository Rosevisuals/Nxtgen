import { Outlet } from 'react-router-dom';
import Header from "../components/Header";
import Sidebar from "../components/Sidebar";

export default function AdminDashboardLayout() {
  return <div style={{ minHeight: '100vh', backgroundColor: '#f9f9f9' }}>
    {/* Full width header */}
    <Header title="Hospital ERP" />

    {/* Sidebar + Main */}
    <div style={{ display: 'flex' }}>
      <Sidebar />

      <main style={{ flex: 1, padding: '24px', background: '#f3f4f6', minHeight: 'calc(100vh - 70px)' }}>
        <Outlet />
      </main>
    </div>
  </div>
}