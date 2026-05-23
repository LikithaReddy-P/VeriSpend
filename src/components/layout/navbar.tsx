"use client";

import Link from "next/link";
import { Menu } from "lucide-react";
import { useState } from "react";
import { ButtonLink } from "@/components/ui/button-link";
import { buttonVariants } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Container } from "@/components/layout/container";
import { navLinks, site } from "@/lib/site";

export function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-white/5 bg-background/70 backdrop-blur-xl">
      <Container>
        <nav className="flex h-16 items-center justify-between">
          <Link
            href="/"
            className="flex items-center gap-2.5 font-semibold tracking-tight"
          >
            <span className="flex size-8 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-violet-500 text-sm font-bold text-primary-foreground">
              {site.logoInitial}
            </span>
            <span>{site.name}</span>
          </Link>

          <div className="hidden items-center gap-8 md:flex">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm text-muted-foreground transition-colors hover:text-foreground"
              >
                {link.label}
              </Link>
            ))}
            <ButtonLink href="/audit" size="sm">
              Free audit
            </ButtonLink>
          </div>

          <div className="flex items-center gap-2 md:hidden">
            <ButtonLink href="/audit" size="sm" className="h-8 text-xs">
              Audit
            </ButtonLink>
            <Sheet open={open} onOpenChange={setOpen}>
              <SheetTrigger
                className={buttonVariants({
                  variant: "ghost",
                  size: "icon",
                })}
                aria-label="Open menu"
              >
                <Menu className="size-5" />
              </SheetTrigger>
              <SheetContent side="right" className="w-[280px]">
                <SheetHeader>
                  <SheetTitle>{site.name}</SheetTitle>
                </SheetHeader>
                <div className="mt-8 flex flex-col gap-4">
                  {navLinks.map((link) => (
                    <Link
                      key={link.href}
                      href={link.href}
                      onClick={() => setOpen(false)}
                      className="text-base font-medium"
                    >
                      {link.label}
                    </Link>
                  ))}
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </nav>
      </Container>
    </header>
  );
}
