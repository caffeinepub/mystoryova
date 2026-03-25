# Mystoryova — Complete Rebuild

## Current State
Previous version existed with 8 pages, 3D book hero, glassmorphism cards, dark/light toggle, AI chatbot, wishlist, and basic admin dashboard. Full rebuild requested for long-term scalability and persistent backend.

## Requested Changes (Diff)

### Add
- Full Motoko backend with persistent storage for books, blog posts, newsletter subscribers, contact messages, reviews, and analytics events
- Authorization-based admin login (role-based: admin vs visitor)
- Blob storage for book cover image uploads
- 7 pages: Home, Books, Book Detail, About, Blog, Contact, Admin Panel
- FAQ-based AI chatbot widget (extensible for OpenAI later)
- Wishlist (localStorage-based for visitors)
- Newsletter subscription with subscriber management in admin
- Analytics event tracking (page views, buy-link clicks)
- Book recommendation system (genre-based)
- Dark/light mode toggle persisted in localStorage
- Genre filter on Books page
- Reader reviews and ratings on Book Detail page
- "Look Inside" preview section per book
- Admin panel: CRUD for books, blog posts, newsletter subscribers, analytics view
- SEO meta tags and structured data per page

### Modify
- Brand: "Mystoryova" wordmark logo, "O. Chiddarwar" as author identity within content
- Design language: cinematic, glassmorphism, gold accents (#C9A84C), black/white theme

### Remove
- All previous static/non-persistent frontend-only state
- Next.js / Firebase references (platform uses React + Motoko)

## Implementation Plan
1. Select `authorization` and `blob-storage` Caffeine components
2. Generate Motoko backend with:
   - Books CRUD (title, description, genre, formats, amazonUrl, coverImageId, authorNote, lookInsideText, isPublished)
   - Blog posts CRUD (title, content, category, publishedAt, isPublished)
   - Newsletter subscribers (email, subscribedAt)
   - Contact messages (name, email, message, receivedAt)
   - Reviews (bookId, reviewer, rating, content)
   - Analytics events (eventType, page, timestamp)
   - Admin role check via authorization component
3. Build React frontend:
   - Layout: Navbar (logo + nav + dark toggle + chatbot), Footer
   - Home: Hero with animated book, featured books, genre categories, testimonials, newsletter form
   - Books: grid with genre filter, hover animations, format badges, Amazon links
   - Book Detail: full description, look inside, reviews, author note, related books
   - About: author bio, elegant typography, optional photo
   - Blog: article grid with categories, clean reading view
   - Contact: form + email + social placeholders
   - Admin: login gate, CRUD dashboards for books/blog/subscribers/analytics
   - Chatbot: floating FAQ widget
   - Wishlist: heart-toggle on book cards, saved to localStorage
