'use client';

import { useState } from 'react';
import { Bookmark, BookmarkFormData } from '@/lib/types';
import { formatDate } from '@/lib/utils';
import BookmarkForm from './BookmarkForm';
import { ExternalLink, Edit, Trash2, Tag, Calendar, Clock } from 'lucide-react';

interface BookmarkListProps {
  bookmarks: Bookmark[];
  onEdit: (id: string, data: BookmarkFormData) => void;
  onDelete: (id: string) => void;
}

export default function BookmarkList({ bookmarks, onEdit, onDelete }: BookmarkListProps) {
  const [editingBookmark, setEditingBookmark] = useState<Bookmark | null>(null);

  const handleEdit = (bookmark: Bookmark) => {
    setEditingBookmark(bookmark);
  };

  const handleEditSubmit = (formData: BookmarkFormData) => {
    if (editingBookmark) {
      onEdit(editingBookmark.id, formData);
      setEditingBookmark(null);
    }
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this bookmark?')) {
      onDelete(id);
    }
  };

  if (bookmarks.length === 0) {
    return (
      <div className="text-center py-16">
        <div className="max-w-md mx-auto">
          <div className="p-6 bg-card/50 backdrop-blur-sm border border-border/50 rounded-2xl mb-6">
            <ExternalLink className="h-16 w-16 mx-auto mb-4 text-muted-foreground/50" />
            <h3 className="text-xl font-semibold text-foreground mb-2">No bookmarks found</h3>
            <p className="text-muted-foreground">Start by adding your first bookmark to get organized!</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {bookmarks.map((bookmark) => (
        <div
          key={bookmark.id}
          className="group relative bg-gradient-to-br from-card/80 to-card/40 backdrop-blur-md border border-border/50 rounded-2xl p-6 hover:shadow-2xl hover:border-primary/30 transition-all duration-500 hover:-translate-y-2 card-hover overflow-hidden"
        >
          {/* Gradient overlay on hover */}
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          
          {/* Glow effect */}
          <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-primary/10 to-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-xl" />
          
          <div className="relative flex items-start gap-6">
            {/* Enhanced Favicon */}
            <div className="flex-shrink-0">
              <div className="relative w-16 h-16 rounded-2xl bg-gradient-to-br from-primary/20 to-purple-500/20 border-2 border-primary/30 flex items-center justify-center overflow-hidden shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-110">
                <img
                  src={bookmark.favicon}
                  alt=""
                  className="w-10 h-10 rounded-lg object-contain"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.style.display = 'none';
                    target.nextElementSibling?.classList.remove('hidden');
                  }}
                />
                <svg className="w-10 h-10 text-primary hidden" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9v-9m0-9v9" />
                </svg>
                
                {/* Shine effect */}
                <div className="absolute inset-0 bg-gradient-to-br from-transparent via-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              </div>
            </div>

            {/* Enhanced Content */}
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <h3 className="text-xl font-bold text-foreground mb-3 group-hover:text-primary transition-all duration-300">
                    <a
                      href={bookmark.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:underline decoration-2 underline-offset-4"
                    >
                      {bookmark.title}
                    </a>
                  </h3>
                  
                  <div className="mb-4">
                    <a
                      href={bookmark.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-primary/80 font-mono bg-primary/5 px-3 py-2 rounded-lg border border-primary/10 inline-block hover:bg-primary/10 hover:border-primary/20 transition-all duration-300"
                    >
                      {bookmark.url}
                    </a>
                  </div>
                  
                  {bookmark.description && (
                    <p className="text-muted-foreground text-sm mb-4 line-clamp-3 leading-relaxed">
                      {bookmark.description}
                    </p>
                  )}
                  
                  {/* Enhanced Tags */}
                  {bookmark.tags.length > 0 && (
                    <div className="flex items-center gap-3 mb-4">
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Tag className="h-4 w-4" />
                        <span className="text-xs font-medium">Tags:</span>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {bookmark.tags.map((tag) => (
                          <span
                            key={tag}
                            className="px-4 py-2 bg-gradient-to-r from-primary/15 to-purple-500/15 text-primary text-sm font-semibold rounded-full border border-primary/25 hover:from-primary/25 hover:to-purple-500/25 transition-all duration-300 shadow-sm hover:shadow-md"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {/* Enhanced Dates */}
                  <div className="flex items-center gap-3 text-xs text-muted-foreground">
                    <div className="flex items-center gap-2 bg-muted/50 px-3 py-2 rounded-lg">
                      <div className="p-1 bg-green-500/10 rounded">
                        <Calendar className="h-3 w-3 text-green-500" />
                      </div>
                      <span className="font-medium">Created: {formatDate(bookmark.createdAt)}</span>
                    </div>
                    {bookmark.updatedAt.getTime() !== bookmark.createdAt.getTime() && (
                      <div className="flex items-center gap-2 bg-muted/50 px-3 py-2 rounded-lg">
                        <div className="p-1 bg-blue-500/10 rounded">
                          <Clock className="h-3 w-3 text-blue-500" />
                        </div>
                        <span className="font-medium">Updated: {formatDate(bookmark.updatedAt)}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Enhanced Actions */}
                <div className="flex flex-col items-center gap-3 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-x-4 group-hover:translate-x-0">
                  <a
                    href={bookmark.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-3 text-muted-foreground hover:text-primary hover:bg-primary/10 rounded-xl transition-all duration-300 hover:scale-110 shadow-lg hover:shadow-xl"
                    title="Open link"
                  >
                    <ExternalLink className="h-5 w-5" />
                  </a>
                  <button
                    onClick={() => handleEdit(bookmark)}
                    className="p-3 text-muted-foreground hover:text-foreground hover:bg-secondary rounded-xl transition-all duration-300 hover:scale-110 shadow-lg hover:shadow-xl"
                    title="Edit bookmark"
                  >
                    <Edit className="h-5 w-5" />
                  </button>
                  <button
                    onClick={() => handleDelete(bookmark.id)}
                    className="p-3 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-xl transition-all duration-300 hover:scale-110 shadow-lg hover:shadow-xl"
                    title="Delete bookmark"
                  >
                    <Trash2 className="h-5 w-5" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}

      {/* Edit Modal */}
      {editingBookmark && (
        <BookmarkForm
          onSubmit={handleEditSubmit}
          onCancel={() => setEditingBookmark(null)}
          existingTags={Array.from(new Set(bookmarks.flatMap(b => b.tags)))}
          initialData={{
            title: editingBookmark.title,
            url: editingBookmark.url,
            description: editingBookmark.description,
            tags: editingBookmark.tags.join(', '),
          }}
        />
      )}
    </div>
  );
} 