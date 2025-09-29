"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import { Save, X } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

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

interface PropertyFormDialogProps {
  property?: Property | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

// Form schema with validation
const propertyFormSchema = z.object({
  name: z.string().min(1, "Property name is required").max(100, "Name must be less than 100 characters"),
  address: z.string().min(1, "Address is required").max(200, "Address must be less than 200 characters"),
  description: z.string().optional(),
  check_in_time: z.string().optional(),
  check_out_time: z.string().optional(),
  check_in_instructions: z.string().optional(),
  check_out_instructions: z.string().optional(),
  wifi_ssid: z.string().optional(),
  wifi_password: z.string().optional(),
  parking_details: z.string().optional(),
  parking_instructions: z.string().optional(),
  quiet_hours_start: z.string().optional(),
  quiet_hours_end: z.string().optional(),
  house_rules: z.string().optional(),
  directions: z.string().optional(),
  google_maps_link: z.string().url("Must be a valid URL").optional().or(z.literal("")),
  nearby_restaurants: z.string().optional(),
  nearby_attractions: z.string().optional(),
  points_of_interest: z.string().optional(),
  transportation_info: z.string().optional(),
  emergency_contacts: z.string().optional(),
  cleaning_instructions: z.string().optional(),
  amenities: z.string().optional(),
});

type PropertyFormData = z.infer<typeof propertyFormSchema>;

export function PropertyFormDialog({
  property,
  open,
  onOpenChange,
  onSuccess,
}: PropertyFormDialogProps) {
  const [isLoading, setIsLoading] = useState(false);
  const supabase = createClient();

  const form = useForm<PropertyFormData>({
    resolver: zodResolver(propertyFormSchema),
    defaultValues: {
      name: "",
      address: "",
      description: "",
      check_in_time: "",
      check_out_time: "",
      check_in_instructions: "",
      check_out_instructions: "",
      wifi_ssid: "",
      wifi_password: "",
      parking_details: "",
      parking_instructions: "",
      quiet_hours_start: "",
      quiet_hours_end: "",
      house_rules: "",
      directions: "",
      google_maps_link: "",
      nearby_restaurants: "",
      nearby_attractions: "",
      points_of_interest: "",
      transportation_info: "",
      emergency_contacts: "",
      cleaning_instructions: "",
      amenities: "",
    },
  });

  // Reset form when property changes or dialog opens
  useEffect(() => {
    if (open) {
      if (property) {
        // Editing mode
        form.reset({
          name: property.name || "",
          address: property.address || "",
          description: property.description || "",
          check_in_time: property.check_in_time || "",
          check_out_time: property.check_out_time || "",
          check_in_instructions: property.check_in_instructions || "",
          check_out_instructions: property.check_out_instructions || "",
          wifi_ssid: property.wifi_ssid || "",
          wifi_password: property.wifi_password || "",
          parking_details: property.parking_details || "",
          parking_instructions: property.parking_instructions || "",
          quiet_hours_start: property.quiet_hours_start || "",
          quiet_hours_end: property.quiet_hours_end || "",
          house_rules: property.house_rules || "",
          directions: property.directions || "",
          google_maps_link: property.google_maps_link || "",
          nearby_restaurants: property.nearby_restaurants || "",
          nearby_attractions: property.nearby_attractions || "",
          points_of_interest: property.points_of_interest || "",
          transportation_info: property.transportation_info || "",
          emergency_contacts: property.emergency_contacts || "",
          cleaning_instructions: property.cleaning_instructions || "",
          amenities: property.amenities?.join(", ") || "",
        });
      } else {
        // Create mode
        form.reset({
          name: "",
          address: "",
          description: "",
          check_in_time: "",
          check_out_time: "",
          check_in_instructions: "",
          check_out_instructions: "",
          wifi_ssid: "",
          wifi_password: "",
          parking_details: "",
          parking_instructions: "",
          quiet_hours_start: "",
          quiet_hours_end: "",
          house_rules: "",
          directions: "",
          google_maps_link: "",
          nearby_restaurants: "",
          nearby_attractions: "",
          points_of_interest: "",
          transportation_info: "",
          emergency_contacts: "",
          cleaning_instructions: "",
          amenities: "",
        });
      }
    }
  }, [property, open, form]);

  const onSubmit = async (data: PropertyFormData) => {
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

      // Prepare data for submission
      const submitData = {
        ...data,
        amenities: data.amenities
          ? data.amenities
              .split(",")
              .map((item) => item.trim())
              .filter(Boolean)
          : [],
        check_in_time: data.check_in_time || null,
        check_out_time: data.check_out_time || null,
        quiet_hours_start: data.quiet_hours_start || null,
        quiet_hours_end: data.quiet_hours_end || null,
        google_maps_link: data.google_maps_link || null,
      };

      let result;
      if (property) {
        // Update existing property
        result = await supabase
          .from("properties")
          .update(submitData)
          .eq("id", property.id);
      } else {
        // Create new property - include user_id for RLS policy
        const insertData = {
          ...submitData,
          user_id: user.id,
        };

        result = await supabase
          .from("properties")
          .insert([insertData])
          .select();
      }

      if (result.error) {
        console.error("Database error:", result.error);
        throw result.error;
      }

      onOpenChange(false);
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
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {property ? "Edit Property" : "Add Property"}
          </DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Basic Information */}
            <Card>
              <CardHeader>
                <CardTitle>Basic Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Property Name *</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g., Cozy Downtown Apartment" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="address"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Address *</FormLabel>
                        <FormControl>
                          <Input placeholder="Full property address" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Brief description of the property"
                          rows={3}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>

            {/* Check-in/Check-out */}
            <Card>
              <CardHeader>
                <CardTitle>Check-in & Check-out</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="check_in_time"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Check-in Time</FormLabel>
                        <FormControl>
                          <Input type="time" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="check_out_time"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Check-out Time</FormLabel>
                        <FormControl>
                          <Input type="time" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <FormField
                  control={form.control}
                  name="check_in_instructions"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Check-in Instructions</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Detailed check-in instructions for guests"
                          rows={3}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="check_out_instructions"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Check-out Instructions</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Detailed check-out instructions for guests"
                          rows={3}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>

            {/* WiFi & Internet */}
            <Card>
              <CardHeader>
                <CardTitle>WiFi & Internet Access</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="wifi_ssid"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>WiFi Network Name</FormLabel>
                        <FormControl>
                          <Input placeholder="Network name (SSID)" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="wifi_password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>WiFi Password</FormLabel>
                        <FormControl>
                          <Input
                            type="password"
                            placeholder="WiFi password"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Parking & Transportation */}
            <Card>
              <CardHeader>
                <CardTitle>Parking & Transportation</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <FormField
                  control={form.control}
                  name="parking_details"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Parking Details</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Parking availability and type (e.g., free street parking, paid garage)"
                          rows={2}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="parking_instructions"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Parking Instructions</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Specific parking instructions and location"
                          rows={2}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="transportation_info"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Transportation Information</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Public transport options, taxi services, etc."
                          rows={2}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>

            {/* House Rules & Quiet Hours */}
            <Card>
              <CardHeader>
                <CardTitle>House Rules & Quiet Hours</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="quiet_hours_start"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Quiet Hours Start</FormLabel>
                        <FormControl>
                          <Input type="time" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="quiet_hours_end"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Quiet Hours End</FormLabel>
                        <FormControl>
                          <Input type="time" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <FormField
                  control={form.control}
                  name="house_rules"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>House Rules</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Property rules for guests"
                          rows={4}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>

            {/* Location & Directions */}
            <Card>
              <CardHeader>
                <CardTitle>Location & Directions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <FormField
                  control={form.control}
                  name="directions"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Directions</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Detailed directions to the property"
                          rows={3}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="google_maps_link"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Google Maps Link</FormLabel>
                      <FormControl>
                        <Input
                          type="url"
                          placeholder="https://maps.google.com/..."
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>

            {/* Local Area Information */}
            <Card>
              <CardHeader>
                <CardTitle>Local Area Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <FormField
                  control={form.control}
                  name="nearby_restaurants"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nearby Restaurants</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Recommended restaurants and dining options"
                          rows={3}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="nearby_attractions"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nearby Attractions</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Tourist attractions and activities"
                          rows={3}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="points_of_interest"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Points of Interest</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Other local points of interest"
                          rows={3}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>

            {/* Amenities & Emergency */}
            <Card>
              <CardHeader>
                <CardTitle>Amenities & Emergency Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <FormField
                  control={form.control}
                  name="amenities"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Amenities</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Pool, Gym, Kitchen, etc. (comma-separated)"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        Enter amenities separated by commas
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="emergency_contacts"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Emergency Contacts</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Emergency contact information"
                          rows={2}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="cleaning_instructions"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Cleaning Instructions</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Cleaning and waste disposal instructions"
                          rows={3}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>

            {/* Form Actions */}
            <div className="flex items-center justify-end space-x-4 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                disabled={isLoading}
              >
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
        </Form>
      </DialogContent>
    </Dialog>
  );
}
