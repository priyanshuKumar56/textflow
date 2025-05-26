export function LandingTestimonials() {
  return (
    <section className="py-20">
      <div className="container">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">Loved by creators and teams</h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Join thousands of users who have transformed their workflow with TextFlow.
          </p>
        </div>

        <div className="mx-auto mt-16 grid max-w-5xl gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <TestimonialCard
            quote="TextFlow has completely changed how I organize my thoughts. The ability to switch between text and visual modes is game-changing."
            author="Sarah Johnson"
            role="Product Designer"
          />
          <TestimonialCard
            quote="We use TextFlow for all our product planning. Being able to embed whiteboards directly in our documentation has streamlined our workflow."
            author="Michael Chen"
            role="Engineering Manager"
          />
          <TestimonialCard
            quote="As a content creator, I need tools that adapt to my creative process. TextFlow gives me the flexibility I need to capture ideas in any format."
            author="Alex Rodriguez"
            role="Content Creator"
          />
          <TestimonialCard
            quote="The calendar integration is perfect for our editorial team. We can plan content and link directly to the documents we're working on."
            author="Emily Williams"
            role="Editor in Chief"
          />
          <TestimonialCard
            quote="TextFlow has replaced at least three different tools for our team. The seamless integration between different views saves us hours every week."
            author="David Kim"
            role="Startup Founder"
          />
          <TestimonialCard
            quote="I've tried dozens of productivity tools, and TextFlow is the first one that actually adapts to how I think instead of forcing me into a specific workflow."
            author="Lisa Thompson"
            role="Productivity Coach"
          />
        </div>
      </div>
    </section>
  )
}

function TestimonialCard({ quote, author, role }: { quote: string; author: string; role: string }) {
  return (
    <div className="rounded-xl border bg-card p-6 shadow-sm">
      <div className="mb-4 text-4xl">"</div>
      <p className="mb-4 text-muted-foreground">{quote}</p>
      <div>
        <p className="font-medium">{author}</p>
        <p className="text-sm text-muted-foreground">{role}</p>
      </div>
    </div>
  )
}
