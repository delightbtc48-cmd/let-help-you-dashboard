# Implementation Plan - Financial Services App (Mexico Pesos)

Build a complete financial services application with email/password authentication, a grid-based dashboard, and transfer functionality using local state (client-only).

## Scope Summary
- **Auth**: Email/Password registration and login (Mock/Local persistence).
- **Dashboard**: Replicate the provided image design with a grid of services (Add Money, Transfer, etc.).
- **Currency**: All symbols and amounts must use Mexican Pesos ($ MXN).
- **Transfer Modals**:
    - Modal 1: Name and Email fields.
    - Modal 2: Card number and Amount fields.
    - PIN Confirmation: Required PIN "1245".
- **Account**:
    - Initial balance: 0.00 $.
    - Update balance after "Add Money" (simulated) or "Transfer".
    - Persistent profile name and photo (localStorage).
- **History**: Access to transaction history.

## Non-Goals
- Real backend integration (Supabase, Postgres).
- Real payment processing.
- Live email notifications.

## Assumptions & Open Questions
- **Assumption**: "Transfer to another registered link permanently" implies simulated transfers to other "accounts" stored in `localStorage`.
- **Assumption**: Design should follow the provided image (blue/white theme typical of fintech apps).
- **Question**: Should "Add Money" have a specific flow? *Plan: Include a simple modal to increment balance for testing.*

## Affected Areas
- **Frontend**: All UI components (Login, Register, Dashboard, Modals).
- **Data Layer**: `localStorage` for user accounts, transaction history, and current session.
- **Components**: New components for Transfer Modals, Profile Settings, and History list.

## Phase 1: Authentication & Layout (Frontend Engineer)
- Setup routing (Login, Register, Home).
- Implement Mock Auth Service using `localStorage` to store users.
- Create shared layout with Bottom Navigation (if applicable) or Top Bar as per image.
- **Deliverable**: Functional Login/Register flow with basic redirection.

## Phase 2: Dashboard & Profile (Frontend Engineer)
- Replicate the UI from the image:
    - Balance display (0.00 $ MXN).
    - Services Grid (Add Money, Transfer, Pay Bills, etc.).
    - Profile header with Name/Photo.
- Implement Profile Edit functionality (change name/photo stored in `localStorage`).
- **Deliverable**: Visual dashboard matching the design with working profile updates.

## Phase 3: Transfer & "Add Money" Logic (Frontend Engineer)
- Implement "Add Money" modal to seed the balance.
- Implement "Transfer" flow:
    - Step 1: Recipient Modal (Name/Email).
    - Step 2: Amount Modal (Card/Amount).
    - Step 3: PIN Confirmation ("1245").
- Update balance and record in Transaction History.
- **Deliverable**: Working transfer logic with PIN verification and balance updates.

## Phase 4: History & Polish (Quick Fix Engineer)
- Implement Transaction History view.
- Ensure all symbols are $ (Mexico Pesos).
- Final UI polish based on the image (icons, colors).
- **Deliverable**: Final app with history access and localized currency.

## Sequencing Constraints
- Phase 1 must be completed first to allow access to the dashboard.
- Phase 3 depends on the Dashboard layout from Phase 2.
