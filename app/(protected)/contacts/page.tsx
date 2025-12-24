import Link from "next/link";
import { SimpleTable } from "@/components/Table";

const contacts = [
  { id: "1", name: "Juan", email: "juan@example.com", phone: "+569111", status: "New" },
  { id: "2", name: "Ana", email: "ana@example.com", phone: "+569222", status: "Qualified" },
];

export default function ContactsPage() {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold">Contacts</h1>
          <p className="text-sm text-slate-600">Filtra por tags, status y etapa.</p>
        </div>
        <button className="btn">Nuevo contacto</button>
      </div>
      <SimpleTable
        columns={[
          { key: "name", label: "Nombre" },
          { key: "email", label: "Email" },
          { key: "phone", label: "Phone" },
          { key: "status", label: "Status" },
        ]}
        data={contacts.map((c) => ({ ...c, id: c.id }))}
      />
      <div className="text-sm text-slate-600">
        {contacts.map((c) => (
          <div key={c.id} className="mt-1">
            <Link className="text-indigo-600 underline" href={`/app/contacts/${c.id}`}>
              Ver {c.name}
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}
