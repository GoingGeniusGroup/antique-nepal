"use client";

import { HeroTable, HeroColumn } from "@/components/admin/hero-table";
import { PageHeader } from "@/components/admin/page-header";
import { PageTransition } from "@/components/admin/page-transition";
import { ConfirmationDialog } from "@/components/ui/confirmation-dialog";
import { getStatusColor, formatDate } from "@/lib/admin-utils";
import { useState } from "react";
import toast from "react-hot-toast";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { UserEditForm } from "@/components/admin/users/user-edit-form";

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
    role: any;
    isActive: boolean;
    createdAt: string;
  };

  const [tableKey, setTableKey] = useState(0);
  const [deleteUser, setDeleteUser] = useState<Row | null>(null);
  const [editingUser, setEditingUser] = useState<Row | null>(null);

  // CRUD Operations
  const handleAddUser = () => {
    alert("Add User functionality - to be implemented with modal form");
  };

  const handleEditUser = (user: Row) => {
    setEditingUser(user);
  };

  const handleSaveUser = () => {
    setEditingUser(null);
    setTableKey((prev) => prev + 1);
  };

  const handleCancelEdit = () => {
    setEditingUser(null);
  };

  const handleDeleteUser = async () => {
    if (!deleteUser) return;

    try {
      const res = await fetch(`/api/admin/users/${deleteUser.id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        setTableKey((prev) => prev + 1);
        toast.success("User deleted successfully");
      } else {
        toast.error("Failed to delete user");
      }
      setDeleteUser(null);
    } catch (error) {
      console.error(error);
      toast.error("An error occurred while deleting user");
      setDeleteUser(null);
    }
  };

  const columns: HeroColumn<Row>[] = [
    { key: "email", label: "Email", sortable: true },
    {
      key: "name",
      label: "Name",
      sortable: true,
      render: (r: Row) => r.name || "—",
    },
    {
      key: "role",
      label: "Role",
      sortable: true,
      render: (r: Row) => (
        <span
          className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${getStatusColor(
            "role",
            r.role
          )}`}
        >
          {r.role}
        </span>
      ),
    },
    {
      key: "isActive",
      label: "Status",
      render: (r: Row) => (
        <span
          className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${getStatusColor(
            "active",
            String(r.isActive)
          )}`}
        >
          {r.isActive ? "Active" : "Suspended"}
        </span>
      ),
    },
    {
      key: "createdAt",
      label: "Joined",
      sortable: true,
      render: (r: Row) => formatDate(r.createdAt),
    },
  ];

  return (
    <PageTransition>
      <div className="space-y-6">
        <PageHeader title="Users" />
        <HeroTable<Row>
          key={tableKey}
          title="User Management"
          fetchUrl="/api/admin/users"
          columns={columns}
          defaultSort="createdAt"
          defaultOrder="desc"
          pageSizeOptions={[10, 20, 50]}
          onAdd={handleAddUser}
          onEdit={handleEditUser}
          onDelete={setDeleteUser}
        />
        <ConfirmationDialog
          open={!!deleteUser}
          onOpenChange={() => setDeleteUser(null)}
          onConfirm={handleDeleteUser}
          title="Delete User?"
          description="Are you sure you want to delete this User? This action cannot
                          be undone."
          confirmText="Delete"
          cancelText="Cancel"
          variant="destructive"
        />

        {editingUser && (
          <Dialog open={!!editingUser} onOpenChange={() => setEditingUser(null)}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Edit User</DialogTitle>
              </DialogHeader>
              <UserEditForm
                user={editingUser}
                onSave={handleSaveUser}
                onCancel={handleCancelEdit}
              />
            </DialogContent>
          </Dialog>
        )}
      </div>
    </PageTransition>
  );
}
