import React, { useEffect, useState } from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { ImageCard } from '@/components/ui/image-card';
import { apiService, ImageCard as ImageCardType } from '@/services/api';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Image as ImageIcon } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export const Home: React.FC = () => {
  const [images, setImages] = useState<ImageCardType[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
  const [filterType, setFilterType] = useState<string>('All');

  const propertyTypes = [
    'Flats',
    'Builder Floors',
    'House Villas',
    'Plots',
    'Farmhouses',
    'Hotels',
    'Lands',
    'Office Spaces',
    'Hostels',
    'Shops Showrooms',
  ];

  const fetchImages = async () => {
    try {
      const fetchedImages = await apiService.getImages();
      setImages(fetchedImages);
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to load images",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchImages();
  }, []);

  const handleUpdate = async (id: string, title: string) => {
    await apiService.updateImage(id, title);
    await fetchImages();
  };

  const handleDelete = async (id: string) => {
    await apiService.deleteImage(id);
    await fetchImages();
  };

  // Filter images by type
  const filteredImages = filterType === 'All'
    ? images
    : images.filter((img) => img.type === filterType);

  if (isLoading) {
    return (
      <AppLayout>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-primary" />
            <p className="text-muted-foreground">Loading your images...</p>
          </div>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="space-y-6">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Discover Amazing property
          </h1>
          <p className="text-muted-foreground">
            Explore your collection of beautiful Dream
          </p>
        </div>

        {/* Filter dropdown */}
        <div className="flex justify-end mb-4">
          <Select value={filterType} onValueChange={setFilterType}>
            <SelectTrigger className="w-[220px] bg-background/50">
              <SelectValue placeholder="Filter by type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="All">All Types</SelectItem>
              {propertyTypes.map((type) => (
                <SelectItem key={type} value={type}>{type}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {filteredImages.length === 0 ? (
          <div className="text-center py-12">
            <ImageIcon className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
            <h3 className="text-lg font-medium text-foreground mb-2">
              No images yet
            </h3>
            <p className="text-muted-foreground">
              Start by uploading your first image!
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {filteredImages.map((image) => (
              <ImageCard
                key={image._id}
                image={image}
                onUpdate={handleUpdate}
                onDelete={handleDelete}
                showActions={false}
              />
            ))}
          </div>
        )}
      </div>
    </AppLayout>
  );
};