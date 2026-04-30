export function MapPlaceholder() {
  return (
    <section className="py-24 bg-muted/30">
      <div className="container px-4 md:px-6">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-display font-bold mb-4">Our Locations</h2>
          <p className="text-muted-foreground">Find a donation center near you.</p>
        </div>
        
        {/* Placeholder for a real map (e.g., Google Maps embed or Mapbox) */}
        <div className="w-full h-[500px] bg-card border border-border rounded-2xl overflow-hidden shadow-sm relative group">
          <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1524661135-423995f22d0b?q=80&w=2000&auto=format&fit=crop')] bg-cover bg-center opacity-40 grayscale" />
          <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent" />
          
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mb-4 animate-bounce">
              <div className="w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center shadow-lg">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>
              </div>
            </div>
            <h3 className="text-2xl font-bold mb-2">Interactive Map</h3>
            <p className="text-muted-foreground max-w-sm text-center">Map integration goes here. Users can search for zip codes to find the nearest center or mobile drive.</p>
          </div>
        </div>
      </div>
    </section>
  );
}
