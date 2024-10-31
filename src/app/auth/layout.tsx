import { Providers } from "../providers";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <Providers>
      <div className="min-h-screen">{children}</div>
    </Providers>
  );
}
