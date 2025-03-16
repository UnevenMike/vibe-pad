import "@/../styles/globals.css";
import { Button } from "@/components/ui/button";
import { Link } from "react-router";

export default function HomePage() {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="border-border border-b">
        <div className="container flex h-16 items-center px-4">
          <div className="text-xl font-bold">VibePad</div>
          <nav className="ml-auto flex gap-4 sm:gap-6">
            <Link to="/app">
              <Button variant="default">Login</Button>
            </Link>
          </nav>
        </div>
      </header>
      <main className="flex-1">
        <section className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <div className="grid items-center gap-6 lg:grid-cols-2 lg:gap-12">
              <div className="space-y-4">
                <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                  Collaborate with your team in real-time
                </h1>
                <p className="text-muted-foreground md:text-xl">
                  Create notes, diagrams, and drawings together. TeamNotes
                  provides a seamless collaboration experience with local-first
                  storage for speed and reliability.
                </p>
                <div className="flex flex-col gap-2 sm:flex-row">
                  <Link to="/app">
                    <Button size="lg" className="w-full sm:w-auto">
                      Get Started
                    </Button>
                  </Link>
                </div>
              </div>
              <div className="relative mx-auto lg:mx-0">
                <div className="border-border bg-background relative h-[350px] w-[450px] border p-4 shadow-lg">
                  <div className="border-border mb-4 flex h-6 w-full items-center border-b">
                    <div className="bg-muted-foreground mr-2 h-3 w-3 rounded-full"></div>
                    <div className="bg-muted-foreground mr-2 h-3 w-3 rounded-full"></div>
                    <div className="bg-muted-foreground h-3 w-3 rounded-full"></div>
                  </div>
                  <div className="space-y-2">
                    <div className="h-8 w-3/4 bg-blue-100 dark:bg-blue-900/20"></div>
                    <div className="bg-muted h-4 w-full"></div>
                    <div className="bg-muted h-4 w-5/6"></div>
                    <div className="bg-muted h-4 w-4/6"></div>
                    <div className="mt-4 h-20 w-full border border-blue-200 bg-blue-50 dark:border-blue-800 dark:bg-blue-900/10"></div>
                    <div className="bg-muted mt-4 h-4 w-full"></div>
                    <div className="bg-muted h-4 w-5/6"></div>
                    <div className="bg-muted h-4 w-4/6"></div>
                  </div>
                </div>
                <div className="border-border bg-background/80 absolute -right-6 -bottom-6 h-[350px] w-[450px] border blur-sm"></div>
                <div className="border-border bg-background/50 absolute -right-12 -bottom-12 h-[350px] w-[450px] border blur-md"></div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
