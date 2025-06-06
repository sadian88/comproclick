export default function Footer() {
  return (
    <footer className="py-8 bg-transparent text-center">
      <div className="container mx-auto px-4">
        <p className="text-sm text-muted-foreground">
          &copy; {new Date().getFullYear()} Compro.click. Todos los derechos reservados.
        </p>
        <p className="text-xs text-muted-foreground mt-1">
          Innovación y tecnología para tu próximo proyecto digital.
        </p>
      </div>
    </footer>
  );
}
