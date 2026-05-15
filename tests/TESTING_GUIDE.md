# Testing Guide

## Unit Tests

- `npm test`
- Add unit tests for services, validation, and utilities

### Recommended tests

- `storage.test.js`
- `validation.test.js`
- `search.test.js`
- `noteContext.test.js`

## Integration Tests

- Create workflows for note creation, update, delete, pin, and search
- Use React Native Testing Library for component integration

## Manual Verification

Use the Phase 9 checklist in `docs/phase_9_10_completion.md` for manual app flows and device testing.

## Coverage

- Aim for coverage on all CRUD operations
- Verify state persistence and navigation flows
- Confirm error and empty states display correctly
