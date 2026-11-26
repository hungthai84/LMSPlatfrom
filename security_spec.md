# EDU LMS Security Specification (Phase 0 - Payload-First Security TDD)

## 1. Core Data Invariants
1. **Identity Integrity**: Every user-created document (`ownerId`, `userId`, `studentId`) must match `request.auth.uid` on creation unless executed by a verified Admin (`isAdmin()`).
2. **Privilege Escalation Prevention**: Users creating `/users/{userId}` can only self-register with `role == 'learner'` (unless they are the bootstrapped Super Admin email). Users cannot modify `role`, `status`, or `xp` on their own profile via client updates.
3. **PII Isolation**: Email, phone, and employee codes reside exclusively in `/users/{userId}/private/{docId}`, readable/writable only by `isOwner(userId)` or `isAdmin()`.
4. **Master Gate Relational Sync**: Subcollection `/courses/{courseId}/lessons/{lessonId}` validates parent `/courses/{courseId}` existence and ownership/admin role via `exists()` / `get()`.
5. **Immutable Audit Trail**: `/auditLogs/{logId}` is append-only (`create` allowed for verified actors matching `ownerId == request.auth.uid`; `update` and `delete` strictly forbidden).
6. **Terminal State & Payment Integrity**: Orders in `/orders/{orderId}` can only be created with `paymentStatus == 'pending_webhook'`. Clients cannot self-mark an order as `'verified'` without Admin verification.
7. **Temporal Integrity**: All `createdAt` and `updatedAt` fields must equal `request.time`, and `createdAt` + `ownerId` remain immutable on update.
8. **Size & Type Boundaries**: All document IDs match `^[a-zA-Z0-9_\-]+$` (`<= 128` chars), and every string/list field has explicit `.size()` constraints.

## 2. The "Dirty Dozen" Attack Payloads (Expected: PERMISSION_DENIED)
1. **Unauthenticated Read/Write**: Read `/courses/c1` or write `/courses/c1` without `request.auth` -> `PERMISSION_DENIED`.
2. **Unverified Email Write**: Authenticated user with `email_verified == false` attempting to create `/discussions/p1` -> `PERMISSION_DENIED`.
3. **Self-Role Escalation on Create**: Learner creating `/users/{uid}` with `role: 'super_admin'` -> `PERMISSION_DENIED`.
4. **Self-Role Escalation on Update**: Learner updating `/users/{uid}` `affectedKeys: ['role']` -> `PERMISSION_DENIED`.
5. **Shadow / Ghost Field Injection**: Creating `/courses/c1` with extra undocumented field `isVerifiedBySystem: true` -> `PERMISSION_DENIED`.
6. **PII Cross-Read Attack**: User A reading `/users/userB/private/info` -> `PERMISSION_DENIED`.
7. **ID Poisoning Attack**: Writing to `/courses/` with a 500-character ID or invalid characters `../admin` -> `PERMISSION_DENIED`.
8. **Denial of Wallet String Overflow**: Creating `/discussions/p1` with `content` > 3000 chars -> `PERMISSION_DENIED`.
9. **Spoofed Owner Attack**: User A creating `/enrollments/e1` with `ownerId: 'userB'` -> `PERMISSION_DENIED`.
10. **Client-Forged Timestamp**: Creating `/courses/c1` with `createdAt: Timestamp(2020-01-01)` instead of `request.time` -> `PERMISSION_DENIED`.
11. **Fake Payment Self-Verification**: Learner updating `/orders/o1` to `paymentStatus: 'verified'` -> `PERMISSION_DENIED`.
12. **Audit Log Tampering**: Any user (even admin) attempting to `update` or `delete` `/auditLogs/log1` -> `PERMISSION_DENIED`.
