"use client";

import { useSession } from "next-auth/react";
import { motion } from "framer-motion";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Mail, User, Shield } from "lucide-react";
import { PageHeader } from "@/components/admin/page-header";
import { PageTransition } from "@/components/admin/page-transition";

export default function AdminProfilePage() {
  const { data: session } = useSession();

  if (!session?.user) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <p className="text-muted-foreground">Loading profile...</p>
      </div>
    );
  }

  const user = session.user as any;
  const fullName = user.name || "Admin User";
  const email = user.email || "admin@example.com";
  const role = user.role || "ADMIN";

  // Get initials for avatar fallback
  const initials = fullName
    .split(" ")
    .map((n: string) => n[0])
    .join("")
    .toUpperCase();

  return (
    <PageTransition>
      <div className="space-y-6">
        <PageHeader title="Admin Profile" />

        <div className="grid gap-6 max-w-4xl mx-auto">
          {/* Profile Header Card */}
          <Card className="border-border/50 shadow-lg dark:!bg-slate-800 dark:!border-slate-600">
            <CardHeader className="pb-4">
              <div className="flex items-center gap-6">
                <Avatar className="h-24 w-24 border-4 border-primary/20">
                  <AvatarImage src={user.image || undefined} />
                  <AvatarFallback className="bg-primary text-primary-foreground text-2xl font-semibold">
                    {initials}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <CardTitle className="text-2xl mb-2">{fullName}</CardTitle>
                  <CardDescription className="text-base flex items-center gap-2">
                    <Mail className="h-4 w-4" />
                    {email}
                  </CardDescription>
                  <div className="mt-3">
                    <Badge variant="default" className="bg-primary/90">
                      <Shield className="h-3 w-3 mr-1" />
                      {role}
                    </Badge>
                  </div>
                </div>
              </div>
            </CardHeader>
          </Card>

          {/* Account Details Card */}
          <Card className="border-border/50 shadow-lg dark:!bg-slate-800 dark:!border-slate-600">
            <CardHeader>
              <CardTitle>Account Details</CardTitle>
              <CardDescription>
                Your account information and settings
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Full Name */}
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <User className="h-4 w-4" />
                    <span className="font-medium">Full Name</span>
                  </div>
                  <p className="text-foreground pl-6">{fullName}</p>
                </div>

                {/* Email */}
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Mail className="h-4 w-4" />
                    <span className="font-medium">Email Address</span>
                  </div>
                  <p className="text-foreground pl-6">{email}</p>
                </div>

                {/* Role */}
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Shield className="h-4 w-4" />
                    <span className="font-medium">Role</span>
                  </div>
                  <p className="text-foreground pl-6">{role}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </PageTransition>
  );
}
