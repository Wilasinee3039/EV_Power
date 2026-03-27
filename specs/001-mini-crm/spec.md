# Feature Specification: Mini CRM System for EV Power Energy

**Feature Branch**: `001-mini-crm`  
**Created**: March 27, 2026  
**Status**: Draft  
**Input**: Mini CRM system for EV Power Energy with login, dashboard, lead management, and activity tracking

## User Scenarios & Testing

### User Story 1 - User Authentication & Access Control (Priority: P1)

An EV Power sales representative needs to securely access the CRM system with their company credentials to begin their workday and manage confidential customer and lead information.

**Why this priority**: Authentication is the foundational security requirement that gates access to all other features. Without a secure login system, the CRM cannot protect customer data or ensure accountability of sales activities.

**Independent Test**: This can be fully tested independently by verifying that unauthorized users are denied access and authorized users can log in with valid credentials, then navigate to the dashboard.

**Acceptance Scenarios**:

1. **Given** an unregistered user on the login page, **When** they enter invalid credentials, **Then** they receive an error message and remain on the login page
2. **Given** a registered user on the login page, **When** they enter correct email and password, **Then** they are authenticated and redirected to the dashboard
3. **Given** an authenticated user, **When** they close the browser and return to the CRM, **Then** their session is preserved (or they must re-authenticate based on session timeout)
4. **Given** an authenticated user, **When** they click logout, **Then** their session is terminated and they are redirected to the login page

---

### User Story 2 - Dashboard Overview with Lead Metrics (Priority: P1)

A sales manager needs to quickly view a high-level overview of the team's lead pipeline, including total lead count and distribution across different statuses, to assess team performance and workload at a glance.

**Why this priority**: The dashboard is the primary entry point after login and provides critical business insights. Sales managers depend on this data for daily decision-making and performance monitoring.

**Independent Test**: This can be fully tested by logging in successfully and verifying that the dashboard displays accurate total lead count and status breakdown without requiring other features to be functional.

**Acceptance Scenarios**:

1. **Given** a user has logged in successfully, **When** they land on the dashboard, **Then** they see the total number of leads prominently displayed
2. **Given** a dashboard with leads in various statuses (e.g., New, Contacted, Qualified, Proposal, Closed), **When** the user views the dashboard, **Then** they see a breakdown/summary of leads by status (visual or numeric)
3. **Given** a dashboard displaying metrics, **When** new leads are added by other team members, **Then** the metrics update to reflect the new count (within a reasonable refresh interval)
4. **Given** a sales representative viewing the dashboard, **When** they lack manager permissions, **Then** they see only metrics relevant to their assigned leads

---

### User Story 3 - Lead Search & List Discovery (Priority: P1)

A sales representative needs to quickly find specific leads by searching and filtering through the lead list to locate customer information and determine their current status and contact history.

**Why this priority**: Search is essential daily functionality that directly impacts sales rep productivity. Without efficient search, reps waste time browsing and cannot serve customers promptly.

**Independent Test**: This can be fully tested independently by creating leads in the system and verifying search returns correct results without needing edit/delete functionality to work.

**Acceptance Scenarios**:

1. **Given** a list of leads with various names and details, **When** a user enters a search term (e.g., "Tesla"), **Then** the list filters to show only leads matching that search term
2. **Given** a user on the lead list page, **When** they apply a status filter (e.g., "Qualified"), **Then** only leads with that status are displayed
3. **Given** a user on the lead list page, **When** they apply a product interest filter (e.g., "Solar"), **Then** only leads interested in that product are displayed
4. **Given** search and filter results, **When** a user combines multiple filters (status + product interest), **Then** the list shows leads matching ALL applied filter criteria
5. **Given** a user viewing filtered results, **When** they click the "clear filters" option, **Then** all leads are displayed again

---

### User Story 4 - Lead Creation & Record Management (Priority: P1)

A sales representative needs to create new lead records in the CRM to document new customer inquiries and ensure the lead is entered into the system for follow-up and tracking.

**Why this priority**: The ability to create leads is critical for capturing new business opportunities. Without this, the CRM cannot accumulate the lead data necessary for pipeline management.

**Independent Test**: This can be fully tested independently by successfully creating a new lead with all required fields and verifying it appears in the lead list.

**Acceptance Scenarios**:

1. **Given** a user on the lead management form, **When** they enter required information (name, contact details, product interest, status), **Then** the system validates that all required fields are completed
2. **Given** valid input in the lead creation form, **When** the user clicks "Save", **Then** the new lead is created and the user receives a confirmation message
3. **Given** a newly created lead, **When** the user views the lead list, **Then** the new lead appears in the list with all entered information
4. **Given** a user creating a lead, **When** they click "Cancel", **Then** the form closes without saving and no lead is created
5. **Given** a lead creation form, **When** the user attempts to save with invalid data (e.g., malformed email), **Then** they receive validation error messages and cannot submit

---

### User Story 5 - Lead Editing & Information Updates (Priority: P2)

A sales representative needs to update existing lead information (status, product interest, contact details) to reflect conversations, new discoveries, and progress along the sales pipeline.

**Why this priority**: Accurate, current lead information is vital for team coordination. While slightly less critical than creation, the ability to edit ensures the system remains the single source of truth for lead data.

**Independent Test**: This can be fully tested by opening an existing lead, modifying its details, and verifying the changes persist when viewing the lead again.

**Acceptance Scenarios**:

1. **Given** a lead in the system, **When** a user clicks "Edit" on that lead, **Then** the lead details form opens with all current information populated
2. **Given** an open lead edit form, **When** a user modifies the status field and clicks "Save", **Then** the change is persisted and confirmed with a success message
3. **Given** a lead being edited, **When** the user changes the product interest from "Solar" to "EV", **Then** the change is saved and reflected in the list view
4. **Given** a user editing a lead, **When** they make no changes and click "Save", **Then** the system shows that no changes were made (or allows the save without error)
5. **Given** multiple users accessing the same lead simultaneously, **When** one user saves changes, **Then** the other user is notified of the updates on their next view/refresh

---

### User Story 6 - Lead Deletion & Record Removal (Priority: P3)

A sales representative or manager needs to remove lead records that are duplicates, invalid, or no longer relevant to keep the CRM database clean and accurate.

**Why this priority**: Data cleanup is important for system hygiene but less urgent than core CRUD operations. The system can function effectively without frequent deletions, though data quality benefits from this capability.

**Independent Test**: This can be fully tested by creating a test lead, deleting it, and verifying it no longer appears in the system.

**Acceptance Scenarios**:

1. **Given** a lead in the system, **When** a user clicks "Delete", **Then** a confirmation dialog appears asking to confirm the deletion
2. **Given** a confirmation dialog, **When** the user confirms deletion, **Then** the lead is removed and no longer appears in the lead list
3. **Given** a confirmation dialog, **When** the user cancels the deletion, **Then** the lead remains in the system unchanged
4. **Given** a deleted lead, **When** the user attempts to access it directly (via URL or link), **Then** a "not found" message is displayed
5. **Given** a delete action, **When** it is performed, **Then** an activity log entry is created recording who deleted the lead and when

---

### User Story 7 - Activity Log & Status Change History (Priority: P2)

A sales manager or representative needs to view a complete history of all status changes and activities associated with each lead to track the lead's journey through the sales pipeline and understand decision-making context.

**Why this priority**: Activity tracking provides accountability, enables auditing, and helps new team members understand lead history. While not immediately blocking other features, it becomes critical for compliance and team coordination.

**Independent Test**: This can be fully tested by making changes to a lead and verifying those changes appear in an activity log with timestamps.

**Acceptance Scenarios**:

1. **Given** a lead that has had its status changed multiple times, **When** a user views the lead's activity log, **Then** they see all previous status changes listed with timestamps and the user who made the change
2. **Given** an activity log entry for a status change, **When** the user views the entry, **Then** it shows the previous status, new status, timestamp, and responsible user
3. **Given** a lead created by a certain user, **When** the activity log is viewed, **Then** the creation event is recorded with the creator's name and creation timestamp
4. **Given** an activity log, **When** entries are listed, **Then** they are sorted in reverse chronological order (newest first) for easy review
5. **Given** a lead with activity spanning months, **When** the user views the activity log, **Then** all historical entries are accessible (no pagination limits on history)

---

### User Story 8 - Lead Details & Comprehensive Information Management (Priority: P2)

A sales representative needs to view and manage all lead information (name, contact details, company, product interests, current status, notes) in a centralized location to maintain a single source of truth and support informed sales decisions.

**Why this priority**: While the list view and editing provide basic information access, a detailed view ensures all lead context is available when needed for sales conversations and strategic planning.

**Independent Test**: This can be fully tested by selecting a lead and verifying that all entered information displays accurately on the details page.

**Acceptance Scenarios**:

1. **Given** a lead in the list view, **When** a user clicks on the lead name or "View Details", **Then** the detailed lead view opens showing all information
2. **Given** a lead details page, **When** the user views the page, **Then** displays show product interest (Solar, EV, Battery), current status, contact information, and company
3. **Given** a lead details page, **When** the user clicks "Edit", **Then** they are taken to a form to modify any of the displayed fields
4. **Given** a lead details view, **When** the user views the page, **Then** they also see the activity log on the same page or linked prominently
5. **Given** a lead details page for a lead without certain optional information, **When** the user views it, **Then** empty fields display gracefully without breaking the layout

---

### Edge Cases

- What happens when a user attempts to search with special characters or very long search strings?
- How does the system handle simultaneous edits to the same lead by different users?
- What happens when activity log entries are made during system maintenance or database issues?
- How are deleted leads handled in reports or aggregate metrics - are they excluded or marked as deleted?
- What happens if a user's session expires while they are editing a lead form?
- How does the system handle bulk operations (e.g., multiple status changes at once)?
- What are the permission boundaries - can all users delete leads, or is this restricted to managers?

## Requirements

### Functional Requirements

- **FR-001**: System MUST provide a user login/authentication interface that accepts email and password credentials
- **FR-002**: System MUST validate user credentials against stored user accounts and deny access with invalid credentials
- **FR-003**: System MUST maintain user session state to keep users logged in across page navigation
- **FR-004**: System MUST provide a logout function that terminates the user session
- **FR-005**: System MUST display a dashboard showing total count of leads in the system
- **FR-006**: System MUST display a breakdown/summary of leads grouped by status on the dashboard
- **FR-007**: System MUST provide a lead list view showing all leads with key information
- **FR-008**: System MUST implement a search function that filters leads by name, company, or contact information
- **FR-009**: System MUST provide filter capabilities by lead status (options: New, Contacted, Qualified, Proposal, Closed)
- **FR-010**: System MUST provide filter capabilities by product interest (options: Solar, EV, Battery)
- **FR-011**: System MUST support combining multiple filters simultaneously
- **FR-012**: System MUST provide a lead creation form that captures name, email, phone, company, product interest, and status
- **FR-013**: System MUST validate required fields on lead creation form before allowing save
- **FR-014**: System MUST store new leads to persistent storage when the creation form is submitted
- **FR-015**: System MUST provide an edit function for existing leads that pre-populates the form with current data
- **FR-016**: System MUST save updates to lead information when the edit form is submitted
- **FR-017**: System MUST provide a delete function for leads with user confirmation
- **FR-018**: System MUST remove deleted leads from the system
- **FR-019**: System MUST display a detailed view of an individual lead showing all stored information
- **FR-020**: System MUST allow access to the lead edit form from the lead details view
- **FR-021**: System MUST record all status changes for each lead in an activity log
- **FR-022**: System MUST timestamp all activity log entries with the date and time of the change
- **FR-023**: System MUST record the user who made each activity log entry
- **FR-024**: System MUST display the activity log for a lead showing all historical changes
- **FR-025**: System MUST sort activity log entries in reverse chronological order (newest first)
- **FR-026**: System MUST prevent unauthorized access to lead information based on [NEEDS CLARIFICATION: Define user permission model - can all users see all leads, or are there permission restrictions?]
- **FR-027**: System MUST handle concurrent user access to the same lead gracefully

### Key Entities

- **User**: Represents a CRM system user with authentication credentials (email, password), name, and role/permissions
  - Attributes: ID, Email, Name, Role, CreatedAt, LastLoginAt
  - Relationships: User can create and edit multiple leads; User records activities

- **Lead**: Represents a potential customer or sales opportunity for EV Power
  - Attributes: ID, Name, Email, Phone, Company, ProductInterest (Solar/EV/Battery), Status (New/Contacted/Qualified/Proposal/Closed), Notes, CreatedAt, UpdatedAt, CreatedByUserId
  - Relationships: Lead has multiple Activity entries; Lead belongs to a Lead status

- **Activity**: Represents a historical record of changes made to a lead
  - Attributes: ID, LeadID, AffectedField, OldValue, NewValue, Timestamp, UserID, ChangeType (StatusChange/EditInfo/Created/Deleted)
  - Relationships: Activity belongs to a Lead; Activity belongs to a User

## Success Criteria

### Measurable Outcomes

- **SC-001**: Users can log in and access the dashboard in under 10 seconds from page load
- **SC-002**: Dashboard displays accurate lead counts, with updates reflecting new/deleted leads within 2 minutes
- **SC-003**: Search function returns results in under 1 second for a database of up to 10,000 leads
- **SC-004**: A sales representative can create a new lead with complete information in under 2 minutes
- **SC-005**: A user can edit a lead's status and save the change in under 30 seconds
- **SC-006**: System supports at least 50 concurrent users without performance degradation
- **SC-007**: 95% of lead searches return the intended lead on the first attempt
- **SC-008**: Activity log displays with timestamps and user information with 100% accuracy for all recorded changes
- **SC-009**: Users report the lead management workflow as intuitive, with 90% completing common tasks without help documentation on first attempt
- **SC-010**: System avoids data loss from concurrent edits with clear conflict resolution or notifications to affected users

## Assumptions

- **User Accessibility**: Users will have stable internet connectivity and access modern web browsers (Chrome, Firefox, Safari, Edge within 2 versions of current)
- **Data Privacy**: The system will be deployed in a secure environment with HTTPS and will comply with applicable data protection regulations; passwords will be stored securely using industry-standard hashing
- **User Base**: Initial deployment targets 20-50 CRM users within the EV Power sales organization; scalability beyond 100 concurrent users is not a v1 requirement
- **Existing Infrastructure**: The organization has a user management/authentication system that can be integrated or the CRM will establish its own
- **Mobile Support**: Mobile app support is out of scope for v1; the system is optimized for desktop/tablet web browsers
- **Data Recovery**: The organization has database backup and recovery procedures in place; the CRM does not need to implement independent backup features
- **Notification System**: Email or in-app notifications for activities are out of scope for v1; only the activity log itself is required
- **Reporting**: Advanced reporting and analytics features are out of scope for v1; the dashboard provides only real-time lead counts
- **Integration**: Third-party integrations (email clients, calendar, external data sources) are out of scope for v1
- **Time Zone Handling**: The system stores and displays timestamps in UTC with user locale configuration handled in v1 as a global setting
- **Permission Model**: For v1, all authenticated users can view, create, edit, and delete any lead (no granular permission restrictions); audit trails through the activity log provide accountability
