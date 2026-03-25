# Mystoryova

## Current State
Fully deployed author website with pages: Home, Books, Book Detail, About, Blog, Blog Detail, Contact, Admin. Footer shows navigation, social links, and copyright.

## Requested Changes (Diff)

### Add
- `/privacy-policy` page with Privacy Policy content relevant to an author website (data collected via newsletter, contact form, cookies; third-party links like Amazon; no selling of personal data; contact email mystoryova@gmail.com)
- `/terms` page with Terms and Conditions (use of site, intellectual property, book purchases via Amazon, disclaimer, governing law)
- Footer links to both pages in the bottom bar alongside the copyright notice

### Modify
- `Footer.tsx`: add "Privacy Policy" and "Terms" links in the bottom bar
- `App.tsx`: register `/privacy-policy` and `/terms` routes

### Remove
- Nothing

## Implementation Plan
1. Create `src/frontend/src/pages/PrivacyPolicyPage.tsx` with full privacy policy content
2. Create `src/frontend/src/pages/TermsPage.tsx` with full terms and conditions content
3. Update `App.tsx` to import and register both new routes
4. Update `Footer.tsx` to add links to both pages in the bottom copyright bar
