import React, { createContext, useContext, useEffect, useState, useCallback } from "react";
import { User as FirebaseUser, onAuthStateChanged, signInWithPopup, signOut } from "firebase/auth";
import {
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  query,
  serverTimestamp,
  setDoc,
  updateDoc,
  where,
  writeBatch,
  getDocs,
} from "firebase/firestore";
import { auth, db, googleProvider, handleFirestoreError, OperationType } from "../firebase";
import {
  AssessmentItem,
  AuditLogItem,
  CertificateItem,
  ClassSessionItem,
  CommerceOrderItem,
  CourseLessonItem,
  DepartmentItem,
  DiscussionPostItem,
  EnrollmentItem,
  LanguageCode,
  LearningAssetItem,
  LearningPathItem,
  LmsCourse,
  LmsRoleId,
  LmsRouteId,
  LmsUser,
  OrganizationItem,
  SubmissionItem,
  SystemThemeId,
  TrainingPlanItem,
} from "../types/lms";
import {
  DEMO_ASSESSMENTS,
  DEMO_CERTIFICATES,
  DEMO_COURSES,
  DEMO_DEPTS,
  DEMO_DISCUSSIONS,
  DEMO_ENROLLMENTS,
  DEMO_LESSONS,
  DEMO_ORDERS,
  DEMO_ORGS,
  DEMO_PATHS,
  DEMO_PLANS,
  DEMO_SESSIONS,
  DEMO_SUBMISSIONS,
  DEMO_USERS,
  DEMO_ASSETS,
} from "../data/demoSeedData";
import { THEME_CONFIG_MAP } from "../themes/themeConfig";
import { playThemeSound, ThemeSoundEvent } from "../utils/themeSound";

const SUPER_ADMIN_EMAIL = "hungthai84@gmail.com";

function makeSafeId(prefix: string): string {
  const rnd = Math.random().toString(36).slice(2, 8);
  return `${prefix}-${Date.now()}-${rnd}`.replace(/[^a-zA-Z0-9_-]/g, "");
}

function stripUndefined<T extends Record<string, unknown>>(obj: T): Record<string, unknown> {
  const out: Record<string, unknown> = {};
  for (const [k, v] of Object.entries(obj)) {
    if (v !== undefined && k !== "id") {
      out[k] = v;
    }
  }
  return out;
}

export interface LmsContextValue {
  // Auth
  firebaseUser: FirebaseUser | null;
  authReady: boolean;
  isSignedIn: boolean;
  isSuperAdmin: boolean;
  signInWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;

  // UI & Theme (Glass Liquid default)
  language: LanguageCode;
  setLanguage: (lang: LanguageCode) => void;
  activeRoute: LmsRouteId;
  setActiveRoute: (route: LmsRouteId) => void;
  activeRole: LmsRoleId;
  setActiveRole: (role: LmsRoleId) => void;
  systemTheme: SystemThemeId;
  setSystemTheme: (theme: SystemThemeId) => void;
  fontSizeScale: "normal" | "large";
  setFontSizeScale: (scale: "normal" | "large") => void;
  reduceMotion: boolean;
  setReduceMotion: (val: boolean) => void;
  highContrast: boolean;
  setHighContrast: (val: boolean) => void;
  globalSearch: string;
  setGlobalSearch: (q: string) => void;

  // Appearance transparency & wallpaper
  wrapperOpacity: number;
  setWrapperOpacity: (val: number) => void;
  sidebarOpacity: number;
  setSidebarOpacity: (val: number) => void;
  cardOpacity: number;
  setCardOpacity: (val: number) => void;
  wallpaperType: "none" | "image" | "video" | "gradient" | "pattern";
  setWallpaperType: (val: "none" | "image" | "video" | "gradient" | "pattern") => void;
  currentWallpaper: string;
  setCurrentWallpaper: (val: string) => void;
  soundEnabled: boolean;
  setSoundEnabled: (val: boolean) => void;
  playSound: (event?: ThemeSoundEvent) => void;

  // Domain Data
  currentProfile: LmsUser;
  users: LmsUser[];
  organizations: OrganizationItem[];
  departments: DepartmentItem[];
  courses: LmsCourse[];
  lessons: CourseLessonItem[];
  enrollments: EnrollmentItem[];
  classSessions: ClassSessionItem[];
  assessments: AssessmentItem[];
  submissions: SubmissionItem[];
  certificates: CertificateItem[];
  assets: LearningAssetItem[];
  learningPaths: LearningPathItem[];
  trainingPlans: TrainingPlanItem[];
  discussions: DiscussionPostItem[];
  orders: CommerceOrderItem[];
  auditLogs: AuditLogItem[];

  // CRUD & Actions
  showToast: (msg: string) => void;
  toastMessage: string | null;
  createCourse: (input: Omit<LmsCourse, "id" | "ownerId" | "instructorId">) => Promise<void>;
  updateCourse: (courseId: string, patch: Partial<LmsCourse>) => Promise<void>;
  deleteCourse: (courseId: string) => Promise<void>;
  addLesson: (input: Omit<CourseLessonItem, "id" | "ownerId">) => Promise<void>;
  updateLesson: (courseId: string, lessonId: string, patch: Partial<CourseLessonItem>) => Promise<void>;
  deleteLesson: (courseId: string, lessonId: string) => Promise<void>;
  enrollCourse: (course: LmsCourse) => Promise<void>;
  updateEnrollmentStatus: (enrollmentId: string, status: EnrollmentItem["status"], progressPercent?: number) => Promise<void>;
  createClassSession: (input: Omit<ClassSessionItem, "id" | "ownerId">) => Promise<void>;
  createAssessment: (input: Omit<AssessmentItem, "id" | "ownerId">) => Promise<void>;
  submitAssessment: (input: Omit<SubmissionItem, "id" | "ownerId" | "studentId" | "studentName">) => Promise<void>;
  gradeSubmission: (submissionId: string, score: number, feedback: string) => Promise<void>;
  issueCertificate: (input: { userId: string; userName: string; courseId: string; courseTitle: string }) => Promise<void>;
  revokeCertificate: (certId: string) => Promise<void>;
  addAsset: (input: Omit<LearningAssetItem, "id" | "ownerId">) => Promise<void>;
  createLearningPath: (input: Omit<LearningPathItem, "id" | "ownerId">) => Promise<void>;
  createTrainingPlan: (input: Omit<TrainingPlanItem, "id" | "ownerId">) => Promise<void>;
  approveTrainingPlan: (planId: string, approvalStatus: "approved" | "rejected") => Promise<void>;
  createDiscussion: (input: { title: string; content: string; category: string }) => Promise<void>;
  likeDiscussion: (postId: string, currentLikes: number) => Promise<void>;
  createOrder: (input: { courseId: string; courseTitle: string; amount: number; couponCode?: string }) => Promise<void>;
  createOrganization: (input: Omit<OrganizationItem, "id" | "ownerId">) => Promise<void>;
  createDepartment: (input: Omit<DepartmentItem, "id" | "ownerId">) => Promise<void>;
  updateUserRole: (uid: string, role: LmsRoleId) => Promise<void>;
  seedDemoToFirestore: () => Promise<void>;
  clearDemoFromFirestore: () => Promise<void>;
  logAudit: (action: string, targetType: string, details?: string) => Promise<void>;
}

const LmsContext = createContext<LmsContextValue | null>(null);

export const LmsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [firebaseUser, setFirebaseUser] = useState<FirebaseUser | null>(null);
  const [authReady, setAuthReady] = useState(false);

  // UI preferences (defaulting to Glass Liquid multi-color system theme)
  const [language, setLanguage] = useState<LanguageCode>("vi");
  const [activeRoute, setActiveRoute] = useState<LmsRouteId>("dashboard");
  const [activeRole, setActiveRole] = useState<LmsRoleId>("super_admin");
  const [systemTheme, setSystemThemeState] = useState<SystemThemeId>("glass-liquid");
  const [fontSizeScale, setFontSizeScale] = useState<"normal" | "large">("normal");
  const [reduceMotion, setReduceMotion] = useState(false);
  const [highContrast, setHighContrast] = useState(false);
  const [globalSearch, setGlobalSearch] = useState("");
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [soundEnabled, setSoundEnabled] = useState(true);

  const [wrapperOpacity, setWrapperOpacity] = useState(74);
  const [sidebarOpacity, setSidebarOpacity] = useState(82);
  const [cardOpacity, setCardOpacity] = useState(86);
  const [wallpaperType, setWallpaperType] = useState<"none" | "image" | "video" | "gradient" | "pattern">("image");
  const [currentWallpaper, setCurrentWallpaper] = useState<string>(THEME_CONFIG_MAP["glass-liquid"].wallpaperUrl);

  // Domain states (populated with Demo preview when unauthenticated; synced to Firestore when authenticated)
  const [users, setUsers] = useState<LmsUser[]>(DEMO_USERS);
  const [organizations, setOrganizations] = useState<OrganizationItem[]>(DEMO_ORGS);
  const [departments, setDepartments] = useState<DepartmentItem[]>(DEMO_DEPTS);
  const [courses, setCourses] = useState<LmsCourse[]>(DEMO_COURSES);
  const [lessons, setLessons] = useState<CourseLessonItem[]>(DEMO_LESSONS);
  const [enrollments, setEnrollments] = useState<EnrollmentItem[]>(DEMO_ENROLLMENTS);
  const [classSessions, setClassSessions] = useState<ClassSessionItem[]>(DEMO_SESSIONS);
  const [assessments, setAssessments] = useState<AssessmentItem[]>(DEMO_ASSESSMENTS);
  const [submissions, setSubmissions] = useState<SubmissionItem[]>(DEMO_SUBMISSIONS);
  const [certificates, setCertificates] = useState<CertificateItem[]>(DEMO_CERTIFICATES);
  const [assets, setAssets] = useState<LearningAssetItem[]>(DEMO_ASSETS);
  const [learningPaths, setLearningPaths] = useState<LearningPathItem[]>(DEMO_PATHS);
  const [trainingPlans, setTrainingPlans] = useState<TrainingPlanItem[]>(DEMO_PLANS);
  const [discussions, setDiscussions] = useState<DiscussionPostItem[]>(DEMO_DISCUSSIONS);
  const [orders, setOrders] = useState<CommerceOrderItem[]>(DEMO_ORDERS);
  const [auditLogs, setAuditLogs] = useState<AuditLogItem[]>([
    {
      id: "audit-demo-1",
      actorName: "System Bootstrap",
      action: "INIT_RBAC_MATRIX",
      targetType: "system",
      details: "Khởi tạo ma trận 12 vai trò RBAC & Glass Liquid Theme",
      ownerId: "demo-owner",
      createdAt: "Vừa xong",
    },
  ]);

  const playSound = useCallback(
    (event: ThemeSoundEvent = "click") => {
      if (soundEnabled) {
        playThemeSound(systemTheme, event);
      }
    },
    [soundEnabled, systemTheme]
  );

  const setSystemTheme = useCallback(
    (nextTheme: SystemThemeId) => {
      setSystemThemeState(nextTheme);
      const meta = THEME_CONFIG_MAP[nextTheme];
      if (meta?.wallpaperUrl) {
        setWallpaperType("image");
        setCurrentWallpaper(meta.wallpaperUrl);
      }
      if (soundEnabled) {
        playThemeSound(nextTheme, "switch");
      }
    },
    [soundEnabled]
  );

  const showToast = useCallback((msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage((prev) => (prev === msg ? null : prev));
    }, 3200);
  }, []);

  const isSuperAdmin = Boolean(
    firebaseUser?.emailVerified && firebaseUser?.email === SUPER_ADMIN_EMAIL
  );

  // Auth listener & user doc bootstrap
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (user) => {
      setFirebaseUser(user);
      setAuthReady(true);

      if (user) {
        try {
          const isBootstrapAdmin = user.emailVerified && user.email === SUPER_ADMIN_EMAIL;
          const assignedRole: LmsRoleId = isBootstrapAdmin ? "super_admin" : "learner";
          if (!isBootstrapAdmin) {
            setActiveRole("learner");
          } else {
            setActiveRole("super_admin");
          }
          await setDoc(
            doc(db, "users", user.uid),
            stripUndefined({
              uid: user.uid,
              displayName: user.displayName || "Thành viên EduSmart",
              avatar: user.photoURL || "/03_avatar_student.png",
              role: assignedRole,
              xp: 860,
              level: 10,
              status: "active",
              ownerId: user.uid,
              createdAt: serverTimestamp(),
              updatedAt: serverTimestamp(),
            }),
            { merge: true }
          );
          if (user.email) {
            await setDoc(
              doc(db, "users", user.uid, "private", "profile"),
              stripUndefined({
                email: user.email,
                ownerId: user.uid,
                createdAt: serverTimestamp(),
                updatedAt: serverTimestamp(),
              }),
              { merge: true }
            );
          }
        } catch (err) {
          // Do not crash app on bootstrap merge error; log cleanly
          console.warn("User bootstrap note:", err);
        }
      }
    });
    return () => unsub();
  }, []);

  // Real-time Firestore listeners (ONLY attached when authenticated!)
  useEffect(() => {
    if (!authReady || !firebaseUser) {
      return;
    }

    const uid = firebaseUser.uid;
    const superAdmin = Boolean(firebaseUser.emailVerified && firebaseUser.email === SUPER_ADMIN_EMAIL);

    const safeSub = <T extends { id?: string }>(
      colName: string,
      qRef: ReturnType<typeof query> | ReturnType<typeof collection>,
      setter: React.Dispatch<React.SetStateAction<T[]>>,
      fallbackDemo: T[]
    ) => {
      return onSnapshot(
        qRef,
        (snap) => {
          const rows = snap.docs.map((d) => ({ id: d.id, ...(d.data() as Record<string, unknown>) })) as T[];
          setter(rows.length > 0 ? rows : fallbackDemo);
        },
        (error) => {
          try {
            handleFirestoreError(error, OperationType.LIST, colName);
          } catch (e) {
            console.warn(`Firestore listener notice for ${colName}:`, e);
          }
        }
      );
    };

    const unsubs: Array<() => void> = [];

    unsubs.push(
      safeSub<LmsCourse>(
        "courses",
        superAdmin
          ? collection(db, "courses")
          : query(collection(db, "courses"), where("isPublic", "==", true)),
        setCourses,
        DEMO_COURSES
      )
    );

    unsubs.push(
      safeSub<OrganizationItem>(
        "organizations",
        superAdmin
          ? collection(db, "organizations")
          : query(collection(db, "organizations"), where("status", "==", "active")),
        setOrganizations,
        DEMO_ORGS
      )
    );

    unsubs.push(
      safeSub<DepartmentItem>(
        "departments",
        superAdmin
          ? collection(db, "departments")
          : query(collection(db, "departments"), where("ownerId", "==", uid)),
        setDepartments,
        DEMO_DEPTS
      )
    );

    unsubs.push(
      safeSub<EnrollmentItem>(
        "enrollments",
        superAdmin
          ? collection(db, "enrollments")
          : query(collection(db, "enrollments"), where("userId", "==", uid)),
        setEnrollments,
        DEMO_ENROLLMENTS
      )
    );

    unsubs.push(
      safeSub<ClassSessionItem>(
        "classSessions",
        superAdmin
          ? collection(db, "classSessions")
          : query(collection(db, "classSessions"), where("ownerId", "==", uid)),
        setClassSessions,
        DEMO_SESSIONS
      )
    );

    unsubs.push(
      safeSub<AssessmentItem>(
        "assessments",
        superAdmin
          ? collection(db, "assessments")
          : query(collection(db, "assessments"), where("isPublic", "==", true)),
        setAssessments,
        DEMO_ASSESSMENTS
      )
    );

    unsubs.push(
      safeSub<SubmissionItem>(
        "submissions",
        superAdmin
          ? collection(db, "submissions")
          : query(collection(db, "submissions"), where("studentId", "==", uid)),
        setSubmissions,
        DEMO_SUBMISSIONS
      )
    );

    unsubs.push(
      safeSub<CertificateItem>(
        "certificates",
        superAdmin
          ? collection(db, "certificates")
          : query(collection(db, "certificates"), where("userId", "==", uid)),
        setCertificates,
        DEMO_CERTIFICATES
      )
    );

    unsubs.push(
      safeSub<LearningAssetItem>(
        "assets",
        superAdmin
          ? collection(db, "assets")
          : query(collection(db, "assets"), where("isPublic", "==", true)),
        setAssets,
        DEMO_ASSETS
      )
    );

    unsubs.push(
      safeSub<LearningPathItem>(
        "learningPaths",
        superAdmin
          ? collection(db, "learningPaths")
          : query(collection(db, "learningPaths"), where("isPublic", "==", true)),
        setLearningPaths,
        DEMO_PATHS
      )
    );

    unsubs.push(
      safeSub<TrainingPlanItem>(
        "trainingPlans",
        superAdmin
          ? collection(db, "trainingPlans")
          : query(collection(db, "trainingPlans"), where("ownerId", "==", uid)),
        setTrainingPlans,
        DEMO_PLANS
      )
    );

    unsubs.push(
      safeSub<DiscussionPostItem>(
        "discussions",
        superAdmin
          ? collection(db, "discussions")
          : query(collection(db, "discussions"), where("isPublic", "==", true)),
        setDiscussions,
        DEMO_DISCUSSIONS
      )
    );

    unsubs.push(
      safeSub<CommerceOrderItem>(
        "orders",
        superAdmin
          ? collection(db, "orders")
          : query(collection(db, "orders"), where("ownerId", "==", uid)),
        setOrders,
        DEMO_ORDERS
      )
    );

    unsubs.push(
      safeSub<AuditLogItem>(
        "auditLogs",
        superAdmin
          ? collection(db, "auditLogs")
          : query(collection(db, "auditLogs"), where("ownerId", "==", uid)),
        setAuditLogs,
        []
      )
    );

    return () => {
      unsubs.forEach((u) => u());
    };
  }, [authReady, firebaseUser]);

  const currentProfile: LmsUser = firebaseUser
    ? {
        uid: firebaseUser.uid,
        displayName: firebaseUser.displayName || "Nguyễn Văn A",
        avatar: firebaseUser.photoURL || "/03_avatar_student.png",
        role: activeRole,
        xp: 2860,
        level: 12,
        status: "active",
        email: firebaseUser.email || undefined,
        ownerId: firebaseUser.uid,
      }
    : {
        ...DEMO_USERS[0],
        role: activeRole,
      };

  const signInWithGoogle = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
      showToast("Đăng nhập Google thành công! Dữ liệu Firestore đã được kích hoạt.");
    } catch (error: unknown) {
      const msg = error instanceof Error ? error.message : "Đăng nhập Google thất bại";
      showToast(msg);
    }
  };

  const logout = async () => {
    await signOut(auth);
    showToast("Đã đăng xuất khỏi tài khoản Google.");
  };

  const logAudit = useCallback(
    async (action: string, targetType: string, details?: string) => {
      const newLog: AuditLogItem = {
        id: makeSafeId("audit"),
        actorName: currentProfile.displayName,
        action,
        targetType,
        details: details || "",
        ownerId: firebaseUser?.uid || "demo-owner",
        createdAt: new Date().toLocaleTimeString("vi-VN"),
      };
      setAuditLogs((prev) => [newLog, ...prev]);

      if (firebaseUser) {
        try {
          await setDoc(
            doc(db, "auditLogs", newLog.id),
            stripUndefined({
              actorName: newLog.actorName,
              action: newLog.action,
              targetType: newLog.targetType,
              details: newLog.details,
              ownerId: firebaseUser.uid,
              createdAt: serverTimestamp(),
            })
          );
        } catch (err) {
          console.warn("Audit log error:", err);
        }
      }
    },
    [currentProfile.displayName, firebaseUser]
  );

  const requireAuthOrDemoNotice = (localUpdater: () => void, successMsg: string) => {
    localUpdater();
    if (!firebaseUser) {
      showToast(`${successMsg} (Chế độ Xem trước Demo — Đăng nhập Google để lưu Cloud)`);
      return false;
    }
    return true;
  };

  const createCourse = async (input: Omit<LmsCourse, "id" | "ownerId" | "instructorId">) => {
    const id = makeSafeId("course");
    const uid = firebaseUser?.uid || "demo-owner";
    const newCourse: LmsCourse = {
      ...input,
      id,
      code: input.code.replace(/[^a-zA-Z0-9_-]/g, "-").slice(0, 32) || makeSafeId("CRS").slice(0, 12),
      instructorId: uid,
      ownerId: uid,
      isDemo: false,
    };

    const canPersist = requireAuthOrDemoNotice(
      () => setCourses((prev) => [newCourse, ...prev]),
      `Đã tạo khóa học "${newCourse.title}"`
    );
    if (!canPersist || !firebaseUser) return;

    try {
      await setDoc(
        doc(db, "courses", id),
        stripUndefined({
          ...newCourse,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        })
      );
      await logAudit("CREATE_COURSE", "courses", newCourse.title);
      showToast(`Đã lưu khóa học "${newCourse.title}" lên Firestore!`);
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, `courses/${id}`);
    }
  };

  const updateCourse = async (courseId: string, patch: Partial<LmsCourse>) => {
    const canPersist = requireAuthOrDemoNotice(
      () => setCourses((prev) => prev.map((c) => (c.id === courseId ? { ...c, ...patch } : c))),
      "Đã cập nhật khóa học"
    );
    if (!canPersist || !firebaseUser) return;

    try {
      await updateDoc(
        doc(db, "courses", courseId),
        stripUndefined({
          ...patch,
          updatedAt: serverTimestamp(),
        })
      );
      await logAudit("UPDATE_COURSE", "courses", courseId);
      showToast("Đã đồng bộ cập nhật khóa học lên Firestore!");
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, `courses/${courseId}`);
    }
  };

  const deleteCourse = async (courseId: string) => {
    const canPersist = requireAuthOrDemoNotice(
      () => setCourses((prev) => prev.filter((c) => c.id !== courseId)),
      "Đã xóa khóa học"
    );
    if (!canPersist || !firebaseUser) return;

    try {
      await deleteDoc(doc(db, "courses", courseId));
      await logAudit("DELETE_COURSE", "courses", courseId);
      showToast("Đã xóa khóa học khỏi Firestore.");
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, `courses/${courseId}`);
    }
  };

  const addLesson = async (input: Omit<CourseLessonItem, "id" | "ownerId">) => {
    const id = makeSafeId("les");
    const uid = firebaseUser?.uid || "demo-owner";
    const lesson: CourseLessonItem = { ...input, id, ownerId: uid, isDemo: false };

    const canPersist = requireAuthOrDemoNotice(
      () => setLessons((prev) => [...prev, lesson]),
      `Đã thêm bài học "${lesson.title}"`
    );
    if (!canPersist || !firebaseUser) return;

    try {
      await setDoc(
        doc(db, "courses", input.courseId, "lessons", id),
        stripUndefined({
          ...lesson,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        })
      );
      await logAudit("ADD_LESSON", "lessons", lesson.title);
      showToast("Đã lưu bài học lên Firestore!");
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, `courses/${input.courseId}/lessons/${id}`);
    }
  };

  const updateLesson = async (courseId: string, lessonId: string, patch: Partial<CourseLessonItem>) => {
    const canPersist = requireAuthOrDemoNotice(
      () => setLessons((prev) => prev.map((l) => (l.id === lessonId ? { ...l, ...patch } : l))),
      "Đã cập nhật bài học"
    );
    if (!canPersist || !firebaseUser) return;

    try {
      await updateDoc(
        doc(db, "courses", courseId, "lessons", lessonId),
        stripUndefined({ ...patch, updatedAt: serverTimestamp() })
      );
      showToast("Đã cập nhật bài học lên Firestore!");
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, `courses/${courseId}/lessons/${lessonId}`);
    }
  };

  const deleteLesson = async (courseId: string, lessonId: string) => {
    const canPersist = requireAuthOrDemoNotice(
      () => setLessons((prev) => prev.filter((l) => l.id !== lessonId)),
      "Đã xóa bài học"
    );
    if (!canPersist || !firebaseUser) return;

    try {
      await deleteDoc(doc(db, "courses", courseId, "lessons", lessonId));
      showToast("Đã xóa bài học khỏi Firestore.");
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, `courses/${courseId}/lessons/${lessonId}`);
    }
  };

  const enrollCourse = async (course: LmsCourse) => {
    const id = makeSafeId("enr");
    const uid = firebaseUser?.uid || "demo-owner";
    const enr: EnrollmentItem = {
      id,
      courseId: course.id,
      courseTitle: course.title,
      userId: uid,
      userName: currentProfile.displayName,
      status: "active",
      progressPercent: 0,
      ownerId: uid,
      isDemo: false,
    };

    const canPersist = requireAuthOrDemoNotice(
      () => setEnrollments((prev) => [enr, ...prev]),
      `Đã ghi danh vào "${course.title}"`
    );
    if (!canPersist || !firebaseUser) return;

    try {
      await setDoc(
        doc(db, "enrollments", id),
        stripUndefined({
          ...enr,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        })
      );
      await logAudit("ENROLL_COURSE", "enrollments", course.title);
      showToast(`Ghi danh thành công "${course.title}"!`);
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, `enrollments/${id}`);
    }
  };

  const updateEnrollmentStatus = async (
    enrollmentId: string,
    status: EnrollmentItem["status"],
    progressPercent?: number
  ) => {
    const canPersist = requireAuthOrDemoNotice(
      () =>
        setEnrollments((prev) =>
          prev.map((e) =>
            e.id === enrollmentId
              ? { ...e, status, progressPercent: progressPercent ?? e.progressPercent }
              : e
          )
        ),
      "Đã cập nhật trạng thái ghi danh"
    );
    if (!canPersist || !firebaseUser) return;

    try {
      await updateDoc(
        doc(db, "enrollments", enrollmentId),
        stripUndefined({
          status,
          progressPercent,
          updatedAt: serverTimestamp(),
        })
      );
      showToast("Đã cập nhật ghi danh lên Firestore.");
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, `enrollments/${enrollmentId}`);
    }
  };

  const createClassSession = async (input: Omit<ClassSessionItem, "id" | "ownerId">) => {
    const id = makeSafeId("ses");
    const uid = firebaseUser?.uid || "demo-owner";
    const item: ClassSessionItem = { ...input, id, ownerId: uid, isDemo: false };

    const canPersist = requireAuthOrDemoNotice(
      () => setClassSessions((prev) => [item, ...prev]),
      `Đã tạo buổi học "${item.title}"`
    );
    if (!canPersist || !firebaseUser) return;

    try {
      await setDoc(
        doc(db, "classSessions", id),
        stripUndefined({
          ...item,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        })
      );
      await logAudit("CREATE_SESSION", "classSessions", item.title);
      showToast("Đã lưu lịch buổi học lên Firestore!");
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, `classSessions/${id}`);
    }
  };

  const createAssessment = async (input: Omit<AssessmentItem, "id" | "ownerId">) => {
    const id = makeSafeId("asm");
    const uid = firebaseUser?.uid || "demo-owner";
    const item: AssessmentItem = { ...input, id, ownerId: uid, isDemo: false };

    const canPersist = requireAuthOrDemoNotice(
      () => setAssessments((prev) => [item, ...prev]),
      `Đã tạo bài kiểm tra "${item.title}"`
    );
    if (!canPersist || !firebaseUser) return;

    try {
      await setDoc(
        doc(db, "assessments", id),
        stripUndefined({
          ...item,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        })
      );
      await logAudit("CREATE_ASSESSMENT", "assessments", item.title);
      showToast("Đã lưu đề thi lên Firestore!");
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, `assessments/${id}`);
    }
  };

  const submitAssessment = async (
    input: Omit<SubmissionItem, "id" | "ownerId" | "studentId" | "studentName">
  ) => {
    const id = makeSafeId("sub");
    const uid = firebaseUser?.uid || "demo-owner";
    const item: SubmissionItem = {
      ...input,
      id,
      studentId: uid,
      studentName: currentProfile.displayName,
      status: "submitted",
      ownerId: uid,
      isDemo: false,
    };

    const canPersist = requireAuthOrDemoNotice(
      () => setSubmissions((prev) => [item, ...prev]),
      "Đã nộp bài kiểm tra thành công"
    );
    if (!canPersist || !firebaseUser) return;

    try {
      await setDoc(
        doc(db, "submissions", id),
        stripUndefined({
          ...item,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        })
      );
      await logAudit("SUBMIT_ASSESSMENT", "submissions", input.assessmentId);
      showToast("Đã nộp bài kiểm tra lên Firestore!");
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, `submissions/${id}`);
    }
  };

  const gradeSubmission = async (submissionId: string, score: number, feedback: string) => {
    const canPersist = requireAuthOrDemoNotice(
      () =>
        setSubmissions((prev) =>
          prev.map((s) =>
            s.id === submissionId ? { ...s, score, feedback, status: "graded" } : s
          )
        ),
      "Đã chấm điểm bài nộp"
    );
    if (!canPersist || !firebaseUser) return;

    try {
      await updateDoc(
        doc(db, "submissions", submissionId),
        stripUndefined({
          score,
          feedback,
          status: "graded",
          updatedAt: serverTimestamp(),
        })
      );
      await logAudit("GRADE_SUBMISSION", "submissions", `${submissionId}: ${score} pts`);
      showToast("Đã lưu điểm & nhận xét Rubric lên Firestore!");
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, `submissions/${submissionId}`);
    }
  };

  const issueCertificate = async (input: {
    userId: string;
    userName: string;
    courseId: string;
    courseTitle: string;
  }) => {
    const id = makeSafeId("cert");
    const uid = firebaseUser?.uid || "demo-owner";
    const verifyCode = `EDU-${Math.random().toString(36).slice(2, 6).toUpperCase()}-2026`;
    const cert: CertificateItem = {
      id,
      verifyCode,
      userId: input.userId,
      userName: input.userName,
      courseId: input.courseId,
      courseTitle: input.courseTitle,
      status: "valid",
      ownerId: uid,
      isDemo: false,
    };

    const canPersist = requireAuthOrDemoNotice(
      () => setCertificates((prev) => [cert, ...prev]),
      `Đã cấp chứng chỉ ${verifyCode}`
    );
    if (!canPersist || !firebaseUser) return;

    try {
      await setDoc(
        doc(db, "certificates", id),
        stripUndefined({
          ...cert,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        })
      );
      await logAudit("ISSUE_CERTIFICATE", "certificates", verifyCode);
      showToast(`Đã cấp & lưu chứng chỉ ${verifyCode} lên Firestore!`);
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, `certificates/${id}`);
    }
  };

  const revokeCertificate = async (certId: string) => {
    const canPersist = requireAuthOrDemoNotice(
      () =>
        setCertificates((prev) =>
          prev.map((c) => (c.id === certId ? { ...c, status: "revoked" } : c))
        ),
      "Đã thu hồi chứng chỉ"
    );
    if (!canPersist || !firebaseUser) return;

    try {
      await updateDoc(
        doc(db, "certificates", certId),
        stripUndefined({ status: "revoked", updatedAt: serverTimestamp() })
      );
      await logAudit("REVOKE_CERTIFICATE", "certificates", certId);
      showToast("Đã thu hồi chứng chỉ trên Firestore.");
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, `certificates/${certId}`);
    }
  };

  const addAsset = async (input: Omit<LearningAssetItem, "id" | "ownerId">) => {
    const id = makeSafeId("ast");
    const uid = firebaseUser?.uid || "demo-owner";
    const item: LearningAssetItem = { ...input, id, ownerId: uid, isDemo: false };

    const canPersist = requireAuthOrDemoNotice(
      () => setAssets((prev) => [item, ...prev]),
      `Đã thêm học liệu "${item.name}"`
    );
    if (!canPersist || !firebaseUser) return;

    try {
      await setDoc(
        doc(db, "assets", id),
        stripUndefined({
          ...item,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        })
      );
      await logAudit("ADD_ASSET", "assets", item.name);
      showToast("Đã lưu học liệu lên Firestore!");
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, `assets/${id}`);
    }
  };

  const createLearningPath = async (input: Omit<LearningPathItem, "id" | "ownerId">) => {
    const id = makeSafeId("path");
    const uid = firebaseUser?.uid || "demo-owner";
    const item: LearningPathItem = { ...input, id, ownerId: uid, isDemo: false };

    const canPersist = requireAuthOrDemoNotice(
      () => setLearningPaths((prev) => [item, ...prev]),
      `Đã tạo lộ trình "${item.title}"`
    );
    if (!canPersist || !firebaseUser) return;

    try {
      await setDoc(
        doc(db, "learningPaths", id),
        stripUndefined({
          ...item,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        })
      );
      await logAudit("CREATE_PATH", "learningPaths", item.title);
      showToast("Đã lưu lộ trình lên Firestore!");
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, `learningPaths/${id}`);
    }
  };

  const createTrainingPlan = async (input: Omit<TrainingPlanItem, "id" | "ownerId">) => {
    const id = makeSafeId("plan");
    const uid = firebaseUser?.uid || "demo-owner";
    const item: TrainingPlanItem = { ...input, id, ownerId: uid, isDemo: false };

    const canPersist = requireAuthOrDemoNotice(
      () => setTrainingPlans((prev) => [item, ...prev]),
      `Đã lập kế hoạch "${item.title}"`
    );
    if (!canPersist || !firebaseUser) return;

    try {
      await setDoc(
        doc(db, "trainingPlans", id),
        stripUndefined({
          ...item,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        })
      );
      await logAudit("CREATE_TRAINING_PLAN", "trainingPlans", item.title);
      showToast("Đã lưu kế hoạch đào tạo lên Firestore!");
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, `trainingPlans/${id}`);
    }
  };

  const approveTrainingPlan = async (planId: string, approvalStatus: "approved" | "rejected") => {
    const canPersist = requireAuthOrDemoNotice(
      () =>
        setTrainingPlans((prev) =>
          prev.map((p) => (p.id === planId ? { ...p, approvalStatus } : p))
        ),
      approvalStatus === "approved" ? "Đã phê duyệt kế hoạch" : "Đã từ chối kế hoạch"
    );
    if (!canPersist || !firebaseUser) return;

    try {
      await updateDoc(
        doc(db, "trainingPlans", planId),
        stripUndefined({ approvalStatus, updatedAt: serverTimestamp() })
      );
      await logAudit("APPROVE_TRAINING_PLAN", "trainingPlans", `${planId}: ${approvalStatus}`);
      showToast("Đã cập nhật trạng thái phê duyệt trên Firestore.");
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, `trainingPlans/${planId}`);
    }
  };

  const createDiscussion = async (input: { title: string; content: string; category: string }) => {
    const id = makeSafeId("disc");
    const uid = firebaseUser?.uid || "demo-owner";
    const item: DiscussionPostItem = {
      id,
      title: input.title,
      content: input.content,
      category: input.category,
      authorName: currentProfile.displayName,
      likesCount: 0,
      isPublic: true,
      ownerId: uid,
      isDemo: false,
    };

    const canPersist = requireAuthOrDemoNotice(
      () => setDiscussions((prev) => [item, ...prev]),
      "Đã đăng bài thảo luận"
    );
    if (!canPersist || !firebaseUser) return;

    try {
      await setDoc(
        doc(db, "discussions", id),
        stripUndefined({
          ...item,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        })
      );
      await logAudit("CREATE_DISCUSSION", "discussions", item.title);
      showToast("Đã đăng bài lên diễn đàn Firestore!");
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, `discussions/${id}`);
    }
  };

  const likeDiscussion = async (postId: string, currentLikes: number) => {
    const canPersist = requireAuthOrDemoNotice(
      () =>
        setDiscussions((prev) =>
          prev.map((d) => (d.id === postId ? { ...d, likesCount: d.likesCount + 1 } : d))
        ),
      "Đã thích bài viết"
    );
    if (!canPersist || !firebaseUser) return;

    try {
      await updateDoc(
        doc(db, "discussions", postId),
        stripUndefined({
          likesCount: currentLikes + 1,
          updatedAt: serverTimestamp(),
        })
      );
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, `discussions/${postId}`);
    }
  };

  const createOrder = async (input: {
    courseId: string;
    courseTitle: string;
    amount: number;
    couponCode?: string;
  }) => {
    const id = makeSafeId("ord");
    const uid = firebaseUser?.uid || "demo-owner";
    const item: CommerceOrderItem = {
      id,
      courseId: input.courseId,
      courseTitle: input.courseTitle,
      amount: input.amount,
      couponCode: input.couponCode,
      paymentStatus: "pending_webhook",
      ownerId: uid,
      isDemo: false,
    };

    const canPersist = requireAuthOrDemoNotice(
      () => setOrders((prev) => [item, ...prev]),
      "Đã tạo đơn hàng (Chờ xác nhận Webhook)"
    );
    if (!canPersist || !firebaseUser) return;

    try {
      await setDoc(
        doc(db, "orders", id),
        stripUndefined({
          ...item,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        })
      );
      await logAudit("CREATE_ORDER", "orders", `${item.courseTitle} (${item.amount}đ)`);
      showToast("Đã ghi nhận đơn hàng trạng thái pending_webhook trên Firestore.");
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, `orders/${id}`);
    }
  };

  const createOrganization = async (input: Omit<OrganizationItem, "id" | "ownerId">) => {
    const id = makeSafeId("org");
    const uid = firebaseUser?.uid || "demo-owner";
    const item: OrganizationItem = { ...input, id, ownerId: uid, isDemo: false };

    const canPersist = requireAuthOrDemoNotice(
      () => setOrganizations((prev) => [item, ...prev]),
      `Đã tạo đơn vị "${item.name}"`
    );
    if (!canPersist || !firebaseUser) return;

    try {
      await setDoc(
        doc(db, "organizations", id),
        stripUndefined({
          ...item,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        })
      );
      await logAudit("CREATE_ORG", "organizations", item.name);
      showToast("Đã lưu đơn vị lên Firestore!");
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, `organizations/${id}`);
    }
  };

  const createDepartment = async (input: Omit<DepartmentItem, "id" | "ownerId">) => {
    const id = makeSafeId("dept");
    const uid = firebaseUser?.uid || "demo-owner";
    const item: DepartmentItem = { ...input, id, ownerId: uid, isDemo: false };

    const canPersist = requireAuthOrDemoNotice(
      () => setDepartments((prev) => [item, ...prev]),
      `Đã tạo phòng ban "${item.name}"`
    );
    if (!canPersist || !firebaseUser) return;

    try {
      await setDoc(
        doc(db, "departments", id),
        stripUndefined({
          ...item,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        })
      );
      await logAudit("CREATE_DEPT", "departments", item.name);
      showToast("Đã lưu phòng ban lên Firestore!");
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, `departments/${id}`);
    }
  };

  const updateUserRole = async (uidTarget: string, role: LmsRoleId) => {
    setUsers((prev) => prev.map((u) => (u.uid === uidTarget ? { ...u, role } : u)));
    await logAudit("UPDATE_USER_ROLE", "users", `${uidTarget} -> ${role}`);
    showToast(`Đã cập nhật vai trò người dùng thành ${role}`);
  };

  const seedDemoToFirestore = async () => {
    if (!firebaseUser) {
      showToast("Vui lòng đăng nhập Google trước khi nạp dữ liệu mẫu lên Firestore.");
      return;
    }
    const uid = firebaseUser.uid;
    try {
      const batch = writeBatch(db);
      for (const org of DEMO_ORGS) {
        batch.set(
          doc(db, "organizations", org.id),
          stripUndefined({ ...org, ownerId: uid, createdAt: serverTimestamp(), updatedAt: serverTimestamp() })
        );
      }
      for (const dept of DEMO_DEPTS) {
        batch.set(
          doc(db, "departments", dept.id),
          stripUndefined({ ...dept, ownerId: uid, createdAt: serverTimestamp(), updatedAt: serverTimestamp() })
        );
      }
      for (const course of DEMO_COURSES) {
        batch.set(
          doc(db, "courses", course.id),
          stripUndefined({ ...course, instructorId: uid, ownerId: uid, createdAt: serverTimestamp(), updatedAt: serverTimestamp() })
        );
      }
      for (const asm of DEMO_ASSESSMENTS) {
        batch.set(
          doc(db, "assessments", asm.id),
          stripUndefined({ ...asm, ownerId: uid, createdAt: serverTimestamp(), updatedAt: serverTimestamp() })
        );
      }
      for (const asset of DEMO_ASSETS) {
        batch.set(
          doc(db, "assets", asset.id),
          stripUndefined({ ...asset, ownerId: uid, createdAt: serverTimestamp(), updatedAt: serverTimestamp() })
        );
      }
      for (const path of DEMO_PATHS) {
        batch.set(
          doc(db, "learningPaths", path.id),
          stripUndefined({ ...path, ownerId: uid, createdAt: serverTimestamp(), updatedAt: serverTimestamp() })
        );
      }
      for (const disc of DEMO_DISCUSSIONS) {
        batch.set(
          doc(db, "discussions", disc.id),
          stripUndefined({ ...disc, ownerId: uid, createdAt: serverTimestamp(), updatedAt: serverTimestamp() })
        );
      }
      await batch.commit();
      await logAudit("SEED_DEMO_DATA", "firestore", "Đã nạp dữ liệu mẫu EDU LMS lên Cloud Firestore");
      showToast("Đã nạp toàn bộ dữ liệu mẫu EDU LMS lên Firestore!");
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, "seedDemoToFirestore");
    }
  };

  const clearDemoFromFirestore = async () => {
    if (!firebaseUser) {
      setCourses([]);
      setOrganizations([]);
      setDepartments([]);
      setAssessments([]);
      showToast("Đã xóa dữ liệu Demo cục bộ (Local Preview).");
      return;
    }
    try {
      const collectionsToClean = [
        "courses",
        "organizations",
        "departments",
        "assessments",
        "assets",
        "learningPaths",
        "discussions",
      ];
      for (const colName of collectionsToClean) {
        const snap = await getDocs(query(collection(db, colName), where("isDemo", "==", true)));
        const batch = writeBatch(db);
        snap.docs.forEach((d) => batch.delete(d.ref));
        if (!snap.empty) {
          await batch.commit();
        }
      }
      await logAudit("CLEAR_DEMO_DATA", "firestore", "Đã xóa toàn bộ bản ghi isDemo=true");
      showToast("Đã dọn sạch dữ liệu Demo khỏi Firestore!");
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, "clearDemoFromFirestore");
    }
  };

  return (
    <LmsContext.Provider
      value={{
        firebaseUser,
        authReady,
        isSignedIn: Boolean(firebaseUser),
        isSuperAdmin,
        signInWithGoogle,
        logout,
        language,
        setLanguage,
        activeRoute,
        setActiveRoute,
        activeRole,
        setActiveRole,
        systemTheme,
        setSystemTheme,
        fontSizeScale,
        setFontSizeScale,
        reduceMotion,
        setReduceMotion,
        highContrast,
        setHighContrast,
        globalSearch,
        setGlobalSearch,
        wrapperOpacity,
        setWrapperOpacity,
        sidebarOpacity,
        setSidebarOpacity,
        cardOpacity,
        setCardOpacity,
        wallpaperType,
        setWallpaperType,
        currentWallpaper,
        setCurrentWallpaper,
        soundEnabled,
        setSoundEnabled,
        playSound,
        currentProfile,
        users,
        organizations,
        departments,
        courses,
        lessons,
        enrollments,
        classSessions,
        assessments,
        submissions,
        certificates,
        assets,
        learningPaths,
        trainingPlans,
        discussions,
        orders,
        auditLogs,
        showToast,
        toastMessage,
        createCourse,
        updateCourse,
        deleteCourse,
        addLesson,
        updateLesson,
        deleteLesson,
        enrollCourse,
        updateEnrollmentStatus,
        createClassSession,
        createAssessment,
        submitAssessment,
        gradeSubmission,
        issueCertificate,
        revokeCertificate,
        addAsset,
        createLearningPath,
        createTrainingPlan,
        approveTrainingPlan,
        createDiscussion,
        likeDiscussion,
        createOrder,
        createOrganization,
        createDepartment,
        updateUserRole,
        seedDemoToFirestore,
        clearDemoFromFirestore,
        logAudit,
      }}
    >
      {children}
    </LmsContext.Provider>
  );
};

export function useLms(): LmsContextValue {
  const ctx = useContext(LmsContext);
  if (!ctx) {
    throw new Error("useLms must be used inside LmsProvider");
  }
  return ctx;
}
