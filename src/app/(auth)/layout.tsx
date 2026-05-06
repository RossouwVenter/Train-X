export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-background via-background to-secondary/20 px-4">
      {/* Logo */}
      <div className="mb-8 flex items-center gap-2">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-orange-500 to-amber-600">
          <span className="text-base font-bold text-white">TX</span>
        </div>
        <span className="bg-gradient-to-r from-orange-400 to-amber-400 bg-clip-text text-2xl font-bold tracking-tight text-transparent">
          TrainX
        </span>
      </div>

      {/* Card container */}
      <div className="w-full max-w-sm">{children}</div>
    </div>
  );
}
