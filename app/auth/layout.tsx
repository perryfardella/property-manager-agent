export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex w-full items-center justify-center p-12 md:p-16">
      <div className="w-full max-w-sm">{children}</div>
    </div>
  );
}
