import { SITE_CONTACTS, type SiteContactId } from "@/lib/site";

export function ContactLinks() {
  return (
    <nav aria-label="Contact" className="flex items-center gap-1">
      {SITE_CONTACTS.map((contact) => (
        <a
          key={contact.id}
          href={contact.href}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={contact.label}
          title={contact.label}
          className="inline-flex size-9 items-center justify-center rounded-md text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900"
        >
          <ContactIcon id={contact.id} />
        </a>
      ))}
    </nav>
  );
}

function ContactIcon({ id }: { readonly id: SiteContactId }) {
  switch (id) {
    case "telegram":
      return (
        <svg aria-hidden="true" viewBox="0 0 24 24" className="size-5">
          <path
            fill="currentColor"
            d="M21.5 3.4 18.2 20c-.25 1.1-.9 1.37-1.82.85l-5.05-3.72-2.44 2.35c-.27.27-.5.5-1.03.5l.37-5.2 9.47-8.55c.41-.37-.09-.57-.64-.2l-11.7 7.37-5.04-1.58c-1.1-.34-1.12-1.1.24-1.63L20.1 2.2c.91-.34 1.7.2 1.4 1.2Z"
          />
        </svg>
      );
    case "linkedin":
      return (
        <svg aria-hidden="true" viewBox="0 0 24 24" className="size-5">
          <path
            fill="currentColor"
            d="M20.45 20.45h-3.55v-5.57c0-1.33-.02-3.04-1.85-3.04-1.86 0-2.14 1.45-2.14 2.94v5.67H9.35V9h3.28v1.56h.05c.46-.86 1.57-1.77 3.24-1.77 3.46 0 4.1 2.28 4.1 5.24v6.42ZM5.34 7.43a2.06 2.06 0 1 1 0-4.12 2.06 2.06 0 0 1 0 4.12ZM7.12 20.45H3.55V9h3.57v11.45ZM22.23 0H1.77C.79 0 0 .77 0 1.73v20.54C0 23.23.79 24 1.77 24h20.45C23.2 24 24 23.23 24 22.27V1.73C24 .77 23.2 0 22.23 0Z"
          />
        </svg>
      );
    default: {
      const _exhaustive: never = id;
      return _exhaustive;
    }
  }
}
