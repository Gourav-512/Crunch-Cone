export default function Footer() {
  return (
    <footer className="border-t bg-background">
      <div className="container mx-auto px-4 py-6 text-center text-sm text-muted-foreground">
        <p>&copy; {new Date().getFullYear()} Scoop Shop. All rights reserved.</p>
        <p>Sweet treats, delivered with a smile!</p>
      </div>
    </footer>
  );
}
