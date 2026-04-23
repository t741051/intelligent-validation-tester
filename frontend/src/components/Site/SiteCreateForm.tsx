"use client";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useCreateSite } from "@/hooks/Site/useSites";
import type { Region } from "@/types/common";
import type { Environment } from "@/types/site";

export function SiteCreateForm({ region }: { region: Region }) {
  const createSite = useCreateSite();
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [environment, setEnvironment] = useState<Environment>("indoor");
  const [open, setOpen] = useState(false);

  if (!open) {
    return (
      <Button variant="outline" size="sm" onClick={() => setOpen(true)}>
        + 新增場域
      </Button>
    );
  }

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    await createSite.mutateAsync({
      name: name.trim(),
      region,
      environment,
      address: address.trim(),
      location: null,
      floor_plan_url: "",
    });
    setName("");
    setAddress("");
    setEnvironment("indoor");
    setOpen(false);
  };

  return (
    <form onSubmit={submit} className="flex flex-wrap items-center gap-2">
      <Input
        className="w-48"
        placeholder="場域名稱"
        value={name}
        onChange={(e) => setName(e.target.value)}
        required
      />
      <Input
        className="w-64"
        placeholder="地址(選填)"
        value={address}
        onChange={(e) => setAddress(e.target.value)}
      />
      <select
        className="h-9 rounded-md border border-gray-300 bg-white px-2 text-sm"
        value={environment}
        onChange={(e) => setEnvironment(e.target.value as Environment)}
      >
        <option value="indoor">室內</option>
        <option value="outdoor">室外</option>
      </select>
      <Button type="submit" size="sm" disabled={createSite.isPending}>
        {createSite.isPending ? "建立中…" : "建立"}
      </Button>
      <Button type="button" size="sm" variant="ghost" onClick={() => setOpen(false)}>
        取消
      </Button>
    </form>
  );
}
