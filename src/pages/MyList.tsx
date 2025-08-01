import React, { useEffect, useState } from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { ImageCard } from '@/components/ui/image-card';
import { apiService, ImageCard as ImageCardType } from '@/services/api';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Image as ImageIcon, Search } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';

export const MyList: React.FC = () => {
  const [images, setImages] = useState<ImageCardType[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
  const { user } = useAuth();
  const [filterType, setFilterType] = useState<string>('All');
  const [filterListing, setFilterListing] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [dateFilter, setDateFilter] = useState<string>('All');

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
  const dateFilterOptions = ['All', 'New', 'Old'];

  const fetchImages = async () => {
    try {
      let fetchedImages;
      if (user?.isAdmin) {
        fetchedImages = await apiService.getAllImages();
      } else {
        fetchedImages = await apiService.getImages();
      }
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
    // eslint-disable-next-line
  }, [user]);

  const handleUpdate = async (
    id: string,
    title: string,
    description?: string,
    price?: string,
    type?: string,
    location?: string,
    newImageFiles?: File[],
    propertyType?: 'Rent' | 'Sale',
    existingImages?: string[]
  ) => {
    await apiService.updateImage(id, title, description, price, type, location, newImageFiles || [], propertyType, existingImages || []);
    await fetchImages();
  };

  const handleDelete = async (id: string) => {
    await apiService.deleteImage(id);
    await fetchImages();
  };

  // Filter images by type, listing, search query, and date
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
    
    // Date filter
    let matchesDate = true;
    if (dateFilter !== 'All') {
      const imageDate = new Date(img.createdAt);
      const now = new Date();
      const daysDiff = (now.getTime() - imageDate.getTime()) / (1000 * 3600 * 24);
      
      if (dateFilter === 'New') {
        matchesDate = daysDiff <= 7; // Properties added in last 7 days
      } else if (dateFilter === 'Old') {
        matchesDate = daysDiff > 7; // Properties older than 7 days
      }
    }
    
    return matchesType && matchesListing && matchesSearch && matchesDate;
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
            My Property Collection
          </h1>
          <p className="text-muted-foreground">
            Manage and organize your Data
          </p>
        </div>

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

            {/* Date Filter */}
            <Select value={dateFilter} onValueChange={setDateFilter}>
              <SelectTrigger className="w-[180px] bg-background/50">
                <SelectValue placeholder="Filter by date" />
              </SelectTrigger>
              <SelectContent>
                {dateFilterOptions.map((option) => (
                  <SelectItem key={option} value={option}>{option}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Clear filters button */}
            {(filterType !== 'All' || filterListing !== 'All' || searchQuery !== '' || dateFilter !== 'All') && (
              <button
                onClick={() => {
                  setFilterType('All');
                  setFilterListing('All');
                  setSearchQuery('');
                  setDateFilter('All');
                }}
                className="px-4 py-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                Clear Filters
              </button>
            )}
          </div>
        </div>

        {filteredImages.length === 0 ? (
          <div className="text-center py-12">
            <ImageIcon className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
            <h3 className="text-lg font-medium text-foreground mb-2">
              {images.length === 0 ? "Your collection is empty" : "No properties match your filters"}
            </h3>
            <p className="text-muted-foreground">
              {images.length === 0 
                ? "Upload your first image to get started!"
                : "Try adjusting your filters to see more properties."
              }
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
                showActions={true}
              />
            ))}
          </div>
        )}
      </div>
    </AppLayout>
  );
};