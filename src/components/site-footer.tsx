export function SiteFooter() {
  return (
    <footer className="py-6 md:px-8 md:py-0 border-t border-border/40">
      <div className="container flex flex-col items-center justify-center gap-4 md:h-24 md:flex-row">
        <p className="text-balance text-center text-sm leading-loose text-muted-foreground md:text-left">
          Creado con ❤️ por Firebase Studio. &copy; {new Date().getFullYear()} SEO Insights Pro.
        </p>
      </div>
    </footer>
  );
}
