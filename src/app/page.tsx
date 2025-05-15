import { SiteHeader } from '@/components/site-header';
import { SiteFooter } from '@/components/site-footer';
import SeoAnalyzer from '@/components/seo-analyzer';

export default function HomePage() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <SiteHeader />
      <main className="flex-1 container mx-auto py-8 px-4">
        <SeoAnalyzer />
      </main>
      <SiteFooter />
    </div>
  );
}
