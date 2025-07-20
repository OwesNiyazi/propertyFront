import React, { useEffect, useState } from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { ImageCard } from '@/components/ui/image-card';
import { apiService, ImageCard as ImageCardType } from '@/services/api';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Image as ImageIcon } from 'lucide-react';

export const MyList: React.FC = () => {
  const [images, setImages] = useState<ImageCardType[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

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

  const handleUpdate = async (id: string, title: string, description?: string, price?: string, type?: string, location?: string) => {
    await apiService.updateImage(id, title, description, price, type, location);
    await fetchImages();
  };

  const handleDelete = async (id: string) => {
    await apiService.deleteImage(id);
    await fetchImages();
  };

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
            My Image Collection
          </h1>
          <p className="text-muted-foreground">
            Manage and organize your uploaded images
          </p>
        </div>

        {images.length === 0 ? (
          <div className="text-center py-12">
            <ImageIcon className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
            <h3 className="text-lg font-medium text-foreground mb-2">
              Your collection is empty
            </h3>
            <p className="text-muted-foreground">
              Upload your first image to get started!
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {images.map((image) => (
              <ImageCard
                key={image._id}
                image={image}
                onUpdate={handleUpdate}
                onDelete={handleDelete}
                showActions={true}
              />
            ))}
          </div>
        )}
      </div>
    </AppLayout>
  );
};