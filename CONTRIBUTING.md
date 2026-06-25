# Contributing to SubSense

We welcome contributions to SubSense! This document outlines our standard operating procedures for code delivery.

## Setup Instructions

1. **Fork and Clone**: Fork the repository on GitHub and clone it locally.
2. **Install Node**: Ensure you are running Node.js 18 or 20.
3. **Install Dependencies**: Run `npm install`.
4. **Environment Configuration**: Duplicate `.env.example` to `.env.local` and populate the necessary Supabase and Gemini keys.
5. **Start Dev Server**: Run `npm run dev`.

## Coding Standards

- **Strict TypeScript**: We enforce a strict TypeScript environment. Avoid `any` unless explicitly wrapping untyped LLM dynamic JSON payloads.
- **Tailwind CSS**: Utilize Tailwind utility classes. Do not use inline `style={{}}` unless dynamically calculating positional physics (e.g. Canvas/Framer interactions).
- **React Components**: All components should be strongly typed functional components. Do not use Class components.
- **API Formatting**: All API modifications must rigorously adhere to the `{ success: boolean, data?: any, error?: string }` contract defined in `API.md`.

## Linting & Formatting

Before opening a Pull Request, you must verify your code passes our ESLint gauntlet.

```bash
# Verify no linting errors exist
npm run lint

# Verify no TypeScript compilation errors exist
npm run build
```

## Branching Strategy

- `main`: Our production-ready release branch. Do not commit directly to `main`.
- `develop`: Our integration branch. All features should branch from `develop`.
- `feat/your-feature-name`: Feature branch naming convention.
- `fix/your-bug-name`: Bug fix branch naming convention.

## Pull Request Guidelines

1. **Keep it focused**: One PR = One Feature/Fix.
2. **Draft PRs**: Open a draft PR early if you want architectural feedback.
3. **Descriptive Title**: Clearly state the change in the PR title.
4. **Pass the CI Gate**: Ensure Vercel preview deployments succeed and the build gate throws zero compilation errors.
5. **Required Reviewers**: You must receive at least 1 approval from a core maintainer before merging into `develop`.
