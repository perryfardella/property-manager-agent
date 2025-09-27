"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Save, X } from "lucide-react";

interface Property {
  id: number;
  name: string;
  address: string;
  description?: string;
  check_in_time?: string;
  check_out_time?: string;
  wifi_ssid?: string;
  wifi_password?: string;
  parking_details?: string;
  parking_instructions?: string;
  quiet_hours_start?: string;
  quiet_hours_end?: string;
  house_rules?: string;
  directions?: string;
  google_maps_link?: string;
  nearby_restaurants?: string;
  nearby_attractions?: string;
  points_of_interest?: string;
  transportation_info?: string;
  emergency_contacts?: string;
  amenities?: string[];
  cleaning_instructions?: string;
  check_in_instructions?: string;
  check_out_instructions?: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

interface PropertyFormProps {
  property?: Property | null;
  onSuccess: () => void;
  onCancel: () => void;
}

export function PropertyForm({
  property,
  onSuccess,
  onCancel,
}: PropertyFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: property?.name || "",
    address: property?.address || "",
    description: property?.description || "",
    check_in_time: property?.check_in_time || "",
    check_out_time: property?.check_out_time || "",
    check_in_instructions: property?.check_in_instructions || "",
    check_out_instructions: property?.check_out_instructions || "",
    wifi_ssid: property?.wifi_ssid || "",
    wifi_password: property?.wifi_password || "",
    parking_details: property?.parking_details || "",
    parking_instructions: property?.parking_instructions || "",
    quiet_hours_start: property?.quiet_hours_start || "",
    quiet_hours_end: property?.quiet_hours_end || "",
    house_rules: property?.house_rules || "",
    directions: property?.directions || "",
    google_maps_link: property?.google_maps_link || "",
    nearby_restaurants: property?.nearby_restaurants || "",
    nearby_attractions: property?.nearby_attractions || "",
    points_of_interest: property?.points_of_interest || "",
    transportation_info: property?.transportation_info || "",
    emergency_contacts: property?.emergency_contacts || "",
    cleaning_instructions: property?.cleaning_instructions || "",
    amenities: property?.amenities?.join(", ") || "",
  });

  const supabase = createClient();

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Get the current user
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError) {
        console.error("Auth error:", userError);
        throw new Error("Authentication error");
      }

      if (!user) {
        throw new Error("User not authenticated");
      }

      console.log("Current user ID:", user.id);

      // Prepare data for submission
      const submitData = {
        ...formData,
        amenities: formData.amenities
          ? formData.amenities
              .split(",")
              .map((item) => item.trim())
              .filter(Boolean)
          : [],
        check_in_time: formData.check_in_time || null,
        check_out_time: formData.check_out_time || null,
        quiet_hours_start: formData.quiet_hours_start || null,
        quiet_hours_end: formData.quiet_hours_end || null,
      };

      let result;
      if (property) {
        // Update existing property
        console.log("Updating property:", property.id);
        result = await supabase
          .from("properties")
          .update(submitData)
          .eq("id", property.id);
      } else {
        // Create new property - include user_id for RLS policy
        console.log("Creating new property with user_id:", user.id);
        const insertData = {
          ...submitData,
          user_id: user.id,
        };
        console.log("Insert data:", insertData);

        result = await supabase
          .from("properties")
          .insert([insertData])
          .select();
      }

      console.log("Database result:", result);

      if (result.error) {
        console.error("Database error:", result.error);
        throw result.error;
      }

      console.log("Property saved successfully");
      onSuccess();
    } catch (error) {
      console.error("Error saving property:", error);
      alert(
        `Error saving property: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button variant="ghost" size="icon" onClick={onCancel}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h2 className="text-2xl font-bold">
              {property ? "Edit Property" : "Add Property"}
            </h2>
            <p className="text-muted-foreground">
              {property
                ? "Update property information"
                : "Add a new property to your portfolio"}
            </p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Information */}
        <Card>
          <CardHeader>
            <CardTitle>Basic Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Property Name *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => handleInputChange("name", e.target.value)}
                  placeholder="e.g., Cozy Downtown Apartment"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="address">Address *</Label>
                <Input
                  id="address"
                  value={formData.address}
                  onChange={(e) => handleInputChange("address", e.target.value)}
                  placeholder="Full property address"
                  required
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) =>
                  handleInputChange("description", e.target.value)
                }
                placeholder="Brief description of the property"
                rows={3}
              />
            </div>
          </CardContent>
        </Card>

        {/* Check-in/Check-out */}
        <Card>
          <CardHeader>
            <CardTitle>Check-in & Check-out</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="check_in_time">Check-in Time</Label>
                <Input
                  id="check_in_time"
                  type="time"
                  value={formData.check_in_time}
                  onChange={(e) =>
                    handleInputChange("check_in_time", e.target.value)
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="check_out_time">Check-out Time</Label>
                <Input
                  id="check_out_time"
                  type="time"
                  value={formData.check_out_time}
                  onChange={(e) =>
                    handleInputChange("check_out_time", e.target.value)
                  }
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="check_in_instructions">
                Check-in Instructions
              </Label>
              <Textarea
                id="check_in_instructions"
                value={formData.check_in_instructions}
                onChange={(e) =>
                  handleInputChange("check_in_instructions", e.target.value)
                }
                placeholder="Detailed check-in instructions for guests"
                rows={3}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="check_out_instructions">
                Check-out Instructions
              </Label>
              <Textarea
                id="check_out_instructions"
                value={formData.check_out_instructions}
                onChange={(e) =>
                  handleInputChange("check_out_instructions", e.target.value)
                }
                placeholder="Detailed check-out instructions for guests"
                rows={3}
              />
            </div>
          </CardContent>
        </Card>

        {/* WiFi & Internet */}
        <Card>
          <CardHeader>
            <CardTitle>WiFi & Internet Access</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="wifi_ssid">WiFi Network Name</Label>
                <Input
                  id="wifi_ssid"
                  value={formData.wifi_ssid}
                  onChange={(e) =>
                    handleInputChange("wifi_ssid", e.target.value)
                  }
                  placeholder="Network name (SSID)"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="wifi_password">WiFi Password</Label>
                <Input
                  id="wifi_password"
                  type="password"
                  value={formData.wifi_password}
                  onChange={(e) =>
                    handleInputChange("wifi_password", e.target.value)
                  }
                  placeholder="WiFi password"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Parking & Transportation */}
        <Card>
          <CardHeader>
            <CardTitle>Parking & Transportation</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="parking_details">Parking Details</Label>
              <Textarea
                id="parking_details"
                value={formData.parking_details}
                onChange={(e) =>
                  handleInputChange("parking_details", e.target.value)
                }
                placeholder="Parking availability and type (e.g., free street parking, paid garage)"
                rows={2}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="parking_instructions">Parking Instructions</Label>
              <Textarea
                id="parking_instructions"
                value={formData.parking_instructions}
                onChange={(e) =>
                  handleInputChange("parking_instructions", e.target.value)
                }
                placeholder="Specific parking instructions and location"
                rows={2}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="transportation_info">
                Transportation Information
              </Label>
              <Textarea
                id="transportation_info"
                value={formData.transportation_info}
                onChange={(e) =>
                  handleInputChange("transportation_info", e.target.value)
                }
                placeholder="Public transport options, taxi services, etc."
                rows={2}
              />
            </div>
          </CardContent>
        </Card>

        {/* House Rules & Quiet Hours */}
        <Card>
          <CardHeader>
            <CardTitle>House Rules & Quiet Hours</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="quiet_hours_start">Quiet Hours Start</Label>
                <Input
                  id="quiet_hours_start"
                  type="time"
                  value={formData.quiet_hours_start}
                  onChange={(e) =>
                    handleInputChange("quiet_hours_start", e.target.value)
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="quiet_hours_end">Quiet Hours End</Label>
                <Input
                  id="quiet_hours_end"
                  type="time"
                  value={formData.quiet_hours_end}
                  onChange={(e) =>
                    handleInputChange("quiet_hours_end", e.target.value)
                  }
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="house_rules">House Rules</Label>
              <Textarea
                id="house_rules"
                value={formData.house_rules}
                onChange={(e) =>
                  handleInputChange("house_rules", e.target.value)
                }
                placeholder="Property rules for guests"
                rows={4}
              />
            </div>
          </CardContent>
        </Card>

        {/* Location & Directions */}
        <Card>
          <CardHeader>
            <CardTitle>Location & Directions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="directions">Directions</Label>
              <Textarea
                id="directions"
                value={formData.directions}
                onChange={(e) =>
                  handleInputChange("directions", e.target.value)
                }
                placeholder="Detailed directions to the property"
                rows={3}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="google_maps_link">Google Maps Link</Label>
              <Input
                id="google_maps_link"
                type="url"
                value={formData.google_maps_link}
                onChange={(e) =>
                  handleInputChange("google_maps_link", e.target.value)
                }
                placeholder="https://maps.google.com/..."
              />
            </div>
          </CardContent>
        </Card>

        {/* Local Area Information */}
        <Card>
          <CardHeader>
            <CardTitle>Local Area Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="nearby_restaurants">Nearby Restaurants</Label>
              <Textarea
                id="nearby_restaurants"
                value={formData.nearby_restaurants}
                onChange={(e) =>
                  handleInputChange("nearby_restaurants", e.target.value)
                }
                placeholder="Recommended restaurants and dining options"
                rows={3}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="nearby_attractions">Nearby Attractions</Label>
              <Textarea
                id="nearby_attractions"
                value={formData.nearby_attractions}
                onChange={(e) =>
                  handleInputChange("nearby_attractions", e.target.value)
                }
                placeholder="Tourist attractions and activities"
                rows={3}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="points_of_interest">Points of Interest</Label>
              <Textarea
                id="points_of_interest"
                value={formData.points_of_interest}
                onChange={(e) =>
                  handleInputChange("points_of_interest", e.target.value)
                }
                placeholder="Other local points of interest"
                rows={3}
              />
            </div>
          </CardContent>
        </Card>

        {/* Amenities & Emergency */}
        <Card>
          <CardHeader>
            <CardTitle>Amenities & Emergency Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="amenities">Amenities</Label>
              <Input
                id="amenities"
                value={formData.amenities}
                onChange={(e) => handleInputChange("amenities", e.target.value)}
                placeholder="Pool, Gym, Kitchen, etc. (comma-separated)"
              />
              <p className="text-xs text-muted-foreground">
                Enter amenities separated by commas
              </p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="emergency_contacts">Emergency Contacts</Label>
              <Textarea
                id="emergency_contacts"
                value={formData.emergency_contacts}
                onChange={(e) =>
                  handleInputChange("emergency_contacts", e.target.value)
                }
                placeholder="Emergency contact information"
                rows={2}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="cleaning_instructions">
                Cleaning Instructions
              </Label>
              <Textarea
                id="cleaning_instructions"
                value={formData.cleaning_instructions}
                onChange={(e) =>
                  handleInputChange("cleaning_instructions", e.target.value)
                }
                placeholder="Cleaning and waste disposal instructions"
                rows={3}
              />
            </div>
          </CardContent>
        </Card>

        {/* Form Actions */}
        <div className="flex items-center justify-end space-x-4 pt-4">
          <Button type="button" variant="outline" onClick={onCancel}>
            <X className="mr-2 h-4 w-4" />
            Cancel
          </Button>
          <Button type="submit" disabled={isLoading}>
            <Save className="mr-2 h-4 w-4" />
            {isLoading
              ? "Saving..."
              : property
              ? "Update Property"
              : "Create Property"}
          </Button>
        </div>
      </form>
    </div>
  );
}
