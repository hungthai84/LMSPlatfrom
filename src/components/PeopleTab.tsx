import React, { useState } from "react";
import { UserPlus, Mail, ShieldAlert, GraduationCap, Users } from "lucide-react";
import { ClassItem, UserProfile } from "../types";

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
  const [showInviteModal, setShowInviteModal] = useState(false);

  // List students currently in this class
  const joinedStudents = allUsers.filter((u) => classItem.students.includes(u.id));

  // Find teacher of this class
  const classTeacher = allUsers.find((u) => u.id === classItem.teacherId) || {
    name: classItem.teacherName,
    avatar: classItem.teacherAvatar,
    email: "teacher@classroom.edu.vn"
  };

  // Find students NOT in this class for the invitation dropdown
  const nonJoinedStudents = allUsers.filter(
    (u) => u.role === "student" && !classItem.students.includes(u.id)
  );

  return (
    <div className="mx-auto max-w-2xl px-4 py-8">
      {/* SECTION: TEACHERS */}
      <div className="mb-10">
        <div className="flex items-center justify-between border-b border-[#1e88e5] pb-3 mb-5">
          <h3 className="text-xl font-bold text-[#1e88e5] flex items-center gap-2 select-none">
            <GraduationCap className="h-5.5 w-5.5" />
            Giáo viên
          </h3>
        </div>

        <div className="flex items-center gap-4 py-2 pl-2">
          <img
            src={classTeacher.avatar}
            alt={classTeacher.name}
            className="h-10 w-10 rounded-full object-cover border border-gray-200"
            referrerPolicy="no-referrer"
          />
          <div className="flex-1">
            <p className="text-sm font-bold text-gray-800">{classTeacher.name}</p>
            <p className="text-xs text-gray-400">{classTeacher.email}</p>
          </div>
          <button className="rounded-full p-2 text-gray-400 hover:bg-gray-100 hover:text-[#1e88e5]">
            <Mail className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* SECTION: STUDENTS */}
      <div>
        <div className="flex items-center justify-between border-b border-[#dadce0] pb-3 mb-5">
          <h3 className="text-xl font-bold text-gray-800 flex items-center gap-2 select-none">
            <Users className="h-5.5 w-5.5 text-gray-500" />
            Học viên
          </h3>
          <span className="text-xs text-gray-400 font-bold">
            {joinedStudents.length} học viên
          </span>
          {activeUser.role === "teacher" && (
            <button
              onClick={() => setShowInviteModal(true)}
              className="rounded-full p-2 text-[#1e88e5] hover:bg-blue-50"
              title="Mời học viên"
            >
              <UserPlus className="h-5 w-5" />
            </button>
          )}
        </div>

        {joinedStudents.length === 0 ? (
          <div className="text-center py-10 border border-dashed border-gray-200 rounded-lg bg-gray-50/50">
            <ShieldAlert className="h-10 w-10 text-gray-300 mx-auto mb-2" />
            <p className="text-sm text-gray-500 font-medium">Lớp học chưa có học viên</p>
            <p className="text-xs text-gray-400">Chia sẻ mã lớp học hoặc thêm học viên bằng nút mời.</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {joinedStudents.map((student) => (
              <div key={student.id} className="flex items-center gap-4 py-3 pl-2 hover:bg-gray-50/30 transition-colors">
                <img
                  src={student.avatar}
                  alt={student.name}
                  className="h-9 w-9 rounded-full object-cover border border-gray-100"
                  referrerPolicy="no-referrer"
                />
                <div className="flex-1">
                  <p className="text-sm font-semibold text-gray-800">{student.name}</p>
                  <p className="text-xs text-gray-400">{student.email}</p>
                </div>
                <button className="rounded-full p-2 text-gray-400 hover:bg-gray-100 hover:text-[#1e88e5]">
                  <Mail className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Invitation Modal */}
      {showInviteModal && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl border border-gray-200 w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="bg-[#1e88e5] text-white p-4 flex items-center justify-between">
              <h3 className="font-bold text-base flex items-center gap-2">
                <UserPlus className="h-5 w-5" />
                Mời học viên vào lớp
              </h3>
              <button
                onClick={() => setShowInviteModal(false)}
                className="text-white hover:text-gray-200 font-bold"
              >
                ✕
              </button>
            </div>

            <div className="p-5">
              <p className="text-xs text-gray-500 leading-relaxed mb-4">
                Chọn tài khoản học viên giả lập từ hệ thống để thêm trực tiếp vào lớp học này.
              </p>

              {nonJoinedStudents.length === 0 ? (
                <div className="text-center py-4 bg-gray-50 rounded border text-xs text-gray-500">
                  Tất cả các tài khoản học viên mô phỏng đều đã có mặt trong lớp này!
                </div>
              ) : (
                <div className="space-y-2 max-h-60 overflow-y-auto">
                  {nonJoinedStudents.map((student) => (
                    <div
                      key={student.id}
                      className="flex items-center justify-between border border-gray-100 rounded-md p-2.5 hover:bg-gray-50"
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <img
                          src={student.avatar}
                          alt={student.name}
                          className="h-8 w-8 rounded-full object-cover"
                          referrerPolicy="no-referrer"
                        />
                        <div className="min-w-0">
                          <p className="text-xs font-bold text-gray-800 truncate">{student.name}</p>
                          <p className="text-[10px] text-gray-400 truncate">{student.email}</p>
                        </div>
                      </div>
                      <button
                        onClick={() => {
                          onInviteStudent(student.id);
                          setShowInviteModal(false);
                        }}
                        className="rounded bg-blue-50 px-3 py-1.5 text-[10px] font-bold text-blue-700 border border-blue-100 hover:bg-blue-100 transition-colors"
                      >
                        Thêm
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="bg-gray-50 p-4 border-t border-gray-100 flex justify-end">
              <button
                onClick={() => setShowInviteModal(false)}
                className="rounded px-4 py-2 text-xs font-semibold text-gray-500 hover:bg-gray-100"
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
