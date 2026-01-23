import { Navbar } from "./components/navbar";
import { Button } from "./components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./components/ui/card";
import { useRoute } from "./lib/router";
import { navigate } from "./lib/router";
import { getToken } from "./lib/auth";
import { getJsonAuth } from "./lib/api";
import { LoginPage } from "./pages/LoginPage";
import { AppHomePage } from "./pages/AppHomePage";
import { CreateSpacePage } from "./pages/CreateSpacePage";
import { SignupPage } from "./pages/SignupPage";
import { useEffect, useState } from "react";
import Space from "./pages/Space";

type SpacePreview = {
  id: string;
  language: string;
};

type ListSpacesResponse = {
  spaces: SpacePreview[];
};

export function App() {
  const route = useRoute();
  const isLoggedIn = Boolean(getToken());

  const [recentSpaces, setRecentSpaces] = useState<SpacePreview[]>([]);
  const [spacesLoading, setSpacesLoading] = useState(false);

  // If you’re already logged in, keep auth pages out of the way.
  if (isLoggedIn && (route === "/login" || route === "/signup")) {
    navigate("/create-space", { replace: true });
  }

  useEffect(() => {
    const token = getToken();
    if (!token) {
      setRecentSpaces([]);
      return;
    }

    // Only fetch when we’re on the landing page; keep other routes snappy.
    if (route !== "/") return;

    let cancelled = false;
    setSpacesLoading(true);

    void (async () => {
      try {
        const res = await getJsonAuth<ListSpacesResponse>("/space", token);
        if (cancelled) return;
        const list = Array.isArray(res.spaces) ? res.spaces : [];
        setRecentSpaces(list.slice(0, 5));
      } catch {
        if (cancelled) return;
        setRecentSpaces([]);
      } finally {
        if (cancelled) return;
        setSpacesLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [route, isLoggedIn]);

  return (
    <div className="min-h-screen w-full overflow-x-hidden flex flex-col overflow-y-hidden p-0 m-0">
      <Navbar />

      {route === "/login" ? (
        <LoginPage />
      ) : route === "/signup" ? (
        <SignupPage />
      ) : route === "/app" ? (
        <AppHomePage />
      ) : route === "/create-space" ? (
        <CreateSpacePage />
      ) : route === "/space" || route.startsWith("/space/") ? (
        <Space />
      ) : (

        <>

          {/* Background */}
          <div className="relative overflow-hidden">
            <div className="pointer-events-none absolute inset-0 -z-10">
              {/* soft futuristic glows */}
              <div className="absolute -top-40 left-1/2 h-[520px] w-[520px] -translate-x-1/2 rounded-full bg-[radial-gradient(circle_at_center,rgba(99,102,241,0.28),transparent_60%)] blur-2xl" />
              <div className="absolute -top-24 right-[-120px] h-[420px] w-[420px] rounded-full bg-[radial-gradient(circle_at_center,rgba(34,211,238,0.22),transparent_60%)] blur-2xl" />
              <div className="absolute bottom-[-220px] left-[-140px] h-[520px] w-[520px] rounded-full bg-[radial-gradient(circle_at_center,rgba(168,85,247,0.18),transparent_60%)] blur-2xl" />

              {/* subtle grid */}
              <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[size:56px_56px] opacity-[0.12]" />
            </div>

            <main className="mx-auto w-full max-w-7xl px-4 pb-16 pt-10">
              {/* Hero */}
              <section className="grid gap-8 md:grid-cols-2 md:items-center">
                <div className="space-y-5">
                  <div className="inline-flex items-center gap-2 rounded-full border bg-card/40 px-3 py-1 text-xs text-muted-foreground shadow-sm backdrop-blur">
                    <span className="h-2 w-2 rounded-full bg-[oklch(var(--primary))]" />
                    Real-time spaces • Roles • Snapshots
                  </div>

                  <h1 className="text-balance text-4xl font-semibold tracking-tight md:text-5xl">
                    A calm, futuristic workspace for collaborative coding.
                  </h1>

                  <p className="text-pretty text-muted-foreground md:text-lg">
                    CodePilot helps teams create code spaces, collaborate safely with roles, and keep history with snapshots and
                    operations.
                  </p>

                  <div className="flex flex-wrap gap-3">
                    {isLoggedIn ? (
                      <>
                        <Button size="lg" onClick={() => navigate("/app")}>Open your workspace</Button>
                        <Button size="lg" variant="outline" onClick={() => navigate("/create-space")}>Spaces</Button>
                      </>
                    ) : (
                      <>
                        <Button size="lg" onClick={() => navigate("/signup")}>Start free</Button>
                        <Button size="lg" variant="outline" onClick={() => navigate("/login")}>Log in</Button>
                      </>
                    )}
                  </div>

                  <div className="flex flex-wrap gap-4 text-xs text-muted-foreground">
                    <div className="rounded-md border bg-card/30 px-3 py-2 backdrop-blur">
                      <div className="font-medium text-foreground">Role-based access</div>
                      <div>Owner • Editor • Viewer</div>
                    </div>
                    <div className="rounded-md border bg-card/30 px-3 py-2 backdrop-blur">
                      <div className="font-medium text-foreground">Fast APIs</div>
                      <div>Built with Bun + Prisma</div>
                    </div>
                  </div>
                </div>

                {/* Mock panel */}
                <div className="relative">
                  <div className="rounded-2xl border bg-card/30 p-4 shadow-sm backdrop-blur">
                    {isLoggedIn ? (
                      <>
                        <div className="flex items-center justify-between">
                          <div className="text-sm font-medium">Your workspace</div>
                          <div className="text-xs text-muted-foreground">quick access</div>
                        </div>

                        <div className="mt-3 space-y-2">
                          <div className="text-xs text-muted-foreground">Recent spaces</div>
                          {spacesLoading ? (
                            <div className="text-xs text-muted-foreground">Loading…</div>
                          ) : recentSpaces.length === 0 ? (
                            <div className="text-xs text-muted-foreground">No spaces yet. Create one to get started.</div>
                          ) : (
                            <div className="space-y-2">
                              {recentSpaces.map((s) => (
                                <div key={s.id} className="flex items-center justify-between rounded-md border bg-background/40 px-3 py-2">
                                  <div>
                                    <div className="text-xs font-medium text-foreground">{s.language}</div>
                                    <div className="text-[10px] text-muted-foreground">{s.id}</div>
                                  </div>
                                  <Button size="sm" variant="secondary" onClick={() => navigate("/create-space")}>Open</Button>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>

                        <div className="mt-4 grid grid-cols-2 gap-2">
                          <Button variant="outline" onClick={() => navigate("/app")}>Go to App</Button>
                          <Button onClick={() => navigate("/create-space")}>Manage spaces</Button>
                        </div>
                      </>
                    ) : (
                      <>
                        <div className="flex items-center justify-between">
                          <div className="text-sm font-medium">Space: typescript</div>
                          <div className="text-xs text-muted-foreground">v12 • synced</div>
                        </div>
                        <div className="mt-3 rounded-xl border bg-background/40 p-4 font-mono text-xs text-muted-foreground">
                          <div className="flex gap-2">
                            <span className="text-muted-foreground">1</span>
                            <span className="text-foreground">function</span>
                            <span className="text-foreground">hello</span>() {"{"}
                          </div>
                          <div className="flex gap-2">
                            <span className="text-muted-foreground">2</span>
                            <span className="text-muted-foreground">  return</span> "Hello from CodePilot";
                          </div>
                          <div className="flex gap-2">
                            <span className="text-muted-foreground">3</span>
                            <span className="text-muted-foreground">{"}"}{"}"}</span>
                          </div>
                        </div>
                        <div className="mt-4 grid grid-cols-3 gap-2 text-xs">
                          <div className="rounded-lg border bg-card/30 p-3">
                            <div className="font-medium">Members</div>
                            <div className="text-muted-foreground">3 active</div>
                          </div>
                          <div className="rounded-lg border bg-card/30 p-3">
                            <div className="font-medium">Snapshots</div>
                            <div className="text-muted-foreground">Auto-saved</div>
                          </div>
                          <div className="rounded-lg border bg-card/30 p-3">
                            <div className="font-medium">Roles</div>
                            <div className="text-muted-foreground">Protected</div>
                          </div>
                        </div>
                      </>
                    )}
                  </div>

                  <div className="pointer-events-none absolute -inset-1 -z-10 rounded-2xl bg-[conic-gradient(from_180deg_at_50%_50%,rgba(34,211,238,0.25),rgba(99,102,241,0.25),rgba(168,85,247,0.25),rgba(34,211,238,0.25))] blur-xl" />
                </div>
              </section>

              {/* Features (bento) */}
              <section className="mt-14 grid gap-4 md:grid-cols-12">
                <Card className="md:col-span-7 bg-card/30 backdrop-blur">
                  <CardHeader>
                    <CardTitle>Spaces that feel instant</CardTitle>
                    <CardDescription>
                      Create a CodeSpace per language. Add members, assign roles, and keep collaboration smooth.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid gap-3 sm:grid-cols-2">
                      <div className="rounded-lg border bg-background/40 p-3">
                        <div className="text-sm font-medium">Invite members</div>
                        <div className="text-xs text-muted-foreground">Add users to a space in one action</div>
                      </div>
                      <div className="rounded-lg border bg-background/40 p-3">
                        <div className="text-sm font-medium">Control access</div>
                        <div className="text-xs text-muted-foreground">Owner / Editor / Viewer permissions</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="md:col-span-5 bg-card/30 backdrop-blur">
                  <CardHeader>
                    <CardTitle>Snapshots + operations</CardTitle>
                    <CardDescription>Track changes over time. Recover fast. Stay confident.</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2 text-xs text-muted-foreground">
                      <div className="flex items-center justify-between rounded-md border bg-background/40 px-3 py-2">
                        <span>INSERT @ 12:04</span>
                        <span className="text-foreground">v12</span>
                      </div>
                      <div className="flex items-center justify-between rounded-md border bg-background/40 px-3 py-2">
                        <span>REPLACE @ 12:03</span>
                        <span className="text-foreground">v11</span>
                      </div>
                      <div className="flex items-center justify-between rounded-md border bg-background/40 px-3 py-2">
                        <span>SNAPSHOT @ 12:00</span>
                        <span className="text-foreground">v10</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="md:col-span-5 bg-card/30 backdrop-blur">
                  <CardHeader>
                    <CardTitle>Built for dev speed</CardTitle>
                    <CardDescription>Bun + TypeScript + Prisma. Simple, fast, and predictable.</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 gap-2">
                      <div className="rounded-lg border bg-background/40 p-3 text-xs">
                        <div className="font-medium">API</div>
                        <div className="text-muted-foreground">Express routes</div>
                      </div>
                      <div className="rounded-lg border bg-background/40 p-3 text-xs">
                        <div className="font-medium">DB</div>
                        <div className="text-muted-foreground">Postgres + Prisma</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Removed: repeated CTA section (the hero already has the primary actions). */}
              </section>

              {/* How it works */}
              <section className="mt-14">
                <div className="mb-4 flex items-end justify-between gap-4">
                  <div>
                    <h2 className="text-xl font-semibold tracking-tight">How it works</h2>
                    <p className="text-sm text-muted-foreground">A simple loop: create → collaborate → iterate.</p>
                  </div>
                </div>

                <div className="grid gap-4 md:grid-cols-3">
                  <Card className="bg-card/30 backdrop-blur">
                    <CardHeader>
                      <CardTitle className="text-base">1) Create a Space</CardTitle>
                      <CardDescription>Pick a language and get a dedicated workspace.</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="text-xs text-muted-foreground">Spaces are designed to stay lightweight and fast.</div>
                    </CardContent>
                  </Card>

                  <Card className="bg-card/30 backdrop-blur">
                    <CardHeader>
                      <CardTitle className="text-base">2) Add people</CardTitle>
                      <CardDescription>Invite members and manage roles securely.</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="text-xs text-muted-foreground">OWNER / EDITOR / VIEWER roles keep control clear.</div>
                    </CardContent>
                  </Card>

                  <Card className="bg-card/30 backdrop-blur">
                    <CardHeader>
                      <CardTitle className="text-base">3) Track changes</CardTitle>
                      <CardDescription>Snapshots + operations give you confidence to move fast.</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="text-xs text-muted-foreground">Recover quickly and avoid “oops” moments.</div>
                    </CardContent>
                  </Card>
                </div>
              </section>

              {/* Security / collaboration */}
              <section className="mt-14">
                <Card className="bg-card/30 backdrop-blur">
                  <CardHeader>
                    <CardTitle>Collaboration, without the chaos</CardTitle>
                    <CardDescription>
                      Clear roles, friend connections, and spaces separation keep teams organized.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid gap-3 sm:grid-cols-2">
                      <div className="rounded-lg border bg-background/40 p-3">
                        <div className="text-sm font-medium">Least-privilege by default</div>
                        <div className="text-xs text-muted-foreground">Give the right access to the right people.</div>
                      </div>
                      <div className="rounded-lg border bg-background/40 p-3">
                        <div className="text-sm font-medium">Your work stays structured</div>
                        <div className="text-xs text-muted-foreground">Spaces + friends make it easy to organize.</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </section>

              {/* Pricing */}
              <section className="mt-14">
                <div className="mb-4">
                  <h2 className="text-xl font-semibold tracking-tight">Pricing</h2>
                  <p className="text-sm text-muted-foreground">Start free, upgrade when your team grows.</p>
                </div>

                <div className="grid gap-4 md:grid-cols-3">
                  <Card className="bg-card/30 backdrop-blur">
                    <CardHeader>
                      <CardTitle className="text-base">Free</CardTitle>
                      <CardDescription>For trying CodePilot</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="text-2xl font-semibold">$0</div>
                      <ul className="space-y-1 text-sm text-muted-foreground">
                        <li>• Personal spaces</li>
                        <li>• Basic collaboration</li>
                        <li>• Community support</li>
                      </ul>
                      <Button className="w-full" onClick={() => navigate("/signup")}>Start free</Button>
                    </CardContent>
                  </Card>

                  <Card className="bg-card/30 backdrop-blur">
                    <CardHeader>
                      <CardTitle className="text-base">Pro</CardTitle>
                      <CardDescription>For serious builders</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div>
                        <span className="text-2xl font-semibold">$12</span>
                        <span className="text-sm text-muted-foreground"> / user / month</span>
                      </div>
                      <ul className="space-y-1 text-sm text-muted-foreground">
                        <li>• Faster workflows</li>
                        <li>• More spaces</li>
                        <li>• Priority support</li>
                      </ul>
                      <Button className="w-full" variant="secondary" onClick={() => navigate("/signup")}>Choose Pro</Button>
                    </CardContent>
                  </Card>

                  <Card className="bg-card/30 backdrop-blur">
                    <CardHeader>
                      <CardTitle className="text-base">Team</CardTitle>
                      <CardDescription>For teams & orgs</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="text-2xl font-semibold">Custom</div>
                      <ul className="space-y-1 text-sm text-muted-foreground">
                        <li>• Centralized management</li>
                        <li>• Advanced permissions</li>
                        <li>• Dedicated onboarding</li>
                      </ul>
                      <Button className="w-full" variant="outline" onClick={() => navigate("/signup")}>Contact sales</Button>
                    </CardContent>
                  </Card>
                </div>
              </section>

              {/* Final CTA */}
              <section className="mt-14">
                <Card className="bg-card/30 backdrop-blur">
                  <CardHeader>
                    <CardTitle>Ready to build in your first Space?</CardTitle>
                    <CardDescription>Create an account and start collaborating in minutes.</CardDescription>
                  </CardHeader>
                  <CardContent className="flex flex-wrap gap-3">
                    <Button size="lg" onClick={() => navigate("/signup")}>Start free</Button>
                    <Button size="lg" variant="outline" onClick={() => navigate("/login")}>Log in</Button>
                  </CardContent>
                </Card>
              </section>

              {/* Removed: footer to keep the landing page clean and avoid extra visual noise at the bottom. */}
            </main>
          </div>

        </>
      )}
    </div>
  );
}

export default App;
