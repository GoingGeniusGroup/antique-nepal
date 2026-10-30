"use client";

import { useState } from "react";
import ProfileContent, { type UserWithRelations } from "./ProfileContent";
import ProfileForm from "./ProfileForm";

type ProfileViewProps = {
  user: UserWithRelations;
};

export default function ProfileView({ user }: ProfileViewProps) {
  const [isEditing, setIsEditing] = useState(false);

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleCancel = () => {
    setIsEditing(false);
  };

  if (isEditing) {
    return <ProfileForm user={user} onCancel={handleCancel} />;
  }

  return <ProfileContent user={user} onEdit={handleEdit} />;
}