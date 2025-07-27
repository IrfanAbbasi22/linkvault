'use client';

import { useState, useEffect } from 'react';
import { Bookmark, BookmarkFormData, SortOption, SortOrder } from '@/lib/types';
import { generateId, getFaviconUrl, formatDate, sortBookmarks, filterBookmarksByTags, getAllTags } from '@/lib/utils';
import { storageManager, ExportImportManager } from '@/lib/storage';
import BookmarkForm from '@/components/BookmarkForm';
import BookmarkList from '@/components/BookmarkList';
import TagFilter from '@/components/TagFilter';
import SortControls from '@/components/SortControls';
import ThemeToggle from '@/components/ThemeToggle';
import { Plus, Bookmark as BookmarkIcon } from 'lucide-react';

export default function Home() {
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState<SortOption>('createdAt');
  const [sortOrder, setSortOrder] = useState<SortOrder>('desc');
  const [searchTerm, setSearchTerm] = useState('');
  const [storageProvider, setStorageProvider] = useState<string>('');

  // Load bookmarks from storage on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      storageManager.load()
        .then((loadedBookmarks) => {
          setBookmarks(loadedBookmarks);
          setStorageProvider(storageManager.getCurrentProviderName());
          console.log('Loaded bookmarks from storage:', loadedBookmarks.length);
        })
        .catch((error) => {
          console.error('Error loading bookmarks:', error);
        })
        .finally(() => {
          setIsLoaded(true);
        });
    }
  }, []);

  // Save bookmarks to storage whenever they change
  useEffect(() => {
    if (typeof window !== 'undefined' && isLoaded && bookmarks.length > 0) {
      storageManager.save(bookmarks)
        .then(() => {
          console.log('Saved bookmarks to storage:', bookmarks.length);
        })
        .catch((error) => {
          console.error('Error saving bookmarks:', error);
        });
    }
  }, [bookmarks, isLoaded]);

  const addBookmark = (formData: BookmarkFormData) => {
    const newBookmark: Bookmark = {
      id: generateId(),
      title: formData.title,
      url: formData.url,
      description: formData.description,
      tags: formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag.length > 0),
      favicon: getFaviconUrl(formData.url),
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    setBookmarks(prev => [newBookmark, ...prev]);
    setIsFormOpen(false);
  };

  const updateBookmark = (id: string, formData: BookmarkFormData) => {
    setBookmarks(prev => prev.map(bookmark => 
      bookmark.id === id 
        ? {
            ...bookmark,
            title: formData.title,
            url: formData.url,
            description: formData.description,
            tags: formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag.length > 0),
            favicon: getFaviconUrl(formData.url),
            updatedAt: new Date(),
          }
        : bookmark
    ));
  };

  const deleteBookmark = (id: string) => {
    setBookmarks(prev => prev.filter(bookmark => bookmark.id !== id));
  };

  const addSampleData = () => {
    const sampleBookmarks: Bookmark[] = [
      {
        id: generateId(),
        title: 'Next.js Documentation',
        url: 'https://nextjs.org/docs',
        description: 'Official Next.js documentation with tutorials and API reference',
        tags: ['react', 'nextjs', 'documentation', 'frontend'],
        favicon: getFaviconUrl('https://nextjs.org/docs'),
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: generateId(),
        title: 'Tailwind CSS',
        url: 'https://tailwindcss.com',
        description: 'A utility-first CSS framework for rapidly building custom user interfaces',
        tags: ['css', 'styling', 'frontend', 'utility'],
        favicon: getFaviconUrl('https://tailwindcss.com'),
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: generateId(),
        title: 'GitHub',
        url: 'https://github.com',
        description: 'Where the world builds software. Millions of developers and companies build, ship, and maintain their software on GitHub',
        tags: ['git', 'development', 'code', 'collaboration'],
        favicon: getFaviconUrl('https://github.com'),
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ];
    setBookmarks(prev => [...sampleBookmarks, ...prev]);
  };

  const clearAllData = () => {
    if (confirm('Are you sure you want to clear all bookmarks? This action cannot be undone.')) {
      setBookmarks([]);
      storageManager.clear();
    }
  };

  const exportBookmarks = () => {
    ExportImportManager.downloadBackup(bookmarks);
  };

  const importBookmarks = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const content = e.target?.result as string;
        const importedBookmarks = ExportImportManager.importFromJSON(content);
        setBookmarks(prev => [...prev, ...importedBookmarks]);
        alert(`Successfully imported ${importedBookmarks.length} bookmarks!`);
      } catch (error) {
        alert('Failed to import bookmarks. Please check the file format.');
      }
    };
    reader.readAsText(file);
  };



  const filteredAndSortedBookmarks = sortBookmarks(
    filterBookmarksByTags(
      bookmarks.filter(bookmark =>
        bookmark.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        bookmark.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        bookmark.url.toLowerCase().includes(searchTerm.toLowerCase())
      ),
      selectedTags
    ),
    sortBy,
    sortOrder
  );

  const allTags = getAllTags(bookmarks);

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Header */}
        <div className="mb-12 text-center">
          <div className="flex items-center justify-center gap-4 mb-6">
            <div className="p-3 bg-primary/10 rounded-xl">
              <BookmarkIcon className="h-10 w-10 text-primary" />
            </div>
            <div>
              <h1 className="text-4xl font-bold gradient-text">
                LinkVault
              </h1>
              <p className="text-muted-foreground text-lg mt-2">
                Secure vault for your bookmarks with advanced organization
              </p>
            </div>
            <ThemeToggle />
          </div>
        </div>

        {/* Enhanced Stats Cards */}
        <div className="mb-8 grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div className="group relative bg-gradient-to-br from-card/80 to-card/40 backdrop-blur-md border border-border/50 rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-1 overflow-hidden">
            {/* Gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            
            <div className="relative flex items-center gap-4">
              <div className="p-3 bg-gradient-to-br from-primary/20 to-purple-500/20 rounded-xl border border-primary/30 shadow-lg group-hover:scale-110 transition-all duration-300">
                <BookmarkIcon className="h-6 w-6 text-primary" />
              </div>
              <div>
                <div className="text-3xl font-bold text-foreground group-hover:text-primary transition-colors duration-300">{bookmarks.length}</div>
                <div className="text-sm text-muted-foreground font-medium">Total Bookmarks</div>
              </div>
            </div>
          </div>
          
          <div className="group relative bg-gradient-to-br from-card/80 to-card/40 backdrop-blur-md border border-border/50 rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-1 overflow-hidden">
            {/* Gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-pink-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            
            <div className="relative flex items-center gap-4">
              <div className="p-3 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-xl border border-purple-500/30 shadow-lg group-hover:scale-110 transition-all duration-300">
                <svg className="h-6 w-6 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                </svg>
              </div>
              <div>
                <div className="text-3xl font-bold text-foreground group-hover:text-purple-500 transition-colors duration-300">{allTags.length}</div>
                <div className="text-sm text-muted-foreground font-medium">Unique Tags</div>
              </div>
            </div>
          </div>
          
          <div className="group relative bg-gradient-to-br from-card/80 to-card/40 backdrop-blur-md border border-border/50 rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-1 overflow-hidden">
            {/* Gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-br from-green-500/5 to-emerald-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            
            <div className="relative flex items-center gap-4">
              <div className="p-3 bg-gradient-to-br from-green-500/20 to-emerald-500/20 rounded-xl border border-green-500/30 shadow-lg group-hover:scale-110 transition-all duration-300">
                <svg className="h-6 w-6 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <div>
                <div className="text-3xl font-bold text-foreground group-hover:text-green-500 transition-colors duration-300">{filteredAndSortedBookmarks.length}</div>
                <div className="text-sm text-muted-foreground font-medium">Filtered Results</div>
              </div>
            </div>
          </div>
        </div>

        {/* Controls */}
        <div className="mb-8 space-y-6">
          <div className="flex flex-col lg:flex-row gap-6 items-start lg:items-center justify-between">
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={() => setIsFormOpen(true)}
                className="inline-flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-primary to-purple-600 text-primary-foreground rounded-xl hover:from-primary/90 hover:to-purple-600/90 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
              >
                <Plus className="h-5 w-5" />
                Add Bookmark
              </button>
              
              {bookmarks.length === 0 && (
                <button
                  onClick={addSampleData}
                  className="inline-flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl hover:from-green-500/90 hover:to-emerald-600/90 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                >
                  <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                  Add Sample Data
                </button>
              )}
              
              <div className="flex flex-wrap items-center gap-3">
                {/* Import button - always visible */}
                <label className="inline-flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl hover:from-green-500/90 hover:to-emerald-600/90 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 cursor-pointer">
                  <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                  </svg>
                  Import Bookmarks
                  <input
                    type="file"
                    accept=".json"
                    onChange={importBookmarks}
                    className="hidden"
                  />
                </label>

                {/* Export and Clear buttons - only when bookmarks exist */}
                {bookmarks.length > 0 && (
                  <>
                    <button
                      onClick={exportBookmarks}
                      className="inline-flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-xl hover:from-blue-500/90 hover:to-indigo-600/90 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                    >
                      <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                      Export Bookmarks
                    </button>
                    
                    <button
                      onClick={clearAllData}
                      className="inline-flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-red-500 to-pink-600 text-white rounded-xl hover:from-red-500/90 hover:to-pink-600/90 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                    >
                      <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                      Clear All
                    </button>
                  </>
                )}
              </div>
              

            </div>
            
            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center w-full lg:w-auto">
              <div className="relative w-full sm:w-80">
                <svg className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <input
                  type="text"
                  placeholder="Search bookmarks..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-input rounded-xl bg-background/50 backdrop-blur-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent transition-all duration-300"
                />
              </div>
              <SortControls
                sortBy={sortBy}
                sortOrder={sortOrder}
                onSortByChange={setSortBy}
                onSortOrderChange={setSortOrder}
              />
            </div>
          </div>

          <TagFilter
            allTags={allTags}
            selectedTags={selectedTags}
            onTagToggle={(tag) => {
              setSelectedTags(prev =>
                prev.includes(tag)
                  ? prev.filter(t => t !== tag)
                  : [...prev, tag]
              );
            }}
            onClearTags={() => setSelectedTags([])}
          />
        </div>



        {/* Enhanced Storage Status */}
        {isLoaded && (
          <div className="mb-6 p-6 bg-gradient-to-br from-blue-50/30 to-purple-50/30 dark:from-blue-900/20 dark:to-purple-900/20 border border-blue-200/30 dark:border-blue-700/30 rounded-2xl backdrop-blur-sm">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-xl border border-blue-500/30 shadow-lg">
                <svg className="h-5 w-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h14M5 12a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v4a2 2 0 01-2 2M5 12a2 2 0 00-2 2v4a2 2 0 002 2h14a2 2 0 002-2v-4a2 2 0 00-2-2m-2-4h.01M17 16h.01" />
                </svg>
              </div>
              <div className="flex-1">
                <div className="text-sm font-bold text-blue-900 dark:text-blue-100">
                  Secure Storage: {storageProvider || 'Loading...'}
                </div>
                <div className="text-xs text-blue-700 dark:text-blue-300 mt-1">
                  Your bookmarks are automatically saved with multiple fallback options. Use Export/Import for additional backup safety.
                </div>
              </div>
              <div className="flex items-center gap-2 text-xs text-blue-600 dark:text-blue-400 bg-blue-100/50 dark:bg-blue-900/30 px-3 py-2 rounded-lg">
                <svg className="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Auto-save enabled
              </div>
            </div>
          </div>
        )}

        {/* Empty State */}
        {isLoaded && bookmarks.length === 0 && (
          <div className="text-center py-12">
            <div className="mx-auto w-24 h-24 bg-gradient-to-br from-purple-100 to-blue-100 rounded-full flex items-center justify-center mb-6">
              <BookmarkIcon className="h-12 w-12 text-purple-500" />
            </div>
            <h3 className="text-xl font-semibold text-foreground mb-2">No bookmarks yet</h3>
            <p className="text-muted-foreground mb-6 max-w-md mx-auto">
              Start by adding your first bookmark or import existing ones from a backup file.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <button
                onClick={() => setIsFormOpen(true)}
                className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-primary to-purple-600 text-white rounded-xl hover:from-primary/90 hover:to-purple-600/90 transition-all duration-300"
              >
                <Plus className="h-4 w-4" />
                Add First Bookmark
              </button>
              <label className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl hover:from-green-500/90 hover:to-emerald-600/90 transition-all duration-300 cursor-pointer">
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                </svg>
                Import Bookmarks
                <input
                  type="file"
                  accept=".json"
                  onChange={importBookmarks}
                  className="hidden"
                />
              </label>
            </div>
          </div>
        )}

        {/* Bookmark List */}
        {bookmarks.length > 0 && (
          <>
            {filteredAndSortedBookmarks.length === 0 ? (
              <div className="text-center py-12">
                <div className="mx-auto w-20 h-20 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center mb-4">
                  <svg className="h-10 w-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2">No matching bookmarks</h3>
                <p className="text-muted-foreground mb-4">
                  Try adjusting your search terms or tag filters.
                </p>
                <button
                  onClick={() => {
                    setSearchTerm('');
                    setSelectedTags([]);
                  }}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-gray-500 to-gray-600 text-white rounded-lg hover:from-gray-500/90 hover:to-gray-600/90 transition-all duration-300"
                >
                  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                  Clear Filters
                </button>
              </div>
            ) : (
              <BookmarkList
                bookmarks={filteredAndSortedBookmarks}
                onEdit={updateBookmark}
                onDelete={deleteBookmark}
              />
            )}
          </>
        )}

        {/* Add Bookmark Form Modal */}
        {isFormOpen && (
          <BookmarkForm
            onSubmit={addBookmark}
            onCancel={() => setIsFormOpen(false)}
            existingTags={allTags}
          />
        )}


      </div>
    </div>
  );
} 