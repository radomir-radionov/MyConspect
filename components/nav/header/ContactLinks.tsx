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
          className="inline-flex size-9 items-center justify-center rounded-md text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-zinc-100"
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
    case "github":
      return (
        <svg aria-hidden="true" viewBox="0 0 24 24" className="size-5">
          <path
            fill="currentColor"
            d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.435 1.845 1.23 1.065 1.86 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.52.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.545 3.3-1.23 3.3-1.23.66 1.66.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12Z"
          />
        </svg>
      );
    default: {
      const _exhaustive: never = id;
      return _exhaustive;
    }
  }
}
