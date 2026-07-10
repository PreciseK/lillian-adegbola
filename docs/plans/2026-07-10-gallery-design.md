# Gallery Feature Design

## Goal
Add a photo/video gallery: a homepage carousel with a "View All" dialog, an admin manager with image upload + video-URL-only entry, and a 2GB storage quota meter for gallery images.

## Data model

### Table: `gallery_items_la2024`
```sql
id            uuid primary key default gen_random_uuid()
type          text not null check (type in ('image','video'))
title         text
caption       text
image_url     text        -- storage public URL, images only
video_url     text        -- external URL (YouTube/Vimeo/file), videos only
thumbnail_url text        -- optional poster image for a video card
is_featured   boolean default false   -- shows on homepage carousel
is_published  boolean default true    -- shows in "View All" dialog
sort_order    integer default 0
created_at    timestamptz default now()
updated_at    timestamptz default now()
```
RLS: public `SELECT` where `is_published = true`; admin-only `INSERT/UPDATE/DELETE` via `public.is_admin()` — mirrors `testimonials_la2024`.

### Storage bucket: `gallery-images`
New dedicated bucket, public read, admin-only write (same policy shape as `website-images`). Per-file size limit (5MB) enforced by the bucket; the 2GB aggregate cap is enforced in application logic since Supabase buckets don't support aggregate quotas.

### Storage usage RPC: `gallery_storage_usage_bytes()`
`SECURITY DEFINER` Postgres function summing `(metadata->>'size')::bigint` from `storage.objects` where `bucket_id = 'gallery-images'`, admin-gated internally. Frontend calls it to compute used bytes / 2GB.

## Landing page (`Gallery.jsx`)
- Fetches `gallery_items_la2024` where `is_published = true`.
- Carousel shows `is_featured = true` items, falling back to latest 8 published if none featured. Mixed images + videos.
- Returns `null` (hidden section) when there are zero published items — same convention as `Testimonials`/`Blog`.
- Custom horizontal scroll-snap carousel + framer-motion, no new dependency. Prev/Next buttons scroll by card width.
- Video cards show a static thumbnail + play badge; click opens a lightbox using the existing `LockedVideoPlayer` + `resolveVideoEmbed`.
- "View All" button opens `GalleryDialog`, a full-screen modal (same fixed-inset-0 pattern as `TransformationModal`) with a grid of all published items and an internal lightbox.
- Section placed between `<VideoShowcase />` and `<Testimonials />` in `App.jsx`.

## Admin (`GalleryManager.jsx`)
- Stats row (Total / Images / Videos / Featured) + a storage meter card (progress bar, color escalates past 90%, shows `usedMB / 2048MB`).
- Add/edit modal with a type toggle:
  - **Image**: reuses `ImageUploader` pointed at `gallery-images` bucket. Before upload, re-checks usage via the RPC; blocks with an inline error if `used + file.size > 2GB`.
  - **Video**: title/caption + URL input only, no file picker. URL validated through `resolveVideoEmbed` before save.
- Item grid with edit / toggle-featured / toggle-published / delete actions, matching `TestimonialsManager`'s pattern.
- Deleting a gallery image also removes the file from the `gallery-images` bucket so the quota frees up.

## Wiring
- `App.jsx`: add `<Gallery />`.
- `AdminSidebar.jsx`: add a `gallery` nav item.
- `AdminDashboard.jsx`: add the `gallery` case rendering `GalleryManager`.
- Migration: `supabase/migrations/<timestamp>_create_gallery.sql` (table, RLS, bucket, storage policies, RPC).
