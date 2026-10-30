"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Role } from "@prisma/client";
import toast from "react-hot-toast";

type User = {
  id: string;
  email: string;
  name: string | null;
  role: Role;
  isActive: boolean;
};

type UserEditFormProps = {
  user: User;
  onSave: () => void;
  onCancel: () => void;
};

export function UserEditForm({ user, onSave, onCancel }: UserEditFormProps) {
  const [isActive, setIsActive] = useState(user.isActive);
  const [role, setRole] = useState<Role>(user.role);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    setIsActive(user.isActive);
    setRole(user.role);
  }, [user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    try {
      const res = await fetch(`/api/admin/users/${user.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role, isActive }),
      });

      if (res.ok) {
        toast.success("User updated successfully!");
        onSave();
      } else {
        const data = await res.json();
        toast.error(data.message || "Failed to update user.");
      }
    } catch (error) {
      console.error(error);
      toast.error("An error occurred while updating the user.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">{user.email}</h3>
        <p className="text-sm text-muted-foreground">{user.name || "No name provided"}</p>
      </div>
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <Label htmlFor="isActive" className="flex flex-col space-y-1">
            <span>Active Status</span>
            <span className="font-normal leading-snug text-muted-foreground">
              Inactive users cannot log in.
            </span>
          </Label>
          <Switch
            id="isActive"
            checked={isActive}
            onCheckedChange={setIsActive}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="role">Role</Label>
          <Select value={role} onValueChange={(value: Role) => setRole(value)}>
            <SelectTrigger>
              <SelectValue placeholder="Select a role" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={"ADMIN"}>Admin</SelectItem>
              <SelectItem value={"CUSTOMER"}>Customer</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      <div className="flex justify-end space-x-4">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" disabled={isSaving}>
          {isSaving ? "Saving..." : "Save Changes"}
        </Button>
      </div>
    </form>
  );
}
