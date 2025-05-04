import Link from "next/link"
import { Lightbulb, Github, Twitter, Linkedin } from "lucide-react"

export function Footer() {
  return (
    <footer className="border-t bg-background">
      <div className="container mx-auto px-4 py-12 md:px-6">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
          <div className="flex flex-col">
            <Link href="/" className="flex items-center gap-2">
              <Lightbulb className="h-6 w-6" />
              <span className="text-xl font-bold">IdeaShare</span>
            </Link>
            <p className="mt-4 text-sm text-muted-foreground">
              Discover and share tech project ideas. Find inspiration for your next coding project.
            </p>
          </div>

          <div>
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider">Explore</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/browse" className="text-sm text-muted-foreground hover:text-foreground">
                  Browse Ideas
                </Link>
              </li>
              <li>
                <Link href="/submit" className="text-sm text-muted-foreground hover:text-foreground">
                  Submit Idea
                </Link>
              </li>
              <li>
                <Link href="/#trending" className="text-sm text-muted-foreground hover:text-foreground">
                  Trending Ideas
                </Link>
              </li>
              <li>
                <Link href="/#popular-tags" className="text-sm text-muted-foreground hover:text-foreground">
                  Popular Tags
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider">Company</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/about" className="text-sm text-muted-foreground hover:text-foreground">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-sm text-muted-foreground hover:text-foreground">
                  Contact
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="text-sm text-muted-foreground hover:text-foreground">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="text-sm text-muted-foreground hover:text-foreground">
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider">Connect</h3>
            <div className="flex space-x-4">
              <a
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-foreground"
              >
                <span className="sr-only">GitHub</span>
                <Github className="h-5 w-5" />
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-foreground"
              >
                <span className="sr-only">Twitter</span>
                <Twitter className="h-5 w-5" />
              </a>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-foreground"
              >
                <span className="sr-only">LinkedIn</span>
                <Linkedin className="h-5 w-5" />
              </a>
            </div>
            <p className="mt-4 text-sm text-muted-foreground">Subscribe to our newsletter for updates</p>
            <form className="mt-2 flex">
              <input
                type="email"
                placeholder="Enter your email"
                className="w-full rounded-l-md border border-input bg-background px-3 py-2 text-sm"
                required
              />
              <button
                type="submit"
                className="rounded-r-md bg-primary px-3 py-2 text-sm font-medium text-primary-foreground"
              >
                Subscribe
              </button>
            </form>
          </div>
        </div>
        <div className="mt-8 border-t pt-8 text-center">
          <p className="text-sm text-muted-foreground">
            &copy; {new Date().getFullYear()} IdeaShare. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}
