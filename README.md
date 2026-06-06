# 🎫 Support CRM — Customer Support Ticket System

A production-ready Customer Support CRM built for managing support tickets, tracking issues, and delivering exceptional customer service. Built as part of the Datastraw Technologies internship assessment.

![Next.js](https://img.shields.io/badge/Next.js-15-black?logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?logo=typescript)
![Supabase](https://img.shields.io/badge/Supabase-PostgreSQL-green?logo=supabase)
![Tailwind](https://img.shields.io/badge/Tailwind_CSS-4-38bdf8?logo=tailwindcss)

---

## ✨ Features

- **Create Tickets** — Submit support tickets with customer details, subject, description, and priority level
- **List & Browse** — View all tickets in a clean card layout, sorted by newest first
- **Real-time Search** — Debounced 300ms search across customer name, email, subject, description, and ticket ID
- **Status Filtering** — Filter by All / Open / In Progress / Closed — combinable with search
- **Ticket Details** — Full detail page with description, status update, and notes timeline
- **Notes System** — Add chronological notes to tickets; auto-refreshes after adding
- **Dashboard Stats** — Live counts of Total, Open, In Progress, and Closed tickets
- **Priority Badges** — Color-coded priority indicators (Low=blue, Medium=yellow, High=red)
- **Copy Ticket ID** — One-click clipboard copy for ticket IDs
- **Toast Notifications** — Success/error feedback via Sonner toast library
- **URL-based Filters** — Search and status filters sync with URL params for sharing/bookmarking
- **Empty States** — Helpful illustrations when no tickets exist or search returns no results
- **Loading Skeletons** — Graceful skeleton loading states across all pages
- **Responsive Design** — Fully responsive layout with sidebar navigation

---

## 🛠 Tech Stack

| Layer        | Technology                | Reasoning                                       |
| ------------ | ------------------------- | ----------------------------------------------- |
| **Frontend** | Next.js 15 (App Router)   | Server-side rendering, file-based routing, SEO   |
| **Styling**  | Tailwind CSS + shadcn/ui  | Utility-first CSS + accessible component library |
| **Backend**  | Next.js API Routes        | Serverless API endpoints colocated with frontend |
| **Database** | Supabase (PostgreSQL)     | Managed Postgres with instant REST API           |
| **Language** | TypeScript                | Type safety across the full stack                |
| **Deploy**   | Vercel                    | Zero-config deployment for Next.js               |

---

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ and npm
- A [Supabase](https://supabase.com) project (free tier is sufficient)

### 1. Clone the repository

```bash
git clone https://github.com/your-username/support-crm.git
cd support-crm
```

### 2. Install dependencies

```bash
npm install
```

### 3. Set up environment variables

```bash
cp .env.local.example .env.local
```

Edit `.env.local` with your Supabase credentials:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
```

> You can find these in your Supabase dashboard under **Settings → API**.

### 4. Set up the database

Run the following SQL in your Supabase **SQL Editor**:

```sql
-- TICKETS TABLE
create table tickets (
  id uuid default gen_random_uuid() primary key,
  ticket_id text unique not null,
  customer_name text not null,
  customer_email text not null,
  subject text not null,
  description text not null,
  status text not null default 'Open' check (status in ('Open', 'In Progress', 'Closed')),
  priority text not null default 'Medium' check (priority in ('Low', 'Medium', 'High')),
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- NOTES TABLE
create table notes (
  id uuid default gen_random_uuid() primary key,
  ticket_id text references tickets(ticket_id) on delete cascade,
  note_text text not null,
  created_at timestamptz default now()
);

-- Auto-increment ticket_id trigger
create sequence ticket_seq start 1;
create or replace function generate_ticket_id()
returns trigger as $$
begin
  new.ticket_id := 'TKT-' || lpad(nextval('ticket_seq')::text, 3, '0');
  return new;
end;
$$ language plpgsql;

create trigger set_ticket_id
before insert on tickets
for each row execute function generate_ticket_id();

-- Updated_at trigger
create or replace function update_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger tickets_updated_at
before update on tickets
for each row execute function update_updated_at();
```

### 5. Run the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 📡 API Endpoints

### `POST /api/tickets` — Create a ticket

**Request body:**

```json
{
  "customer_name": "John Doe",
  "customer_email": "john@example.com",
  "subject": "Login issue",
  "description": "Cannot log in to the dashboard...",
  "priority": "High"
}
```

**Response:** `201 Created` — Returns the created ticket object with auto-generated `ticket_id`.

---

### `GET /api/tickets` — List tickets

**Query parameters (optional):**

| Param    | Type   | Description                                    |
| -------- | ------ | ---------------------------------------------- |
| `search` | string | Free-text search across name, email, subject   |
| `status` | string | Filter by status: `Open`, `In Progress`, `Closed` |

**Example:** `GET /api/tickets?search=login&status=Open`

**Response:** `200 OK` — Array of ticket objects sorted by `created_at DESC`.

---

### `GET /api/tickets/[ticketId]` — Get a ticket

**Response:** `200 OK` — Ticket object with nested `notes` array.

---

### `PUT /api/tickets/[ticketId]` — Update a ticket

**Request body (all fields optional):**

```json
{
  "status": "In Progress",
  "priority": "High",
  "note_text": "Escalated to engineering team"
}
```

**Response:** `200 OK` — Updated ticket object with notes.

---

## 🌐 Deployment (Vercel)

1. Push your code to GitHub
2. Go to [vercel.com](https://vercel.com) and import your repository
3. Add environment variables in Vercel's dashboard:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
4. Click **Deploy** — done!

---

## 📁 Project Structure

```
support-crm/
├── app/
│   ├── layout.tsx              # Root layout with sidebar + Toaster
│   ├── page.tsx                # Dashboard — ticket list + search + filter + stats
│   ├── tickets/
│   │   ├── new/page.tsx        # Create ticket form
│   │   └── [ticketId]/page.tsx # Ticket detail + update + notes
│   └── api/
│       └── tickets/
│           ├── route.ts        # GET all, POST create
│           └── [ticketId]/
│               └── route.ts    # GET one, PUT update
├── components/
│   ├── CreateTicketForm.tsx    # New ticket form with validation
│   ├── DashboardStats.tsx      # Stats cards (Total/Open/InProgress/Closed)
│   ├── NotesSection.tsx        # Notes timeline + add note form
│   ├── SearchBar.tsx           # Debounced search with URL sync
│   ├── StatusFilter.tsx        # Tab-style status filter
│   ├── TicketCard.tsx          # Individual ticket card
│   ├── TicketDetail.tsx        # Full ticket detail view
│   ├── TicketList.tsx          # Ticket list with loading/empty states
│   └── ui/                    # shadcn/ui components
├── lib/
│   ├── supabase.ts            # Supabase client
│   └── utils.ts               # Helpers (cn, formatDate, color utils)
├── types/
│   └── index.ts               # TypeScript interfaces
├── .env.local.example
└── README.md
```

---

## 📝 License

Built by **Aayush** for the Datastraw Technologies internship assessment.
