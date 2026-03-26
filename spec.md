# Mystoryova — Code Bug Fixes

## Current State
The site has working UI with Motoko backend. Admin login and books section are reported as broken.

## Requested Changes (Diff)

### Add
- Loading state on admin login button while actor is initializing or while login is being verified
- Actor-readiness check before forgot-password PIN request

### Modify
- **Admin login race condition**: `useAdmin.login()` silently returns `false` when actor is null, showing "Incorrect password" even when actor just isn't ready yet. Fix: pass `isFetching` from `useActor` through `useAdmin` context and use it in `LoginForm` to disable the button and show a "Connecting..." message instead.
- **BooksPage empty state on actor load**: When `enabled: false` (actor not ready), `isLoading` is `false`, so `filtered.length === 0` renders "No books match your filters" instead of skeleton. Fix: merge actor `isFetching` into the `isLoading` flag in `useGetAllBooks` or in `BooksPage`.
- **Forgot password PIN request when actor is null**: `actor?.generateResetPin()` returns `undefined` when actor isn't ready, which shows "That email is not registered" error. Fix: check actor availability first and show appropriate message.
- **Login button missing loading state**: No visual spinner while `login()` is pending. Fix: add `isLoading` state to `handleSubmit` and disable button during submission.
- **Settings change-password PIN request when actor is null**: Same actor-null issue in the settings tab's `handleRequestPin`. Fix: same check.

### Remove
- Nothing removed

## Implementation Plan
1. Add `isFetching` to `AdminContext` and `AdminProvider` (expose from `useActor` through the context)
2. In `LoginForm`: disable "Enter Dashboard" when actor is loading; show "Still connecting..." instead of allowing submission; add `isSubmitting` state for visual spinner during `login()` call; fix forgot-password PIN request to check actor availability
3. In `useGetAllBooks` (useQueries.ts): combine `actorFetching` into returned `isLoading` so BooksPage skeleton shows while actor initialises
4. In `AdminPage` settings section: fix `handleRequestPin` to check actor before calling
