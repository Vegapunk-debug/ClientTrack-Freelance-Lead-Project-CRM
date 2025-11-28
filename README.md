# ClientTrack-Freelance-Lead-Project-CRM
# ClientTrack 🚀

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Status](https://img.shields.io/badge/status-Active-success.svg)
![Version](https://img.shields.io/badge/version-1.0.0-purple.svg)

**ClientTrack** is a specialized CRM designed for freelance designers and developers. It streamlines the chaotic process of managing potential clients, tracking active projects, and forecasting revenue in one unified dashboard.

---

## 📖 Table of Contents
- [About the Project](#-about-the-project)
- [Key Features](#-key-features)
- [Database Schema](#-database-schema)
- [Tech Stack](#-tech-stack)
- [Getting Started](#-getting-started)
- [Future Roadmap](#-future-roadmap)

---

## 🎯 About the Project

Freelancers often lose track of leads in email threads or forget to follow up with potential clients. **ClientTrack** solves this by separating **Leads** (potential work) from **Projects** (active work) while providing a seamless conversion workflow between the two.

### The Core Workflow
1. **Capture:** Add a Lead with budget and source.
2. **Nurture:** Set follow-up dates and track notes.
3. **Convert:** One-click conversion from Lead to Project.
4. **Deliver:** Manage project status and track expected revenue.

---

## ✨ Key Features

### 1. Lead Management System
- **Source Tracking:** Tag leads by origin (`LinkedIn`, `Referral`, `Website`, `Other`) to analyze where business comes from.
- **Smart Follow-ups:** "Today’s Follow-ups" view ensures no opportunity slips through the cracks.
- **Budgeting:** Record initial budget ranges before a contract is signed.

### 2. Project & Pipeline Tracking
- **Status Workflow:** Manage projects through a defined lifecycle:
  - `Discussion` ➝ `In Progress` ➝ `On Hold` ➝ `Completed`
- **Financials:** Tag projects as **Fixed Price** or **Hourly** with an `Expected Value` field.
- **Progress Notes:** Timestamped notes for every update.

### 3. Analytics & Views
- **Revenue Projection:** Real-time dashboard calculating the sum of expected value for active projects.
- **Kanban-Style Views:** Filter Leads and Projects by Status or Source.
- **Global Search:** Find any client or note instantly with keyword search.

---

## 🗄 Database Schema

The application relies on a relational model linking Leads to Projects.

```sql
/* Simplified Schema Structure */

-- 1. Leads Table
CREATE TABLE Leads (
    id INT PRIMARY KEY,
    client_name VARCHAR(255),
    source VARCHAR(50),      -- LinkedIn, Referral, etc.
    follow_up_date DATE,
    status VARCHAR(50)       -- New, Contacted, Converted
);

-- 2. Projects Table
CREATE TABLE Projects (
    id INT PRIMARY KEY,
    lead_id INT FOREIGN KEY, -- Links back to the original Lead
    status VARCHAR(50),      -- Discussion, In Progress, Completed
    pricing_type VARCHAR(20),-- Fixed or Hourly
    expected_value DECIMAL   -- Used for Revenue Projection
);
