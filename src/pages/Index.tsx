import { useState, useEffect } from "react";
import { Newspaper } from "lucide-react";
import NewsCard from "@/components/NewsCard";
import SearchBar from "@/components/SearchBar";
import CategoryFilter from "@/components/CategoryFilter";
import LoadingState from "@/components/LoadingState";
import ErrorState from "@/components/ErrorState";
import ThemeToggle from "@/components/ThemeToggle";
import { toast } from "sonner";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

interface Article {
  title: string;
  description: string;
  url: string;
  image: string;
  publishedAt: string;
  source: {
    name: string;
  };
}

const Index = () => {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("general");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchNews = async (query?: string, category?: string, page: number = 1) => {
  setLoading(true);
  setError(false);

  try {
    // Base URLs
    const API_KEY = import.meta.env.VITE_GNEWS_API_KEY;
    const GNEWS_BASE = "https://gnews.io/api/v4";
    const PROXY_BASE = "https://api.allorigins.win/raw?url="; // Safe public proxy

    // Build actual API URL
    let realUrl = query
      ? `${GNEWS_BASE}/search?q=${encodeURIComponent(query)}&lang=en&country=us&max=10&page=${page}&apikey=${API_KEY}`
      : `${GNEWS_BASE}/top-headlines?category=${category || selectedCategory}&lang=en&country=us&max=10&page=${page}&apikey=${API_KEY}`;

    // Add proxy only when running on production (Vercel)
    const finalUrl = window.location.hostname.includes("vercel.app")
      ? `${PROXY_BASE}${encodeURIComponent(realUrl)}`
      : realUrl;

    const response = await fetch(finalUrl);

    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

    const data = await response.json();

    setArticles(data.articles || []);
    setTotalPages(Math.ceil((data.totalArticles || 100) / 10));

    if (data.articles && data.articles.length === 0) {
      toast.info("No articles found for your search");
    }
  } catch (err) {
    console.error("Error fetching news:", err);
    setError(true);
    toast.error("Failed to fetch news articles");
  } finally {
    setLoading(false);
  }
};

  useEffect(() => {
    fetchNews();
  }, [selectedCategory]);

  const handleSearch = () => {
    setCurrentPage(1);
    if (searchQuery.trim()) {
      fetchNews(searchQuery, undefined, 1);
    } else {
      fetchNews(undefined, undefined, 1);
    }
  };

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
    setSearchQuery("");
    setCurrentPage(1);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    if (searchQuery.trim()) {
      fetchNews(searchQuery, undefined, page);
    } else {
      fetchNews(undefined, selectedCategory, page);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleRetry = () => {
    fetchNews();
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="gradient-primary text-primary-foreground py-12 mb-8">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex-1" />
            <div className="flex items-center gap-3">
              <Newspaper className="w-10 h-10" />
              <h1 className="text-4xl md:text-5xl font-bold">NewsHub</h1>
            </div>
            <div className="flex-1 flex justify-end">
              <ThemeToggle />
            </div>
          </div>
          <p className="text-center text-lg opacity-90">
            Stay updated with the latest news from around the world
          </p>
        </div>
      </header>

      <div className="container mx-auto px-4 pb-12">
        {/* Search Bar */}
        <div className="mb-8">
          <SearchBar 
            value={searchQuery}
            onChange={setSearchQuery}
            onSearch={handleSearch}
          />
        </div>

        {/* Category Filter */}
        <div className="mb-12">
          <CategoryFilter 
            selectedCategory={selectedCategory}
            onSelectCategory={handleCategoryChange}
          />
        </div>

        {/* Content */}
        {loading ? (
          <LoadingState />
        ) : error ? (
          <ErrorState onRetry={handleRetry} />
        ) : (
          <>
            {articles.length > 0 ? (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-in fade-in duration-500">
                  {articles.map((article, index) => (
                    <NewsCard
                      key={`${article.url}-${index}`}
                      title={article.title}
                      description={article.description}
                      url={article.url}
                      image={article.image}
                      source={article.source.name}
                      publishedAt={article.publishedAt}
                    />
                  ))}
                </div>
                
                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="mt-12 flex justify-center">
                    <Pagination>
                      <PaginationContent>
                        <PaginationItem>
                          <PaginationPrevious 
                            onClick={() => currentPage > 1 && handlePageChange(currentPage - 1)}
                            className={currentPage === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
                          />
                        </PaginationItem>
                        
                        {[...Array(Math.min(totalPages, 5))].map((_, i) => {
                          const pageNum = currentPage <= 3 ? i + 1 : currentPage >= totalPages - 2 ? totalPages - 4 + i : currentPage - 2 + i;
                          if (pageNum > 0 && pageNum <= totalPages) {
                            return (
                              <PaginationItem key={pageNum}>
                                <PaginationLink 
                                  onClick={() => handlePageChange(pageNum)}
                                  isActive={currentPage === pageNum}
                                  className="cursor-pointer"
                                >
                                  {pageNum}
                                </PaginationLink>
                              </PaginationItem>
                            );
                          }
                          return null;
                        })}
                        
                        <PaginationItem>
                          <PaginationNext 
                            onClick={() => currentPage < totalPages && handlePageChange(currentPage + 1)}
                            className={currentPage === totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"}
                          />
                        </PaginationItem>
                      </PaginationContent>
                    </Pagination>
                  </div>
                )}
              </>
            ) : (
              <div className="text-center py-12">
                <p className="text-muted-foreground text-lg">
                  No articles found. Try a different search or category.
                </p>
              </div>
            )}
          </>
        )}
      </div>

      {/* Footer */}
      <footer className="border-t border-border py-8 mt-12">
        <div className="container mx-auto px-4 text-center text-muted-foreground">
          <p>Powered by GNews API • Built with React & Tailwind CSS</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
