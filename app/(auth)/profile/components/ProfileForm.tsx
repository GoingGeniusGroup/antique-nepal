import { useState, useTransition, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { ArrowLeft, Camera, Save, X } from "lucide-react";
import { UserWithRelations } from "./ProfileContent";
import { updateProfile } from "@/app/actions/auth/updateProfile";
import { toast } from "react-hot-toast";

type ProfileFormProps = {
  user: UserWithRelations;
  onCancel: () => void;
};

export default function ProfileForm({ user, onCancel }: ProfileFormProps) {
  const primaryAddress = user.addresses?.[0];
  const [isPending, startTransition] = useTransition();

  const [formData, setFormData] = useState({
    firstName: user.firstName || "",
    lastName: user.lastName || "",
    email: user.email || "",
    phone: user.phone || "",
    street: primaryAddress?.addressLine1 || "",
    city: primaryAddress?.city || "",
    postal: primaryAddress?.postalCode || "",
    country: primaryAddress?.country || "",
  });

  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(user.image);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setAvatarFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const data = new FormData();
    data.append("firstName", formData.firstName);
    data.append("lastName", formData.lastName);
    data.append("phone", formData.phone);
    data.append("street", formData.street);
    data.append("city", formData.city);
    data.append("postal", formData.postal);
    data.append("country", formData.country);
    if (avatarFile) {
      data.append("avatar", avatarFile);
    }

    startTransition(async () => {
      const result = await updateProfile(data);
      if (result.success) {
        toast.success("Profile updated successfully!");
        onCancel();
      } else {
        toast.error("Failed to update profile.");
        console.error(result.message);
      }
    });
  };

  // Clean up the object URL to avoid memory leaks
  useEffect(() => {
    return () => {
      if (previewUrl && previewUrl.startsWith("blob:")) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  return (
    <div className="min-h-screen bg-gradient-subtle">
      <section className="pt-32 pb-20 px-4">
        <div className="container max-w-4xl">
          {/* Header */}
          <div className="mb-8">
            <Button
              variant="ghost"
              className="mb-4 hover:bg-accent"
              onClick={onCancel}
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Profile
            </Button>
            <h1 className="text-4xl font-bold mb-2">Edit Profile</h1>
            <p className="text-muted-foreground">
              Update your personal information and settings
            </p>
          </div>

          <form className="space-y-6" onSubmit={handleSubmit}>
            {/* Avatar Section */}
            <Card className="border-border/50 shadow-elegant">
              <CardHeader>
                <CardTitle>Profile Picture</CardTitle>
                <CardDescription>Update your profile photo</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-6">
                  <Avatar className="w-24 h-24 border-4 border-border shadow-soft">
                    <AvatarImage src={previewUrl} alt="Profile" />
                    <AvatarFallback className="text-2xl font-bold bg-primary text-primary-foreground">
                      {formData.firstName?.[0]}
                      {formData.lastName?.[0]}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <Label htmlFor="avatar-upload" className="cursor-pointer">
                      <div className="inline-flex items-center justify-center gap-2 rounded-md bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2 text-sm font-medium transition-all hover:shadow-soft">
                        <Camera className="w-4 h-4" />
                        Upload Photo
                      </div>
                    </Label>
                    <input
                      id="avatar-upload"
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleAvatarChange}
                    />
                    <p className="text-sm text-muted-foreground mt-2">
                      JPG, PNG or WEBP. Max size 2MB.
                    </p>
                  </div>
                  {previewUrl && user.image !== previewUrl && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => {
                        setAvatarFile(null);
                        setPreviewUrl(user.image);
                      }}
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Personal Information */}
            <Card className="border-border/50 shadow-elegant">
              <CardHeader>
                <CardTitle>Personal Information</CardTitle>
                <CardDescription>Update your personal details</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">First Name</Label>
                    <Input
                      id="firstName"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleInputChange}
                      placeholder="Enter first name"
                      className="transition-all focus:shadow-soft"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName">Last Name</Label>
                    <Input
                      id="lastName"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleInputChange}
                      placeholder="Enter last name"
                      className="transition-all focus:shadow-soft"
                      required
                    />
                  </div>
                </div>

                <Separator />

                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address</Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder="your@email.com"
                      className="transition-all focus:shadow-soft"
                      disabled // Prevent email change
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input
                      id="phone"
                      name="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={handleInputChange}
                      placeholder="+977 98XXXXXXXX"
                      className="transition-all focus:shadow-soft"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Address Information */}
            <Card className="border-border/50 shadow-elegant">
              <CardHeader>
                <CardTitle>Address Information</CardTitle>
                <CardDescription>Update your primary address</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="street">Street Address</Label>
                  <Input
                    id="street"
                    name="street"
                    value={formData.street}
                    onChange={handleInputChange}
                    placeholder="Street address"
                    className="transition-all focus:shadow-soft"
                    required
                  />
                </div>

                <div className="grid md:grid-cols-3 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="city">City</Label>
                    <Input
                      id="city"
                      name="city"
                      value={formData.city}
                      onChange={handleInputChange}
                      placeholder="City"
                      className="transition-all focus:shadow-soft"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="postal">Postal Code</Label>
                    <Input
                      id="postal"
                      name="postal"
                      value={formData.postal}
                      onChange={handleInputChange}
                      placeholder="Postal code"
                      className="transition-all focus:shadow-soft"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="country">Country</Label>
                    <Input
                      id="country"
                      name="country"
                      value={formData.country}
                      onChange={handleInputChange}
                      placeholder="Country"
                      className="transition-all focus:shadow-soft"
                      required
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Action Buttons */}
            <div className="flex gap-4 justify-end pt-4">
              <Button
                type="button"
                variant="outline"
                className="px-8 hover:shadow-soft transition-all"
                onClick={onCancel}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isPending}
                className="px-8 hover:shadow-soft transition-all"
              >
                {isPending ? (
                  <>
                    <div className="w-4 h-4 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin mr-2" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4 mr-2" />
                    Save Changes
                  </>
                )}
              </Button>
            </div>
          </form>
        </div>
      </section>
    </div>
  );
}
