---
argument-hint: [feature]
description: Initialize a new feature branch named feature/[feature-name]-[YYYY-MM-DD] and set up for development
---
## Overview
Systematically set up a new feature from initial planning through to implementation structure.

## Steps
1. **Create a Git branch** following this naming convention:
   - Format: `feature/[feature]-[YYYY-MM-DD]`
   - Use kebab-case for the feature name
   - Use today's date in ISO format
   - Example: `feature/user-authentication-2025-10-18`

2. **Analyze the existing codebase** to understand:
   - Current architecture and patterns (`AGENT.md`)
  
3. **Understand the feature** to implement
   - Read the file in argument[feature]

4. **Think deeply and create a comprehensive implementation plan**
   - Design **data models and Server actions**
   - Plan **UI components** and flow
   - Consider **testing strategy** (if vistest is installed)
   - **Dependencies**: External libraries or internal modules needed
   - **SEO** impacts
   - **Accessibility (A11y)** requirements 

5. **Ask clarifying questions** if anything is unclear or ambiguous about:
   - Feature requirements or expected behavior
   - Technical constraints or preferences
   - Integration points with existing code
   - Priority or timeline considerations
   - User experience or UI/UX expectations

## Feature Setup Checklist
- [ ] Requirements documented
- [ ] Technical approach planned
- [ ] Feature branch created
- [ ] Development environment ready