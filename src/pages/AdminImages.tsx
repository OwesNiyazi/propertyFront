import React, { useEffect, useState } from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { apiService, ImageCard as ImageCardType } from '@/services/api';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';

export const AdminImages: React.FC = () => {
  const [images, setImages] = useState<ImageCardType[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  const fetchImages = async () => {
    try {
      const fetchedImages = await apiService.getAllImages();
      setImages(fetchedImages);
    } catch (error) {
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to load images',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => { fetchImages(); }, []);

  const handleDelete = async (id: string) => {
    try {
      await apiService.deleteImage(id);
      toast({ title: 'Deleted', description: 'Image deleted successfully.' });
      fetchImages();
    } catch (error) {
      toast({ title: 'Delete failed', description: error instanceof Error ? error.message : 'Failed to delete image', variant: 'destructive' });
    }
  };

  return (
    <AppLayout>
      <div className="space-y-6">
        <h1 className="text-3xl font-bold mb-4">Admin: All Images</h1>
        {isLoading ? (
          <div className="flex items-center justify-center min-h-[400px]">
            <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-primary" />
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {images.map((image) => (
              <div key={image._id} className="border rounded-lg p-4 bg-card/50">
                <img src={image.imageUrl} alt={image.title} className="w-full h-40 object-cover rounded mb-2" />
                <div className="font-bold">{image.title}</div>
                <div className="text-sm text-muted-foreground">{image.description}</div>
                <div className="flex gap-2 mt-2">
                  <button onClick={() => handleDelete(image._id)} className="px-2 py-1 bg-red-500 text-white rounded">Delete</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </AppLayout>
  );
};
export default AdminImages; 