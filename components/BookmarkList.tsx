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
          className="group bg-card/50 backdrop-blur-sm border border-border/50 rounded-xl p-6 hover:shadow-lg hover:border-border transition-all duration-300 hover:-translate-y-1"
        >
                      <div className="flex items-start gap-6">
              {/* Favicon */}
              <div className="flex-shrink-0">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary/10 to-purple-500/10 flex items-center justify-center border border-border/50">
                  <img
                    src={bookmark.favicon}
                    alt=""
                    className="w-8 h-8 rounded-lg"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.style.display = 'none';
                    }}
                  />
                </div>
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <h3 className="text-lg font-semibold text-foreground mb-2 group-hover:text-primary transition-colors">
                      {bookmark.title}
                    </h3>
                    <a
                      href={bookmark.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-primary hover:text-purple-600 hover:underline truncate block mb-3"
                    >
                      {bookmark.url}
                    </a>
                    {bookmark.description && (
                      <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed">
                        {bookmark.description}
                      </p>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-1 flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <a
                      href={bookmark.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-3 text-muted-foreground hover:text-primary hover:bg-primary/10 rounded-lg transition-all duration-200"
                      title="Open link"
                    >
                      <ExternalLink className="h-4 w-4" />
                    </a>
                    <button
                      onClick={() => handleEdit(bookmark)}
                      className="p-3 text-muted-foreground hover:text-foreground hover:bg-secondary rounded-lg transition-all duration-200"
                      title="Edit bookmark"
                    >
                      <Edit className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(bookmark.id)}
                      className="p-3 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-lg transition-all duration-200"
                      title="Delete bookmark"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>

              {/* Tags */}
              {bookmark.tags.length > 0 && (
                <div className="flex items-center gap-3 mt-4">
                  <Tag className="h-4 w-4 text-muted-foreground" />
                  <div className="flex flex-wrap gap-2">
                    {bookmark.tags.map((tag) => (
                      <span
                        key={tag}
                        className="px-3 py-1 text-xs font-medium bg-gradient-to-r from-primary/10 to-purple-500/10 text-primary border border-primary/20 rounded-full"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Dates */}
              <div className="flex items-center gap-6 mt-4 text-xs text-muted-foreground">
                <div className="flex items-center gap-2">
                  <div className="p-1 bg-green-500/10 rounded">
                    <Calendar className="h-3 w-3 text-green-500" />
                  </div>
                  <span>Created: {formatDate(bookmark.createdAt)}</span>
                </div>
                {bookmark.updatedAt.getTime() !== bookmark.createdAt.getTime() && (
                  <div className="flex items-center gap-2">
                    <div className="p-1 bg-blue-500/10 rounded">
                      <Clock className="h-3 w-3 text-blue-500" />
                    </div>
                    <span>Updated: {formatDate(bookmark.updatedAt)}</span>
                  </div>
                )}
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