# Mystoryova

## Current State
The store has Printful (international) already integrated in the backend with `setPrintfulApiKey` and `fulfillPrintfulOrder`. The AdminOrdersTab only shows the Stripe configuration section -- there is no UI to trigger fulfillment or configure Printful/Printrove API keys.

## Requested Changes (Diff)

### Add
- Printrove API integration in backend (setPrintroveApiKey + fulfillPrintroveOrder via HTTP outcall to `https://www.printrove.com/api/v2/orders`)
- "Fulfillment" section in AdminOrdersTab showing two sub-sections: Printrove (India) and Printful (International)
- Per-order "Fulfill" button in the orders table that opens a modal to choose Printrove or Printful, then triggers the backend call
- Order detail modal shows `printfulOrderId` field as "Fulfillment Ref"

### Modify
- AdminOrdersTab: Add Printrove config card (API key input + save), add Printful config card (API key input + save, which was previously missing from UI), add per-row Fulfill button for paid/unfulfilled orders
- Backend main.mo: Add `stable var printroveApiKey`, `setPrintroveApiKey`, `fulfillPrintroveOrder`, and `buildPrintroveOrderBody` functions

### Remove
- Nothing removed

## Implementation Plan
1. Update backend main.mo: add Printrove stable var, setter, fulfillment function with HTTP outcall to Printrove API
2. Regenerate backend.d.ts to expose new functions
3. Update AdminOrdersTab: add Fulfillment config section (Printrove + Printful cards), add "Fulfill" button per row that opens a choose-provider modal
