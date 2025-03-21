import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight, BookOpen, Calendar, GraduationCap, Users } from "lucide-react"

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <header className="border-b">
        <div className="container flex h-16 items-center justify-between px-4 md:px-6">
          <div className="flex items-center gap-2">
            <GraduationCap className="h-6 w-6" />
            <span className="text-xl font-bold">EduConsult Pro</span>
          </div>
          <nav className="hidden md:flex gap-6">
            <Link href="#features" className="text-sm font-medium hover:underline underline-offset-4">
              Features
            </Link>
            {/* <Link href="#testimonials" className="text-sm font-medium hover:underline underline-offset-4">
              Testimonials
            </Link> */}
            {/* <Link href="#pricing" className="text-sm font-medium hover:underline underline-offset-4">
              Pricing
            </Link> */}
          </nav>
          <div className="flex items-center gap-4">
            <Link href="/signin">
              <Button variant="outline">Log In</Button>
            </Link>
            <Link href="/signup">
              <Button>Sign Up</Button>
            </Link>
          </div>
        </div>
      </header>
      <main className="flex-1">
                <section className="w-full py-12 md:py-24 lg:py-32 bg-muted">
          <div className="container px-4 md:px-6">
            <div className="grid gap-6 lg:grid-cols-2 lg:gap-12 items-center">
              <div className="flex flex-col justify-center space-y-4">
                <div className="space-y-2">
                  <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl">
                    Streamline Your Education Consulting Practice
                  </h1>
                  <p className="max-w-[600px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                    Manage student portfolios, track assignments, and stay updated with the latest university
                    information—all in one place.
                  </p>
                </div>
                <div className="flex flex-col gap-2 min-[400px]:flex-row">
                  <Link href="/signup">
                    <Button size="lg" className="gap-1">
                      Get Started <ArrowRight className="h-4 w-4" />
                    </Button>
                  </Link>
                  <Link href="#features">
                    <Button size="lg" variant="outline">
                      Learn More
                    </Button>
                  </Link>
                </div>
              </div>
              <div className="mx-auto lg:mx-0 relative">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg blur-xl opacity-20"></div>
                <div className="relative bg-background rounded-lg border overflow-hidden shadow-xl">
                  <div className="p-4 border-b">
                    <div className="flex items-center gap-2">
                      <div className="h-3 w-3 rounded-full bg-red-500"></div>
                      <div className="h-3 w-3 rounded-full bg-yellow-500"></div>
                      <div className="h-3 w-3 rounded-full bg-green-500"></div>
                      <div className="ml-2 text-sm font-medium">Consultant Dashboard</div>
                    </div>
                  </div>
                  <div className="aspect-[16/9] bg-muted flex items-center justify-center">
                    <div className="grid grid-cols-2 gap-4 p-4 w-full">
                      <div className="bg-background rounded p-4 border shadow-sm">
                        <div className="flex items-center gap-2 mb-2">
                          <Users className="h-4 w-4 text-primary" />
                          <span className="font-medium">Students</span>
                        </div>
                        <div className="text-2xl font-bold">24</div>
                      </div>
                      <div className="bg-background rounded p-4 border shadow-sm">
                        <div className="flex items-center gap-2 mb-2">
                          <BookOpen className="h-4 w-4 text-primary" />
                          <span className="font-medium">Assignments</span>
                        </div>
                        <div className="text-2xl font-bold">86</div>
                      </div>
                      <div className="bg-background rounded p-4 border shadow-sm">
                        <div className="flex items-center gap-2 mb-2">
                          <Calendar className="h-4 w-4 text-primary" />
                          <span className="font-medium">Deadlines</span>
                        </div>
                        <div className="text-2xl font-bold">12</div>
                      </div>
                      <div className="bg-background rounded p-4 border shadow-sm">
                        <div className="flex items-center gap-2 mb-2">
                          <GraduationCap className="h-4 w-4 text-primary" />
                          <span className="font-medium">Schools</span>
                        </div>
                        <div className="text-2xl font-bold">38</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <footer className="border-t">
        
      </footer>
    </div>
  )
}
