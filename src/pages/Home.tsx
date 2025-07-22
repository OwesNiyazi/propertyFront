import React, { useEffect, useState } from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { ImageCard } from '@/components/ui/image-card';
import { apiService, ImageCard as ImageCardType } from '@/services/api';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Image as ImageIcon } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { Dialog, DialogContent } from '@/components/ui/dialog'; // If you have a dialog/modal component

export const Home: React.FC = () => {
  const [images, setImages] = useState<ImageCardType[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
  const [filterType, setFilterType] = useState<string>('All');
  const [filterListing, setFilterListing] = useState<string>('All');
  const [modalOpen, setModalOpen] = useState(false);
  const [modalImages, setModalImages] = useState<string[]>([]);
  const [modalIndex, setModalIndex] = useState(0);

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
  const listingTypes = ['Rent', 'Sale'];

  const fetchImages = async () => {
    try {
      const fetchedImages = await apiService.getAllImages();
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

  const handleCardClick = (image: ImageCardType) => {
    setModalImages(image.imageUrls || []);
    setModalIndex(0);
    setModalOpen(true);
  };

  // Filter images by both type and listing
  const filteredImages = images.filter((img) => {
    const matchesType = filterType === 'All' || img.type === filterType;
    const matchesListing = filterListing === 'All' ||  img.propertyType === filterListing;
    return matchesType && matchesListing;
  });

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
            Discover Amazing Property
          </h1>
          <p className="text-muted-foreground">
            Explore your collection of beautiful dreams
          </p>
        </div>

        {/* Filter dropdowns */}
        <div className="flex justify-end mb-4 gap-4">
          {/* Property Type Filter */}
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

          {/* Listing Type Filter */}
          <Select value={filterListing} onValueChange={setFilterListing}>
            <SelectTrigger className="w-[220px] bg-background/50">
              <SelectValue placeholder="Filter by listing" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="All">All Rent/Sale</SelectItem>
              {listingTypes.map((listing) => (
                <SelectItem key={listing} value={listing}>{listing}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Image Grid */}
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
              <div key={image._id} onClick={() => handleCardClick(image)} className="cursor-pointer">
                <ImageCard
                  image={image}
                  onUpdate={handleUpdate}
                  onDelete={handleDelete}
                  showActions={false}
                />
              </div>
            ))}
          </div>
        )}
        {/* Modal for image preview */}
        <Dialog open={modalOpen} onOpenChange={setModalOpen}>
          <DialogContent className="flex flex-col items-center">
            {modalImages.length > 0 && (
              <>
                <img
                  src={modalImages[modalIndex]}
                  alt={`Property ${modalIndex + 1}`}
                  className="max-h-[70vh] max-w-full mb-4"
                />
                <div className="flex gap-2">
                  <button
                    onClick={() => setModalIndex((i) => Math.max(i - 1, 0))}
                    disabled={modalIndex === 0}
                  >
                    Prev
                  </button>
                  <button
                    onClick={() => setModalIndex((i) => Math.min(i + 1, modalImages.length - 1))}
                    disabled={modalIndex === modalImages.length - 1}
                  >
                    Next
                  </button>
                </div>
                <div className="text-xs mt-2">
                  {modalIndex + 1} / {modalImages.length}
                </div>
              </>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </AppLayout>
  );
};
