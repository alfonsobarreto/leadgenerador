"use client";

import Link from "next/link";
import { useState } from "react";
import type { ChangeEvent, FormEvent, JSX } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { MockAgent } from "@/src/lib/mockData";
import { slugifyFromFullName } from "@/src/lib/mockData";

export function AdminDashboard({ agents }: { agents: MockAgent[] }): JSX.Element {
  const [sheetOpen, setSheetOpen] = useState(false);
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [slug, setSlug] = useState("");

  const onNameChange = (e: ChangeEvent<HTMLInputElement>): void => {
    const v = e.target.value;
    setFullName(v);
    setSlug(slugifyFromFullName(v));
  };

  const onSubmit = (e: FormEvent<HTMLFormElement>): void => {
    e.preventDefault();
    const payload = {
      fullName,
      email,
      password,
      whatsapp,
      slug,
    };
    console.log("[admin] crear asesor (mock)", payload);
    setSheetOpen(false);
    setFullName("");
    setEmail("");
    setPassword("");
    setWhatsapp("");
    setSlug("");
  };

  return (
    <div className="min-h-[100dvh] bg-background text-foreground">
      <header className="border-b border-border bg-card/40 backdrop-blur-sm">
        <div className="mx-auto flex max-w-6xl flex-col gap-1 px-4 py-8 sm:flex-row sm:items-end sm:justify-between sm:px-6">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
              LeadGenerator SaaS
            </p>
            <h1 className="font-heading mt-2 text-2xl font-semibold tracking-tight sm:text-3xl">
              Panel de Control — Super Admin
            </h1>
            <p className="mt-2 max-w-xl text-sm text-muted-foreground">
              Gestión multitenant de asesores y rutas públicas (`/[slug]`). Sin autenticación por ahora.
            </p>
          </div>
          <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
            <Button
              type="button"
              size="lg"
              className="mt-4 shrink-0 sm:mt-0"
              onClick={() => setSheetOpen(true)}
            >
              Crear nuevo asesor
            </Button>
            <SheetContent side="right" className="w-full gap-0 overflow-y-auto sm:max-w-md">
              <SheetHeader className="border-b border-border pb-4 text-left">
                <SheetTitle>Nuevo asesor</SheetTitle>
                <SheetDescription>
                  Los datos solo se muestran en consola hasta conectar Supabase.
                </SheetDescription>
              </SheetHeader>
              <form onSubmit={onSubmit} className="flex flex-1 flex-col gap-4 p-4">
                <div className="space-y-2">
                  <Label htmlFor="admin-full-name">Nombre completo</Label>
                  <Input
                    id="admin-full-name"
                    autoComplete="name"
                    value={fullName}
                    onChange={onNameChange}
                    placeholder="Ej. Ana Torres"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="admin-email">Correo electrónico</Label>
                  <Input
                    id="admin-email"
                    type="email"
                    autoComplete="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="ana@empresa.com"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="admin-password">Contraseña</Label>
                  <Input
                    id="admin-password"
                    type="password"
                    autoComplete="new-password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="admin-wa">Número de WhatsApp</Label>
                  <Input
                    id="admin-wa"
                    type="tel"
                    autoComplete="tel"
                    value={whatsapp}
                    onChange={(e) => setWhatsapp(e.target.value)}
                    placeholder="+52 …"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="admin-slug">Identificador de URL (slug)</Label>
                  <Input
                    id="admin-slug"
                    value={slug}
                    onChange={(e) => setSlug(slugifyFromFullName(e.target.value))}
                    placeholder="ana-torres"
                    pattern="[a-z0-9]+(?:-[a-z0-9]+)*"
                    title="Solo minúsculas, números y guiones"
                    required
                  />
                  <p className="text-xs text-muted-foreground">
                    Se genera al escribir el nombre; puedes ajustarlo manualmente.
                  </p>
                </div>
                <SheetFooter className="flex-col gap-2 border-t border-border pt-4 sm:flex-col">
                  <Button type="submit" className="w-full">
                    Guardar (consola)
                  </Button>
                  <SheetClose render={<Button type="button" variant="outline" className="w-full" />}>Cancelar</SheetClose>
                </SheetFooter>
              </form>
            </SheetContent>
          </Sheet>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
        <Card>
          <CardHeader>
            <CardTitle>Asesores activos (mock)</CardTitle>
            <CardDescription>
              Fuente: `src/lib/mockData.ts`. Vista previa de URL pública por slug.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nombre</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>URL / slug</TableHead>
                  <TableHead>WhatsApp</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {agents.map((a) => (
                  <TableRow key={a.slug}>
                    <TableCell className="font-medium">{a.name}</TableCell>
                    <TableCell>{a.email}</TableCell>
                    <TableCell>
                      <Link
                        href={`/${a.slug}`}
                        className="text-primary underline-offset-4 hover:underline"
                      >
                        /{a.slug}
                      </Link>
                    </TableCell>
                    <TableCell className="font-mono text-xs">{a.whatsapp}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
