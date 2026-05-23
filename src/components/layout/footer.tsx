import Link from "next/link";
import { Container } from "@/components/layout/container";
import { site } from "@/lib/site";

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-border/60">
      <Container className="py-14">
        <div className="flex flex-col gap-10 lg:flex-row lg:items-start lg:justify-between">
          <div className="max-w-sm space-y-4">
            <Link href="/" className="inline-flex items-center gap-2.5 font-semibold">
              <span className="flex size-9 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-violet-500 text-sm font-bold text-primary-foreground">
                {site.logoInitial}
              </span>
              {site.name}
            </Link>
            <p className="text-sm leading-relaxed text-muted-foreground">
              {site.description}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-10 text-sm sm:grid-cols-3 sm:gap-16">
            <div className="space-y-3">
              <p className="font-medium text-foreground">Product</p>
              <ul className="space-y-2.5 text-muted-foreground">
                <li>
                  <Link href="#how-it-works" className="hover:text-foreground">
                    How it works
                  </Link>
                </li>
                <li>
                  <Link href="#features" className="hover:text-foreground">
                    Features
                  </Link>
                </li>
                <li>
                  <Link href="/audit" className="hover:text-foreground">
                    Free audit
                  </Link>
                </li>
              </ul>
            </div>
            <div className="space-y-3">
              <p className="font-medium text-foreground">Company</p>
              <ul className="space-y-2.5 text-muted-foreground">
                <li>
                  <span className="cursor-default">About</span>
                </li>
                <li>
                  <span className="cursor-default">Contact</span>
                </li>
              </ul>
            </div>
            <div className="space-y-3">
              <p className="font-medium text-foreground">Legal</p>
              <ul className="space-y-2.5 text-muted-foreground">
                <li>
                  <span className="cursor-default">Privacy</span>
                </li>
                <li>
                  <span className="cursor-default">Terms</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-border/60 pt-8 text-xs text-muted-foreground sm:flex-row">
          <p>© {year} {site.name}. All rights reserved.</p>
          <p>Built for finance and ops teams managing modern AI infrastructure.</p>
        </div>
      </Container>
    </footer>
  );
}
