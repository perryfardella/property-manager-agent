"use client";

import { useState, useEffect, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { PropertyForm } from "./property-form";
import { PropertyDetails } from "./property-details";
import { Plus, Home, MapPin } from "lucide-react";

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

export function PropertyManagement() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingProperty, setEditingProperty] = useState<Property | null>(null);
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(
    null
  );

  const supabase = createClient();

  const fetchProperties = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from("properties")
        .select("*")
        .eq("is_active", true)
        .order("created_at", { ascending: false });

      if (error) throw error;
      setProperties(data || []);
    } catch (error) {
      console.error("Error fetching properties:", error);
    } finally {
      setIsLoading(false);
    }
  }, [supabase]);

  useEffect(() => {
    fetchProperties();
  }, [fetchProperties]);

  const handleCreateProperty = () => {
    setEditingProperty(null);
    setSelectedProperty(null);
    setShowForm(true);
  };

  const handleEditProperty = (property: Property) => {
    setEditingProperty(property);
    setSelectedProperty(null);
    setShowForm(true);
  };

  const handleViewProperty = (property: Property) => {
    setSelectedProperty(property);
    setShowForm(false);
  };

  const handleFormSuccess = () => {
    setShowForm(false);
    setEditingProperty(null);
    fetchProperties();
  };

  const handleDeleteProperty = async (propertyId: number) => {
    if (!confirm("Are you sure you want to delete this property?")) return;

    try {
      const { error } = await supabase
        .from("properties")
        .update({ is_active: false })
        .eq("id", propertyId);

      if (error) throw error;
      fetchProperties();
      if (selectedProperty?.id === propertyId) {
        setSelectedProperty(null);
      }
    } catch (error) {
      console.error("Error deleting property:", error);
    }
  };

  if (showForm) {
    return (
      <PropertyForm
        property={editingProperty}
        onSuccess={handleFormSuccess}
        onCancel={() => setShowForm(false)}
      />
    );
  }

  if (selectedProperty) {
    return (
      <PropertyDetails
        property={selectedProperty}
        onEdit={() => handleEditProperty(selectedProperty)}
        onDelete={() => handleDeleteProperty(selectedProperty.id)}
        onBack={() => setSelectedProperty(null)}
      />
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Properties</h2>
          <p className="text-muted-foreground">
            Manage your short-term rental properties
          </p>
        </div>
        <Button onClick={handleCreateProperty}>
          <Plus className="mr-2 h-4 w-4" />
          Add Property
        </Button>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(3)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardHeader className="space-y-2">
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2"></div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="h-3 bg-gray-200 rounded"></div>
                  <div className="h-3 bg-gray-200 rounded w-5/6"></div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : properties.length === 0 ? (
        <Card className="text-center py-12">
          <CardContent>
            <Home className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No properties yet
            </h3>
            <p className="text-gray-500 mb-6">
              Add your first property to start managing guest communications
            </p>
            <Button onClick={handleCreateProperty}>
              <Plus className="mr-2 h-4 w-4" />
              Add Your First Property
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {properties.map((property) => (
            <Card
              key={property.id}
              className="cursor-pointer hover:shadow-md transition-shadow"
              onClick={() => handleViewProperty(property)}
            >
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-lg">{property.name}</CardTitle>
                    <div className="flex items-center text-sm text-muted-foreground mt-1">
                      <MapPin className="mr-1 h-3 w-3" />
                      {property.address}
                    </div>
                  </div>
                  <Badge variant="secondary">Active</Badge>
                </div>
              </CardHeader>
              <CardContent>
                {property.description && (
                  <p className="text-sm text-gray-600 line-clamp-2 mb-3">
                    {property.description}
                  </p>
                )}
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <div className="flex items-center space-x-4">
                    {property.check_in_time && (
                      <span>Check-in: {property.check_in_time}</span>
                    )}
                    {property.check_out_time && (
                      <span>Check-out: {property.check_out_time}</span>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
