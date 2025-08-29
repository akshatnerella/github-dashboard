'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';

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
						<svg viewBox="0 0 24 24" className="h-8 w-8 text-white" aria-hidden>
							<rect x="3"  y="3"  width="8" height="8" rx="2" />
							<rect x="13" y="3"  width="8" height="8" rx="2" opacity="0.9" />
							<rect x="3"  y="13" width="8" height="8" rx="2" opacity="0.9" />
							<rect x="13" y="13" width="8" height="8" rx="0.85" />
						</svg>
						<span>Tiles</span>
					</Link>

					{/* Text on the right side */}
					<span className="text-ink-2 text-sm">Part of nerella.me suite</span>
				</div>
			</div>
		</motion.header>
	);
}