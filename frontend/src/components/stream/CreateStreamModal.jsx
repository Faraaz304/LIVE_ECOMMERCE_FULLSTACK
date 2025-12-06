'use client';

import React, { useState } from 'react';
import { X, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

const CreateStreamModal = ({ isOpen, onClose, onConfirm, isLoading }) => {
  const [title, setTitle] = useState('');
  
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="w-full max-w-md bg-card border border-border rounded-xl shadow-2xl p-6 space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="text-xl font-semibold text-foreground">Create New Stream</h3>
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground">
            <X size={20}/>
          </button>
        </div>
        
        <div className="space-y-2">
          <label className="text-sm font-medium">Stream Title</label>
          <input 
            type="text" 
            placeholder="e.g., Summer Sale Launch"
            className="w-full px-3 py-2 bg-background border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <p className="text-xs text-muted-foreground">This will create a scheduled event on your YouTube channel.</p>
        </div>

        <div className="flex justify-end gap-3 pt-2">
          <Button variant="outline" onClick={onClose} disabled={isLoading}>Cancel</Button>
          <Button 
            onClick={() => onConfirm(title)} 
            disabled={!title || isLoading} 
            className="bg-primary text-primary-foreground"
          >
            {isLoading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin"/> Creating...</> : 'Create Stream'}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CreateStreamModal;