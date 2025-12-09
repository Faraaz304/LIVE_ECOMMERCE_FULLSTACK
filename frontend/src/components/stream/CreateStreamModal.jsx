'use client';

import React, { useState } from 'react';
import { X, Loader2, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';

const CreateStreamModal = ({ isOpen, onClose, onConfirm, isLoading }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [isLocating, setIsLocating] = useState(false); // State for location fetching
  
  if (!isOpen) return null;

  const handleCreateClick = () => {
    // 1. Check if browser supports Geolocation
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by your browser");
      return;
    }

    setIsLocating(true);

    // 2. Get Current Position (The Uber/Swiggy part)
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;
        
        setIsLocating(false);

        // 3. Send Title, Description AND Location to Parent
        onConfirm({ 
          title, 
          description, 
          location: { lat, lng } 
        });
      },
      (error) => {
        setIsLocating(false);
        console.error("Location Error:", error);
        alert("We need your location to show this stream to nearby users. Please allow location access.");
      },
      { enableHighAccuracy: true } // Request precise GPS
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="w-full max-w-md bg-card border border-border rounded-xl shadow-2xl p-6 space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="text-xl font-semibold text-foreground">Create New Stream</h3>
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground">
            <X size={20}/>
          </button>
        </div>
        
        <div className="space-y-3">
          <div className="space-y-1">
            <label className="text-sm font-medium">Stream Title</label>
            <input 
              type="text" 
              placeholder="e.g., Summer Sale Launch"
              className="w-full px-3 py-2 bg-background border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>

          <div className="space-y-1">
            <label className="text-sm font-medium">Description</label>
            <textarea 
              placeholder="Describe your event..."
              className="w-full px-3 py-2 bg-background border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-primary min-h-[80px] resize-none"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          <div className="flex items-center gap-2 text-xs text-muted-foreground bg-muted p-2 rounded">
            <MapPin size={14} className="text-primary"/>
            Location will be captured automatically when you create.
          </div>
        </div>

        <div className="flex justify-end gap-3 pt-2">
          <Button variant="outline" onClick={onClose} disabled={isLoading || isLocating}>Cancel</Button>
          <Button 
            onClick={handleCreateClick} // <--- Call our wrapper function
            disabled={!title || isLoading || isLocating} 
            className="bg-primary text-primary-foreground"
          >
            {isLocating ? (
              <><Loader2 className="mr-2 h-4 w-4 animate-spin"/> Locating...</>
            ) : isLoading ? (
              <><Loader2 className="mr-2 h-4 w-4 animate-spin"/> Creating...</>
            ) : (
              'Create Stream'
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CreateStreamModal;