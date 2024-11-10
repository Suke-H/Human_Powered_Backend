variable "project_id" {
  type        = string
  description = "GCP Project ID"
}

variable "region" {
  type        = string
  description = "GCP Region"
  default     = "asia-northeast1"
}

variable "github_repo" {
  type        = string
  description = "GitHubリポジトリ (例: user/repo)"
}

variable "github_actions" {
  type = object({
    service_account_name            = string
    workload_identity_pool_name     = string
    workload_identity_provider_name = string
  })
  default = {
    service_account_name            = "${var.project_id}-github-actions-sa"
    workload_identity_pool_name     = "${var.project_id}-github-actions-pool"
    workload_identity_provider_name = "${var.project_id}-github-provider"
  }
  description = "GitHub Actions関連の設定"
}

variable "enabled_apis" {
  type        = list(string)
  description = "プロジェクトに必要なAPI"
  default     = [
    "iam.googleapis.com",
    "iamcredentials.googleapis.com",
    "cloudresourcemanager.googleapis.com",
    "run.googleapis.com",
    "artifactregistry.googleapis.com"
  ]
}

variable "terraform_sa_roles" {
  type        = list(string)
  description = "Terraform用サービスアカウントに付与するロール"
  default     = [
    "roles/iam.serviceAccountAdmin",
    "roles/iam.workloadIdentityPoolAdmin",
    "roles/serviceusage.serviceUsageAdmin"
  ]
}

variable "github_actions_roles" {
  type        = list(string)
  description = "GitHub Actions用サービスアカウントに付与するロール"
  default     = [
    "roles/run.admin",
    "roles/iam.serviceAccountUser",
    "roles/artifactregistry.writer"
  ]
}