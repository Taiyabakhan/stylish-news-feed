import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, ExternalLink } from "lucide-react";

interface NewsCardProps {
  title: string;
  description: string;
  url: string;
  image: string;
  source: string;
  publishedAt: string;
}

const NewsCard = ({ title, description, url, image, source, publishedAt }: NewsCardProps) => {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric' 
    });
  };

  return (
    <a href={url} target="_blank" rel="noopener noreferrer" className="block h-full">
      <Card className="news-card h-full overflow-hidden border-border hover:border-accent/50 cursor-pointer">
        <div className="aspect-video overflow-hidden bg-muted">
          <img 
            src={image || "/placeholder.svg"} 
            alt={title}
            className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.src = "/placeholder.svg";
            }}
          />
        </div>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between mb-2 gap-2">
            <Badge variant="secondary" className="text-xs">
              {source}
            </Badge>
            <div className="flex items-center text-xs text-muted-foreground">
              <Calendar className="w-3 h-3 mr-1" />
              {formatDate(publishedAt)}
            </div>
          </div>
          <CardTitle className="text-xl leading-tight line-clamp-2 hover:text-accent transition-colors">
            {title}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <CardDescription className="line-clamp-3 text-sm leading-relaxed">
            {description}
          </CardDescription>
          <div className="flex items-center text-accent text-sm font-medium mt-4">
            Read more <ExternalLink className="w-4 h-4 ml-1" />
          </div>
        </CardContent>
      </Card>
    </a>
  );
};

export default NewsCard;
