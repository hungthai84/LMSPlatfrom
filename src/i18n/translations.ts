import { LanguageCode } from "../types/lms";

export function tr(lang: LanguageCode, vi: string, en: string): string {
  return lang === "en" ? en : vi;
}

export const ROUTE_TITLES: Record<string, { vi: string; en: string }> = {
  dashboard: { vi: "Dashboard Tổng quan", en: "Main Dashboard" },
  "training-analytics": { vi: "Thống kê & Cảnh báo", en: "Training Analytics & Alerts" },
  courses: { vi: "Khóa học & Danh mục", en: "Courses & Catalog" },
  "learning-paths": { vi: "Lộ trình & Năng lực", en: "Learning Paths & Competency" },
  "training-plans": { vi: "Kế hoạch & Ngân sách", en: "Training Plans & Budget" },
  "course-builder": { vi: "Course Builder & SCORM", en: "Course Builder & SCORM" },
  "learning-library": { vi: "Thư viện Học liệu", en: "Learning Content Library" },
  "users-rbac": { vi: "Người dùng & 12 Vai trò RBAC", en: "Users & 12 RBAC Roles" },
  organizations: { vi: "Đơn vị & Phòng ban", en: "Organizations & Departments" },
  classrooms: { vi: "Lớp học & Virtual Classroom", en: "Classrooms & Virtual Sessions" },
  enrollments: { vi: "Đăng ký & Ghi danh", en: "Registration & Enrollments" },
  assessments: { vi: "Đề thi & Ngân hàng Câu hỏi", en: "Assessments & Question Bank" },
  gradebook: { vi: "Bảng điểm & Rubric", en: "Gradebook & Rubric" },
  certificates: { vi: "Chứng chỉ & Xác minh QR", en: "Certificates & QR Verify" },
  gamification: { vi: "Gamification & Bảng xếp hạng", en: "Gamification & Leaderboard" },
  community: { vi: "Cộng đồng & Diễn đàn", en: "Community & Forum" },
  "ai-learning": { vi: "Trung tâm AI Learning", en: "AI Learning Center" },
  reports: { vi: "Báo cáo & Training ROI", en: "Reports & Training ROI" },
  commerce: { vi: "Thương mại & Đơn hàng", en: "E-Commerce & Orders" },
  integrations: { vi: "Integration Center", en: "Integration Center" },
  "system-admin": { vi: "Quản trị Hệ thống", en: "System Administration" },
};
