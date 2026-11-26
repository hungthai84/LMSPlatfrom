// Phase 0 Security Test Specification for EDU LMS Firestore Rules
// Verifies the Dirty Dozen attack payloads against firestore.rules invariants.

export const DIRTY_DOZEN_CASES = [
  { name: "1. Unauthenticated read/write to /courses/c1", expected: "PERMISSION_DENIED" },
  { name: "2. Unverified email write to /discussions/p1", expected: "PERMISSION_DENIED" },
  { name: "3. Self-role escalation to super_admin on /users/{uid} create", expected: "PERMISSION_DENIED" },
  { name: "4. Self-role escalation on /users/{uid} update", expected: "PERMISSION_DENIED" },
  { name: "5. Shadow field injection (isVerifiedBySystem: true) on /courses/c1", expected: "PERMISSION_DENIED" },
  { name: "6. Cross-user PII read on /users/{otherUid}/private/info", expected: "PERMISSION_DENIED" },
  { name: "7. ID poisoning (invalid path chars or >128 chars)", expected: "PERMISSION_DENIED" },
  { name: "8. String overflow (>3000 chars) on /discussions/p1 content", expected: "PERMISSION_DENIED" },
  { name: "9. Spoofed ownerId on /enrollments/e1 create", expected: "PERMISSION_DENIED" },
  { name: "10. Forged client timestamp on /courses/c1 create", expected: "PERMISSION_DENIED" },
  { name: "11. Learner self-verifying paymentStatus on /orders/o1", expected: "PERMISSION_DENIED" },
  { name: "12. Tampering with immutable /auditLogs/log1 via update/delete", expected: "PERMISSION_DENIED" }
] as const;
