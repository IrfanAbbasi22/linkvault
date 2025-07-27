'use client';

import { useState, useEffect } from 'react';
import { BookmarkFormData } from '@/lib/types';
import { X, ExternalLink, Tag, FileText, Globe } from 'lucide-react';

interface BookmarkFormProps {
  onSubmit: (data: BookmarkFormData) => void;
  onCancel: () => void;
  existingTags: string[];
  initialData?: BookmarkFormData;
}

export default function BookmarkForm({ 
  onSubmit, 
  onCancel, 
  existingTags, 
  initialData 
}: BookmarkFormProps) {
  const [formData, setFormData] = useState<BookmarkFormData>({
    title: '',
    url: '',
    description: '',
    tags: '',
  });

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    }
  }, [initialData]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.title.trim() && formData.url.trim()) {
      onSubmit(formData);
    }
  };

  const addTag = (tag: string) => {
    const currentTags = formData.tags.split(',').map(t => t.trim()).filter(t => t);
    if (!currentTags.includes(tag)) {
      setFormData(prev => ({
        ...prev,
        tags: [...currentTags, tag].join(', ')
      }));
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-gradient-to-br from-background/95 to-background/90 backdrop-blur-md rounded-3xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto border border-border/50 relative overflow-hidden">
        {/* Gradient background */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-purple-500/5" />
        
        <div className="relative">
          <div className="flex items-center justify-between p-6 border-b border-border/50">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary/10 rounded-xl">
                <svg className="h-6 w-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                </svg>
              </div>
              <h2 className="text-xl font-bold text-foreground">
                {initialData ? 'Edit Bookmark' : 'Add New Bookmark'}
              </h2>
            </div>
            <button
              onClick={onCancel}
              className="p-2 text-muted-foreground hover:text-foreground hover:bg-muted rounded-xl transition-all duration-300 hover:scale-110"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Title */}
          <div>
            <label className="block text-sm font-semibold text-foreground mb-3">
              Title *
            </label>
            <div className="relative">
              <FileText className="absolute left-4 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                className="w-full pl-12 pr-4 py-3 border border-input rounded-xl bg-background/50 backdrop-blur-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent transition-all duration-300"
                placeholder="Enter bookmark title"
                required
              />
            </div>
          </div>

          {/* URL */}
          <div>
            <label className="block text-sm font-semibold text-foreground mb-3">
              URL *
            </label>
            <div className="relative">
              <Globe className="absolute left-4 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input
                type="url"
                value={formData.url}
                onChange={(e) => setFormData(prev => ({ ...prev, url: e.target.value }))}
                className="w-full pl-12 pr-4 py-3 border border-input rounded-xl bg-background/50 backdrop-blur-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent transition-all duration-300"
                placeholder="https://example.com"
                required
              />
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-semibold text-foreground mb-3">
              Description
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              className="w-full px-4 py-3 border border-input rounded-xl bg-background/50 backdrop-blur-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent resize-none transition-all duration-300"
              placeholder="Add a description or notes..."
              rows={3}
            />
          </div>

          {/* Tags */}
          <div>
            <label className="block text-sm font-semibold text-foreground mb-3">
              Tags
            </label>
            <div className="relative">
              <Tag className="absolute left-4 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input
                type="text"
                value={formData.tags}
                onChange={(e) => setFormData(prev => ({ ...prev, tags: e.target.value }))}
                className="w-full pl-12 pr-4 py-3 border border-input rounded-xl bg-background/50 backdrop-blur-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent transition-all duration-300"
                placeholder="Enter tags separated by commas"
              />
            </div>
            
            {/* Existing Tags */}
            {existingTags.length > 0 && (
              <div className="mt-4">
                <p className="text-xs font-medium text-muted-foreground mb-3">Click to add existing tags:</p>
                <div className="flex flex-wrap gap-2">
                  {existingTags.map((tag) => (
                    <button
                      key={tag}
                      type="button"
                      onClick={() => addTag(tag)}
                      className="px-3 py-1 text-xs font-medium bg-gradient-to-r from-primary/10 to-purple-500/10 text-primary border border-primary/20 rounded-full hover:bg-primary/20 transition-all duration-200"
                    >
                      {tag}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="flex gap-4 pt-6">
            <button
              type="button"
              onClick={onCancel}
              className="flex-1 px-6 py-3 border border-input rounded-xl text-foreground hover:bg-secondary transition-all duration-300 font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-6 py-3 bg-gradient-to-r from-primary to-purple-600 text-primary-foreground rounded-xl hover:from-primary/90 hover:to-purple-600/90 transition-all duration-300 font-medium shadow-lg hover:shadow-xl"
            >
              {initialData ? 'Update' : 'Add'} Bookmark
            </button>
          </div>
        </form>
        </div>
      </div>
    </div>
  );
} 