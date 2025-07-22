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
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [propertyType, setPropertyType] = useState<'Rent' | 'Sale' | ''>('');
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
    const files = Array.from(e.target.files || []);
    const validFiles = files.filter(file => file.type.startsWith('image/'));
    setSelectedFiles(validFiles);
    const readers = validFiles.map(file => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      return new Promise<string>((resolve) => {
        reader.onload = (e) => resolve(e.target?.result as string);
      });
    });
    Promise.all(readers).then(setPreviews);
  };

  const handleRemoveFile = (index: number) => {
    setSelectedFiles(files => files.filter((_, i) => i !== index));
    setPreviews(previews => previews.filter((_, i) => i !== index));
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

    if (selectedFiles.length === 0) {
      toast({
        title: "Error",
        description: "Please select at least one image to upload",
        variant: "destructive",
      });
      return;
    }

    if (!propertyType) {
      toast({
        title: "Error",
        description: "Please select property type (Rent or Sale)",
        variant: "destructive",
      });
      return;
    }

    setIsUploading(true);
    try {
      await apiService.uploadImages({
        title: title.trim(),
        description: description.trim() || '',
        type: type || '',
        subtype: '', // Add subtype field if needed
        price: Number(price) || 0,
        location: location.trim() || '',
        images: selectedFiles,
        propertyType,
      });
      toast({
        title: "Success!",
        description: "Your images have been uploaded successfully",
      });
      navigate('/my-list');
    } catch (error) {
      toast({
        title: "Upload failed",
        description: error instanceof Error ? error.message : "Failed to upload images",
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
            Add New Property
          </h1>
          <p className="text-muted-foreground">
            Upload a new Property to your collection
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
              <Label htmlFor="propertyType">Property Type</Label>
              <Select value={propertyType} onValueChange={setPropertyType}>
                <SelectTrigger className="bg-background/50">
                  <SelectValue placeholder="Select property type (Rent or Sale)" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Rent">Rent</SelectItem>
                  <SelectItem value="Sale">Sale</SelectItem>
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
              <Label>Select Images</Label>
              <div className="border-2 border-dashed border-border rounded-lg p-8 text-center hover:border-primary/50 transition-colors">
                <input
                  type="file"
                  accept="image/*"
                  multiple
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
                      Choose images
                    </p>
                    <p className="text-sm text-muted-foreground">
                      PNG, JPG, GIF up to 10MB each
                    </p>
                  </div>
                </label>
              </div>
              {previews.length > 0 && (
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-4">
                  {previews.map((preview, idx) => (
                    <div key={idx} className="relative">
                      <div className="aspect-video rounded-lg overflow-hidden bg-muted">
                        <img src={preview} alt={`Preview ${idx + 1}`} className="w-full h-full object-cover" />
                      </div>
                      <Button
                        type="button"
                        variant="destructive"
                        size="sm"
                        onClick={() => handleRemoveFile(idx)}
                        className="absolute top-2 right-2"
                      >
                        <X size={16} />
                      </Button>
                    </div>
                  ))}
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
                disabled={isUploading || selectedFiles.length === 0 || !title.trim()}
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
                    Upload 
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