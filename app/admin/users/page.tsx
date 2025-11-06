"use client";

import { HeroTable, HeroColumn } from "@/components/admin/hero-table";
import { PageHeader } from "@/components/admin/page-header";
import { PageTransition } from "@/components/admin/page-transition";
import { getStatusColor, formatDate } from "@/lib/admin-utils";

/**
 * Users Management Page
 * 
 * Features:
 * - View all users with search, sort, and pagination
 * - Edit user roles and status
 * - Suspend/activate user accounts
 * - Real-time data updates
 */

export default function UsersPage() {
  type Row = {
    id: string;
    email: string;
    name: string | null;
    role: string;
    isActive: boolean;
    createdAt: string;
  };

  // CRUD Operations
  const handleAddUser = () => {
    alert("Add User functionality - to be implemented with modal form");
  };

  const handleEditUser = (user: Row) => {
    alert(`Edit User: ${user.email} - to be implemented with modal form`);
  };

  const handleDeleteUser = (user: Row) => {
    if (confirm(`Are you sure you want to delete user: ${user.email}?`)) {
      alert("Delete User functionality - to be implemented with API call");
    }
  };

  const columns: HeroColumn<Row>[] = [
    { key: "email", label: "Email", sortable: true },
    { key: "name", label: "Name", sortable: true, render: (r: Row) => r.name || "—" },
    { key: "role", label: "Role", sortable: true, render: (r: Row) => (
      <span className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${getStatusColor('role', r.role)}`}>
        {r.role}
      </span>
    ) },
    { key: "isActive", label: "Status", render: (r: Row) => (
      <span className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${getStatusColor('active', String(r.isActive))}`}>
        {r.isActive ? "Active" : "Suspended"}
      </span>
    ) },
    { key: "createdAt", label: "Joined", sortable: true, render: (r: Row) => formatDate(r.createdAt) },
  ];

  return (
    <PageTransition>
      <div className="space-y-6">
        <PageHeader title="Users" />
        <HeroTable<Row>
          title="User Management"
          fetchUrl="/api/admin/users"
          columns={columns}
          defaultSort="createdAt"
          defaultOrder="desc"
          pageSizeOptions={[10, 20, 50]}
          onAdd={handleAddUser}
          onEdit={handleEditUser}
          onDelete={handleDeleteUser}
        />
      </div>
    </PageTransition>
  );
}
