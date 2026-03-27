# Insurance Claims Domain - Top Level Entities

This document defines the key entities in the Insurance Claims domain with their primary fields.

---

## 1. Claim

The core entity representing an insurance claim filed by a policyholder or claimant.

- **claim_id** - Unique identifier for the claim
- **claim_number** - Human-readable claim reference number
- **policy_id** - Reference to the associated policy
- **claimant_id** - Reference to the person filing the claim
- **loss_date** - Date when the loss/incident occurred
- **report_date** - Date when the claim was reported
- **claim_status** - Current status (Open, Under Review, Approved, Denied, Closed)
- **claim_type** - Type of claim (Auto, Property, Health, Liability, etc.)
- **loss_description** - Detailed description of the loss/incident
- **loss_location** - Address/location where the loss occurred
- **estimated_loss_amount** - Initial estimated amount of loss
- **actual_loss_amount** - Final calculated loss amount
- **deductible_amount** - Deductible applicable to this claim
- **claim_amount** - Total amount being claimed
- **approved_amount** - Amount approved for payment
- **assigned_adjuster_id** - Reference to the assigned claims adjuster
- **priority_level** - Priority (Low, Medium, High, Critical)
- **created_date** - Timestamp when claim was created
- **last_updated_date** - Timestamp of last update
- **closed_date** - Date when claim was closed

---

## 2. Policy

Insurance policy contract between insurer and insured.

- **policy_id** - Unique identifier for the policy
- **policy_number** - Policy reference number
- **policyholder_id** - Reference to the policyholder
- **policy_type** - Type of insurance (Auto, Home, Life, Health, Commercial)
- **policy_status** - Current status (Active, Inactive, Cancelled, Expired)
- **effective_date** - Date when policy becomes effective
- **expiration_date** - Date when policy expires
- **premium_amount** - Premium amount
- **premium_frequency** - Payment frequency (Monthly, Quarterly, Annual)
- **coverage_limit** - Maximum coverage amount
- **deductible** - Standard deductible amount
- **underwriter_id** - Reference to underwriter
- **agent_id** - Reference to insurance agent
- **risk_rating** - Risk assessment rating
- **cancellation_date** - Date of cancellation (if applicable)
- **renewal_date** - Next renewal date
- **terms_and_conditions** - Policy terms document reference
- **created_date** - Date policy was created
- **last_modified_date** - Date of last modification
- **payment_method** - Method of premium payment

---

## 3. Policyholder

The person or entity that owns the insurance policy.

- **policyholder_id** - Unique identifier for the policyholder
- **first_name** - First name
- **last_name** - Last name
- **middle_name** - Middle name or initial
- **date_of_birth** - Date of birth
- **ssn** - Social Security Number (encrypted)
- **email_address** - Primary email address
- **phone_number** - Primary phone number
- **alternate_phone** - Secondary phone number
- **mailing_address** - Mailing address
- **physical_address** - Physical/residential address
- **customer_since** - Date became a customer
- **customer_status** - Status (Active, Inactive, VIP)
- **occupation** - Occupation/profession
- **employer** - Employer name
- **annual_income** - Annual income range
- **credit_score** - Credit rating
- **preferred_contact_method** - Preferred communication method
- **language_preference** - Preferred language
- **risk_profile** - Customer risk assessment

---

## 4. Claimant

Person or entity filing the insurance claim (may be different from policyholder).

- **claimant_id** - Unique identifier for the claimant
- **claim_id** - Reference to the associated claim
- **first_name** - First name
- **last_name** - Last name
- **relationship_to_insured** - Relationship (Self, Spouse, Child, Third Party)
- **date_of_birth** - Date of birth
- **ssn** - Social Security Number (encrypted)
- **email_address** - Email address
- **phone_number** - Primary contact number
- **alternate_phone** - Secondary phone number
- **address** - Current address
- **employment_status** - Employment status
- **injury_type** - Type of injury/loss sustained
- **injury_severity** - Severity level
- **medical_treatment_required** - Whether medical treatment is needed
- **is_attorney_represented** - Whether represented by attorney
- **attorney_contact_info** - Attorney contact details
- **preferred_contact_time** - Best time to contact
- **communication_notes** - Special communication instructions
- **created_date** - Date record was created

---

## 5. Claims Adjuster

Insurance professional who investigates and settles claims.

- **adjuster_id** - Unique identifier for the adjuster
- **employee_id** - Employee reference number
- **first_name** - First name
- **last_name** - Last name
- **email_address** - Work email address
- **phone_number** - Work phone number
- **mobile_number** - Mobile contact number
- **license_number** - Professional license number
- **license_state** - State of licensure
- **license_expiration_date** - License expiration date
- **specialization** - Area of expertise (Auto, Property, Medical, etc.)
- **experience_years** - Years of experience
- **active_case_load** - Number of currently assigned cases
- **max_case_load** - Maximum allowed case load
- **territory** - Geographic territory covered
- **employment_status** - Status (Active, On Leave, Terminated)
- **hire_date** - Date of hire
- **supervisor_id** - Reference to supervisor
- **performance_rating** - Performance score
- **certification_details** - Professional certifications
- **availability_status** - Current availability

---

## 6. Loss/Incident

Details about the loss event that triggered the claim.

- **loss_id** - Unique identifier for the loss event
- **claim_id** - Reference to associated claim
- **loss_date** - Date of loss
- **loss_time** - Time of loss
- **loss_type** - Type of loss (Collision, Theft, Fire, Water Damage, etc.)
- **loss_cause** - Cause of loss
- **loss_location** - Address/location of incident
- **weather_conditions** - Weather at time of incident
- **police_report_filed** - Whether police report was filed
- **police_report_number** - Police report reference number
- **police_department** - Department that filed report
- **witnesses_present** - Whether witnesses were present
- **number_of_witnesses** - Count of witnesses
- **fault_determination** - Who is at fault
- **contributing_factors** - Factors that contributed to loss
- **loss_narrative** - Detailed description of incident
- **photos_available** - Whether photos are available
- **video_available** - Whether video evidence exists
- **estimated_damages** - Estimated damage amount
- **third_party_involved** - Whether third parties are involved

---

## 7. Coverage

Specific coverage details within a policy.

- **coverage_id** - Unique identifier for coverage
- **policy_id** - Reference to parent policy
- **coverage_type** - Type of coverage (Liability, Collision, Comprehensive, Medical)
- **coverage_name** - Name of coverage
- **coverage_description** - Detailed description
- **coverage_limit** - Maximum coverage amount
- **per_occurrence_limit** - Limit per incident
- **aggregate_limit** - Total limit for policy period
- **deductible** - Deductible amount
- **premium_amount** - Premium for this coverage
- **effective_date** - Start date of coverage
- **expiration_date** - End date of coverage
- **coverage_status** - Status (Active, Inactive, Suspended)
- **exclusions** - List of exclusions
- **special_conditions** - Special terms or conditions
- **co_insurance_percentage** - Co-insurance rate if applicable
- **waiting_period** - Waiting period before coverage begins
- **territorial_limits** - Geographic limitations
- **sublimits** - Any sub-limits applicable
- **endorsements** - Additional endorsements

---

## 8. Payment

Financial transactions related to claim settlement.

- **payment_id** - Unique identifier for payment
- **claim_id** - Reference to associated claim
- **payee_id** - Reference to payment recipient
- **payment_type** - Type (Claim Payment, Reserve, Reimbursement, Salvage)
- **payment_method** - Method (Check, ACH, Wire, Card)
- **payment_amount** - Amount of payment
- **payment_date** - Date payment was made
- **payment_status** - Status (Pending, Approved, Issued, Cleared, Cancelled)
- **check_number** - Check number if applicable
- **transaction_reference** - Transaction reference number
- **payment_category** - Category (Property Damage, Medical, Lost Wages, etc.)
- **tax_withheld** - Amount of tax withheld
- **net_payment_amount** - Net amount after deductions
- **approval_date** - Date payment was approved
- **approved_by** - User who approved payment
- **payee_name** - Name of payee
- **payee_address** - Address of payee
- **payment_notes** - Additional payment notes
- **void_date** - Date payment was voided (if applicable)
- **reissue_flag** - Whether this is a reissued payment

---

## 9. Document

Documents and files associated with claims and policies.

- **document_id** - Unique identifier for document
- **claim_id** - Reference to associated claim
- **policy_id** - Reference to associated policy
- **document_type** - Type (Photo, Report, Form, Medical Record, Invoice)
- **document_name** - Name of document
- **document_description** - Brief description
- **file_name** - Original file name
- **file_path** - Storage path/location
- **file_size** - File size in bytes
- **file_format** - File format (PDF, JPG, PNG, DOCX)
- **upload_date** - Date uploaded
- **uploaded_by** - User who uploaded
- **document_date** - Date of the document content
- **page_count** - Number of pages
- **version_number** - Document version
- **is_confidential** - Confidentiality flag
- **retention_period** - How long to retain
- **access_restrictions** - Access control settings
- **indexing_keywords** - Search keywords
- **verification_status** - Whether verified/authenticated

---

## 10. Vehicle

Vehicle information for auto insurance claims.

- **vehicle_id** - Unique identifier for vehicle
- **claim_id** - Reference to associated claim
- **policy_id** - Reference to associated policy
- **vin** - Vehicle Identification Number
- **make** - Vehicle manufacturer
- **model** - Vehicle model
- **year** - Model year
- **color** - Vehicle color
- **license_plate** - License plate number
- **license_state** - State of registration
- **odometer_reading** - Current mileage
- **body_type** - Body style (Sedan, SUV, Truck, etc.)
- **ownership_status** - Owned, Leased, Financed
- **lienholder** - Lienholder information if applicable
- **purchase_date** - Date vehicle was purchased
- **purchase_price** - Original purchase price
- **current_value** - Current market value
- **repair_estimate** - Estimated repair cost
- **total_loss_indicator** - Whether vehicle is totaled
- **salvage_value** - Salvage value if totaled
- **damage_description** - Description of damage

---

## 11. Property

Property information for property insurance claims.

- **property_id** - Unique identifier for property
- **claim_id** - Reference to associated claim
- **policy_id** - Reference to associated policy
- **property_type** - Type (Residential, Commercial, Personal Property)
- **property_address** - Full street address
- **city** - City
- **state** - State
- **zip_code** - Postal code
- **county** - County
- **property_description** - Detailed description
- **year_built** - Year property was built
- **square_footage** - Total square footage
- **number_of_rooms** - Count of rooms
- **construction_type** - Construction materials/type
- **roof_type** - Type of roof
- **property_value** - Assessed value
- **mortgage_holder** - Mortgage company
- **occupancy_type** - Owner-occupied, Rental, Vacant
- **damage_extent** - Extent of damage
- **repair_estimate** - Estimated repair cost

---

## 12. Medical Expense

Medical costs and treatment information for injury claims.

- **medical_expense_id** - Unique identifier
- **claim_id** - Reference to associated claim
- **claimant_id** - Reference to claimant
- **provider_id** - Reference to medical provider
- **service_date** - Date of service
- **treatment_type** - Type of treatment/service
- **diagnosis_code** - ICD diagnosis code
- **procedure_code** - CPT procedure code
- **service_description** - Description of service
- **treatment_location** - Facility where treated
- **provider_name** - Name of provider
- **billed_amount** - Amount billed by provider
- **allowed_amount** - Amount allowed by insurance
- **paid_amount** - Amount actually paid
- **patient_responsibility** - Amount patient owes
- **payment_status** - Status of payment
- **bill_received_date** - Date bill was received
- **medical_report_available** - Whether medical report exists
- **follow_up_required** - Whether follow-up treatment needed
- **related_to_claim** - Relevance to claim

---

## 13. Witness

Witness information for incidents and claims.

- **witness_id** - Unique identifier for witness
- **claim_id** - Reference to associated claim
- **loss_id** - Reference to loss event
- **first_name** - First name
- **last_name** - Last name
- **contact_phone** - Phone number
- **contact_email** - Email address
- **address** - Current address
- **relationship_to_parties** - Relationship (None, Friend, Family, Bystander)
- **witness_type** - Type (Eyewitness, Expert, Character)
- **statement_provided** - Whether statement was given
- **statement_date** - Date statement was taken
- **statement_text** - Witness statement content
- **statement_method** - How statement was taken (Written, Recorded, In-person)
- **credibility_rating** - Assessed credibility
- **availability_for_testimony** - Available to testify
- **contacted_date** - Date first contacted
- **contacted_by** - Who contacted the witness
- **additional_notes** - Additional relevant information
- **consent_to_contact** - Permission to contact again

---

## 14. Service Provider

External service providers (repair shops, contractors, medical facilities, etc.).

- **provider_id** - Unique identifier for provider
- **provider_name** - Business name
- **provider_type** - Type (Auto Repair, Contractor, Medical, Legal, etc.)
- **tax_id** - Tax identification number
- **license_number** - Business license number
- **business_address** - Street address
- **city** - City
- **state** - State
- **zip_code** - Postal code
- **phone_number** - Business phone
- **fax_number** - Fax number
- **email_address** - Business email
- **website** - Website URL
- **preferred_vendor** - Whether preferred vendor
- **rating** - Quality rating
- **years_in_business** - Years operating
- **specialties** - Areas of specialization
- **insurance_certificate** - Insurance coverage details
- **payment_terms** - Standard payment terms
- **average_turnaround_time** - Average completion time

---

## 15. Reserve

Financial reserves set aside for claim payments.

- **reserve_id** - Unique identifier for reserve
- **claim_id** - Reference to associated claim
- **reserve_type** - Type (Indemnity, Expense, Medical)
- **initial_reserve_amount** - Initial amount set aside
- **current_reserve_amount** - Current reserve amount
- **paid_to_date** - Total paid so far
- **outstanding_reserve** - Remaining reserve amount
- **reserve_date** - Date reserve was set
- **set_by** - User who set reserve
- **reserve_basis** - Basis for reserve (Estimate, Actual, Policy Limit)
- **last_reviewed_date** - Date of last review
- **reviewed_by** - User who reviewed
- **adjustment_amount** - Amount of adjustment
- **adjustment_reason** - Reason for adjustment
- **adjustment_date** - Date of adjustment
- **automation_flag** - Whether automatically calculated
- **confidence_level** - Confidence in reserve accuracy
- **reserve_notes** - Additional notes
- **approval_required** - Whether approval needed for changes
- **approved_by** - Approver if required

---

## 16. Investigation

Investigative activities related to claims.

- **investigation_id** - Unique identifier for investigation
- **claim_id** - Reference to associated claim
- **investigation_type** - Type (Fraud, Liability, Coverage, SIU)
- **investigation_status** - Status (Open, In Progress, Completed, Suspended)
- **assigned_investigator_id** - Reference to investigator
- **start_date** - Date investigation began
- **completion_date** - Date investigation completed
- **priority_level** - Priority (Low, Medium, High, Urgent)
- **fraud_indicators** - Indicators of potential fraud
- **investigation_findings** - Summary of findings
- **recommendation** - Investigator recommendation
- **evidence_collected** - List of evidence collected
- **interviews_conducted** - Number of interviews
- **surveillance_required** - Whether surveillance is needed
- **surveillance_results** - Results if surveillance conducted
- **subrogation_potential** - Potential for subrogation
- **coverage_issues_identified** - Coverage concerns found
- **estimated_hours** - Estimated investigation hours
- **actual_hours** - Actual hours spent
- **cost_of_investigation** - Total investigation cost

---

## 17. Settlement

Settlement agreements and negotiations.

- **settlement_id** - Unique identifier for settlement
- **claim_id** - Reference to associated claim
- **settlement_type** - Type (Full and Final, Partial, Structured)
- **settlement_amount** - Total settlement amount
- **negotiated_date** - Date settlement was negotiated
- **settlement_date** - Date settlement was finalized
- **settlement_status** - Status (Proposed, Negotiating, Accepted, Rejected)
- **proposed_by** - Party who proposed settlement
- **negotiated_by** - Negotiator
- **approved_by** - Approver
- **approval_date** - Date approved
- **claimant_acceptance_date** - Date claimant accepted
- **release_form_signed** - Whether release was signed
- **release_date** - Date of release
- **payment_schedule** - If structured, payment schedule
- **terms_and_conditions** - Settlement terms
- **confidentiality_clause** - Confidentiality requirements
- **attorney_fees** - Attorney fees if applicable
- **settlement_reason** - Reason for settlement approach

---

## 18. Litigation

Legal proceedings related to claims.

- **litigation_id** - Unique identifier for litigation
- **claim_id** - Reference to associated claim
- **case_number** - Court case number
- **court_name** - Name of court
- **jurisdiction** - Legal jurisdiction
- **filing_date** - Date lawsuit filed
- **plaintiff** - Plaintiff name
- **defendant** - Defendant name
- **plaintiff_attorney** - Plaintiff's attorney
- **defendant_attorney** - Defense attorney
- **claim_amount_demanded** - Amount plaintiff is seeking
- **litigation_status** - Status (Filed, Discovery, Trial, Settled, Dismissed)
- **discovery_deadline** - Discovery cutoff date
- **trial_date** - Scheduled trial date
- **mediation_scheduled** - Whether mediation is scheduled
- **mediation_date** - Date of mediation
- **settlement_authority** - Settlement authorization amount
- **litigation_expenses** - Legal costs incurred
- **expert_witnesses** - List of expert witnesses
- **anticipated_verdict** - Expected outcome
- **verdict_date** - Date verdict rendered

---

## 19. Reinsurance

Reinsurance arrangements for claims.

- **reinsurance_id** - Unique identifier
- **claim_id** - Reference to associated claim
- **policy_id** - Reference to policy
- **reinsurer_name** - Name of reinsurer
- **reinsurer_id** - Reinsurer identifier
- **reinsurance_type** - Type (Proportional, Non-Proportional, Facultative)
- **treaty_reference** - Treaty reference number
- **retention_amount** - Company retention amount
- **ceded_amount** - Amount ceded to reinsurer
- **reinsurer_share_percentage** - Reinsurer's percentage
- **reinsurance_premium** - Premium paid to reinsurer
- **notice_date** - Date reinsurer was notified
- **notice_method** - How reinsurer was notified
- **recovery_amount** - Amount recoverable
- **recovered_to_date** - Amount recovered so far
- **outstanding_recovery** - Amount still to recover
- **payment_terms** - Reinsurer payment terms
- **dispute_status** - Any disputes with reinsurer
- **collection_status** - Status of recovery collection
- **reinsurance_notes** - Additional notes

---

## 20. Fraud Alert

Fraud detection and prevention records.

- **fraud_alert_id** - Unique identifier for fraud alert
- **claim_id** - Reference to associated claim
- **alert_date** - Date alert was generated
- **alert_type** - Type (Automatic, Manual, Tip)
- **alert_source** - Source of alert (System, Employee, Anonymous Tip)
- **fraud_indicators** - List of fraud indicators detected
- **risk_score** - Calculated fraud risk score
- **alert_status** - Status (New, Under Review, Confirmed, False Positive)
- **assigned_to** - SIU investigator assigned
- **priority_level** - Investigation priority
- **fraud_type_suspected** - Type of fraud (Hard, Soft, Staged, etc.)
- **investigation_started_date** - Date investigation began
- **investigation_completed_date** - Date investigation completed
- **findings** - Investigation findings
- **action_taken** - Action taken (Denied, Referred to Law Enforcement, etc.)
- **amount_saved** - Amount saved by detecting fraud
- **law_enforcement_notified** - Whether police notified
- **prosecution_status** - Status of criminal case
- **red_flags_identified** - Specific red flags found
- **recommendations** - Recommendations for prevention

---

## Entity Relationships Summary

**Key Relationships:**
- Claim is central, connected to Policy, Claimant, Loss, Coverage, Payment, Documents
- Policy connects to Policyholder, Coverage, Claims
- Loss connects to Claim, Witnesses, Property/Vehicle
- Investigation links to Claim, Fraud Alert
- Settlement and Litigation are claim resolution paths
- Service Providers connect to Claims for repairs/services
- Medical Expenses link to Claimants and Claims
- Reinsurance connects to Claims and Policies for risk transfer
