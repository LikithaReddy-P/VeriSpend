import { Navbar } from "@/components/layout/navbar";

export default function AuditLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Navbar />
      <main className="flex-1 bg-background">{children}</main>
    </>
  );
}
