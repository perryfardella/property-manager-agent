"use client";

import { useState, useEffect, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
} from "@/components/ui/form";
import {
  Edit,
  Trash2,
  MapPin,
  Clock,
  Wifi,
  Car,
  Volume2,
  Navigation,
  Phone,
  Plus,
  X,
  Info,
} from "lucide-react";
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

interface WhatsAppLink {
  id: number;
  guest_phone_number: string;
  guest_name?: string;
  start_date?: string;
  end_date?: string;
  is_active: boolean;
  notes?: string;
}

interface PropertyDetailsDialogProps {
  property: Property | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onEdit: (property: Property) => void;
  onDelete: (propertyId: number) => void;
}

// Form schema for WhatsApp link
const whatsAppLinkSchema = z.object({
  guest_phone_number: z.string().min(1, "Phone number is required"),
  guest_name: z.string().optional(),
  start_date: z.string().optional(),
  end_date: z.string().optional(),
  notes: z.string().optional(),
});

type WhatsAppLinkForm = z.infer<typeof whatsAppLinkSchema>;

export function PropertyDetailsDialog({
  property,
  open,
  onOpenChange,
  onEdit,
  onDelete,
}: PropertyDetailsDialogProps) {
  const [whatsappLinks, setWhatsappLinks] = useState<WhatsAppLink[]>([]);
  const [showAddLink, setShowAddLink] = useState(false);

  const supabase = createClient();

  const form = useForm<WhatsAppLinkForm>({
    resolver: zodResolver(whatsAppLinkSchema),
    defaultValues: {
      guest_phone_number: "",
      guest_name: "",
      start_date: "",
      end_date: "",
      notes: "",
    },
  });

  const fetchWhatsAppLinks = useCallback(async () => {
    if (!property) return;

    try {
      const { data, error } = await supabase
        .from("property_whatsapp_links")
        .select("*")
        .eq("property_id", property.id)
        .eq("is_active", true)
        .order("created_at", { ascending: false });

      if (error) throw error;
      setWhatsappLinks(data || []);
    } catch (error) {
      console.error("Error fetching WhatsApp links:", error);
    }
  }, [supabase, property?.id]);

  useEffect(() => {
    if (property && open) {
      fetchWhatsAppLinks();
    }
  }, [property, open, fetchWhatsAppLinks]);

  const handleAddWhatsAppLink = async (data: WhatsAppLinkForm) => {
    if (!property) return;

    try {
      const { error } = await supabase.from("property_whatsapp_links").insert([
        {
          property_id: property.id,
          guest_phone_number: data.guest_phone_number,
          guest_name: data.guest_name || null,
          start_date: data.start_date || null,
          end_date: data.end_date || null,
          notes: data.notes || null,
        },
      ]);

      if (error) throw error;

      form.reset();
      setShowAddLink(false);
      fetchWhatsAppLinks();
    } catch (error) {
      console.error("Error adding WhatsApp link:", error);
      alert("Error adding WhatsApp link. Please try again.");
    }
  };

  const handleRemoveWhatsAppLink = async (linkId: number) => {
    if (!confirm("Are you sure you want to remove this WhatsApp link?")) return;

    try {
      const { error } = await supabase
        .from("property_whatsapp_links")
        .update({ is_active: false })
        .eq("id", linkId);

      if (error) throw error;
      fetchWhatsAppLinks();
    } catch (error) {
      console.error("Error removing WhatsApp link:", error);
    }
  };

  const DetailSection = ({
    title,
    children,
    icon,
  }: {
    title: string;
    children: React.ReactNode;
    icon: React.ReactNode;
  }) => (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          {icon}
          <span>{title}</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">{children}</CardContent>
    </Card>
  );

  const InfoItem = ({ label, value }: { label: string; value?: string }) => {
    if (!value) return null;
    return (
      <div>
        <p className="text-sm font-medium text-muted-foreground">{label}</p>
        <p className="text-sm">{value}</p>
      </div>
    );
  };

  if (!property) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-7xl w-[95vw] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between flex-col gap-4">
            <div className="flex items-center space-x-4">
              <div>
                <h1 className="text-2xl font-bold">{property.name}</h1>
                <div className="flex items-center text-muted-foreground">
                  <MapPin className="mr-1 h-4 w-4" />
                  {property.address}
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Badge variant="secondary">Active</Badge>
              <Button
                variant="outline"
                size="sm"
                onClick={() => onEdit(property)}
              >
                <Edit className="mr-2 h-4 w-4" />
                Edit
              </Button>
              <Button
                variant="destructive"
                size="sm"
                onClick={() => onDelete(property.id)}
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Delete
              </Button>
            </div>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Basic Information */}
          {property.description && (
            <DetailSection
              title="Description"
              icon={<Info className="h-5 w-5" />}
            >
              <p className="text-sm">{property.description}</p>
            </DetailSection>
          )}

          {/* Check-in/Check-out */}
          {(property.check_in_time ||
            property.check_out_time ||
            property.check_in_instructions ||
            property.check_out_instructions) && (
            <DetailSection
              title="Check-in & Check-out"
              icon={<Clock className="h-5 w-5" />}
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <InfoItem
                  label="Check-in Time"
                  value={property.check_in_time}
                />
                <InfoItem
                  label="Check-out Time"
                  value={property.check_out_time}
                />
              </div>
              <InfoItem
                label="Check-in Instructions"
                value={property.check_in_instructions}
              />
              <InfoItem
                label="Check-out Instructions"
                value={property.check_out_instructions}
              />
            </DetailSection>
          )}

          {/* WiFi */}
          {(property.wifi_ssid || property.wifi_password) && (
            <DetailSection
              title="WiFi & Internet"
              icon={<Wifi className="h-5 w-5" />}
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <InfoItem
                  label="Network Name (SSID)"
                  value={property.wifi_ssid}
                />
                <InfoItem label="Password" value={property.wifi_password} />
              </div>
            </DetailSection>
          )}

          {/* Parking */}
          {(property.parking_details ||
            property.parking_instructions ||
            property.transportation_info) && (
            <DetailSection
              title="Parking & Transportation"
              icon={<Car className="h-5 w-5" />}
            >
              <InfoItem
                label="Parking Details"
                value={property.parking_details}
              />
              <InfoItem
                label="Parking Instructions"
                value={property.parking_instructions}
              />
              <InfoItem
                label="Transportation Information"
                value={property.transportation_info}
              />
            </DetailSection>
          )}

          {/* House Rules */}
          {(property.quiet_hours_start ||
            property.quiet_hours_end ||
            property.house_rules) && (
            <DetailSection
              title="House Rules & Quiet Hours"
              icon={<Volume2 className="h-5 w-5" />}
            >
              {(property.quiet_hours_start || property.quiet_hours_end) && (
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Quiet Hours
                  </p>
                  <p className="text-sm">
                    {property.quiet_hours_start && property.quiet_hours_end
                      ? `${property.quiet_hours_start} - ${property.quiet_hours_end}`
                      : property.quiet_hours_start || property.quiet_hours_end}
                  </p>
                </div>
              )}
              <InfoItem label="House Rules" value={property.house_rules} />
            </DetailSection>
          )}

          {/* Location & Directions */}
          {(property.directions || property.google_maps_link) && (
            <DetailSection
              title="Location & Directions"
              icon={<Navigation className="h-5 w-5" />}
            >
              <InfoItem label="Directions" value={property.directions} />
              {property.google_maps_link && (
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Google Maps
                  </p>
                  <a
                    href={property.google_maps_link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-blue-600 hover:underline"
                  >
                    Open in Google Maps
                  </a>
                </div>
              )}
            </DetailSection>
          )}

          {/* Local Area */}
          {(property.nearby_restaurants ||
            property.nearby_attractions ||
            property.points_of_interest) && (
            <DetailSection
              title="Local Area Information"
              icon={<MapPin className="h-5 w-5" />}
            >
              <InfoItem
                label="Nearby Restaurants"
                value={property.nearby_restaurants}
              />
              <InfoItem
                label="Nearby Attractions"
                value={property.nearby_attractions}
              />
              <InfoItem
                label="Points of Interest"
                value={property.points_of_interest}
              />
            </DetailSection>
          )}

          {/* Emergency & Other */}
          {(property.emergency_contacts ||
            property.cleaning_instructions ||
            property.amenities?.length) && (
            <DetailSection
              title="Emergency & Additional Information"
              icon={<Phone className="h-5 w-5" />}
            >
              <InfoItem
                label="Emergency Contacts"
                value={property.emergency_contacts}
              />
              <InfoItem
                label="Cleaning Instructions"
                value={property.cleaning_instructions}
              />
              {property.amenities && property.amenities.length > 0 && (
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Amenities
                  </p>
                  <div className="flex flex-wrap gap-2 mt-1">
                    {property.amenities.map((amenity, index) => (
                      <Badge key={index} variant="outline">
                        {amenity}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </DetailSection>
          )}

          {/* WhatsApp Links Management */}
          <DetailSection
            title="Guest WhatsApp Numbers"
            icon={<Phone className="h-5 w-5" />}
          >
            <div className="space-y-4">
              {whatsappLinks.length === 0 ? (
                <p className="text-sm text-muted-foreground">
                  No guest WhatsApp numbers linked yet.
                </p>
              ) : (
                <div className="space-y-3">
                  {whatsappLinks.map((link) => (
                    <div
                      key={link.id}
                      className="flex items-center justify-between p-3 border rounded-lg"
                    >
                      <div className="flex-1">
                        <div className="flex items-center space-x-2">
                          <span className="font-medium">
                            {link.guest_phone_number}
                          </span>
                          {link.guest_name && (
                            <Badge variant="outline">{link.guest_name}</Badge>
                          )}
                        </div>
                        {(link.start_date || link.end_date) && (
                          <p className="text-xs text-muted-foreground mt-1">
                            {link.start_date && link.end_date
                              ? `${link.start_date} - ${link.end_date}`
                              : link.start_date || link.end_date}
                          </p>
                        )}
                        {link.notes && (
                          <p className="text-xs text-muted-foreground mt-1">
                            {link.notes}
                          </p>
                        )}
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleRemoveWhatsAppLink(link.id)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}

              {!showAddLink ? (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowAddLink(true)}
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Add Guest WhatsApp Number
                </Button>
              ) : (
                <Form {...form}>
                  <form
                    onSubmit={form.handleSubmit(handleAddWhatsAppLink)}
                    className="space-y-3 p-4 border rounded-lg bg-gray-50"
                  >
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <FormField
                        control={form.control}
                        name="guest_phone_number"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Phone Number *</FormLabel>
                            <FormControl>
                              <Input placeholder="+1234567890" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="guest_name"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Guest Name</FormLabel>
                            <FormControl>
                              <Input
                                placeholder="Optional guest name"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="start_date"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Start Date</FormLabel>
                            <FormControl>
                              <Input type="date" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="end_date"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>End Date</FormLabel>
                            <FormControl>
                              <Input type="date" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    <FormField
                      control={form.control}
                      name="notes"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Notes</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Optional notes about the guest or stay"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <div className="flex items-center space-x-2">
                      <Button type="submit" size="sm">
                        Add Link
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setShowAddLink(false);
                          form.reset();
                        }}
                      >
                        Cancel
                      </Button>
                    </div>
                  </form>
                </Form>
              )}
            </div>
          </DetailSection>
        </div>
      </DialogContent>
    </Dialog>
  );
}
