export default function OrgSettingsPage() {
  return (
    <div className="space-y-4">
      <h1 className="text-xl font-semibold">Organización</h1>
      <div className="card space-y-2">
        <p className="text-sm text-slate-700">Nombre de la organización, miembros y roles.</p>
        <ul className="list-disc pl-5 text-sm text-slate-600">
          <li>Roles: owner, admin, member.</li>
          <li>Un usuario puede pertenecer a múltiples organizaciones.</li>
        </ul>
      </div>
    </div>
  );
}
