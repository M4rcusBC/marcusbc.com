'use client';

export default function DefaultSignIn() {
  return (
    <div className="container flex items-center justify-center min-h-[60vh] py-12">
      <div className="max-w-md w-full space-y-8 text-center">
        <div>
          <h2 className="mt-6 text-3xl font-bold tracking-tight">
            Authentication
          </h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Authentication is currently not configured for this portfolio site.
          </p>
          <p className="mt-4 text-sm text-muted-foreground">
            This is a portfolio and project showcase site. If you're interested in collaboration
            or have questions, please use the contact form instead.
          </p>
        </div>
        <div className="mt-8">
          <a
            href="/contact"
            className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2"
          >
            Contact Me Instead
          </a>
        </div>
      </div>
    </div>
  );
}