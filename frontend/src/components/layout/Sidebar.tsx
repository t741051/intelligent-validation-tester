"use client";
import { ChevronDown, ChevronRight } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { cn } from "@/lib/cn";
import { useUiStore } from "@/stores/uiStore";

type NavLeaf = { kind: "leaf"; id: string; href: string; label: string };
type NavBranch = {
  kind: "branch";
  id: string;
  label: string;
  icon?: string;
  children: NavNode[];
};
type NavNode = NavLeaf | NavBranch;

const NAV: NavNode[] = [
  { kind: "leaf", id: "overview", href: "/overview", label: "📊 總覽" },
  {
    kind: "branch",
    id: "interface-validation",
    label: "連接介面驗證",
    icon: "🔌",
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
    icon: "📁",
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
    icon: "🧠",
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
  { kind: "leaf", id: "test-scenarios", href: "/test-scenarios", label: "🎯 端對端測試情境" },
  {
    kind: "branch",
    id: "site-management",
    label: "場域管理",
    icon: "🌍",
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
    <div className={cn("space-y-0.5", depth > 0 && "border-l border-gray-100 pl-2 mt-0.5", indent)}>
      {nodes.map((node) => {
        if (node.kind === "leaf") {
          const active = pathname === node.href || pathname.startsWith(node.href + "/");
          return (
            <Link
              key={node.id}
              href={node.href}
              className={cn(
                "block px-3 py-1.5 rounded-md text-sm transition-colors",
                active
                  ? "bg-blue-50 text-blue-700 font-medium"
                  : "text-gray-600 hover:bg-gray-50",
              )}
            >
              {node.label}
            </Link>
          );
        }
        const branchActive = hasActiveDescendant(node, pathname);
        const expanded = expandedNavIds.includes(node.id) || branchActive;
        return (
          <div key={node.id}>
            <button
              type="button"
              onClick={() => toggle(node.id)}
              className={cn(
                "w-full flex items-center gap-2 px-3 py-2 rounded-md text-sm transition-colors",
                branchActive ? "text-blue-700 font-medium" : "text-gray-700 hover:bg-gray-50",
              )}
            >
              {node.icon && <span>{node.icon}</span>}
              <span className="flex-1 text-left">{node.label}</span>
              {expanded
                ? <ChevronDown className="w-4 h-4 text-gray-400" />
                : <ChevronRight className="w-4 h-4 text-gray-400" />}
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
    <aside className={cn("border-r bg-white w-64 flex-shrink-0 overflow-y-auto", className)}>
      <div className="p-4 border-b">
        <p className="text-lg font-semibold">智慧驗證 tester</p>
        <p className="text-xs text-gray-400 mt-1">v1.0.0</p>
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
