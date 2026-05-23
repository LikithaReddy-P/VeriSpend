import { Container } from "@/components/layout/container";
import { trustedBy } from "@/lib/site";

export function SocialProof() {
  return (
    <section className="border-y border-border/60 bg-white/[0.02] py-10">
      <Container>
        <p className="mb-8 text-center text-sm text-muted-foreground">
          Trusted by finance and ops teams at modern companies
        </p>
        <ul className="flex flex-wrap items-center justify-center gap-x-10 gap-y-6 sm:gap-x-14">
          {trustedBy.map((name) => (
            <li
              key={name}
              className="text-lg font-semibold tracking-tight text-muted-foreground/50 transition-colors hover:text-muted-foreground"
            >
              {name}
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
}
