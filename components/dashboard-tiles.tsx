"use client";
import React from "react";
import { Star, GitBranch, AlertCircle, Users, Eye, Code, MessageCircle } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import type { TileData } from "@/lib/github-api";

interface DashboardTilesProps {
	tiles: TileData;
}

export function DashboardTiles({ tiles }: DashboardTilesProps) {
	// For future: position tracking for paid plans
	// const [positions, setPositions] = useState(...)
	return (
		<div
			className="w-full h-full min-w-0 min-h-0 grid grid-cols-12 grid-rows-6 gap-6 p-6"
		>
			{/* Repo Title & Tagline */}
			<Card className="glass-card glass-highlight col-span-12 row-span-1 flex flex-col justify-center px-8 py-4 mb-2">
				<CardHeader className="p-0 mb-1">
					<CardTitle className="text-2xl md:text-3xl font-bold truncate">
						{tiles.title.text}
					</CardTitle>
				</CardHeader>
				<div className="text-ink-2 text-base truncate">{tiles.tagline.text}</div>
			</Card>

			{/* KPIs - All in one tile */}
			<Card
				className="glass-card glass-highlight col-span-6 row-span-2 flex flex-col justify-center items-center"
				data-tile="kpis"
			>
				<CardHeader className="p-0 mb-2 w-full">
					<CardTitle className="text-lg font-semibold text-center w-full">Key Metrics</CardTitle>
				</CardHeader>
				<CardContent className="p-0 w-full">
					<div className="grid grid-cols-5 gap-2 w-full justify-items-center">
						<KPI icon={Star} label="Stars" value={tiles.kpis.stars} color="text-yellow-400" />
						<KPI icon={GitBranch} label="Forks" value={tiles.kpis.forks} color="text-green-400" />
						<KPI icon={AlertCircle} label="Issues" value={tiles.kpis.open_issues} color="text-red-400" />
						<KPI icon={MessageCircle} label="PRs" value={tiles.kpis.open_prs} color="text-blue-400" />
						<KPI icon={Eye} label="Watchers" value={tiles.kpis.watchers} color="text-violet-400" />
					</div>
				</CardContent>
			</Card>

			{/* Contributors */}
			<Card
				className="glass-card glass-highlight col-span-3 row-span-2 flex flex-col"
				data-tile="contributors"
			>
				<CardHeader className="pb-2">
					<CardTitle className="text-base font-semibold">Top Contributors</CardTitle>
				</CardHeader>
				<CardContent className="flex flex-wrap gap-2 items-center">
					{tiles.contributors_leaderboard.top.slice(0, 6).map((c) => (
						<TooltipProvider key={c.login}>
							<Tooltip>
								<TooltipTrigger asChild>
									<div className="flex flex-col items-center w-12">
										<Avatar className="h-10 w-10 mb-1">
											<AvatarImage src={c.avatar_url} alt={c.login} />
											<AvatarFallback>{c.login[0]}</AvatarFallback>
										</Avatar>
										<span className="text-xs text-ink-2 truncate w-full">{c.login}</span>
									</div>
								</TooltipTrigger>
								<TooltipContent>
									<div className="text-xs">
										{c.login}<br />{c.contributions} commits
									</div>
								</TooltipContent>
							</Tooltip>
						</TooltipProvider>
					))}
				</CardContent>
			</Card>

			{/* Tech Stack */}
			<Card
				className="glass-card glass-highlight col-span-3 row-span-2 flex flex-col"
				data-tile="tech-stack"
			>
				<CardHeader className="pb-2">
					<CardTitle className="text-base font-semibold">Tech Stack</CardTitle>
				</CardHeader>
				<CardContent className="p-0">
					<Table>
						<TableBody>
							{tiles.tech_stack.languages.slice(0, 4).map((lang) => (
								<TableRow key={lang.name}>
									<TableCell className="p-1 text-xs text-ink font-medium">{lang.name}</TableCell>
									<TableCell className="p-1 text-xs text-ink-2 text-right">{lang.pct}</TableCell>
								</TableRow>
							))}
						</TableBody>
					</Table>
				</CardContent>
			</Card>

			{/* Recent Activity */}
			<Card
				className="glass-card glass-highlight col-span-12 row-span-3 flex flex-col"
				data-tile="activity"
			>
				<CardHeader className="pb-2">
					<CardTitle className="text-base font-semibold">Recent Activity</CardTitle>
				</CardHeader>
				<CardContent className="overflow-y-auto max-h-40 p-0">
					<ul className="divide-y divide-white/10">
						{tiles.timeline.events.slice(0, 6).map((event, i) => (
							<li key={i} className="py-2 flex items-center gap-2">
								<span className="text-xs text-ink-2 w-24 shrink-0">{event.date}</span>
								<span className="text-xs text-ink truncate">{event.title}</span>
								{event.url && (
									<a href={event.url} target="_blank" rel="noopener noreferrer" className="ml-auto text-xs text-violet-400 underline">View</a>
								)}
							</li>
						))}
					</ul>
				</CardContent>
			</Card>
		</div>
	);
}

interface KPIProps {
	icon: React.ElementType;
	label: string;
	value: string;
	color: string;
}
function KPI({ icon: Icon, label, value, color }: KPIProps) {
	return (
		<div className="flex flex-col items-center justify-center gap-1">
			<div className={cn("p-2 rounded-lg bg-white/10", color)}>
				<Icon className="h-5 w-5" />
			</div>
			<span className="text-base font-semibold text-ink tabular-nums">{value}</span>
			<span className="text-xs text-ink-2">{label}</span>
		</div>
	);
}