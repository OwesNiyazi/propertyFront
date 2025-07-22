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
  onUpdate: (id: string, title: string, description?: string, price?: string, type?: string, location?: string, newImageFiles?: File[], propertyType?: 'Rent' | 'Sale', existingImages?: string[]) => Promise<void>;
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
  const [editPropertyType, setEditPropertyType] = useState<'Rent' | 'Sale' | ''>(image.propertyType as 'Rent' | 'Sale' | '');
  const [editImageFiles, setEditImageFiles] = useState<File[]>([]);
  const [editImagePreviews, setEditImagePreviews] = useState<string[]>([]);
  const [existingImages, setExistingImages] = useState<string[]>(image.imageUrls || []);

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
    if (!editPropertyType) {
      toast({
        title: "Error",
        description: "Please select property type (Rent or Sale)",
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
        editImageFiles, // <-- all new files
        editPropertyType,
        existingImages // <-- all remaining old images
      );
      setIsEditing(false);
      setEditImageFiles([]);
      setEditImagePreviews([]);
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

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const validFiles = files.filter(file => file.type.startsWith('image/'));
    setEditImageFiles(prev => [...prev, ...validFiles]);
    // Create previews for new files only
    const readers = validFiles.map(file => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      return new Promise<string>((resolve) => {
        reader.onload = (e) => resolve(e.target?.result as string);
      });
    });
    Promise.all(readers).then(newPreviews => {
      setEditImagePreviews(prev => [...prev, ...newPreviews]);
    });
  };

  const handleRemoveExistingImage = (idx: number) => {
    setExistingImages(images => images.filter((_, i) => i !== idx));
  };
  const handleRemoveNewImage = (idx: number) => {
    setEditImageFiles(files => files.filter((_, i) => i !== idx));
    setEditImagePreviews(previews => previews.filter((_, i) => i !== idx));
  };

  return (
    <div className="group bg-card/50 backdrop-blur-sm border border-border rounded-lg overflow-hidden shadow-card hover:shadow-glow transition-all duration-300 transform hover:scale-105">
      <div className="aspect-square overflow-hidden bg-muted">
        <img
          src={image.imageUrls?.[0]}
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
            <Select value={editPropertyType} onValueChange={setEditPropertyType}>
              <SelectTrigger className="text-sm">
                <SelectValue placeholder="Select property type (Rent or Sale)" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Rent">Rent</SelectItem>
                <SelectItem value="Sale">Sale</SelectItem>
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
            {/* Existing images */}
            {existingImages.length > 0 && (
              <div className="grid grid-cols-2 gap-2 mb-2">
                {existingImages.map((url, idx) => (
                  <div key={idx} className="relative">
                    <img src={url} alt={`Old ${idx + 1}`} className="w-full h-24 object-cover rounded" />
                    <Button
                      type="button"
                      size="sm"
                      variant="destructive"
                      className="absolute top-1 right-1"
                      onClick={() => handleRemoveExistingImage(idx)}
                    >
                      <X size={14} />
                    </Button>
                  </div>
                ))}
              </div>
            )}
            {/* New images */}
            {editImagePreviews.length > 0 && (
              <div className="grid grid-cols-2 gap-2 mb-2">
                {editImagePreviews.map((preview, idx) => (
                  <div key={idx} className="relative">
                    <img src={preview} alt={`New ${idx + 1}`} className="w-full h-24 object-cover rounded" />
                    <Button
                      type="button"
                      size="sm"
                      variant="destructive"
                      className="absolute top-1 right-1"
                      onClick={() => handleRemoveNewImage(idx)}
                    >
                      <X size={14} />
                    </Button>
                  </div>
                ))}
              </div>
            )}
            {/* File input */}
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={handleFileSelect}
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
              <div className="text-xs font-semibold text-primary mb-1">
                {image.propertyType}
              </div>
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