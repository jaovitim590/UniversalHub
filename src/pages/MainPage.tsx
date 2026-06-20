export function MainPage() {
    return (
        <main className="relative flex min-h-[calc(100vh-64px)] items-center justify-center overflow-hidden bg-background px-6">

            <div className="absolute left-20 top-20 h-72 w-72 rounded-full bg-primary/20 blur-3xl" />
            <div className="absolute bottom-10 right-20 h-80 w-80 rounded-full bg-accent/20 blur-3xl" />

            <section className="relative z-10 w-full max-w-4xl rounded-3xl border border-white/10 bg-card/80 p-12 shadow-2xl backdrop-blur-xl">
                <div className="text-center">
                    <p className="mb-3 text-sm uppercase tracking-[0.25em] text-muted-foreground">
                        Desktop Platform
                    </p>

                    <h1 className="mb-5 bg-linear-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-6xl font-black text-transparent">
                        Universal Hub
                    </h1>

                    <p className="mx-auto mb-10 max-w-2xl text-lg leading-relaxed text-muted-foreground">
                        Centralize ferramentas, recursos e utilidades em um único lugar,
                        com uma experiência rápida, moderna e organizada.
                    </p>

                    <div className="mx-auto flex w-fit items-center gap-3 rounded-2xl border border-white/10 bg-background/50 px-6 py-3 shadow-lg">
                        <div className="h-3 w-3 animate-pulse rounded-full bg-green-400" />
                        <span className="text-sm font-medium text-foreground">
                            Version 0.1 Alpha
                        </span>
                    </div>
                </div>
            </section>
        </main>
    );
}