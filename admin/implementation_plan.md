# Dashboard UI Overhaul Implementation Plan

## Goal
Revamp the `Dashboard.jsx` to be a high-quality, modern, and visual command center for the PrimeAuto Admin.

## User Review Required
- None. This is a direct requested UI update.

## Proposed Changes

### [Admin Dashboard]
#### [MODIFY] [Dashboard.jsx](file:///g:/projects/PrimeAuto/admin/src/pages/admin/Dashboard.jsx)
- **Imports**: Add more icons from `react-icons/fa` and `react-icons/md`.
- **Layout**: Switch to a grid-based layout for Cards, Charts, and Activity.
- **Components**:
    - `StatCard`: Enhanced card with `percentage` prop and arrow icons for growth/decline.
    - `SalesChart`: A custom SVG line chart component (visual mock).
    - `ServicePieChart`: A custom SVG pie chart component (visual mock).
    - `RecentActivities`: A styled table with badges.
    - `HealthMonitor`: A visual circular progress bar or status bar for Server/Database.

#### [NEW] [DashboardComponents.jsx] (Optional, or inline)
- I will likely keep these inline in `Dashboard.jsx` or separate files if large, but given the context, inline or simple separate components is fine. I'll stick to inline for single-file portability unless it gets too huge.

## Verification Plan

### Manual Verification
1.  **Stat Cards**: Check if they render with the provided icons and percentage growth (mocked logic or real if available).
2.  **Charts**: Verify the SVG charts render correctly and span the width.
3.  **Responsiveness**: Check grid behavior on resize (simulated).
4.  **Theme**: Ensure colors (gradients, shadows) match the "premium" request.
