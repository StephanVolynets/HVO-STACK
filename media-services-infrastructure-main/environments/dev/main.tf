provider "google" {
  project = var.project_id
  region  = var.region
}

terraform {
  required_providers {
    google = {
      source  = "hashicorp/google"
      version = "~> 4.60.0"
    }
  }
  
  backend "gcs" {
    bucket = "human-voice-over-dev-terraform-state"
    prefix = "terraform/media-services/state"
  }
}

# Enable required APIs
resource "google_project_service" "storage_transfer_api" {
  project = var.project_id
  service = "storagetransfer.googleapis.com"
  
  disable_dependent_services = false
  disable_on_destroy         = false
}

module "pubsub" {
  source = "../../modules/pubsub"
  
  project_id = var.project_id
  topics = {
    "video-transcoding-requests" = {
      subscription_name = "video-transcoding-requests-sub"
      push_endpoint     = "${var.microservice_url}/api/video/transcode"
    },
    "video-transcoding-completions" = {
      subscription_name = "video-transcoding-completions-sub"
      push_endpoint     = "${var.microservice_url}/api/video/process-transcoded"
    },
    "box-to-gcs" = {
      subscription_name = "box-to-gcs-sub"
      push_endpoint     = "${var.microservice_url}/api/box/mirror-to-gcs"
    },
    "gdrive-to-gcs-completions" = {
      subscription_name = "gdrive-to-gcs-completions-sub"
      push_endpoint     = "${var.microservice_url}/api/drive/transfer-completed"
    }
  }
}



# Create a service account for Transcoder operations
resource "google_service_account" "transcoder_sa" {
  account_id   = "transcoder-publisher"
  display_name = "Transcoder Publisher Service Account"
  project      = var.project_id
}

# Grant transcoder.admin role to this service account
resource "google_project_iam_member" "transcoder_admin" {
  project = var.project_id
  role    = "roles/transcoder.admin"
  member  = "serviceAccount:${google_service_account.transcoder_sa.email}"
}

# Grant this service account permission to publish to the topic
resource "google_pubsub_topic_iam_binding" "transcoder_publisher" {
  project = var.project_id
  topic   = module.pubsub.topic_names["video-transcoding-completions"]
  role    = "roles/pubsub.publisher"
  members = [
    "serviceAccount:${google_service_account.transcoder_sa.email}"
  ]
}

# Create a service account for Storage Transfer operations
resource "google_service_account" "storage_transfer_sa" {
  account_id   = "storage-transfer-publisher"
  display_name = "Storage Transfer Publisher Service Account"
  project      = var.project_id
}

# Grant storagetransfer.admin role to this service account
resource "google_project_iam_member" "storage_transfer_admin" {
  project = var.project_id
  role    = "roles/storagetransfer.admin"
  member  = "serviceAccount:${google_service_account.storage_transfer_sa.email}"
}

# Grant publish permission to the gdrive-to-gcs-completions topic
resource "google_pubsub_topic_iam_binding" "storage_transfer_publisher" {
  project = var.project_id
  topic   = module.pubsub.topic_names["gdrive-to-gcs-completions"]
  role    = "roles/pubsub.publisher"
  members = [
    "serviceAccount:${google_service_account.storage_transfer_sa.email}"
  ]
}

# Get project number for IAM bindings
data "google_project" "project" {
  project_id = var.project_id
}

output "pubsub_topics" {
  value = module.pubsub.topic_names
}

output "transcoder_service_account" {
  value = google_service_account.transcoder_sa.email
}

output "storage_transfer_service_account" {
  value = google_service_account.storage_transfer_sa.email
}

# Variables
variable "project_id" {
  description = "The GCP project ID"
  type        = string
  default     = "human-voice-over-dev"
}

variable "region" {
  description = "The GCP region"
  type        = string
  default     = "us-central1"
}

variable "microservice_url" {
  description = "The base URL of your microservice"
  type        = string
}
