import { LmsRoleId, LmsRouteId, PermissionAction } from "../types/lms";

export interface RoleDefinition {
  id: LmsRoleId;
  code: string;
  nameVi: string;
  nameEn: string;
  scope: string;
  badgeColor: string;
  permissions: Record<LmsRouteId, PermissionAction[]>;
}

const ALL_ACTIONS: PermissionAction[] = ["view", "create", "edit", "delete", "approve", "export"];
const MANAGE_ACTIONS: PermissionAction[] = ["view", "create", "edit", "approve", "export"];
const VIEW_EXPORT: PermissionAction[] = ["view", "export"];
const VIEW_ONLY: PermissionAction[] = ["view"];

function buildMatrix(overrides: Partial<Record<LmsRouteId, PermissionAction[]>>, fallback: PermissionAction[] = VIEW_ONLY): Record<LmsRouteId, PermissionAction[]> {
  const routes: LmsRouteId[] = [
    "dashboard", "training-analytics", "courses", "learning-paths", "training-plans",
    "course-builder", "learning-library", "users-rbac", "organizations", "classrooms",
    "enrollments", "assessments", "gradebook", "certificates", "gamification",
    "community", "ai-learning", "reports", "commerce", "integrations", "system-admin"
  ];
  const result = {} as Record<LmsRouteId, PermissionAction[]>;
  for (const r of routes) {
    result[r] = overrides[r] ?? fallback;
  }
  return result;
}

export const RBAC_ROLES: RoleDefinition[] = [
  {
    id: "super_admin",
    code: "01",
    nameVi: "Super Admin – Quản trị tối cao",
    nameEn: "Super Admin",
    scope: "Toàn hệ thống, tất cả tổ chức & bảo mật",
    badgeColor: "bg-indigo-100 text-indigo-700 border-indigo-200",
    permissions: buildMatrix({}, ALL_ACTIONS),
  },
  {
    id: "system_admin",
    code: "02",
    nameVi: "System Admin – Quản trị hệ thống",
    nameEn: "System Admin",
    scope: "Cấu hình nền tảng, tài khoản, giao diện, sao lưu",
    badgeColor: "bg-blue-100 text-blue-700 border-blue-200",
    permissions: buildMatrix({ commerce: VIEW_EXPORT }, ALL_ACTIONS),
  },
  {
    id: "training_director",
    code: "03",
    nameVi: "Training Director – Giám đốc đào tạo",
    nameEn: "Training Director",
    scope: "Chiến lược đào tạo, kế hoạch năm/quý, ngân sách & KPI",
    badgeColor: "bg-purple-100 text-purple-700 border-purple-200",
    permissions: buildMatrix({
      "training-plans": ALL_ACTIONS,
      courses: MANAGE_ACTIONS,
      "learning-paths": ALL_ACTIONS,
      reports: VIEW_EXPORT,
      "training-analytics": VIEW_EXPORT,
      "ai-learning": ["view", "create", "export"],
      "system-admin": VIEW_ONLY,
    }, VIEW_EXPORT),
  },
  {
    id: "training_manager",
    code: "04",
    nameVi: "Training Manager – Quản lý đào tạo",
    nameEn: "Training Manager",
    scope: "Quản lý khóa học, lớp học, phân công GV, ghi danh",
    badgeColor: "bg-cyan-100 text-cyan-700 border-cyan-200",
    permissions: buildMatrix({
      courses: ALL_ACTIONS,
      "course-builder": ALL_ACTIONS,
      classrooms: ALL_ACTIONS,
      enrollments: ALL_ACTIONS,
      "training-plans": ["view", "create", "edit", "approve"],
      certificates: MANAGE_ACTIONS,
      "ai-learning": ["view", "create"],
      reports: VIEW_EXPORT,
    }, VIEW_ONLY),
  },
  {
    id: "organization_admin",
    code: "05",
    nameVi: "Organization Admin – Quản trị đơn vị",
    nameEn: "Organization Admin",
    scope: "Dữ liệu đơn vị, phòng ban & nhân sự trực thuộc",
    badgeColor: "bg-teal-100 text-teal-700 border-teal-200",
    permissions: buildMatrix({
      organizations: ALL_ACTIONS,
      "users-rbac": ["view", "create", "edit", "export"],
      enrollments: MANAGE_ACTIONS,
      reports: VIEW_EXPORT,
    }, VIEW_ONLY),
  },
  {
    id: "department_manager",
    code: "06",
    nameVi: "Department Manager – Trưởng phòng",
    nameEn: "Department Manager",
    scope: "Đề xuất nhu cầu, đăng ký & theo dõi kết quả nhân viên",
    badgeColor: "bg-emerald-100 text-emerald-700 border-emerald-200",
    permissions: buildMatrix({
      "training-plans": ["view", "create"],
      enrollments: ["view", "create", "approve"],
      reports: VIEW_EXPORT,
      "users-rbac": VIEW_ONLY,
    }, VIEW_ONLY),
  },
  {
    id: "instructor",
    code: "07",
    nameVi: "Instructor – Giảng viên",
    nameEn: "Instructor",
    scope: "Khóa học được giao, bài giảng, bài tập, điểm danh, chấm điểm",
    badgeColor: "bg-sky-100 text-sky-700 border-sky-200",
    permissions: buildMatrix({
      courses: ["view", "create", "edit"],
      "course-builder": ALL_ACTIONS,
      "learning-library": ["view", "create", "edit"],
      classrooms: ["view", "create", "edit"],
      assessments: ALL_ACTIONS,
      gradebook: ["view", "edit", "export"],
      community: ["view", "create", "edit"],
      "ai-learning": ["view", "create"],
    }, VIEW_ONLY),
  },
  {
    id: "teaching_assistant",
    code: "08",
    nameVi: "Teaching Assistant – Trợ giảng",
    nameEn: "Teaching Assistant",
    scope: "Hỗ trợ học viên, quản lý thảo luận, theo dõi lớp",
    badgeColor: "bg-amber-100 text-amber-700 border-amber-200",
    permissions: buildMatrix({
      classrooms: ["view", "edit"],
      assessments: ["view"],
      gradebook: ["view", "edit"],
      community: ["view", "create", "edit"],
      "ai-learning": ["view", "create"],
    }, VIEW_ONLY),
  },
  {
    id: "evaluator",
    code: "09",
    nameVi: "Evaluator – Người đánh giá",
    nameEn: "Evaluator",
    scope: "Chấm bài theo Rubric, nhận xét & phúc khảo",
    badgeColor: "bg-orange-100 text-orange-700 border-orange-200",
    permissions: buildMatrix({
      assessments: ["view", "approve"],
      gradebook: ["view", "edit", "approve", "export"],
      certificates: ["view"],
    }, []),
  },
  {
    id: "learner",
    code: "10",
    nameVi: "Learner – Học viên",
    nameEn: "Learner",
    scope: "Học tập, làm bài tập, thi, nhận chứng chỉ & cộng đồng",
    badgeColor: "bg-blue-50 text-[#1951FC] border-blue-200",
    permissions: buildMatrix({
      dashboard: VIEW_ONLY,
      courses: VIEW_ONLY,
      "learning-paths": VIEW_ONLY,
      "learning-library": VIEW_ONLY,
      classrooms: VIEW_ONLY,
      enrollments: ["view", "create"],
      assessments: ["view", "create"],
      gradebook: VIEW_ONLY,
      certificates: VIEW_ONLY,
      gamification: VIEW_ONLY,
      community: ["view", "create"],
      "ai-learning": ["view", "create"],
      commerce: ["view", "create"],
      "system-admin": VIEW_ONLY,
    }, []),
  },
  {
    id: "auditor",
    code: "11",
    nameVi: "Auditor – Kiểm tra viên",
    nameEn: "Auditor",
    scope: "Kiểm tra lịch sử, quy trình, trích xuất báo cáo (chỉ đọc)",
    badgeColor: "bg-slate-100 text-slate-700 border-slate-200",
    permissions: buildMatrix({}, VIEW_EXPORT),
  },
  {
    id: "guardian",
    code: "12",
    nameVi: "Parent / Guardian – Người giám hộ",
    nameEn: "Parent / Guardian",
    scope: "Theo dõi tiến độ, điểm số & nhận thông báo học viên liên kết",
    badgeColor: "bg-pink-100 text-pink-700 border-pink-200",
    permissions: buildMatrix({
      dashboard: VIEW_ONLY,
      "training-analytics": VIEW_ONLY,
      gradebook: VIEW_ONLY,
      certificates: VIEW_ONLY,
      classrooms: VIEW_ONLY,
    }, []),
  },
];

export interface SidebarGroupDef {
  id: string;
  code: string;
  labelVi: string;
  labelEn: string;
  items: {
    route: LmsRouteId;
    labelVi: string;
    labelEn: string;
    badge?: string;
  }[];
}

export const SIDEBAR_MODULE_GROUPS: SidebarGroupDef[] = [
  {
    id: "g01",
    code: "01",
    labelVi: "Tổng quan",
    labelEn: "Overview",
    items: [
      { route: "dashboard", labelVi: "Dashboard Tổng quan", labelEn: "Main Dashboard" },
      { route: "training-analytics", labelVi: "Thống kê & Cảnh báo", labelEn: "Training Analytics" },
    ],
  },
  {
    id: "g02",
    code: "02",
    labelVi: "Quản lý Đào tạo",
    labelEn: "Training Management",
    items: [
      { route: "courses", labelVi: "Khóa học & Danh mục", labelEn: "Courses Catalog" },
      { route: "learning-paths", labelVi: "Lộ trình & Năng lực", labelEn: "Learning Paths" },
      { route: "training-plans", labelVi: "Kế hoạch & Ngân sách", labelEn: "Training Plans" },
    ],
  },
  {
    id: "g03",
    code: "03",
    labelVi: "Nội dung Học tập",
    labelEn: "Learning Content",
    items: [
      { route: "course-builder", labelVi: "Course Builder & SCORM", labelEn: "Course Builder" },
      { route: "learning-library", labelVi: "Thư viện Học liệu", labelEn: "Content Library" },
    ],
  },
  {
    id: "g04",
    code: "04",
    labelVi: "Người dùng & Tổ chức",
    labelEn: "Users & Organization",
    items: [
      { route: "users-rbac", labelVi: "Người dùng & RBAC", labelEn: "Users & RBAC" },
      { route: "organizations", labelVi: "Đơn vị & Phòng ban", labelEn: "Orgs & Departments" },
    ],
  },
  {
    id: "g05",
    code: "05",
    labelVi: "Lớp học & Ghi danh",
    labelEn: "Classrooms & Enrollment",
    items: [
      { route: "classrooms", labelVi: "Lớp học & Trực tuyến", labelEn: "Virtual Classrooms" },
      { route: "enrollments", labelVi: "Đăng ký & Ghi danh", labelEn: "Enrollments" },
    ],
  },
  {
    id: "g06",
    code: "06",
    labelVi: "Kiểm tra & Đánh giá",
    labelEn: "Assessment & Gradebook",
    items: [
      { route: "assessments", labelVi: "Đề thi & Ngân hàng câu hỏi", labelEn: "Exams & Question Bank" },
      { route: "gradebook", labelVi: "Bảng điểm & Rubric", labelEn: "Gradebook & Rubric" },
    ],
  },
  {
    id: "g07",
    code: "07",
    labelVi: "Chứng chỉ & Thành tích",
    labelEn: "Certificates & Badges",
    items: [
      { route: "certificates", labelVi: "Chứng chỉ & Xác minh QR", labelEn: "Certificates & QR" },
      { route: "gamification", labelVi: "Huy hiệu & Bảng xếp hạng", labelEn: "Gamification" },
    ],
  },
  {
    id: "g08",
    code: "08",
    labelVi: "Tương tác & Cộng đồng",
    labelEn: "Community & Comms",
    items: [
      { route: "community", labelVi: "Diễn đàn & Thông báo", labelEn: "Forum & Notifications" },
    ],
  },
  {
    id: "g09",
    code: "09",
    labelVi: "AI Learning",
    labelEn: "AI Learning Center",
    items: [
      { route: "ai-learning", labelVi: "8 AI Agents & RAG", labelEn: "AI Agents & RAG", badge: "AI" },
    ],
  },
  {
    id: "g10",
    code: "10",
    labelVi: "Báo cáo & Thương mại",
    labelEn: "Analytics & Commerce",
    items: [
      { route: "reports", labelVi: "Báo cáo & Training ROI", labelEn: "Reports & ROI" },
      { route: "commerce", labelVi: "Thương mại & Đơn hàng", labelEn: "E-Commerce" },
    ],
  },
  {
    id: "g11",
    code: "11",
    labelVi: "Tích hợp & Hệ thống",
    labelEn: "Integrations & System",
    items: [
      { route: "integrations", labelVi: "Integration Center", labelEn: "Integration Center" },
      { route: "system-admin", labelVi: "Quản trị & Giao diện", labelEn: "System & Themes" },
    ],
  },
];

export function hasPermission(roleId: LmsRoleId, route: LmsRouteId, action: PermissionAction): boolean {
  const role = RBAC_ROLES.find((r) => r.id === roleId);
  if (!role) return false;
  return (role.permissions[route] || []).includes(action);
}
