"use client";

import { signIn, signOut, useSession } from "next-auth/react";
import Link from "next/link";
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Music } from "lucide-react"

export function Appbar() {
    const session = useSession();

    return (
        <div className="flex items-center h-14 px-4 bg-gray-900">
            <Link className="flex items-center justify-center" href="#">
                <Music className="h-6 w-6 text-purple-400" />
                <span className="ml-2 text-2xl font-bold text-purple-400">MusePlay</span>
            </Link>
            <nav className="flex items-center gap-4 sm:gap-6 ml-auto">
                <Link className="text-sm font-medium text-gray-300 hover:text-purple-400 transition-colors" href="#features">
                    Features
                </Link>
                <Link className="text-sm font-medium text-gray-300 hover:text-purple-400 transition-colors" href="#how-it-works">
                    How It Works
                </Link>
                <Link className="text-sm font-medium text-gray-300 hover:text-purple-400 transition-colors" href="#contact">
                    Contact
                </Link>
                <div>  
                    {session.data?.user ? (
                        <Button className="bg-purple-600 hover:bg-purple-700 text-white" onClick={() => signOut()}>
                            Logout
                        </Button>
                    ) : (
                        <Button className="bg-purple-600 hover:bg-purple-700 text-white" onClick={() => signIn()}>
                            Sign In
                        </Button>
                    )}
                </div>
            </nav>
        </div>
    )
}