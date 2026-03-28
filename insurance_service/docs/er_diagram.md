# Database ER Diagram (Mermaid)

```mermaid
erDiagram
    USER ||--o{ USER_POLICY : purchases
    POLICY_MASTER ||--o{ USER_POLICY : template_for
    USER_POLICY ||--o{ CLAIM : covered_by
    CLAIMANT ||--o{ CLAIM : files
    LOSS ||--|| CLAIM : describes
    CLAIM ||--o{ DOCUMENT : contains
    USER ||--o{ CLAIM : verifies

    USER {
        uuid id PK
        string username UK
        string email UK
        string password_hash
        string first_name
        string last_name
        string role "policyholder | employee | admin"
        boolean is_active
    }

    POLICY_MASTER {
        uuid id PK
        string name
        string description
        string policy_type
        float base_premium
        string coverage_details
    }

    USER_POLICY {
        uuid id PK
        string policy_number UK
        datetime start_date
        datetime end_date
        float premium_paid
        string status
        uuid user_id FK
        uuid policy_master_id FK
    }

    CLAIMANT {
        uuid id PK
        string first_name
        string last_name
        string email
        string phone
        string relationship_to_insured
    }

    CLAIM {
        uuid id PK
        string claim_number UK
        string claim_status
        float estimated_loss_amount
        datetime verified_at
        uuid verified_by_id FK
        uuid user_policy_id FK
        uuid claimant_id FK
        uuid loss_id FK
    }

    LOSS {
        uuid id PK
        datetime loss_date
        string loss_type
        string loss_cause
        string loss_location
        string loss_description
    }

    DOCUMENT {
        uuid id PK
        string document_name
        string document_type
        string file_path
        string file_format
        uuid claim_id FK
    }
