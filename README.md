This is a comprehensive Product Requirements Document (PRD) for building a Unified Client Collaboration & Success Platform (internally codenamed: "The ESG Cockpit").
This PRD is designed to be handed to a Product Manager or Engineering Lead to start the build or vendor selection process.
 
Product Requirements Document (PRD)
 
Project Name: The ESG Cockpit (Unified Customer Success OS)Version: 1.0Status: DraftContext: ESG Data Management SaaS
 
1. Executive Summary
 
The goal is to build a "Single Pane of Glass" platform that bridges the gap between internal operations (ClickUp, Email, Ticketing, CRM) and external customer visibility.
Currently, data is siloed. The objective is to create a bi-directional interface where a CSM can manage the entire lifecycle of an ESG client (from onboarding to renewal) in one view, while giving CXOs a real-time health/revenue view and Customers a transparent project portal.
 
2. User Personas
 
The CSM (Internal): Needs "cut-throat" task management. Wants to stop toggling between Gmail, ClickUp, and Zendesk. Needs to see "Who is blocking the BRSR report?" instantly.
The CXO (Internal): Needs a bird's-eye view of ARR at risk, Onboarding delays, and NPS trends.
The ESG Client (External): Needs to know the status of their data ingestion, upcoming deadlines for regulatory filings, and pending approvals without emailing for updates.
 
3. Functional Requirements: The "Single Page" View
 
This is the core view for a specific account (e.g., "Tata Steel - ESG Implementation").
 
Zone A: The "Left Rail" (Account Health & Vitals)
 
Position: Fixed Left Sidebar
NPS & CSAT Score: Live feed from survey tool (e.g., Delighted/Typeform). Color-coded (Green >9, Red <6).
Commercial Snapshot:
ARR: $ Value.
Contract Type: (e.g., Enterprise, Pilot).
Renewal Date: Countdown timer (e.g., "Renewing in 45 days").
License Utilization: % of ESG modules used vs. purchased.
Key People (Stakeholder Map):
Champion: (Name/Photo)
Economic Buyer: (Name/Photo)
Detractors: (Flagged in Red)
 
Zone B: The "Central Command" (Project & Task Management)
 
Position: Center/Top
Integration: Deep ClickUp 2-Way Sync.
The "Timeline" View: A Gantt chart showing key ESG milestones (e.g., Data Collection -> Gap Analysis -> BRSR Draft -> Final Submission).
Task List (Cut-Throat Mode):
Dependency Tracking: If the client hasn't uploaded "Scope 3 Emissions Data" (Dependency), the "Generate Report" task is locked.
Overdue Escalation: If a task is overdue by 48 hours, the row turns bright red and auto-flags the account as "At Risk."
Deliverables Widget: A distinct section showing agreed outputs (e.g., "Q3 Carbon Report").
External vs. Internal Toggle:
Private Tasks: Visible only to CSM (e.g., "Upsell Opportunity").
Public Tasks: Visible to Client (e.g., "Upload Electricity Bills").
 
Zone C: The "Communication Stream" (Unified Inbox)
 
Position: Center/Bottom or Right Panel (Collapsible)
Email Sync (Gmail/Outlook): Shows all emails associated with the client's domain.
Feature: "Reply from Dashboard." Sending an email here logs it in the CRM and sends it via Gmail.
Ticket Sync (Zendesk/Freshdesk/Intercom):
Shows open tickets (e.g., "Login Error," "Data API failing").
Feature: If a 'Blocker' ticket is open, the Project Health automatically degrades to 'Yellow'.
 
4. Functional Requirements: The CXO / Portfolio View
 
This is the "Control Tower" for Leadership.
The "Heatmap" Grid:
Rows: List of all Accounts.
Columns: Onboarding Status, NPS, Ticket Volume, Last Contact Date, ARR.
Risk Logic:
Red Flag Algorithm: IF (NPS < 6) OR (Tickets > 5 in a week) OR (Project Delayed > 10 days) → Mark Account Red.
Financial Filtering:
"Show me all 'Red' accounts with ARR > $50k."
Resource Load:
Which CSM is overloaded? (Based on ClickUp task volume).
 
5. Technical Architecture & Integrations
 
To achieve the "Rocketlane" experience, we need a middleware layer.
 
The Tech Stack
 
Frontend: React.js (for a snappy, app-like experience).
Backend: Node.js / Python.
Database: Postgres (to store the "meta-layer" of data).
 
Required Integrations (API Mapping)
 
ClickUp API:
Get Tasks: Pull lists, statuses, due dates.
Webhooks: When a client checks a box on the dashboard, it updates ClickUp instantly.
Email Provider (Gmail/Outlook Graph API):
Read/Write access to threads matching Client Domain.
Ticketing (Zendesk/Jira Service Desk):
Pull Ticket Status, Priority, and Assignee.
CRM (Salesforce/HubSpot):
Pull ARR, Renewal Date, Contract PDF link.
 
6. The "External Customer Portal" Experience
 
This is what the Client sees when they log in.
Branding: White-labeled (Your Company Logo + Client Logo).
The "Welcome" Widget: "Hi [Client Name], we are 65% through your ESG Implementation."
Action Items (The "To-Do" List):
Upload: Drag-and-drop interface for documents (Energy bills, HR policies).
Approve: "Approve Phase 1 Scope."
Live Timeline: They see the Gantt chart (Read-only).
Library: Auto-populated links to their Contracts and Final Deliverables.
 
7. User Flow Example: "Changing a Deliverable"
 
Trigger: The Client emails the CSM saying, "We can't provide Scope 3 data until next month."
Action:
CSM sees the email inside the Unified Dashboard.
CSM clicks the "Scope 3 Data" task in the Center Command (ClickUp integration).
CSM changes the Due Date +30 days.
Result:
ClickUp: Task date updates automatically.
Dashboard: The Timeline shifts; the "Projected Go-Live" date auto-calculates to a later date.
Client Portal: The client sees the new timeline immediately.
CXO View: The account is flagged "Yellow" because the "Time to Value" just increased.
 
8. UI Layout Sketch (Mental Model)
 
Plaintext
 
+-----------------------------------------------------------------------+
|  [Logo]  Global Search (Account, Task, Email)      [Notifications]    |
+-----------------------------------------------------------------------+
| SIDEBAR   |  MAIN DASHBOARD HEADER: TATA STEEL (ARR: $100k) | Risk: LOW|
|           |-----------------------------------------------------------|
| > My Tasks|  [ KPI WIDGETS ]                                          |
| > Clients |  [ Timeline: On Track ] [ Pending Actions: 3 ] [ NPS: 9 ] |
| > Reports |-----------------------------------------------------------|
|           |  LEFT COL: DETAILS  |  CENTER COL: WORKSPACE (TABS)       |
|           |                     |                                     |
|           |  [Contract Info]    |  [TASKS]  [EMAILS]  [DOCS]          |
|           |  Start: Jan 01      |                                     |
|           |  End: Dec 31        |  v Phase 1: Data Ingestion          |
|           |                     |    [x] API Setup (Done)             |
|           |  [Stakeholders]     |    [ ] Upload Hist. Data (ClickUp)  |
|           |  (O) Head of ESG    |        -> DEPENDENCY: Waiting on    |
|           |  (O) IT Director    |           Client IT Dept            |
|           |                     |                                     |
|           |  [NPS Score]        |  v Phase 2: BRSR Reporting          |
|           |  [ 9/10 ]           |    [ ] Draft Generation             |
|           |                     |                                     |
+-----------------------------------------------------------------------+
|           |  BOTTOM PANEL: RECENT TICKETS & ALERTS                    |
|           |  (Alert) Ticket #402: "Login failed" - Open 2hrs          |
+-----------------------------------------------------------------------+
 
9. Development Phases
 
Phase 1 (The MVP): Read-only Dashboard. Pulls data from ClickUp and Hubspot/Salesforce. No bi-directional editing yet.
Phase 2 (The Operator): Add "Write" capabilities. Editing a task updates ClickUp. Add Email integration.
Phase 3 (The Client Portal): Expose a sanitized view to the external client with login credentials.
Phase 4 (Intelligence): Add the Risk Algorithms and CXO Heatmaps.
 
Next Steps for You
 
Would you like me to create a mockup of the data structure (JSON schema) that your engineering team would need to map the ClickUp API to this Dashboard? This will save them significant planning time.
 
This is the PRD i wrote long long ago the tasks manager bit i have a specifc PRD which will taken up in depth 
 