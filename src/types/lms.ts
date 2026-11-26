export type LmsRoleId =
  | "super_admin"
  | "system_admin"
  | "training_director"
  | "training_manager"
  | "organization_admin"
  | "department_manager"
  | "instructor"
  | "teaching_assistant"
  | "evaluator"
  | "learner"
  | "auditor"
  | "guardian";

export type PermissionAction = "view" | "create" | "edit" | "delete" | "approve" | "export";

export type SystemThemeId =
  | "glass-liquid"
  | "glass-light"
  | "ocean-navy-light"
  | "ocean-navy-dark"
  | "dark-neon"
  | "flat-light"
  | "origin-os";

export type LanguageCode = "vi" | "en";

export type LmsRouteId =
  | "dashboard"
  | "training-analytics"
  | "courses"
  | "learning-paths"
  | "training-plans"
  | "course-builder"
  | "learning-library"
  | "users-rbac"
  | "organizations"
  | "classrooms"
  | "enrollments"
  | "assessments"
  | "gradebook"
  | "certificates"
  | "gamification"
  | "community"
  | "ai-learning"
  | "reports"
  | "commerce"
  | "integrations"
  | "system-admin";

export interface LmsUser {
  uid: string;
  displayName: string;
  avatar: string;
  role: LmsRoleId;
  secondaryRoles?: LmsRoleId[];
  orgId?: string;
  deptId?: string;
  xp: number;
  level: number;
  status: "active" | "suspended" | "archived";
  email?: string;
  phone?: string;
  employeeCode?: string;
  isDemo?: boolean;
  ownerId: string;
}

export interface OrganizationItem {
  id: string;
  code: string;
  name: string;
  orgType: "enterprise" | "academy" | "branch" | "partner";
  status: "active" | "inactive";
  isDemo?: boolean;
  ownerId: string;
}

export interface DepartmentItem {
  id: string;
  orgId: string;
  name: string;
  managerName?: string;
  budget?: number;
  isDemo?: boolean;
  ownerId: string;
}

export interface LmsCourse {
  id: string;
  code: string;
  title: string;
  category: string;
  description?: string;
  level: "beginner" | "intermediate" | "advanced";
  durationHours?: number;
  price?: number;
  passingScore?: number;
  status: "draft" | "pending" | "published" | "active" | "completed" | "archived";
  isPublic: boolean;
  instructorId: string;
  instructorName: string;
  thumbnailUrl?: string;
  isDemo?: boolean;
  ownerId: string;
}

export interface CourseLessonItem {
  id: string;
  courseId: string;
  chapterTitle: string;
  title: string;
  lessonType: "video" | "document" | "quiz" | "scorm" | "interactive";
  durationMinutes?: number;
  orderIndex: number;
  content?: string;
  mediaUrl?: string;
  isDemo?: boolean;
  ownerId: string;
}

export interface EnrollmentItem {
  id: string;
  courseId: string;
  courseTitle: string;
  userId: string;
  userName: string;
  status: "pending" | "approved" | "active" | "completed" | "rejected" | "waitlist";
  progressPercent: number;
  score?: number;
  isDemo?: boolean;
  ownerId: string;
}

export interface ClassSessionItem {
  id: string;
  courseId: string;
  title: string;
  instructorName: string;
  room?: string;
  platform: "offline" | "zoom" | "google_meet" | "teams" | "bbb";
  meetingStatus: "unconfigured" | "scheduled" | "live" | "ended";
  scheduleTime: string;
  attendanceCount?: number;
  isDemo?: boolean;
  ownerId: string;
}

export interface AssessmentItem {
  id: string;
  courseId: string;
  title: string;
  assessmentType: "quiz" | "assignment" | "exam" | "practice";
  durationMinutes?: number;
  passingScore: number;
  maxScore: number;
  status: "draft" | "published" | "closed";
  isPublic: boolean;
  isDemo?: boolean;
  ownerId: string;
}

export interface SubmissionItem {
  id: string;
  assessmentId: string;
  courseId: string;
  studentId: string;
  studentName: string;
  content?: string;
  score?: number;
  maxScore: number;
  status: "assigned" | "submitted" | "graded" | "appeal";
  feedback?: string;
  isDemo?: boolean;
  ownerId: string;
}

export interface CertificateItem {
  id: string;
  verifyCode: string;
  userId: string;
  userName: string;
  courseId: string;
  courseTitle: string;
  status: "valid" | "revoked";
  isDemo?: boolean;
  ownerId: string;
}

export interface LearningAssetItem {
  id: string;
  name: string;
  assetType: "video" | "pdf" | "doc" | "ppt" | "ebook" | "scorm" | "image" | "audio";
  sizeLabel?: string;
  folder: string;
  url?: string;
  isPublic: boolean;
  isDemo?: boolean;
  ownerId: string;
}

export interface LearningPathItem {
  id: string;
  title: string;
  targetRole: string;
  department?: string;
  coursesCount: number;
  isMandatory: boolean;
  isPublic: boolean;
  isDemo?: boolean;
  ownerId: string;
}

export interface TrainingPlanItem {
  id: string;
  title: string;
  period: string;
  department: string;
  budgetAllocated: number;
  budgetSpent?: number;
  approvalStatus: "draft" | "pending" | "approved" | "rejected";
  isDemo?: boolean;
  ownerId: string;
}

export interface DiscussionPostItem {
  id: string;
  title: string;
  content: string;
  category: string;
  authorName: string;
  likesCount: number;
  isPublic: boolean;
  isDemo?: boolean;
  ownerId: string;
}

export interface CommerceOrderItem {
  id: string;
  courseId: string;
  courseTitle: string;
  amount: number;
  couponCode?: string;
  paymentStatus: "pending_webhook" | "verified" | "refunded";
  isDemo?: boolean;
  ownerId: string;
}

export interface AuditLogItem {
  id: string;
  actorName: string;
  action: string;
  targetType: string;
  details?: string;
  ownerId: string;
  createdAt?: string;
}
