# Database Schema

Complete reference for Pyadra's PostgreSQL database (Supabase).

---

## 📊 Schema Overview

**Database**: PostgreSQL 15+ (Supabase)  
**Tables**: 6 core tables  
**Storage**: Supabase Storage buckets for file uploads

```
observers                  # Visitor tracking
├─ orbit_supporters        # Orbit 77 donations
├─ orbit_applications      # Orbit 77 participation requests
├─ ethernicapsule_capsules # Time-locked messages
├─ figurines_orders        # Figurine orders
└─ home_completions        # Home game statistics
```

---

## 📋 Table Definitions

### `observers`
**Purpose**: Track website visitors with unique IDs

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | `serial` | PRIMARY KEY | Auto-increment observer number |
| `created_at` | `timestamptz` | NOT NULL, DEFAULT now() | First visit timestamp |
| `last_seen` | `timestamptz` | DEFAULT now() | Last activity timestamp |

**Indexes**:
- Primary key on `id`

**Usage**: Assigned on first visit to home page  
**Growth**: ~100-500 new observers per day

---

### `orbit_supporters`
**Purpose**: Track Orbit 77 donations and supporter information

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | `uuid` | PRIMARY KEY, DEFAULT uuid_generate_v4() | Unique supporter ID |
| `stripe_session_id` | `text` | UNIQUE | Stripe checkout session |
| `display_name` | `text` | NOT NULL | Public display name |
| `email` | `text` | NOT NULL | Supporter email |
| `amount_aud` | `integer` | NOT NULL | Donation in cents (AUD) |
| `display_publicly` | `boolean` | DEFAULT true | Show in supporters list |
| `message` | `text` | | Optional supporter message |
| `created_at` | `timestamptz` | NOT NULL, DEFAULT now() | Donation timestamp |

**Indexes**:
- Primary key on `id`
- Unique index on `stripe_session_id`
- Index on `created_at` (for sorting)

**Usage**: Created by Stripe webhook after successful donation  
**Growth**: ~10-50 supporters per month

**Example Row**:
```sql
{
  "id": "123e4567-e89b-12d3-a456-426614174000",
  "stripe_session_id": "cs_test_abc123",
  "display_name": "John Doe",
  "email": "john@example.com",
  "amount_aud": 5000,  -- $50 AUD
  "display_publicly": true,
  "message": "Keep creating!",
  "created_at": "2026-05-01 10:30:00+00"
}
```

---

### `orbit_applications`
**Purpose**: Track Orbit 77 participation applications

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | `uuid` | PRIMARY KEY, DEFAULT uuid_generate_v4() | Unique application ID |
| `name` | `text` | NOT NULL | Applicant name |
| `email` | `text` | NOT NULL | Contact email |
| `location` | `text` | | Geographic location |
| `why` | `text` | NOT NULL | Motivation for joining |
| `availability` | `text` | | Schedule preferences |
| `status` | `text` | DEFAULT 'pending' | Application status |
| `created_at` | `timestamptz` | NOT NULL, DEFAULT now() | Submission timestamp |
| `reviewed_at` | `timestamptz` | | Review timestamp |
| `notes` | `text` | | Internal review notes |

**Indexes**:
- Primary key on `id`
- Index on `status` (for filtering)
- Index on `created_at` (for sorting)

**Status Values**:
- `pending` - Awaiting review
- `accepted` - Invited to participate
- `declined` - Not selected
- `contacted` - Follow-up sent

**Usage**: Submitted via `/exhibitions/galaxy/orbit/join`  
**Growth**: ~5-20 applications per month

---

### `ethernicapsule_capsules`
**Purpose**: Store time-locked encrypted messages

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | `uuid` | PRIMARY KEY, DEFAULT uuid_generate_v4() | Unique capsule ID |
| `stripe_session_id` | `text` | UNIQUE | Stripe checkout session |
| `sender_email` | `text` | NOT NULL | Sender's email |
| `recipient_email` | `text` | NOT NULL | Recipient's email |
| `guardian_email` | `text` | | Optional guardian email |
| `capsule_key_hash` | `text` | NOT NULL, UNIQUE | SHA-256 hash of recipient key |
| `sender_key_hash` | `text` | NOT NULL, UNIQUE | SHA-256 hash of sender key |
| `guardian_key_hash` | `text` | UNIQUE | SHA-256 hash of guardian key |
| `message_ciphertext` | `text` | NOT NULL | Encrypted message |
| `unlock_date` | `date` | NOT NULL | Date when capsule unlocks |
| `status` | `text` | DEFAULT 'sealed' | Capsule state |
| `created_at` | `timestamptz` | NOT NULL, DEFAULT now() | Creation timestamp |
| `opened_at` | `timestamptz` | | Recipient opened timestamp |
| `previewed_at` | `timestamptz` | | Sender preview timestamp |
| `guardian_accessed_at` | `timestamptz` | | Guardian access timestamp |

**Indexes**:
- Primary key on `id`
- Unique indexes on all `*_key_hash` columns
- Index on `unlock_date` (for notification scheduling)
- Index on `status` (for queries)

**Status Values**:
- `sealed` - Locked, not previewed
- `previewed` - Sender has viewed message
- `opened` - Recipient has opened capsule
- `guardian_accessed` - Guardian unlocked early

**Security**:
- Keys are **never stored** in plaintext
- Only SHA-256 hashes stored
- Message is **client-side encrypted** before storage
- Row Level Security (RLS) enabled

**Example Row**:
```sql
{
  "id": "789e4567-e89b-12d3-a456-426614174000",
  "stripe_session_id": "cs_test_xyz789",
  "sender_email": "alice@example.com",
  "recipient_email": "bob@example.com",
  "guardian_email": "charlie@example.com",
  "capsule_key_hash": "abc123...def456",
  "sender_key_hash": "ghi789...jkl012",
  "guardian_key_hash": "mno345...pqr678",
  "message_ciphertext": "U2FsdGVkX1...",
  "unlock_date": "2027-12-25",
  "status": "sealed",
  "created_at": "2026-05-01 14:20:00+00",
  "opened_at": null,
  "previewed_at": null,
  "guardian_accessed_at": null
}
```

---

### `figurines_orders`
**Purpose**: Track custom figurine orders

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | `uuid` | PRIMARY KEY, DEFAULT uuid_generate_v4() | Unique order ID |
| `stripe_session_id` | `text` | UNIQUE | Stripe checkout session |
| `customer_name` | `text` | NOT NULL | Customer name |
| `customer_email` | `text` | NOT NULL | Customer email |
| `shipping_address` | `text` | NOT NULL | Full shipping address |
| `front_photo_url` | `text` | NOT NULL | Front-facing selfie URL |
| `left_photo_url` | `text` | NOT NULL | Left profile selfie URL |
| `right_photo_url` | `text` | NOT NULL | Right profile selfie URL |
| `status` | `text` | DEFAULT 'pending' | Order status |
| `created_at` | `timestamptz` | NOT NULL, DEFAULT now() | Order timestamp |
| `shipped_at` | `timestamptz` | | Shipping timestamp |
| `tracking_number` | `text` | | Shipment tracking |
| `notes` | `text` | | Internal notes |

**Indexes**:
- Primary key on `id`
- Index on `status` (for filtering)
- Index on `created_at` (for sorting)

**Status Values**:
- `pending` - Payment received, not started
- `processing` - 3D model generation in progress
- `printing` - Physical printing started
- `shipped` - Order dispatched
- `delivered` - Order arrived
- `cancelled` - Order cancelled

**Storage**:
- Photos stored in Supabase Storage bucket: `figurines-photos`
- Access: Private (RLS enforced)

**Usage**: Created after Stripe checkout completion  
**Growth**: ~5-15 orders per month

---

### `home_completions`
**Purpose**: Track home page game completion statistics

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | `uuid` | PRIMARY KEY, DEFAULT uuid_generate_v4() | Unique completion ID |
| `observer_id` | `integer` | | Observer ID (if available) |
| `time_elapsed` | `numeric` | NOT NULL | Completion time in seconds |
| `pulses_sent` | `integer` | NOT NULL | Number of pulses sent |
| `decode_attempts` | `integer` | NOT NULL | Decoding attempts |
| `created_at` | `timestamptz` | NOT NULL, DEFAULT now() | Completion timestamp |

**Indexes**:
- Primary key on `id`
- Index on `created_at` (for analytics)

**Usage**: Recorded when user completes home page signal decoding game  
**Analytics**: Average completion time, success rate

---

## 🔗 Relationships

### Entity Relationship Diagram

```
┌──────────────┐
│  observers   │
│  (visitors)  │
└──────┬───────┘
       │
       │ 1:1 optional
       │
       ▼
┌──────────────────┐
│ home_completions │
│   (game stats)   │
└──────────────────┘

┌────────────────────┐
│ orbit_supporters   │
│   (donations)      │
└────────────────────┘
       ▲
       │
       │ Stripe webhook
       │
┌────────────────────┐
│ orbit_applications │
│  (join requests)   │
└────────────────────┘

┌──────────────────────────┐
│ ethernicapsule_capsules  │
│   (time-locked msgs)     │
└──────────────────────────┘
       ▲
       │ Stripe webhook
       │

┌──────────────────┐
│ figurines_orders │
│   (3D prints)    │
└──────────────────┘
       ▲
       │ Stripe webhook
       │
```

**Note**: No foreign key constraints between tables (intentional design for loose coupling)

---

## 🔐 Row Level Security (RLS)

### Policy Overview

| Table | Policy | Rule |
|-------|--------|------|
| `observers` | Public read | Anyone can SELECT |
| `orbit_supporters` | Public read (filtered) | Only `display_publicly=true` rows |
| `orbit_applications` | Private | Admin only |
| `ethernicapsule_capsules` | Key-based access | Query by `*_key_hash` only |
| `figurines_orders` | Private | Admin only |
| `home_completions` | Anonymous write | Anyone can INSERT |

### Example Policies

**Orbit Supporters (Public Read)**:
```sql
CREATE POLICY "Public supporters visible"
ON orbit_supporters
FOR SELECT
USING (display_publicly = true);
```

**EterniCapsule (Key-Based Access)**:
```sql
CREATE POLICY "Capsule key access"
ON ethernicapsule_capsules
FOR SELECT
USING (
  auth.jwt() ->> 'capsule_key_hash' = capsule_key_hash
  OR auth.jwt() ->> 'sender_key_hash' = sender_key_hash
);
```

---

## 📦 Storage Buckets

### Figurines Photos
**Bucket**: `figurines-photos`  
**Access**: Private (RLS)  
**Structure**:
```
figurines-photos/
└── {order_id}/
    ├── front.jpg
    ├── left.jpg
    └── right.jpg
```

**Retention**: Permanent (needed for reprints)

---

## 🗄️ Migrations

**Location**: `/supabase/migrations/`

**Migration History**:
1. `20240330_create_observers.sql` - Initial observer tracking
2. `20240401_create_orbit_tables.sql` - Orbit 77 donations & applications
3. `20240415_create_eternicapsule.sql` - Time-locked capsules
4. `20240420_create_figurines.sql` - Figurine orders
5. `20240425_add_home_completions.sql` - Game stats
6. `20240501_add_guardian_access.sql` - Guardian email feature
7. `20240505_add_figurines_tracking.sql` - Shipment tracking

**Running Migrations**:
```bash
# Local development
supabase db reset

# Production
supabase db push
```

---

## 📈 Performance Considerations

### Indexes
- All primary keys are indexed (automatic)
- Foreign key columns indexed where applicable
- Timestamp columns indexed for sorting/filtering
- Status columns indexed for query performance

### Query Optimization
- Use `.select('specific, columns')` instead of `.select('*')`
- Add `.limit()` to paginated queries
- Use `.single()` when expecting one row

### Scaling
- Current schema supports 100K+ rows per table
- Consider partitioning for tables exceeding 1M rows
- Monitor query performance with Supabase dashboard

---

## 🔄 Backup & Recovery

**Automated Backups**: Daily (Supabase Pro)  
**Retention**: 30 days  
**Point-in-Time Recovery**: Available up to 7 days

**Manual Backup**:
```bash
supabase db dump -f backup.sql
```

**Restore**:
```bash
psql -h your-db.supabase.co -U postgres -f backup.sql
```

---

## 📚 Related Documentation

- **API Reference** (`/docs/API_REFERENCE.md`) - How APIs interact with database
- **Environment Variables** (`/docs/ENVIRONMENT_VARIABLES.md`) - Database connection config
- **Architecture** (`/ARCHITECTURE.md`) - System design overview
