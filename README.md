# Kubernetes Workshop

This project contains interactive slides to teach the basics of container orchestration and kubernetes. 
The content of this workshop is tailored towards beginners for container orchestration.

## Prerequisites

Participants for this workshop should have basic knowledge of containers, networking, consistency and distributed applications, 
as well as basic knowledge on how to use a command line.

## Contents

- Introduction / Why another layer of indirection?
- Basics
  - What is Orchestration?
  - What benefits over plain containers?
  - Kubernetes Basics
  - Relation between kubernetes and containers
  - OCI Standards
- The Kubernetes System
  - Control Loop
  - Nodes
  - Deployments
  - DaemonSets
  - Services
  - Configuration
  - Secrets
  - Persistency
  - Extensibility
- Managing large deployments
- Best Practices
  - Resource Management
  - Containerization
  - Sidecars

## Hacking on the presentation

This project is organized as a standard [Angular](https://angular.io) project. 
To work on it, you can use the following commands:

```sh
npm ci
npm start # will start a development server on port 4200
```

Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

## Deploying

The presentation is shipped as a container, which can be used in the runtime or orchestration software of your choice.
We support customizing the URLs that the participants can use to distribute workshop, by mounting a `config.json` file into the container at `/usr/share/nginx/html/config.json`.
