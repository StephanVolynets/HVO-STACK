# Media Services Infrastructure

This repository contains Terraform configurations for our media services infrastructure, including:

- Video transcoding requests and completions via Google Transcoder API
- File transfers between Box and Google Cloud Storage
- Microservice endpoints for processing media files

## Structure

- `modules/` - Reusable Terraform modules
  - `pubsub/` - Pub/Sub topics and subscriptions
  - `endpoints/` - Cloud Run service and IAM permissions
- `environments/` - Environment-specific configurations
  - `dev/` - Development environment (human-voice-over-dev)
  - `prod/` - Production environment (human-voice-over-prod)

## Setup

### Prerequisites

1. Install Terraform (version 1.0.0 or later)
2. Install Google Cloud SDK
3. Authenticate with Google Cloud: `gcloud auth application-default login`
4. Create GCS buckets for Terraform state:
   ```bash
   gcloud storage buckets create gs://human-voice-over-dev-terraform-state --location=us-central1
   gcloud storage buckets create gs://human-voice-over-prod-terraform-state --location=us-central1
   ```
