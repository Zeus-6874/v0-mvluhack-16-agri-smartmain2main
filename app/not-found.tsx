export default function NotFound() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-background">
      <div className="text-center space-y-6">
        <div>
          <h1 className="text-6xl font-bold text-foreground">404</h1>
          <p className="text-2xl font-semibold text-muted-foreground mt-2">Page Not Found</p>
        </div>
        <p className="text-muted-foreground max-w-md">The page you are looking for does not exist or has been moved.</p>
        <a
          href="/"
          className="inline-block px-6 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
        >
          Return to Home
        </a>
      </div>
    </div>
  )
}
