// ******** Component Declaration ********
export default function UserLayout({ children }: { children: React.ReactNode }) {
  return (
    <main>
      <div>{children}</div>
    </main>
  );
}
