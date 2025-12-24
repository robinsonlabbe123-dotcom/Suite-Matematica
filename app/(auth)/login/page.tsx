export default function LoginPage() {
  return (
    <div className="mx-auto max-w-md space-y-4">
      <h1 className="text-2xl font-semibold">Login</h1>
      <p className="text-sm text-slate-600">Autenticación vía Supabase Auth (email/password o magic link).</p>
      <form className="space-y-3">
        <input className="w-full rounded-md border border-slate-300 p-2" placeholder="Email" />
        <input className="w-full rounded-md border border-slate-300 p-2" type="password" placeholder="Password" />
        <button className="btn w-full" type="button">
          Sign in
        </button>
      </form>
    </div>
  );
}
