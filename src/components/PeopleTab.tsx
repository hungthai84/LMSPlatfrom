import React, { useState } from "react";
import { UserPlus, Mail, ShieldAlert, GraduationCap, Users } from "lucide-react";
import { ClassItem, UserProfile } from "../types";
import { useLms } from "../contexts/LmsContext";
import { tr } from "../i18n/translations";

interface PeopleTabProps {
  classItem: ClassItem;
  activeUser: UserProfile;
  allUsers: UserProfile[];
  onInviteStudent: (studentId: string) => void;
}

export default function PeopleTab({
  classItem,
  activeUser,
  allUsers,
  onInviteStudent
}: PeopleTabProps) {
  const { language } = useLms();
  const [showInviteModal, setShowInviteModal] = useState(false);

  const joinedStudents = allUsers.filter((u) => classItem.students.includes(u.id));

  const classTeacher = allUsers.find((u) => u.id === classItem.teacherId) || {
    name: classItem.teacherName,
    avatar: classItem.teacherAvatar,
    email: "teacher@classroom.edu.vn"
  };

  const nonJoinedStudents = allUsers.filter(
    (u) => u.role === "student" && !classItem.students.includes(u.id)
  );

  return (
    <div className="mx-auto max-w-2xl px-2 sm:px-4 py-6 space-y-6">
      {/* SECTION: TEACHERS */}
      <div className="glass-liquid-card-blue rounded-[14px] border border-white/60 p-5 shadow-sm">
        <div className="flex items-center justify-between border-b border-blue-200/60 pb-3 mb-4">
          <h3 className="text-lg sm:text-xl font-bold text-blue-600 flex items-center gap-2 select-none">
            <GraduationCap className="h-5 w-5" />
            {tr(language, "Giáo viên", "Teachers")}
          </h3>
        </div>

        <div className="flex items-center gap-4 py-1">
          <img
            src={classTeacher.avatar}
            alt={classTeacher.name}
            className="h-10 w-10 rounded-full object-cover border border-white"
            referrerPolicy="no-referrer"
          />
          <div className="flex-1 min-w-0">
            <p className="text-sm font-bold text-slate-800 truncate">{classTeacher.name}</p>
            <p className="text-xs text-slate-500 truncate">{classTeacher.email}</p>
          </div>
          <button className="rounded-[14px] p-2 text-slate-400 hover:bg-white/70 hover:text-blue-600 transition-colors">
            <Mail className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* SECTION: STUDENTS */}
      <div className="glass-liquid-card rounded-[14px] border border-white/60 p-5 shadow-sm">
        <div className="flex items-center justify-between border-b border-white/60 pb-3 mb-4">
          <h3 className="text-lg sm:text-xl font-bold text-slate-800 flex items-center gap-2 select-none">
            <Users className="h-5 w-5 text-slate-500" />
            {tr(language, "Học viên", "Students")}
          </h3>
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-500 font-bold">
              {joinedStudents.length} {tr(language, "học viên", "students")}
            </span>
            {activeUser.role === "teacher" && (
              <button
                onClick={() => setShowInviteModal(true)}
                className="rounded-[14px] p-2 text-blue-600 hover:bg-blue-50 transition-colors"
                title={tr(language, "Mời học viên", "Invite student")}
              >
                <UserPlus className="h-5 w-5" />
              </button>
            )}
          </div>
        </div>

        {joinedStudents.length === 0 ? (
          <div className="text-center py-10 border border-dashed border-slate-200 rounded-[14px] bg-white/50">
            <ShieldAlert className="h-10 w-10 text-slate-300 mx-auto mb-2" />
            <p className="text-sm text-slate-600 font-medium">{tr(language, "Lớp học chưa có học viên", "No students enrolled yet")}</p>
            <p className="text-xs text-slate-400">{tr(language, "Chia sẻ mã lớp học hoặc thêm học viên bằng nút mời.", "Share the class code or invite students directly.")}</p>
          </div>
        ) : (
          <div className="divide-y divide-white/50">
            {joinedStudents.map((student) => (
              <div key={student.id} className="flex items-center gap-4 py-3 hover:bg-white/40 rounded-[14px] px-2 transition-colors">
                <img
                  src={student.avatar}
                  alt={student.name}
                  className="h-9 w-9 rounded-full object-cover border border-white"
                  referrerPolicy="no-referrer"
                />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-slate-800 truncate">{student.name}</p>
                  <p className="text-xs text-slate-400 truncate">{student.email}</p>
                </div>
                <button className="rounded-[14px] p-2 text-slate-400 hover:bg-white/70 hover:text-blue-600 transition-colors">
                  <Mail className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Invitation Modal */}
      {showInviteModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="glass-liquid-card rounded-[14px] shadow-2xl border border-white/60 w-full max-w-md max-h-[85dvh] flex flex-col overflow-hidden">
            <div className="bg-blue-600 text-white p-4 flex items-center justify-between shrink-0">
              <h3 className="font-bold text-base flex items-center gap-2">
                <UserPlus className="h-5 w-5" />
                {tr(language, "Mời học viên vào lớp", "Invite students")}
              </h3>
              <button
                onClick={() => setShowInviteModal(false)}
                className="rounded-[14px] px-2 py-1 text-white hover:bg-white/20 font-bold"
              >
                ✕
              </button>
            </div>

            <div className="p-5 overflow-y-auto">
              <p className="text-xs text-slate-500 leading-relaxed mb-4">
                {tr(language, "Chọn tài khoản học viên từ hệ thống để thêm trực tiếp vào lớp học này.", "Select a student account from the system to enroll directly into this class.")}
              </p>

              {nonJoinedStudents.length === 0 ? (
                <div className="text-center py-4 bg-white/70 rounded-[14px] border border-white/60 text-xs text-slate-500">
                  {tr(language, "Tất cả tài khoản học viên đều đã có mặt trong lớp này!", "All student accounts are already enrolled in this class!")}
                </div>
              ) : (
                <div className="space-y-2 max-h-60 overflow-y-auto">
                  {nonJoinedStudents.map((student) => (
                    <div
                      key={student.id}
                      className="flex items-center justify-between border border-white/70 bg-white/70 rounded-[14px] p-2.5 hover:bg-white transition-colors"
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <img
                          src={student.avatar}
                          alt={student.name}
                          className="h-8 w-8 rounded-full object-cover"
                          referrerPolicy="no-referrer"
                        />
                        <div className="min-w-0">
                          <p className="text-xs font-bold text-slate-800 truncate">{student.name}</p>
                          <p className="text-[10px] text-slate-400 truncate">{student.email}</p>
                        </div>
                      </div>
                      <button
                        onClick={() => {
                          onInviteStudent(student.id);
                          setShowInviteModal(false);
                        }}
                        className="rounded-[14px] bg-blue-50 px-3 py-1.5 text-[11px] font-bold text-blue-700 border border-blue-100 hover:bg-blue-100 transition-colors shrink-0"
                      >
                        {tr(language, "Thêm", "Add")}
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="bg-white/60 p-4 border-t border-white/60 flex justify-end shrink-0">
              <button
                onClick={() => setShowInviteModal(false)}
                className="rounded-[14px] px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-white/80"
              >
                {tr(language, "Đóng", "Close")}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
