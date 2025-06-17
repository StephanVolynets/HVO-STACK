variable "project_id" {
  description = "The GCP project ID"
  type        = string
}

variable "topics" {
  description = "Map of topic names to their subscription configurations"
  type        = map(object({
    subscription_name = string
    push_endpoint     = string
  }))
}

resource "google_pubsub_topic" "topic" {
  for_each = var.topics
  name     = each.key
  project  = var.project_id
}

resource "google_pubsub_subscription" "subscription" {
  for_each = var.topics
  
  name    = each.value.subscription_name
  topic   = google_pubsub_topic.topic[each.key].name
  project = var.project_id
  
  push_config {
    push_endpoint = each.value.push_endpoint
    
    attributes = {
      x-goog-version = "v1"
    }
  }
  
  ack_deadline_seconds = 60
  
  # Dead letter policy for failed messages
  dead_letter_policy {
    dead_letter_topic     = google_pubsub_topic.dead_letter.id
    max_delivery_attempts = 5
  }
  
  # Retry policy
  retry_policy {
    minimum_backoff = "10s"
    maximum_backoff = "600s"
  }
}

# Dead Letter Topic for failed message processing
resource "google_pubsub_topic" "dead_letter" {
  name    = "dead-letter-queue"
  project = var.project_id
}

resource "google_pubsub_subscription" "dead_letter_sub" {
  name    = "dead-letter-subscription"
  topic   = google_pubsub_topic.dead_letter.name
  project = var.project_id
  
  # For dead letter queue, we use pull subscription that can be monitored
  ack_deadline_seconds = 600
}

output "topic_names" {
  value = {
    for k, v in google_pubsub_topic.topic : k => v.name
  }
}

output "dead_letter_topic" {
  value = google_pubsub_topic.dead_letter.name
}
