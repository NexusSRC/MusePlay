import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Music, Users, Radio, ArrowRight } from "lucide-react"
import Link from "next/link"
import { Appbar } from "./components/Appbar"
import { useDeferredValue } from "react"
import { Redirect } from "./components/Redirect"

export default function StreamTunesDarkLanding() {
  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 text-gray-100">
      <Appbar/>
      <Redirect/>
      <main className="flex-1">
        <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center space-y-4 text-center">
              <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl/none">
                  Let Your Fans <span className="text-purple-400">Choose the Beat</span>
                </h1>
                <p className="mx-auto max-w-[700px] text-gray-400 md:text-xl">
                  Where creators and fans unite to create the perfect soundtrack for every stream.
                </p>
              </div>
              <div className="space-x-4">
                <Button size="lg" className="bg-purple-600 hover:bg-purple-700 text-white">Get Started</Button>
                <Button variant="outline" size="lg" className="border-purple-400 text-purple-400 hover:bg-purple-400/10">Learn More</Button>
              </div>
            </div>
          </div>
        </section>
        <section id="features" className="w-full py-12 md:py-24 lg:py-32 bg-gray-800">
          <div className="container px-4 md:px-6">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl text-center mb-12 text-purple-400">Key Features</h2>
            <div className="grid gap-10 sm:grid-cols-2 md:grid-cols-3">
              <div className="flex flex-col items-center space-y-3 text-center">
                <Users className="h-12 w-12 text-purple-400" />
                <h3 className="text-xl font-bold">Interactive Streaming</h3>
                <p className="text-gray-400">Engage with your audience in real-time music selection.</p>
              </div>
              <div className="flex flex-col items-center space-y-3 text-center">
                <Radio className="h-12 w-12 text-purple-400" />
                <h3 className="text-xl font-bold">Vast Music Library</h3>
                <p className="text-gray-400">Access millions of tracks across all genres.</p>
              </div>
              <div className="flex flex-col items-center space-y-3 text-center">
                <Music className="h-12 w-12 text-purple-400" />
                <h3 className="text-xl font-bold">High-Quality Audio</h3>
                <p className="text-gray-400">Crystal clear sound for the best listening experience.</p>
              </div>
            </div>
          </div>
        </section>
        <section id="how-it-works" className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <div className="grid gap-10 px-10 md:gap-16 lg:grid-cols-2">
              <div className="space-y-4">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl text-purple-400">How It Works</h2>
                <p className="max-w-[600px] text-gray-400 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  StreamTunes brings creators and listeners together for an interactive music experience.
                </p>
                <ul className="grid gap-4">
                  <li className="flex items-center gap-4">
                    <span className="font-bold text-purple-400">1.</span> Creators start a stream
                  </li>
                  <li className="flex items-center gap-4">
                    <span className="font-bold text-purple-400">2.</span> Fans join and vote for songs
                  </li>
                  <li className="flex items-center gap-4">
                    <span className="font-bold text-purple-400">3.</span> Most voted songs play next
                  </li>
                </ul>
              </div>
              <div className="flex items-center justify-center">
                <div className="relative w-[300px] h-[300px] bg-purple-900/30 rounded-full overflow-hidden">
                  <div className="absolute inset-0 flex items-center justify-center text-4xl font-bold text-purple-400">
                    StreamTunes
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
        <section className="w-full py-12 md:py-24 lg:py-32 bg-purple-900 text-white">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">Ready to Revolutionize Your Streams?</h2>
                <p className="mx-auto max-w-[600px] text-purple-100 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Join StreamTunes today and start creating unforgettable music experiences with your audience.
                </p>
              </div>
              <div className="w-full max-w-sm space-y-2">
                <form className="flex space-x-2">
                  <Input 
                    className="max-w-lg flex-1 bg-purple-800 text-white border-purple-700 focus:ring-purple-400 focus:border-purple-400" 
                    placeholder="Enter your email" 
                    type="email" 
                  />
                  <Button type="submit" className="bg-white text-purple-900 hover:bg-purple-100">
                    Get Started
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </form>
              </div>
            </div>
          </div>
        </section>
      </main>
      <footer className="flex flex-col gap-2 sm:flex-row py-6 w-full shrink-0 items-center px-4 md:px-6 border-t border-gray-800">
        <p className="text-xs text-gray-400">© 2024 StreamTunes. All rights reserved.</p>
        <nav className="sm:ml-auto flex gap-4 sm:gap-6">
          <Link className="text-xs hover:underline underline-offset-4 text-gray-400 hover:text-purple-400" href="#">
            Terms of Service
          </Link>
          <Link className="text-xs hover:underline underline-offset-4 text-gray-400 hover:text-purple-400" href="#">
            Privacy
          </Link>
        </nav>
      </footer>
    </div>
  )
}