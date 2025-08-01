import React, { useEffect, useState } from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { ImageCard } from '@/components/ui/image-card';
import { apiService, ImageCard as ImageCardType } from '@/services/api';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Loader2, Image as ImageIcon, Plus, LogIn, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { Dialog, DialogContent } from '@/components/ui/dialog';

export const Home: React.FC = () => {
  const [images, setImages] = useState<ImageCardType[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();
  const [filterType, setFilterType] = useState<string>('All');
  const [filterListing, setFilterListing] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
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
    if (!isAuthenticated) {
      toast({
        title: "Login Required",
        description: "Please login to edit properties",
        variant: "destructive",
      });
      navigate('/login');
      return;
    }
    
    try {
      await apiService.updateImage(id, title);
      await fetchImages();
      toast({
        title: "Success",
        description: "Property updated successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to update property",
        variant: "destructive",
      });
    }
  };

  const handleDelete = async (id: string) => {
    if (!isAuthenticated) {
      toast({
        title: "Login Required",
        description: "Please login to delete properties",
        variant: "destructive",
      });
      navigate('/login');
      return;
    }
    
    try {
      await apiService.deleteImage(id);
      await fetchImages();
      toast({
        title: "Success",
        description: "Property deleted successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to delete property",
        variant: "destructive",
      });
    }
  };

  const handleCardClick = (image: ImageCardType) => {
    setModalImages(image.imageUrls || []);
    setModalIndex(0);
    setModalOpen(true);
  };

  const handleAddProperty = () => {
    if (!isAuthenticated) {
      toast({
        title: "Login Required",
        description: "Please login to add new properties",
        variant: "destructive",
      });
      navigate('/login');
      return;
    }
    navigate('/add-card');
  };

  // Filter images by type, listing, and search query
  const filteredImages = images.filter((img) => {
    // Type filter
    const matchesType = filterType === 'All' || img.type === filterType;
    
    // Listing filter
    const matchesListing = filterListing === 'All' || img.propertyType === filterListing;
    
    // Search filter - search in title, description, location
    const searchLower = searchQuery.toLowerCase();
    const matchesSearch = searchQuery === '' || 
      img.title.toLowerCase().includes(searchLower) ||
      (img.description && img.description.toLowerCase().includes(searchLower)) ||
      (img.location && img.location.toLowerCase().includes(searchLower));
    
    return matchesType && matchesListing && matchesSearch;
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
          {!isAuthenticated && (
            <div className="mt-4 p-4 bg-primary/10 rounded-lg border border-primary/20">
              <p className="text-sm text-muted-foreground mb-3">
                👋 Welcome! Browse properties freely. Login to add, edit, or manage your own properties.
              </p>
              <div className="flex gap-2 justify-center">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => navigate('/login')}
                  className="flex items-center gap-2"
                >
                  <LogIn size={16} />
                  Login
                </Button>
                <Button
                  variant="gradient"
                  size="sm"
                  onClick={() => navigate('/register')}
                >
                  Sign Up
                </Button>
              </div>
            </div>
          )}
        </div>

        {/* Action buttons for authenticated users */}
        {isAuthenticated && (
          <div className="flex justify-between items-center">
            <div className="flex gap-2">
              <Button
                onClick={handleAddProperty}
                className="flex items-center gap-2"
                variant="gradient"
              >
                <Plus size={16} />
                Add Property
              </Button>
              <Button
                onClick={() => navigate('/my-list')}
                variant="outline"
              >
                My Properties
              </Button>
            </div>
            <div className="text-sm text-muted-foreground">
              Welcome back, {user?.username}!
            </div>
          </div>
        )}

        {/* Filter section */}
        <div className="space-y-4">
          {/* Search bar */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={16} />
            <Input
              placeholder="Search by title, description, or location..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-background/50"
            />
          </div>

          {/* Filter dropdowns */}
          <div className="flex flex-wrap gap-4">
            {/* Property Type Filter */}
            <Select value={filterType} onValueChange={setFilterType}>
              <SelectTrigger className="w-[180px] bg-background/50">
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
              <SelectTrigger className="w-[180px] bg-background/50">
                <SelectValue placeholder="Filter by listing" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="All">All Rent/Sale</SelectItem>
                {listingTypes.map((listing) => (
                  <SelectItem key={listing} value={listing}>{listing}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Clear filters button */}
            {(filterType !== 'All' || filterListing !== 'All' || searchQuery !== '') && (
              <button
                onClick={() => {
                  setFilterType('All');
                  setFilterListing('All');
                  setSearchQuery('');
                }}
                className="px-4 py-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                Clear Filters
              </button>
            )}
          </div>
        </div>

        {/* Image Grid */}
        {filteredImages.length === 0 ? (
          <div className="text-center py-12">
            <ImageIcon className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
            <h3 className="text-lg font-medium text-foreground mb-2">
              No properties yet
            </h3>
            <p className="text-muted-foreground">
              {isAuthenticated 
                ? "Start by adding your first property!"
                : "Be the first to add a property!"
              }
            </p>
            {!isAuthenticated && (
              <Button
                onClick={() => navigate('/register')}
                className="mt-4"
                variant="gradient"
              >
                Sign Up to Add Properties
              </Button>
            )}
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
