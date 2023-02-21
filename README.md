# Reports System - Using Next.js and Graphql 📟

This is a monorepo to monitor realtime spam reports,
using [Turborepo](https://turborepo.org/) and [pnpm workspaces](https://pnpm.io/workspaces) to link packages together.

## Acknowledgements

- [Mext.js](https://nextjs.org/)
- [Graphql Yoga](https://the-guild.dev/graphql/yoga-server)
- [MongoDB](https://www.mongodb.com/)

## Installation

1. Clone the Repo and relocate to the project.

2. Locate the .env file in the root project and run:

```bash
    pnpm install
```

```bash
    pnpm dev
```

The web app will run as default at http://localhost:3000

The grapahql server will run at http://localhost:4000/graphql

## Environment Variables

To run this project, you need to use the env variables from admin

## Running Tests

Test where not completed, but you can test the server with graphql playground

Insert report mutation:

```
mutation {
  addReport(
    state: "OPEN"
    source: "REPORT"
    sourceIdentityId: "12334-graphql"
    reference: {referenceId: "12343-ref", referenceType: "REPORT"}
    payload: {source: "REPORT", reportType: "SPAM", message: "hello world", reportId: "6706b3ba-bf36-4ad4-9b9d-4ebf4f4e2429", referenceResourceId: "a03411ce-0197-49a2-86d4-55e06aa52e79", referenceResourceType: "REPLY"}
  ) {
    id
    state
    payload {
      reportType
      message
    }
  }
}
```

Reports query:

```
    query {
        reports {
            id
        }
    }
```
