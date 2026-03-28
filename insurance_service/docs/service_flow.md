# Insurance Claim Management System - Backend Service Flow

## Overview
This document outlines the operational flow of the backend service, reflecting the business logic where users register, browse master policies, purchase them, and subsequently raise claims.

## User Types
1. **Policyholder**: A registered user who can browse and purchase policies, and file claims.
2. **Employee**: An insurance company staff member who verifies and processes claims.

## Application Lifecycle

### 1. User Registration
- **API**: `POST /users/`
- **Flow**: Users register on the platform. By default, they are assigned the `policyholder` role.

### 2. Policy Catalog (Master Policies)
- **API**: `POST /policy-master/` (Admin/Employee)
- **API**: `GET /policy-master/` (Public/Policyholder)
- **Flow**: The insurance company defines available products (e.g., "Premium Auto Insurance").

### 3. Policy Purchase
- **API**: `POST /user-policies/`
- **Flow**: A registered user selects a master policy and "buys" it. This creates a `UserPolicy` record with a unique policy number.

### 4. Filing a Claim (FNOL)
- **API**: `POST /claimants/` (To record who is making the claim)
- **API**: `POST /claims/`
- **Flow**: A policyholder raises a claim against one of their active `UserPolicies`. They provide incident details (Loss).

### 5. Evidence Submission
- **API**: `POST /documents/`
- **Flow**: The user uploads photos or documents related to the claim.

### 6. Claim Verification
- **API**: `POST /claims/{claim_id}/verify`
- **Flow**: An `Employee` reviews the claim and documents, then updates the status to `Verified`, `Approved`, or `Rejected`.

---

## Core Entities & Relationships

- **User**: Can be a Policyholder or Employee.
- **PolicyMaster**: The template for insurance products.
- **UserPolicy**: The specific instance of a policy owned by a User.
- **Claim**: Linked to a `UserPolicy`.
- **Loss**: Details of the incident linked to a Claim.
- **Claimant**: The person sustaining the loss.
- **Document**: Evidence linked to a Claim.
