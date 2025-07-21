import React, { useState } from 'react';
import { ImageCard as ImageCardType } from '@/services/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { Edit2, Trash2, Save, X, MapPin, IndianRupee, Home } from 'lucide-react';

type PropertyType = 'Flats' | 'Builder Floors' | 'House Villas' | 'Plots' | 'Farmhouses' | 'Hotels' | 'Lands' | 'Office Spaces' | 'Hostels' | 'Shops Showrooms';

interface ImageCardProps {
  image: ImageCardType;
  onUpdate: (id: string, title: string, description?: string, price?: string, type?: string, location?: string, imageFile?: File) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
  showActions?: boolean;
}

export const ImageCard: React.FC<ImageCardProps> = ({
  image,
  onUpdate,
  onDelete,
  showActions = false,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(image.title);
  const [editDescription, setEditDescription] = useState(image.description || '');
  const [editPrice, setEditPrice] = useState(image.price?.toString() || '');
  const [editType, setEditType] = useState<PropertyType | ''>(image.type as PropertyType || '');
  const [editLocation, setEditLocation] = useState(image.location || '');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const [editImageFile, setEditImageFile] = useState<File | undefined>(undefined);

  const propertyTypes: PropertyType[] = [
    'Flats',
    'Builder Floors', 
    'House Villas',
    'Plots',
    'Farmhouses',
    'Hotels',
    'Lands',
    'Office Spaces',
    'Hostels',
    'Shops Showrooms'
  ];

  const handleSave = async () => {
    if (editTitle.trim() === '') {
      toast({
        title: "Error",
        description: "Title cannot be empty",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      await onUpdate(
        image._id, 
        editTitle.trim(), 
        editDescription.trim() || undefined,
        editPrice.trim() || undefined,
        editType || undefined,
        editLocation.trim() || undefined,
        editImageFile
      );
      setIsEditing(false);
      setEditImageFile(undefined);
      toast({
        title: "Success",
        description: "Image details updated successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to update image",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this image?')) {
      setIsLoading(true);
      try {
        await onDelete(image._id);
        toast({
          title: "Success",
          description: "Image deleted successfully",
        });
      } catch (error) {
        toast({
          title: "Error",
          description: error instanceof Error ? error.message : "Failed to delete image",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleCancel = () => {
    setEditTitle(image.title);
    setEditDescription(image.description || '');
    setEditPrice(image.price?.toString() || '');
    setEditType(image.type as PropertyType || '');
    setEditLocation(image.location || '');
    setIsEditing(false);
  };

  return (
    <div className="group bg-card/50 backdrop-blur-sm border border-border rounded-lg overflow-hidden shadow-card hover:shadow-glow transition-all duration-300 transform hover:scale-105">
      <div className="aspect-square overflow-hidden bg-muted">
        <img
          src={image.imageUrl}
          alt={image.title}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
          loading="lazy"
        />
      </div>
      
      <div className="p-4">
        {isEditing ? (
          <div className="space-y-3">
            <Input
              value={editTitle}
              onChange={(e) => setEditTitle(e.target.value)}
              placeholder="Enter property title"
              className="text-sm"
              disabled={isLoading}
            />
            <Input
              value={editPrice}
              onChange={(e) => setEditPrice(e.target.value)}
              placeholder="Enter price (e.g., ₹50,000)"
              className="text-sm"
              disabled={isLoading}
            />
            <Select value={editType} onValueChange={(value: PropertyType) => setEditType(value)} disabled={isLoading}>
              <SelectTrigger className="text-sm">
                <SelectValue placeholder="Select property type" />
              </SelectTrigger>
              <SelectContent>
                {propertyTypes.map((propertyType) => (
                  <SelectItem key={propertyType} value={propertyType}>
                    {propertyType}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Input
              value={editLocation}
              onChange={(e) => setEditLocation(e.target.value)}
              placeholder="Enter location"
              className="text-sm"
              disabled={isLoading}
            />
            <Textarea
              value={editDescription}
              onChange={(e) => setEditDescription(e.target.value)}
              placeholder="Enter property description"
              className="text-sm min-h-[60px]"
              disabled={isLoading}
            />
            <input
              type="file"
              accept="image/*"
              onChange={e => setEditImageFile(e.target.files ? e.target.files[0] : undefined)}
              disabled={isLoading}
              className="text-sm"
            />
            <div className="flex space-x-2">
              <Button
                size="sm"
                onClick={handleSave}
                disabled={isLoading}
                className="flex-1"
              >
                <Save size={14} />
                Save
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={handleCancel}
                disabled={isLoading}
                className="flex-1"
              >
                <X size={14} />
                Cancel
              </Button>
            </div>
          </div>
        ) : (
          <>
            <div className="space-y-3">
              <h3 className="font-medium text-foreground line-clamp-2">
                {image.title}
              </h3>
              
              {image.price && (
                <div className="flex items-center gap-2 text-sm text-primary font-semibold">
                  <IndianRupee size={14} />
                  {image.price}
                </div>
              )}
              
              {image.type && (
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Home size={14} />
                  {image.type}
                </div>
              )}
              
              {image.location && (
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <MapPin size={14} />
                  {image.location}
                </div>
              )}
              
              {image.description && (
                <p className="text-sm text-muted-foreground line-clamp-2">
                  {image.description}
                </p>
              )}
            </div>
            
            {showActions && (
              <div className="flex space-x-2 mt-4">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setIsEditing(true)}
                  disabled={isLoading}
                  className="flex-1"
                >
                  <Edit2 size={14} />
                  Edit
                </Button>
                <Button
                  size="sm"
                  variant="destructive"
                  onClick={handleDelete}
                  disabled={isLoading}
                  className="flex-1"
                >
                  <Trash2 size={14} />
                  Delete
                </Button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};