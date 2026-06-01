# Retail Platform - End-to-End Architecture

## Project Overview

The Retail Platform is a cloud-native microservices application deployed on Amazon EKS. The platform follows modern DevOps and Platform Engineering practices including Infrastructure as Code, CI/CD automation, Kubernetes orchestration, centralized secrets management, observability, and automated scaling.

The application consists of multiple Spring Boot microservices, a frontend application, Amazon RDS database, AWS networking components, and a complete monitoring stack using Prometheus, Grafana, and Alertmanager.

---

# High-Level Architecture

User requests follow the below flow:

User Browser

↓

Route53 DNS

↓

AWS Application Load Balancer (ALB)

↓

Kubernetes Ingress

↓

Gateway Service

↓

Auth Service / Order Service

↓

Amazon RDS MySQL

---

# Technology Stack

## Frontend Layer

### Technologies

* HTML
* CSS
* JavaScript
* Nginx

### Purpose

Provides the user interface for the retail application.

### Deployment

Containerized using Docker and deployed as a Kubernetes Deployment on Amazon EKS.

---

## API Gateway Layer

### Technologies

* Java 17
* Spring Boot
* Spring Cloud Gateway

### Responsibilities

* Single entry point for all backend services
* Request routing
* API aggregation
* Authentication forwarding
* Centralized API management

### Example

Incoming Request:

/api/auth/login

Gateway Routes To:

auth-service

---

## Authentication Service

### Technologies

* Java 17
* Spring Boot
* Spring Security
* JWT Authentication
* Spring Data JPA
* Hibernate

### Responsibilities

* User Registration
* User Login
* JWT Token Generation
* User Authentication
* User Authorization

### Database

Amazon RDS MySQL

---

## Order Service

### Technologies

* Java 17
* Spring Boot
* Spring Data JPA
* Hibernate

### Responsibilities

* Create Orders
* Retrieve Orders
* Business Logic Processing

### Database

Amazon RDS MySQL

---

# Container Platform

## Amazon EKS

### Purpose

Provides managed Kubernetes control plane for container orchestration.

### Responsibilities

* Pod Scheduling
* High Availability
* Self Healing
* Auto Scaling
* Rolling Updates
* Service Discovery

### Worker Nodes

EC2 Managed Node Groups

---

# Container Runtime

### Technology

containerd

### Purpose

Runs application containers on Kubernetes worker nodes.

---

# Networking Architecture

## Route53

### Purpose

Provides DNS resolution.

### Example

auth-dev.cloudai.click

Resolves to:

AWS Application Load Balancer

---

## AWS Application Load Balancer (ALB)

### Created By

AWS Load Balancer Controller

### Responsibilities

* Internet-facing traffic entry point
* SSL Termination
* Host-based routing
* Path-based routing

### Example

https://auth-dev.cloudai.click

↓

ALB

↓

Ingress

↓

Service

↓

Pod

---

## Kubernetes Ingress

### Purpose

Connects ALB with Kubernetes Services.

### Benefits

* Centralized routing
* Single ALB for multiple services
* Reduced AWS cost

---

## Kubernetes Services

### Service Type

ClusterIP

### Services

* auth-service
* gateway-service
* order-service
* frontend

### Responsibilities

* Internal Load Balancing
* Service Discovery

---

# Database Layer

## Amazon RDS MySQL

### Purpose

Stores application data.

### Usage

Auth Service:

* User Data
* Credentials

Order Service:

* Order Data
* Transaction Information

### Benefits

* Managed Database
* Automated Backups
* High Availability
* Automated Patching

---

# Secrets Management

## AWS Secrets Manager

Stores:

* Database Credentials
* Application Secrets
* JWT Secrets

---

## External Secrets Operator (ESO)

### Flow

AWS Secrets Manager

↓

External Secrets Operator

↓

Kubernetes Secret

↓

Application Pod

### Benefits

* No secrets stored in Git
* Centralized secret management
* Automatic synchronization

---

# CI/CD Pipeline

## Technologies

* GitHub
* GitHub Actions
* Docker
* Amazon ECR
* Helm

---

## Deployment Flow

Developer Push

↓

GitHub Repository

↓

GitHub Actions

↓

Build Maven Project

↓

Run Tests

↓

Build Docker Image

↓

Push Image to Amazon ECR

↓

Helm Upgrade

↓

Deploy to Amazon EKS

---

# Infrastructure as Code

## Technology

Terraform

### Resources Managed

* VPC
* Public Subnets
* Private Subnets
* Route Tables
* NAT Gateway
* Internet Gateway
* Security Groups
* IAM Roles
* EKS Cluster
* EKS Node Groups
* RDS Database

### Benefits

* Repeatable Deployments
* Version Control
* Automation
* Disaster Recovery

---

# Observability Stack

## Spring Boot Actuator

### Endpoint

/actuator/health

Provides:

* Application Health
* Liveness Status
* Readiness Status

---

## Micrometer

### Purpose

Collects application metrics.

### Metrics Examples

* JVM Memory
* JVM Threads
* HTTP Requests
* Database Connections
* Application Uptime

---

## Prometheus

### Purpose

Collects and stores metrics.

### Metric Collection Flow

Application

↓

/actuator/prometheus

↓

ServiceMonitor

↓

Prometheus

### Responsibilities

* Metric Collection
* Time Series Storage
* Querying with PromQL
* Alert Evaluation

---

## Grafana

### Purpose

Visualization Layer

### Dashboards

* Application Health
* JVM Metrics
* Resource Utilization
* Kubernetes Metrics
* Infrastructure Monitoring

### Example Metrics

* CPU Usage
* Memory Usage
* Pod Health
* Request Rate
* JVM Heap Usage

---

## Alertmanager

### Purpose

Alert Routing and Notification

### Alert Flow

Prometheus Rule

↓

Prometheus

↓

Alertmanager

↓

Email / Slack / Teams

### Example Alert

AuthServiceDown

Triggered when:

Available Replicas < 1

---

# Prometheus Storage

## Grafana Storage

Stored In:

Grafana PVC

Stores:

* Dashboards
* Users
* Datasources
* Settings

---

## Prometheus Storage

Stored In:

Prometheus PVC

Backed By:

AWS EBS gp3 Volume

Stores:

* Time Series Database (TSDB)
* Historical Metrics

### Retention

2 Days

### Production Best Practice

Prometheus

↓

Remote Write

↓

Amazon Managed Prometheus / Thanos

↓

Long-Term Storage

---

# Kubernetes Components Used

## Deployments

Used For

* Frontend
* Gateway Service
* Auth Service
* Order Service

---

## StatefulSets

Used For

* Prometheus
* Alertmanager

Reason:

Requires persistent storage.

---

## Horizontal Pod Autoscaler (HPA)

Configured For

* Auth Service
* Gateway Service
* Order Service

Purpose:

Automatic scaling based on CPU utilization.

---

# Interview Explanation (2-3 Minutes)

"In my recent project, I worked on a cloud-native retail platform deployed on Amazon EKS. The application consists of Spring Boot microservices including Gateway, Auth, and Order services. Traffic enters through Route53 and an AWS Application Load Balancer managed by AWS Load Balancer Controller. Kubernetes Ingress routes requests to internal ClusterIP services. The backend services communicate with Amazon RDS MySQL and retrieve secrets from AWS Secrets Manager using External Secrets Operator.

The complete infrastructure including VPC, EKS, RDS, IAM roles, and networking components is provisioned using Terraform. CI/CD is implemented using GitHub Actions, Docker, Amazon ECR, and Helm. For observability, we expose application metrics using Spring Boot Actuator and Micrometer, collect metrics through Prometheus, visualize them using Grafana, and manage alerts through Alertmanager. Prometheus data is stored on persistent EBS-backed volumes and application secrets are centrally managed through AWS Secrets Manager."
