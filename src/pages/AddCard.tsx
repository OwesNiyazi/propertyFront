import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppLayout } from '@/components/layout/AppLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { apiService } from '@/services/api';
import { useToast } from '@/hooks/use-toast';
import { Upload, Image as ImageIcon, X } from 'lucide-react';

type PropertyType = 'Flats' | 'Builder Floors' | 'House Villas' | 'Plots' | 'Farmhouses' | 'Hotels' | 'Lands' | 'Office Spaces' | 'Hostels' | 'Shops Showrooms';

export const AddCard: React.FC = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [type, setType] = useState<PropertyType | ''>('');
  const [location, setLocation] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

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

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.type.startsWith('image/')) {
        setSelectedFile(file);
        const reader = new FileReader();
        reader.onload = (e) => {
          setPreview(e.target?.result as string);
        };
        reader.readAsDataURL(file);
      } else {
        toast({
          title: "Invalid file",
          description: "Please select an image file",
          variant: "destructive",
        });
      }
    }
  };

  const handleRemoveFile = () => {
    setSelectedFile(null);
    setPreview(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title.trim()) {
      toast({
        title: "Error",
        description: "Please enter a title for your image",
        variant: "destructive",
      });
      return;
    }

    if (!selectedFile) {
      toast({
        title: "Error",
        description: "Please select an image to upload",
        variant: "destructive",
      });
      return;
    }

    setIsUploading(true);
    try {
      await apiService.uploadImage(
        title.trim(), 
        selectedFile, 
        description.trim() || undefined,
        price.trim() || undefined,
        type || undefined,
        location.trim() || undefined
      );
      toast({
        title: "Success!",
        description: "Your image has been uploaded successfully",
      });
      navigate('/my-list');
    } catch (error) {
      toast({
        title: "Upload failed",
        description: error instanceof Error ? error.message : "Failed to upload image",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <AppLayout>
      <div className="max-w-2xl mx-auto space-y-6">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Add New Image
          </h1>
          <p className="text-muted-foreground">
            Upload a new image to your collection
          </p>
        </div>

        <div className="bg-card/50 backdrop-blur-sm border border-border rounded-lg p-6 shadow-card">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="title">Property Title</Label>
                <Input
                  id="title"
                  type="text"
                  placeholder="Enter property title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="bg-background/50"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="price">Price</Label>
                <Input
                  id="price"
                  type="text"
                  placeholder="Enter price (e.g., ₹50,000)"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  className="bg-background/50"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="type">Property Type</Label>
              <Select value={type} onValueChange={(value: PropertyType) => setType(value)}>
                <SelectTrigger className="bg-background/50">
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
            </div>

            <div className="space-y-2">
              <Label htmlFor="location">Location</Label>
              <Input
                id="location"
                type="text"
                placeholder="Enter property location"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="bg-background/50"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                placeholder="Enter property description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="bg-background/50 min-h-[100px]"
              />
            </div>

            <div className="space-y-4">
              <Label>Select Image</Label>
              
              {!preview ? (
                <div className="border-2 border-dashed border-border rounded-lg p-8 text-center hover:border-primary/50 transition-colors">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileSelect}
                    className="hidden"
                    id="file-upload"
                  />
                  <label
                    htmlFor="file-upload"
                    className="cursor-pointer flex flex-col items-center space-y-4"
                  >
                    <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
                      <Upload className="w-8 h-8 text-primary" />
                    </div>
                    <div>
                      <p className="text-lg font-medium text-foreground">
                        Choose an image
                      </p>
                      <p className="text-sm text-muted-foreground">
                        PNG, JPG, GIF up to 10MB
                      </p>
                    </div>
                  </label>
                </div>
              ) : (
                <div className="relative">
                  <div className="aspect-video rounded-lg overflow-hidden bg-muted">
                    <img
                      src={preview}
                      alt="Preview"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <Button
                    type="button"
                    variant="destructive"
                    size="sm"
                    onClick={handleRemoveFile}
                    className="absolute top-2 right-2"
                  >
                    <X size={16} />
                  </Button>
                </div>
              )}
            </div>

            <div className="flex space-x-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate('/my-list')}
                className="flex-1"
                disabled={isUploading}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="gradient"
                disabled={isUploading || !selectedFile || !title.trim()}
                className="flex-1"
              >
                {isUploading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                    Uploading...
                  </>
                ) : (
                  <>
                    <ImageIcon size={16} />
                    Upload Image
                  </>
                )}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </AppLayout>
  );
};