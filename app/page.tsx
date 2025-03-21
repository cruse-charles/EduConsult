import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight, BookOpen, Calendar, GraduationCap, ShieldUser, Users } from "lucide-react"

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
            {/* <Link href="#features" className="text-sm font-medium hover:underline underline-offset-4">
              Features
            </Link> */}
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
        {/* Main Text and Dashboard View */}
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
        {/* Features Section */}
        <section id="features" className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <div className="inline-block rounded-lg bg-muted px-3 py-1 text-sm">Features</div>
                <h2 className="text-3xl font-bold tracking-tighter md:text-4xl/tight">
                  Everything You Need to Succeed
                </h2>
                <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Our platform provides all the tools education consultants need to effectively manage their students
                  and help them achieve their academic goals.
                </p>
              </div>
            </div>
            <div className="mx-auto grid max-w-5xl items-center gap-6 py-12 lg:grid-cols-2 lg:gap-12">
              <div className="grid gap-6">
                <div className="grid gap-2">
                  <div className="flex items-center gap-2">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground">
                      <Users className="h-4 w-4" />
                    </div>
                    <h3 className="text-xl font-bold">Student Portfolio Management</h3>
                  </div>
                  <p className="text-muted-foreground">
                    Easily manage student profiles, track their progress, and store important documents in one
                    centralized location.
                  </p>
                </div>
                <div className="grid gap-2">
                  <div className="flex items-center gap-2">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground">
                      <BookOpen className="h-4 w-4" />
                    </div>
                    <h3 className="text-xl font-bold">Assignment Management</h3>
                  </div>
                  <p className="text-muted-foreground">
                    Create, assign, and track assignments for each student. Students can view and submit their work
                    directly through the platform.
                  </p>
                </div>
                <div className="grid gap-2">
                  <div className="flex items-center gap-2">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground">
                      <Calendar className="h-4 w-4" />
                    </div>
                    <h3 className="text-xl font-bold">Integrated Calendar</h3>
                  </div>
                  <p className="text-muted-foreground">
                    Keep track of important deadlines and appointments with our integrated calendar system, customized
                    for each student.
                  </p>
                </div>
              </div>
              <div className="grid gap-6">
                <div className="grid gap-2">
                  <div className="flex items-center gap-2">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground">
                      <GraduationCap className="h-4 w-4" />
                    </div>
                    <h3 className="text-xl font-bold">School Information Database</h3>
                  </div>
                  <p className="text-muted-foreground">
                    Access up-to-date information about universities and colleges, automatically scraped from their
                    websites.
                  </p>
                </div>
                <div className="grid gap-2">
                  <div className="flex items-center gap-2">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground">
                      <Users className="h-4 w-4"/>
                    </div>
                    <h3 className="text-xl font-bold">Role-Based Access</h3>
                  </div>
                  <p className="text-muted-foreground">
                    Different views for consultants and students ensure that everyone sees exactly what they need to
                    see.
                  </p>
                </div>
                <div className="grid gap-2">
                  <div className="flex items-center gap-2">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground">
                      <ShieldUser className="h-4 w-4"/>
                    </div>
                    <h3 className="text-xl font-bold">Secure Data Storage</h3>
                  </div>
                  <p className="text-muted-foreground">
                    All student information and documents are securely stored and protected.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      {/* Footer */}
      <footer className="border-t">
                <div className="container flex flex-col gap-4 py-10 md:flex-row md:gap-8 md:py-12">
          <div className="flex flex-col gap-2 md:gap-4 lg:gap-6">
            <div className="flex items-center gap-2">
              <GraduationCap className="h-6 w-6" />
              <span className="text-xl font-bold">EduConsult Pro</span>
            </div>
            <p className="text-sm text-muted-foreground">
              Empowering education consultants to help students achieve their dreams.
            </p>
          </div>
          <div className="md:ml-auto grid gap-8 sm:grid-cols-3">
            <div className="grid gap-3 text-sm">
              <div className="font-medium">Product</div>
              <Link href="#" className="text-muted-foreground hover:underline">
                Features
              </Link>
              {/* <Link href="#" className="text-muted-foreground hover:underline">
                Pricing
              </Link> */}
              {/* <Link href="#" className="text-muted-foreground hover:underline">
                Testimonials
              </Link> */}
            </div>
            <div className="grid gap-3 text-sm">
              <div className="font-medium">The Developer</div>
              <Link href="https://charlesnealcruse.netlify.app/" className="text-muted-foreground hover:underline">
                About
              </Link>
              {/* <Link href="#" className="text-muted-foreground hover:underline">
                Blog
              </Link> */}
              {/* <Link href="#" className="text-muted-foreground hover:underline">
                Careers
              </Link> */}
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
