import Link from "next/link";

const TEAM_MEMBERS = [
  {
    name: "Sanika Sadre",
    role: "Founder & Editor",
    initials: "SS",
    bio: "Obsessed with editorial design, typography, and clean human-computer interfaces. Previously designing digital reading experiences.",
  },
  {
    name: "Elena Rostova",
    role: "Visual Designer",
    initials: "ER",
    bio: "Focuses on type scale, layout grids, and spatial web layouts. Believes that minimalism is the ultimate form of sophistication.",
  },
  {
    name: "Marcus Chen",
    role: "Lead Engineer",
    initials: "MC",
    bio: "Specializes in design engineering, CSS animations, and building fast, accessible web platforms for long-form reading.",
  }
];

export default function TeamPage() {
  return (
    <div className="space-y-16">
      {/* Header */}
      <section className="space-y-4 pt-4">
        <Link 
          href="/" 
          className="font-sans text-xs font-semibold uppercase tracking-widest text-muted hover:text-foreground transition-colors duration-500 inline-flex items-center gap-1 group"
        >
          <span className="inline-block transition-transform duration-500 group-hover:-translate-x-0.5">←</span>
          Back to Home
        </Link>
        <h1 className="font-sans text-4xl md:text-5xl font-black tracking-tight text-foreground">
          The Team
        </h1>
        <p className="font-sans text-base text-muted max-w-md leading-relaxed">
          The creators, designers, and engineers behind pageblogs.
        </p>
      </section>

      {/* Team Grid */}
      <section className="border-t border-border-custom pt-12">
        <div className="grid gap-12 sm:grid-cols-2 md:grid-cols-3">
          {TEAM_MEMBERS.map((member, index) => (
            <div 
              key={index} 
              className="group flex flex-col items-start space-y-4 transition-all duration-700 ease-in-out"
            >
              {/* Monochrome Glassmorphic Circle Avatar */}
              <div className="relative w-16 h-16 rounded-full flex items-center justify-center bg-foreground text-background font-sans text-lg font-bold uppercase select-none border border-border-custom shadow-sm transition-all duration-700 ease-in-out group-hover:scale-105 group-hover:bg-background group-hover:text-foreground group-hover:border-foreground/30">
                {member.initials}
              </div>
              
              <div className="space-y-1">
                <h3 className="font-sans text-lg font-bold text-foreground transition-colors duration-500 group-hover:text-muted">
                  {member.name}
                </h3>
                <p className="font-sans text-[11px] font-semibold uppercase tracking-wider text-muted">
                  {member.role}
                </p>
              </div>
              
              <p className="font-sans text-[13px] leading-relaxed text-muted/95 font-normal">
                {member.bio}
              </p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

