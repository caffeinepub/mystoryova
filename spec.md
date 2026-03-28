# Mystoryova

## Current State
Admin login has been intermittently failing. The `verifyAdminPassword` backend function is a `query` call, which does NOT wake up a stopped/idle ICP canister. All retries were also query calls, so they all failed immediately. The proactive wake ping on page load also used `verifyAdminPassword` (query), which had the same problem.

## Requested Changes (Diff)

### Add
- Nothing new

### Modify
- `src/backend/main.mo`: Change `verifyAdminPassword` from `public query func` to `public shared func` (update call) so it wakes a sleeping canister
- `src/frontend/src/pages/AdminPage.tsx`: Change the proactive wake ping from `actor.verifyAdminPassword("")` to `actor.getAllBooks()` or any other update call — or better, use `actor.recordPageVisit("admin-ping")` which is already an update call

### Remove
- Nothing

## Implementation Plan
1. Change `verifyAdminPassword` to `public shared func` in main.mo
2. Update the wake ping in AdminPage LoginForm to use an update call (`recordPageVisit`) instead of the query-based `verifyAdminPassword`
