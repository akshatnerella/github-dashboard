'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Menu, X, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';

const navLinks = [
  { href: '/docs', label: 'Docs' },
  { href: '/pricing', label: 'Pricing' },
  { href: '/changelog', label: 'Changelog' },
];

export function Header() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <motion.header
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="relative z-50 w-full"
    >
      <div className="mx-auto max-w-7xl px-4 md:px-6">
        <div className="glass-card glass-highlight relative mt-4 flex h-16 items-center justify-between px-6">
          {/* Logo */}
          <Link 
            href="/" 
            className="flex items-center space-x-2 text-ink font-semibold text-lg focus:outline-none focus:ring-2 focus:ring-violet-400/60 rounded-lg p-1"
          >
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-violet-500 to-violet-600">
              <span className="text-white font-bold text-lg">LS</span>
            </div>
            <span>LogSpace</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-ink-2 hover:text-ink transition-colors focus:outline-none focus:ring-2 focus:ring-violet-400/60 rounded-lg px-2 py-1"
              >
                {link.label}
              </Link>
            ))}
            <Button 
              variant="outline" 
              className="glass-button border-white/30 hover:bg-white/20 focus:ring-2 focus:ring-violet-400/60 text-ink-2 hover:text-ink"
            >
              Sign In
            </Button>
          </nav>

          {/* Mobile Navigation */}
          <div className="md:hidden">
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="glass-button focus:ring-2 focus:ring-violet-400/60"
                  aria-label="Open menu"
                >
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent className="glass-card border-white/20">
                <div className="flex flex-col space-y-4 pt-8">
                  {navLinks.map((link) => (
                    <Link
                      key={link.href}
                      href={link.href}
                      className="text-ink-2 hover:text-ink transition-colors focus:outline-none focus:ring-2 focus:ring-violet-400/60 rounded-lg px-2 py-1"
                      onClick={() => setIsOpen(false)}
                    >
                      {link.label}
                    </Link>
                  ))}
                  <Button 
                    variant="outline" 
                    className="glass-button border-white/30 hover:bg-white/20 focus:ring-2 focus:ring-violet-400/60 text-ink-2 hover:text-ink"
                    onClick={() => setIsOpen(false)}
                  >
                    Sign In
                  </Button>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </motion.header>
  );
}