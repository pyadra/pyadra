# EBOK - Physical Book Publication Node

**Status**: 🚧 In Development (Q3 2026)  
**Exhibition**: Galaxy  
**URL**: `/exhibitions/galaxy/ebook`

---

## 📖 Concept

EBOK allows creators to publish their stories, essays, and reflections as physical books. Content that exists beyond screens, held in your hands, kept on shelves.

**Core Principle**: Digital-to-physical transformation. Your words become permanent objects.

---

## 🎯 User Flow

### 1. Write
- Compose your story (essays, memoir, fiction, poetry)
- Markdown-based editor with preview
- Character count and page estimation
- Draft saving (local browser storage)

### 2. Design
- Choose book size (A5, A6, pocket)
- Select cover style (minimalist, illustrated, photography)
- Upload cover photo (optional)
- Typography preferences (serif, sans-serif)

### 3. Preview
- 3D book preview with your content
- Flip through pages
- See actual layout and formatting
- Download PDF proof

### 4. Order
- Select quantity (1-50 copies)
- Pricing: $20-40 AUD per book (depending on size/pages)
- Shipping options (domestic/international)
- Stripe checkout

### 5. Production
- Professional printing (offset or digital)
- Perfect binding or saddle stitch
- Standard shipping (2-3 weeks)

---

## 💡 Use Cases

1. **Personal Essays**: Publish your thoughts on life, philosophy, experiences
2. **Family Stories**: Record family history for future generations
3. **Poetry Collections**: Small-run poetry books
4. **Gift Books**: Create custom books as gifts
5. **Manifestos**: Share your vision or ideology

---

## 🛠️ Technical Implementation (Planned)

### Frontend
- `/src/app/exhibitions/galaxy/ebook/` (to be created)
- Rich text editor (TipTap or similar)
- PDF generation (using jsPDF or similar)
- 3D book preview (Three.js)

### Backend
- `/src/app/api/ebook/` (to be created)
  - `POST /api/ebook/checkout` - Create order
  - `POST /api/ebook/upload` - Upload manuscript/cover
  - `GET /api/ebook/preview` - Generate PDF preview

### Database
- New table: `ebook_orders`
  ```sql
  id: uuid
  stripe_session_id: text
  customer_name: text
  customer_email: text
  manuscript: text (markdown)
  cover_image_url: text
  book_size: text (a5, a6, pocket)
  quantity: integer
  status: text (pending, printing, shipped, delivered)
  created_at: timestamptz
  shipped_at: timestamptz
  ```

### Email Notifications
- Order confirmation
- Manuscript received
- Printing started
- Book shipped (with tracking)

---

## 📊 Pricing Structure (Draft)

| Size | Pages | Price (AUD) |
|------|-------|-------------|
| A5 (148×210mm) | Up to 100 | $35 |
| A6 (105×148mm) | Up to 80 | $25 |
| Pocket (90×140mm) | Up to 60 | $20 |

**Additional Costs**:
- Extra pages: +$0.10 per page
- Color interior: +$5
- Hardcover: +$15
- Bulk orders (10+): -10% discount

---

## 🎨 Design Philosophy

### Minimalist Aesthetic
- Clean typography
- Generous margins
- High-quality paper stock
- Subtle cover finishes

### Intentionality
- No mass production vibes
- Each book feels handcrafted
- Focus on content, not flashy design

### Permanence
- Archival-quality paper
- Durable binding
- Built to last decades

---

## 🚧 Development Status

### Completed
- [ ] User interface design (Figma mockups)
- [ ] Editor integration
- [ ] PDF generation system
- [ ] 3D preview component
- [ ] Printing partner integration

### In Progress
- [x] Conceptual design (this document)
- [ ] Technical architecture planning

### Not Started
- [ ] Frontend implementation
- [ ] Backend API routes
- [ ] Database schema
- [ ] Stripe integration
- [ ] Email templates

---

## 📅 Timeline

- **Q2 2026**: Design and prototyping
- **Q3 2026**: Development sprint
- **Q4 2026**: Beta testing with early users
- **2027**: Public launch

---

## 🎯 Success Metrics

- **Orders per month**: Target 20-50 books
- **Repeat customers**: 30% of customers order 2+ books
- **Average book length**: 40-60 pages
- **Customer satisfaction**: 4.5/5+ rating

---

## 🔗 Integration with Other Nodes

### Orbit 77
- Supporters receive 15% discount on first EBOK order
- Featured EBOKs from Orbit participants

### EterniCapsule
- Option to turn capsule message into a book after unlocking
- "From digital capsule to physical book" conversion

### Figurines
- Bundle: Figurine + custom book about your story

---

## 📚 References

- **Competitors**: Blurb, Lulu, Newspaper Club
- **Inspiration**: Small-batch publishing, zine culture
- **Printing Partners**: TBD (researching Australian printers)

---

## 📝 Open Questions

1. **Editing Workflow**: Should users be able to revise after ordering?
2. **ISBN**: Do we offer ISBN registration?
3. **Copyright**: How do we handle copyright/licensing?
4. **Distribution**: Do we offer distribution beyond personal orders?
5. **Minimum Order**: Should there be a minimum quantity (e.g., 5 copies)?

---

## 🆘 Contact

For questions about EBOK development:
- Refer to ARCHITECTURE.md for technical context
- Check Figma designs (link TBD)
- See project roadmap in docs/ORBIT_77_IMPROVEMENT_PLAN.md

---

*This document will be updated as EBOK development progresses.*
