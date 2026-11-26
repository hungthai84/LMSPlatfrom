import React, { useState } from "react";
import {
  BookOpen,
  Plus,
  Layers,
  CalendarRange,
  FileCode2,
  FolderOpen,
  CheckCircle2,
  XCircle,
  Trash2,
  ArrowUp,
  ArrowDown,
  ShieldCheck,
  Search,
} from "lucide-react";
import { useLms } from "../../contexts/LmsContext";
import { hasPermission } from "../../constants/rbac";
import { validateScormManifest, ScormValidationResponse } from "../../services/aiService";
import { LmsCourse, LmsRouteId } from "../../types/lms";
import { tr } from "../../i18n/translations";

export const TrainingAndContentModules: React.FC<{
  route: Extract<LmsRouteId, "courses" | "learning-paths" | "training-plans" | "course-builder" | "learning-library">;
  onOpenCourseDetail: (courseId: string) => void;
}> = ({ route, onOpenCourseDetail }) => {
  const {
    language,
    activeRole,
    courses,
    lessons,
    learningPaths,
    trainingPlans,
    assets,
    createCourse,
    updateCourse,
    deleteCourse,
    addLesson,
    updateLesson,
    deleteLesson,
    createLearningPath,
    createTrainingPlan,
    approveTrainingPlan,
    addAsset,
    enrollCourse,
    showToast,
  } = useLms();

  // Course creation state
  const [courseSearch, setCourseSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [newTitle, setNewTitle] = useState("");
  const [newCode, setNewCode] = useState("");
  const [newCategory, setNewCategory] = useState("Lập trình");
  const [newLevel, setNewLevel] = useState<LmsCourse["level"]>("intermediate");
  const [newPrice, setNewPrice] = useState(0);

  // Course Builder & SCORM state
  const [selectedCourseId, setSelectedCourseId] = useState<string>(courses[0]?.id || "class-1");
  const [lessonChapter, setLessonChapter] = useState("Chương 1: Khởi đầu");
  const [lessonTitle, setLessonTitle] = useState("");
  const [lessonType, setLessonType] = useState<"video" | "document" | "quiz" | "scorm" | "interactive">("video");
  const [lessonDuration, setLessonDuration] = useState(25);
  const [scormXml, setScormXml] = useState(
    `<manifest identifier="EDUSMART-SCORM-12" version="1.0">\n  <metadata><schema>ADL SCORM</schema><schemaversion>1.2</schemaversion></metadata>\n  <organizations default="org_1"><organization identifier="org_1"><title>Bài giảng ReactJS</title></organization></organizations>\n  <resources><resource identifier="res_1" type="webcontent" href="index.html" /></resources>\n</manifest>`
  );
  const [scormResult, setScormResult] = useState<ScormValidationResponse | null>(null);

  // Learning Path state
  const [pathTitle, setPathTitle] = useState("");
  const [pathRole, setPathRole] = useState("Frontend Developer");
  const [pathMandatory, setPathMandatory] = useState(true);

  // Training Plan state
  const [planTitle, setPlanTitle] = useState("");
  const [planPeriod, setPlanPeriod] = useState("Quý 4 / 2026");
  const [planDept, setPlanDept] = useState("Khối Kỹ thuật & Phần mềm");
  const [planBudget, setPlanBudget] = useState(150000000);

  // Asset Library state
  const [assetName, setAssetName] = useState("");
  const [assetType, setAssetType] = useState<"pdf" | "video" | "doc" | "ppt" | "ebook" | "scorm" | "image" | "audio">("pdf");
  const [assetFolder, setAssetFolder] = useState("Tài liệu chung");
  const [assetSize, setAssetSize] = useState("2.4 MB");

  const canCreate = hasPermission(activeRole, route, "create");
  const canEdit = hasPermission(activeRole, route, "edit");
  const canDelete = hasPermission(activeRole, route, "delete");
  const canApprove = hasPermission(activeRole, route, "approve");

  const handleCreateCourse = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;
    await createCourse({
      code: newCode.trim() || `CRS-${Math.random().toString(36).slice(2, 6).toUpperCase()}`,
      title: newTitle.trim(),
      category: newCategory,
      level: newLevel,
      durationHours: 20,
      price: Number(newPrice) || 0,
      passingScore: 75,
      status: "draft",
      isPublic: true,
      instructorName: "Giảng viên EduSmart",
      thumbnailUrl: "/04_course_reactjs_thumbnail.png",
    });
    setNewTitle("");
    setNewCode("");
  };

  const handleAddLesson = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!lessonTitle.trim()) return;
    const courseLessons = lessons.filter((l) => l.courseId === selectedCourseId);
    await addLesson({
      courseId: selectedCourseId,
      chapterTitle: lessonChapter,
      title: lessonTitle.trim(),
      lessonType,
      durationMinutes: lessonDuration,
      orderIndex: courseLessons.length + 1,
      content: "Nội dung bài giảng tương tác trong Course Builder.",
    });
    setLessonTitle("");
  };

  const handleValidateScorm = async () => {
    try {
      const res = await validateScormManifest(scormXml, "scorm12");
      setScormResult(res);
      showToast(
        res.valid
          ? tr(language, "SCORM Manifest hợp lệ!", "Valid SCORM Manifest!")
          : tr(language, "SCORM Manifest thiếu thẻ chuẩn.", "SCORM Manifest missing required tags.")
      );
    } catch (err: unknown) {
      showToast(err instanceof Error ? err.message : tr(language, "Lỗi kiểm tra SCORM", "SCORM validation error"));
    }
  };

  if (route === "courses") {
    const filtered = courses.filter((c) => {
      const matchText =
        c.title.toLowerCase().includes(courseSearch.toLowerCase()) ||
        c.code.toLowerCase().includes(courseSearch.toLowerCase());
      const matchStatus = statusFilter === "all" || c.status === statusFilter;
      return matchText && matchStatus;
    });

    return (
      <div className="space-y-5 pb-8">
        <div className="glass-liquid-card-blue p-4 sm:p-5 rounded-[14px] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h1 className="text-lg sm:text-xl font-bold text-slate-900">
              {tr(language, "Quản lý Khóa học & Danh mục Đào tạo", "Courses & Training Catalog")}
            </h1>
            <p className="text-xs text-slate-600 mt-0.5">
              {tr(
                language,
                "Vòng đời khóa học: Nháp (draft) → Chờ duyệt (pending) → Xuất bản (published) → Lưu trữ (archived).",
                "Course lifecycle: Draft → Pending → Published → Archived."
              )}
            </p>
          </div>
          <span className="text-xs font-bold px-3 py-1.5 rounded-[14px] bg-white/80 text-[#0d6efd] shrink-0 self-start sm:self-auto">
            {courses.length} {tr(language, "Khóa học", "Courses")}
          </span>
        </div>

        {canCreate && (
          <form onSubmit={handleCreateCourse} className="glass-liquid-card p-4 rounded-[14px] grid grid-cols-1 md:grid-cols-6 gap-2.5 items-end">
            <div className="md:col-span-2">
              <label className="text-[11px] font-bold text-slate-600">
                {tr(language, "Tên khóa học", "Course Title")}
              </label>
              <input
                type="text"
                required
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                placeholder={tr(language, "VD: Kiến trúc Cloud & Kubernetes", "e.g. Cloud Architecture & Kubernetes")}
                className="w-full mt-1 px-3 py-2 rounded-[14px] bg-white border border-slate-200 text-xs"
              />
            </div>
            <div>
              <label className="text-[11px] font-bold text-slate-600">{tr(language, "Mã khóa", "Code")}</label>
              <input
                type="text"
                value={newCode}
                onChange={(e) => setNewCode(e.target.value)}
                placeholder="K8S-2026"
                className="w-full mt-1 px-3 py-2 rounded-[14px] bg-white border border-slate-200 text-xs"
              />
            </div>
            <div>
              <label className="text-[11px] font-bold text-slate-600">{tr(language, "Danh mục", "Category")}</label>
              <select
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value)}
                className="w-full mt-1 px-3 py-2 rounded-[14px] bg-white border border-slate-200 text-xs"
              >
                <option value="Lập trình">{tr(language, "Lập trình", "Programming")}</option>
                <option value="Thiết kế">{tr(language, "Thiết kế", "Design")}</option>
                <option value="Marketing">Marketing</option>
                <option value="Kinh doanh">{tr(language, "Kinh doanh", "Business")}</option>
                <option value="AI & Dữ liệu">{tr(language, "AI & Dữ liệu", "AI & Data")}</option>
              </select>
            </div>
            <div>
              <label className="text-[11px] font-bold text-slate-600">{tr(language, "Học phí (VNĐ)", "Tuition (VND)")}</label>
              <input
                type="number"
                value={newPrice}
                onChange={(e) => setNewPrice(Number(e.target.value))}
                className="w-full mt-1 px-3 py-2 rounded-[14px] bg-white border border-slate-200 text-xs"
              />
            </div>
            <button type="submit" className="px-4 py-2 rounded-[14px] bg-[#0d6efd] text-white text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer h-[36px]">
              <Plus className="w-4 h-4" /> {tr(language, "Tạo khóa học", "Create Course")}
            </button>
          </form>
        )}

        <div className="flex flex-wrap gap-2 items-center">
          <div className="relative flex-1 min-w-[200px]">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              value={courseSearch}
              onChange={(e) => setCourseSearch(e.target.value)}
              placeholder={tr(language, "Tìm theo tên hoặc mã khóa học...", "Search by title or code...")}
              className="w-full pl-9 pr-3 py-2 rounded-[14px] bg-white/90 border border-slate-200 text-xs"
            />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 rounded-[14px] bg-white/90 border border-slate-200 text-xs font-bold"
          >
            <option value="all">{tr(language, "Tất cả trạng thái", "All Statuses")}</option>
            <option value="published">{tr(language, "Đã xuất bản", "Published")}</option>
            <option value="active">{tr(language, "Đang diễn ra", "Active")}</option>
            <option value="pending">{tr(language, "Chờ duyệt", "Pending")}</option>
            <option value="draft">{tr(language, "Bản nháp", "Draft")}</option>
          </select>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {filtered.map((course) => (
            <div key={course.id} className="glass-liquid-card p-4 rounded-[14px] flex flex-col justify-between gap-3">
              <div className="space-y-2.5">
                <div className="relative h-32 rounded-[14px] overflow-hidden">
                  <img
                    src={course.thumbnailUrl || "/04_course_reactjs_thumbnail.png"}
                    alt={course.title}
                    className="w-full h-full object-cover"
                  />
                  <span className="absolute top-2 left-2 px-2.5 py-0.5 rounded-[14px] bg-white/90 text-[10px] font-bold text-[#0d6efd]">
                    {course.code}
                  </span>
                  <span className="absolute top-2 right-2 px-2.5 py-0.5 rounded-[14px] bg-slate-900/75 text-[10px] font-bold text-white uppercase">
                    {course.status}
                  </span>
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900 line-clamp-1">{course.title}</h3>
                  <p className="text-[11px] text-slate-600 mt-0.5 line-clamp-2">{course.description || course.category}</p>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-200/60 flex flex-wrap items-center justify-between gap-2">
                <span className="text-xs font-bold text-emerald-700">
                  {course.price ? `${course.price.toLocaleString("vi-VN")}đ` : tr(language, "Miễn phí", "Free")}
                </span>
                <div className="flex flex-wrap items-center gap-1.5">
                  <button
                    onClick={() => onOpenCourseDetail(course.id)}
                    className="px-2.5 py-1.5 rounded-[14px] bg-white border border-slate-200 text-[11px] font-bold text-slate-700 hover:text-[#0d6efd] cursor-pointer"
                  >
                    {tr(language, "Vào lớp", "Enter Class")}
                  </button>
                  <button
                    onClick={() => enrollCourse(course)}
                    className="px-2.5 py-1.5 rounded-[14px] bg-[#0d6efd] text-white text-[11px] font-bold cursor-pointer"
                  >
                    {tr(language, "Ghi danh", "Enroll")}
                  </button>
                  {canApprove && course.status !== "published" && (
                    <button
                      onClick={() => updateCourse(course.id, { status: "published", isPublic: true })}
                      className="px-2.5 py-1.5 rounded-[14px] bg-emerald-600 text-white text-[11px] font-bold cursor-pointer"
                    >
                      {tr(language, "Duyệt", "Approve")}
                    </button>
                  )}
                  {canDelete && (
                    <button
                      onClick={() => deleteCourse(course.id)}
                      className="p-1.5 rounded-[14px] bg-red-50 text-red-600 hover:bg-red-100 cursor-pointer"
                      title={tr(language, "Xóa khóa học", "Delete course")}
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (route === "course-builder") {
    const courseLessons = lessons
      .filter((l) => l.courseId === selectedCourseId)
      .sort((a, b) => a.orderIndex - b.orderIndex);

    return (
      <div className="space-y-5 pb-8">
        <div className="glass-liquid-card-emerald p-4 sm:p-5 rounded-[14px] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h1 className="text-lg sm:text-xl font-bold text-slate-900">
              {tr(language, "Course Builder & Kiểm định Gói SCORM 1.2 / 2004", "Course Builder & SCORM 1.2 / 2004 Validator")}
            </h1>
            <p className="text-xs text-slate-600 mt-0.5">
              {tr(
                language,
                "Thiết kế cấu trúc Chương → Bài học đa phương tiện và kiểm tra cấu trúc imsmanifest.xml.",
                "Design Chapter → Lesson curriculum and validate imsmanifest.xml packages."
              )}
            </p>
          </div>
          <select
            value={selectedCourseId}
            onChange={(e) => setSelectedCourseId(e.target.value)}
            className="px-3.5 py-2 rounded-[14px] bg-white border border-emerald-200 text-xs font-bold"
          >
            {courses.map((c) => (
              <option key={c.id} value={c.id}>{c.title}</option>
            ))}
          </select>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-12 gap-5">
          <div className="xl:col-span-7 glass-liquid-card p-4 sm:p-5 rounded-[14px] space-y-4">
            <h3 className="text-sm font-bold text-slate-900">
              {tr(
                language,
                `Danh sách Bài giảng theo Chương (${courseLessons.length} bài)`,
                `Curriculum Lessons (${courseLessons.length} items)`
              )}
            </h3>

            {canCreate && (
              <form onSubmit={handleAddLesson} className="grid grid-cols-1 sm:grid-cols-4 gap-2 bg-white/70 p-3 rounded-[14px]">
                <input
                  type="text"
                  value={lessonChapter}
                  onChange={(e) => setLessonChapter(e.target.value)}
                  placeholder={tr(language, "Tên chương...", "Chapter title...")}
                  className="px-3 py-2 rounded-[14px] bg-white border border-slate-200 text-xs"
                />
                <input
                  type="text"
                  required
                  value={lessonTitle}
                  onChange={(e) => setLessonTitle(e.target.value)}
                  placeholder={tr(language, "Tên bài học mới...", "New lesson title...")}
                  className="sm:col-span-2 px-3 py-2 rounded-[14px] bg-white border border-slate-200 text-xs"
                />
                <div className="flex gap-1.5">
                  <select
                    value={lessonType}
                    onChange={(e) => setLessonType(e.target.value as typeof lessonType)}
                    className="flex-1 px-2 py-2 rounded-[14px] bg-white border border-slate-200 text-xs"
                  >
                    <option value="video">Video</option>
                    <option value="document">PDF/Doc</option>
                    <option value="quiz">Quiz</option>
                    <option value="scorm">SCORM</option>
                    <option value="interactive">{tr(language, "Tương tác", "Interactive")}</option>
                  </select>
                  <button type="submit" className="px-3 py-2 rounded-[14px] bg-[#0d6efd] text-white text-xs font-bold cursor-pointer">
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </form>
            )}

            <div className="space-y-2">
              {courseLessons.map((les) => (
                <div key={les.id} className="p-3 rounded-[14px] bg-white/85 border border-slate-200 flex items-center justify-between gap-2">
                  <div>
                    <span className="text-[10px] font-bold text-[#0d6efd]">{les.chapterTitle}</span>
                    <p className="text-xs font-bold text-slate-900">{les.orderIndex}. {les.title}</p>
                    <p className="text-[10px] text-slate-500 uppercase">
                      {les.lessonType} • {les.durationMinutes || lessonDuration} {tr(language, "phút", "mins")}
                    </p>
                  </div>
                  {canEdit && (
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => updateLesson(selectedCourseId, les.id, { orderIndex: Math.max(1, les.orderIndex - 1) })}
                        className="p-1.5 rounded-[14px] bg-slate-100 hover:bg-slate-200 cursor-pointer"
                      >
                        <ArrowUp className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => updateLesson(selectedCourseId, les.id, { orderIndex: les.orderIndex + 1 })}
                        className="p-1.5 rounded-[14px] bg-slate-100 hover:bg-slate-200 cursor-pointer"
                      >
                        <ArrowDown className="w-3.5 h-3.5" />
                      </button>
                      {canDelete && (
                        <button
                          onClick={() => deleteLesson(selectedCourseId, les.id)}
                          className="p-1.5 rounded-[14px] bg-red-50 text-red-600 cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="xl:col-span-5 glass-liquid-card-orange p-4 sm:p-5 rounded-[14px] space-y-3">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <FileCode2 className="w-4 h-4 text-orange-600" />
              {tr(language, "Kiểm định Cấu trúc SCORM Manifest (imsmanifest.xml)", "Validate SCORM Manifest (imsmanifest.xml)")}
            </h3>
            <textarea
              rows={8}
              value={scormXml}
              onChange={(e) => setScormXml(e.target.value)}
              className="w-full p-3 rounded-[14px] bg-white/90 border border-orange-200 text-[11px] font-mono outline-none"
            />
            <button
              onClick={handleValidateScorm}
              className="w-full py-2.5 rounded-[14px] bg-[#f97316] hover:bg-orange-600 text-white text-xs font-bold cursor-pointer"
            >
              {tr(language, "Kiểm tra chuẩn SCORM qua Server (/api/scorm/validate)", "Validate SCORM via Server (/api/scorm/validate)")}
            </button>
            {scormResult && (
              <div className={`p-3 rounded-[14px] text-xs font-bold ${scormResult.valid ? "bg-emerald-50 text-emerald-800" : "bg-red-50 text-red-800"}`}>
                <p>{scormResult.standard}: {scormResult.message}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  if (route === "learning-paths") {
    return (
      <div className="space-y-5 pb-8">
        <div className="glass-liquid-card-purple p-4 sm:p-5 rounded-[14px] flex items-center justify-between gap-3">
          <div>
            <h1 className="text-lg sm:text-xl font-bold text-slate-900">
              {tr(language, "Lộ trình Học tập & Ma trận Năng lực", "Learning Paths & Competency Matrix")}
            </h1>
            <p className="text-xs text-slate-600 mt-0.5">
              {tr(language, "Gán lộ trình bắt buộc theo vị trí công việc (Competency Matrix & Onboarding).", "Assign mandatory role-based learning paths & onboarding tracks.")}
            </p>
          </div>
          <Layers className="w-6 h-6 text-purple-600 shrink-0" />
        </div>

        {canCreate && (
          <form
            onSubmit={async (e) => {
              e.preventDefault();
              if (!pathTitle.trim()) return;
              await createLearningPath({
                title: pathTitle.trim(),
                targetRole: pathRole,
                department: tr(language, "Toàn doanh nghiệp", "Enterprise-wide"),
                coursesCount: 3,
                isMandatory: pathMandatory,
                isPublic: true,
              });
              setPathTitle("");
            }}
            className="glass-liquid-card p-4 rounded-[14px] grid grid-cols-1 sm:grid-cols-4 gap-2.5"
          >
            <input
              type="text"
              required
              value={pathTitle}
              onChange={(e) => setPathTitle(e.target.value)}
              placeholder={tr(language, "Tên lộ trình năng lực...", "Learning path title...")}
              className="sm:col-span-2 px-3 py-2 rounded-[14px] bg-white border border-slate-200 text-xs"
            />
            <input
              type="text"
              value={pathRole}
              onChange={(e) => setPathRole(e.target.value)}
              placeholder={tr(language, "Vị trí áp dụng...", "Target role...")}
              className="px-3 py-2 rounded-[14px] bg-white border border-slate-200 text-xs"
            />
            <div className="flex items-center gap-2">
              <label className="text-xs font-bold flex items-center gap-1.5">
                <input type="checkbox" checked={pathMandatory} onChange={(e) => setPathMandatory(e.target.checked)} />
                {tr(language, "Bắt buộc", "Mandatory")}
              </label>
              <button type="submit" className="ml-auto px-4 py-2 rounded-[14px] bg-[#0d6efd] text-white text-xs font-bold cursor-pointer">
                {tr(language, "Tạo lộ trình", "Create Path")}
              </button>
            </div>
          </form>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {learningPaths.map((p) => (
            <div key={p.id} className="glass-liquid-card p-4 rounded-[14px] space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-[14px] bg-purple-100 text-purple-800">
                  {p.targetRole}
                </span>
                {p.isMandatory && (
                  <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-[14px] bg-orange-100 text-orange-800">
                    {tr(language, "Bắt buộc", "Mandatory")}
                  </span>
                )}
              </div>
              <h3 className="text-sm font-bold text-slate-900">{p.title}</h3>
              <p className="text-xs text-slate-600">
                {p.department} • {p.coursesCount} {tr(language, "khóa học", "courses")}
              </p>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (route === "training-plans") {
    return (
      <div className="space-y-5 pb-8">
        <div className="glass-liquid-card-orange p-4 sm:p-5 rounded-[14px] flex items-center justify-between gap-3">
          <div>
            <h1 className="text-lg sm:text-xl font-bold text-slate-900">
              {tr(language, "Kế hoạch Đào tạo & Phê duyệt Ngân sách", "Training Plans & Budget Approvals")}
            </h1>
            <p className="text-xs text-slate-600 mt-0.5">
              {tr(language, "Đề xuất nhu cầu theo phòng ban, theo dõi giải ngân và quy trình duyệt nhiều cấp.", "Departmental training requests, budget tracking, and multi-level approval.")}
            </p>
          </div>
          <CalendarRange className="w-6 h-6 text-orange-600 shrink-0" />
        </div>

        {canCreate && (
          <form
            onSubmit={async (e) => {
              e.preventDefault();
              if (!planTitle.trim()) return;
              await createTrainingPlan({
                title: planTitle.trim(),
                period: planPeriod,
                department: planDept,
                budgetAllocated: Number(planBudget) || 0,
                budgetSpent: 0,
                approvalStatus: "pending",
              });
              setPlanTitle("");
            }}
            className="glass-liquid-card p-4 rounded-[14px] grid grid-cols-1 sm:grid-cols-5 gap-2.5"
          >
            <input
              type="text"
              required
              value={planTitle}
              onChange={(e) => setPlanTitle(e.target.value)}
              placeholder={tr(language, "Tên kế hoạch đào tạo...", "Training plan name...")}
              className="sm:col-span-2 px-3 py-2 rounded-[14px] bg-white border border-slate-200 text-xs"
            />
            <input
              type="text"
              value={planPeriod}
              onChange={(e) => setPlanPeriod(e.target.value)}
              className="px-3 py-2 rounded-[14px] bg-white border border-slate-200 text-xs"
            />
            <input
              type="number"
              value={planBudget}
              onChange={(e) => setPlanBudget(Number(e.target.value))}
              className="px-3 py-2 rounded-[14px] bg-white border border-slate-200 text-xs"
            />
            <button type="submit" className="px-4 py-2 rounded-[14px] bg-[#0d6efd] text-white text-xs font-bold cursor-pointer">
              {tr(language, "Trình duyệt", "Submit Plan")}
            </button>
          </form>
        )}

        <div className="space-y-3">
          {trainingPlans.map((plan) => (
            <div key={plan.id} className="glass-liquid-card p-4 rounded-[14px] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-bold text-slate-900">{plan.title}</h3>
                  <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-[14px] bg-white/90 uppercase text-slate-700">
                    {plan.approvalStatus}
                  </span>
                </div>
                <p className="text-xs text-slate-600 mt-1">
                  {plan.period} • {plan.department} • {tr(language, "Ngân sách:", "Budget:")} {plan.budgetAllocated.toLocaleString("vi-VN")}đ
                </p>
              </div>
              {canApprove && plan.approvalStatus === "pending" && (
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => approveTrainingPlan(plan.id, "approved")}
                    className="px-3 py-1.5 rounded-[14px] bg-emerald-600 text-white text-xs font-bold flex items-center gap-1 cursor-pointer"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" /> {tr(language, "Duyệt", "Approve")}
                  </button>
                  <button
                    onClick={() => approveTrainingPlan(plan.id, "rejected")}
                    className="px-3 py-1.5 rounded-[14px] bg-red-600 text-white text-xs font-bold flex items-center gap-1 cursor-pointer"
                  >
                    <XCircle className="w-3.5 h-3.5" /> {tr(language, "Từ chối", "Reject")}
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    );
  }

  // learning-library
  return (
    <div className="space-y-5 pb-8">
      <div className="glass-liquid-card-blue p-4 sm:p-5 rounded-[14px] flex items-center justify-between gap-3">
        <div>
          <h1 className="text-lg sm:text-xl font-bold text-slate-900">
            {tr(language, "Thư viện Học liệu Số & Kho Tài nguyên", "Digital Learning Library & Assets")}
          </h1>
          <p className="text-xs text-slate-600 mt-0.5">
            {tr(language, "Lưu trữ PDF, Slide, Video, SCORM có phân thư mục và kiểm soát quyền chia sẻ.", "Store PDF, Slides, Video, and SCORM with folder permissions.")}
          </p>
        </div>
        <FolderOpen className="w-6 h-6 text-[#0d6efd] shrink-0" />
      </div>

      {canCreate && (
        <form
          onSubmit={async (e) => {
            e.preventDefault();
            if (!assetName.trim()) return;
            await addAsset({
              name: assetName.trim(),
              assetType,
              folder: assetFolder,
              sizeLabel: assetSize,
              isPublic: true,
            });
            setAssetName("");
          }}
          className="glass-liquid-card p-4 rounded-[14px] grid grid-cols-1 sm:grid-cols-5 gap-2.5"
        >
          <input
            type="text"
            required
            value={assetName}
            onChange={(e) => setAssetName(e.target.value)}
            placeholder={tr(language, "Tên học liệu...", "Asset name...")}
            className="sm:col-span-2 px-3 py-2 rounded-[14px] bg-white border border-slate-200 text-xs"
          />
          <select
            value={assetType}
            onChange={(e) => setAssetType(e.target.value as typeof assetType)}
            className="px-3 py-2 rounded-[14px] bg-white border border-slate-200 text-xs"
          >
            <option value="pdf">PDF</option>
            <option value="video">Video</option>
            <option value="ppt">Slide PPT</option>
            <option value="scorm">SCORM ZIP</option>
            <option value="ebook">Ebook</option>
          </select>
          <input
            type="text"
            value={assetFolder}
            onChange={(e) => setAssetFolder(e.target.value)}
            className="px-3 py-2 rounded-[14px] bg-white border border-slate-200 text-xs"
          />
          <button type="submit" className="px-4 py-2 rounded-[14px] bg-[#0d6efd] text-white text-xs font-bold cursor-pointer">
            {tr(language, "Thêm học liệu", "Add Asset")}
          </button>
        </form>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {assets.map((asset) => (
          <div key={asset.id} className="glass-liquid-card p-4 rounded-[14px] flex flex-col justify-between gap-3">
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-[14px] bg-blue-100 text-blue-800">
                  {asset.assetType}
                </span>
                <span className="text-[10px] font-bold text-slate-500">{asset.sizeLabel}</span>
              </div>
              <h4 className="text-xs font-bold text-slate-900">{asset.name}</h4>
              <p className="text-[11px] text-slate-500">
                {tr(language, "Thư mục:", "Folder:")} {asset.folder}
              </p>
            </div>
            <button
              onClick={() =>
                showToast(
                  tr(language, `Đang mở xem trước tài liệu "${asset.name}"`, `Opening preview for "${asset.name}"`)
                )
              }
              className="w-full py-1.5 rounded-[14px] bg-white border border-slate-200 text-xs font-bold text-[#0d6efd] cursor-pointer"
            >
              {tr(language, "Xem / Tải về", "View / Download")}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};
