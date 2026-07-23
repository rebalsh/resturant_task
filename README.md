

# Restaurant Full-Stack Application 🍽️

This repository contains a full-stack restaurant application. The infrastructure has been modernized to run entirely on **Kubernetes** with a fully automated **CI/CD pipeline** (GitOps approach using GitHub Actions and ArgoCD).

## 🚀 Prerequisites
To run this project locally, ensure you have the following installed:
- **Docker Desktop** (with **Kubernetes** enabled in settings).
- **kubectl** CLI tool.
- **Git**.

---

## 🛠️ How to Run the Project Locally

### 1. Clone the Repository
```bash
git clone https://github.com/rebalsh/resturant_task.git




Setup Secrets (Important)
For security reasons, sensitive data (Hardcoded Secrets) is not pushed to GitHub. Please create a secrets.yaml file inside the k8s-manifests folder with the following content:


apiVersion: v1
kind: Secret
metadata:
  name: backend-secrets
type: Opaque
stringData:
  ADMIN_PASSWORD: "SuperSecretAdminPassword2026"
  JWT_SECRET: "your_ultra_secure_jwt_secret_key_here"
  EMAIL_PASS: "lcsdqwomvsvvrwel"
Apply the secret before running the deployment:

Bash
kubectl apply -f k8s-manifests/secrets.yaml

3. Deploy the Application
Once the secrets are applied, you can deploy the Backend and Frontend to your local Kubernetes cluster:

Bash
kubectl apply -f k8s-manifests/backend.yaml
kubectl apply -f k8s-manifests/frontend.yaml



Access the Application
Wait a few moments for the Pods to be in the Running state, then open your browser:
http://localhost/
http://localhost/admin/login


Docker Hub Repositories (CI Pipeline)
The CI pipeline (GitHub Actions) automatically builds and pushes the images to Docker Hub upon every push. You can view them here:

Backend Image: rebal1sh/restaurant-backend

Frontend Image: rebal1sh/restaurant-frontend

🏗️ Future Improvements (Production-Ready Architecture)
While this is a test task kept relatively simple for local execution, moving to a real Production environment would involve the following architectural upgrades:

Database Upgrade: Replace SQLite with a robust external database like PostgreSQL to enable High Availability (HA) and increase Backend Replicas safely.

Networking & Security: Change the Backend Service type from LoadBalancer to ClusterIP to hide it from the public internet, and use an Ingress Controller to manage routing securely.

Image Tagging: Avoid using the latest tag in Docker images. Instead, use the Git Commit Hash to ensure precise version tracking and to trigger ArgoCD synchronization automatically.

Health Checks: Implement Liveness and Readiness Probes in the Kubernetes manifests to ensure container health and zero-downtime deployments.