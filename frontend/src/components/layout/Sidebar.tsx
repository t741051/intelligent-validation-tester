"use client";
import {
  ChevronDown,
  ChevronRight,
  Cable,
  Database,
  Globe,
  LayoutDashboard,
  Sparkles,
  Target,
  type LucideIcon,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { cn } from "@/lib/cn";
import { useUiStore } from "@/stores/uiStore";

type NavLeaf = { kind: "leaf"; id: string; href: string; label: string; icon?: LucideIcon };
type NavBranch = {
  kind: "branch";
  id: string;
  label: string;
  icon?: LucideIcon;
  children: NavNode[];
};
type NavNode = NavLeaf | NavBranch;

const NAV: NavNode[] = [
  { kind: "leaf", id: "overview", href: "/overview", label: "總覽", icon: LayoutDashboard },
  {
    kind: "branch",
    id: "interface-validation",
    label: "連接介面驗證",
    icon: Cable,
    children: [
      {
        kind: "branch",
        id: "interface-dut",
        label: "DUT",
        children: [
          { kind: "leaf", id: "iv-smo", href: "/interface-validation/smo", label: "SMO" },
          { kind: "leaf", id: "iv-ric", href: "/interface-validation/ric", label: "RIC" },
          { kind: "leaf", id: "iv-xapp", href: "/interface-validation/xapp", label: "xApp" },
          { kind: "leaf", id: "iv-rapp", href: "/interface-validation/rapp", label: "rApp" },
        ],
      },
    ],
  },
  {
    kind: "branch",
    id: "data-validation",
    label: "資料品質驗證",
    icon: Database,
    children: [
      {
        kind: "branch",
        id: "data-dut",
        label: "DUT",
        children: [
          { kind: "leaf", id: "dv-smo", href: "/data-validation/smo", label: "SMO" },
          { kind: "leaf", id: "dv-ric", href: "/data-validation/ric", label: "RIC" },
        ],
      },
    ],
  },
  {
    kind: "branch",
    id: "intelligence-validation",
    label: "智慧程度驗證",
    icon: Sparkles,
    children: [
      {
        kind: "branch",
        id: "intelligence-apps",
        label: "DUT",
        children: [
          { kind: "leaf", id: "in-xapp", href: "/intelligence-validation/xapp", label: "xApp" },
          { kind: "leaf", id: "in-rapp", href: "/intelligence-validation/rapp", label: "rApp" },
        ],
      },
    ],
  },
  { kind: "leaf", id: "test-scenarios", href: "/test-scenarios", label: "端對端測試情境", icon: Target },
  {
    kind: "branch",
    id: "site-management",
    label: "場域管理",
    icon: Globe,
    children: [
      { kind: "leaf", id: "site-domestic", href: "/site-management/domestic", label: "國內場域" },
      { kind: "leaf", id: "site-international", href: "/site-management/international", label: "國外場域" },
    ],
  },
];

function hasActiveDescendant(node: NavNode, pathname: string): boolean {
  if (node.kind === "leaf") {
    return pathname === node.href || pathname.startsWith(node.href + "/");
  }
  return node.children.some((c) => hasActiveDescendant(c, pathname));
}

function NavTree({
  nodes,
  pathname,
  depth,
  expandedNavIds,
  toggle,
}: {
  nodes: NavNode[];
  pathname: string;
  depth: number;
  expandedNavIds: string[];
  toggle: (id: string) => void;
}) {
  const indent = depth === 0 ? "" : depth === 1 ? "ml-4" : "ml-6";
  return (
    <div className={cn("space-y-0.5", depth > 0 && "border-l border-white/10 pl-2 mt-0.5", indent)}>
      {nodes.map((node) => {
        if (node.kind === "leaf") {
          const active = pathname === node.href || pathname.startsWith(node.href + "/");
          const LeafIcon = node.icon;
          return (
            <Link
              key={node.id}
              href={node.href}
              className={cn(
                "relative flex items-center gap-2 px-3 py-1.5 rounded-item text-sm transition-colors",
                active
                  ? "bg-mint-300/10 text-mint-300 font-medium"
                  : "text-white/70 hover:bg-white/5 hover:text-white",
              )}
            >
              {active && (
                <span className="absolute left-0 top-1/2 -translate-y-1/2 h-4 w-0.5 bg-mint-300 rounded-r" />
              )}
              {LeafIcon && <LeafIcon className="w-4 h-4" strokeWidth={1.5} />}
              <span>{node.label}</span>
            </Link>
          );
        }
        const branchActive = hasActiveDescendant(node, pathname);
        const expanded = expandedNavIds.includes(node.id) || branchActive;
        const BranchIcon = node.icon;
        return (
          <div key={node.id}>
            <button
              type="button"
              onClick={() => toggle(node.id)}
              className={cn(
                "w-full flex items-center gap-2 px-3 py-2 rounded-item text-sm transition-colors",
                branchActive
                  ? "text-mint-300 font-medium"
                  : "text-white/80 hover:bg-white/5 hover:text-white",
              )}
            >
              {BranchIcon && <BranchIcon className="w-4 h-4" strokeWidth={1.5} />}
              <span className="flex-1 text-left">{node.label}</span>
              {expanded
                ? <ChevronDown className="w-4 h-4 text-white/40" />
                : <ChevronRight className="w-4 h-4 text-white/40" />}
            </button>
            {expanded && (
              <NavTree
                nodes={node.children}
                pathname={pathname}
                depth={depth + 1}
                expandedNavIds={expandedNavIds}
                toggle={toggle}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}

export function Sidebar({ className }: { className?: string }) {
  const pathname = usePathname() ?? "";
  const expandedNavIds = useUiStore((s) => s.expandedNavIds);
  const toggleNavItem = useUiStore((s) => s.toggleNavItem);

  return (
    <aside className={cn("border-r border-white/10 bg-navy-600/70 backdrop-blur-sm w-64 flex-shrink-0 overflow-y-auto", className)}>
      <div className="p-4 border-b border-white/10">
        <p className="text-lg font-semibold text-white">智慧驗證 tester</p>
        <p className="text-xs text-white/40 mt-1">v1.0.0</p>
      </div>
      <nav className="p-2">
        <NavTree
          nodes={NAV}
          pathname={pathname}
          depth={0}
          expandedNavIds={expandedNavIds}
          toggle={toggleNavItem}
        />
      </nav>
    </aside>
  );
}
