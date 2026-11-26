import React, { useState } from "react";
import { Shield, Users, Building2, Download, Plus, CheckCircle2 } from "lucide-react";
import { useLms } from "../../contexts/LmsContext";
import { RBAC_ROLES, hasPermission } from "../../constants/rbac";
import { LmsRoleId, LmsRouteId } from "../../types/lms";
import { tr } from "../../i18n/translations";

export const UsersAndOrgsModule: React.FC<{
  route: Extract<LmsRouteId, "users-rbac" | "organizations">;
}> = ({ route }) => {
  const {
    language,
    activeRole,
    setActiveRole,
    users,
    organizations,
    departments,
    updateUserRole,
    createOrganization,
    createDepartment,
    showToast,
  } = useLms();

  const [orgName, setOrgName] = useState("");
  const [orgCode, setOrgCode] = useState("");
  const [deptName, setDeptName] = useState("");
  const [deptOrgId, setDeptOrgId] = useState(organizations[0]?.id || "org-edusmart");

  const canCreate = hasPermission(activeRole, route, "create");
  const canEdit = hasPermission(activeRole, route, "edit");

  const handleExportUsersCsv = () => {
    const header = "UID,DisplayName,Role,XP,Level,Status\n";
    const rows = users.map((u) => `${u.uid},"${u.displayName}",${u.role},${u.xp},${u.level},${u.status}`).join("\n");
    const blob = new Blob([header + rows], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "edusmart_users_rbac.csv";
    a.click();
    URL.revokeObjectURL(url);
    showToast(
      tr(
        language,
        "Đã xuất danh sách người dùng & vai trò RBAC ra CSV!",
        "Exported users & RBAC roles to CSV!"
      )
    );
  };

  if (route === "users-rbac") {
    return (
      <div className="space-y-5 pb-8">
        <div className="glass-liquid-card-blue p-4 sm:p-5 rounded-[14px] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h1 className="text-lg sm:text-xl font-bold text-slate-900">
              {tr(language, "Quản lý Người dùng & Ma trận 12 Vai trò RBAC", "Users & 12-Role RBAC Matrix")}
            </h1>
            <p className="text-xs text-slate-600 mt-0.5">
              {tr(
                language,
                "Phân quyền chi tiết theo module & hành động (view, create, edit, delete, approve, export).",
                "Granular module & action permissions (view, create, edit, delete, approve, export)."
              )}
            </p>
          </div>
          <button
            onClick={handleExportUsersCsv}
            className="px-4 py-2 rounded-[14px] bg-[#0d6efd] text-white text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer shrink-0 self-start sm:self-auto"
          >
            <Download className="w-4 h-4" /> {tr(language, "Xuất CSV", "Export CSV")}
          </button>
        </div>

        {/* 12 Role Switcher / Inspector */}
        <div className="glass-liquid-card p-4 sm:p-5 rounded-[14px] space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Shield className="w-4 h-4 text-[#0d6efd]" />
              {tr(
                language,
                "12 Vai trò RBAC Chuẩn Enterprise (Click để xem thử quyền giao diện)",
                "12 Enterprise RBAC Roles (Click to preview permissions)"
              )}
            </h3>
            <span className="text-xs font-bold text-[#0d6efd]">
              {tr(language, "Đang xem với vai trò:", "Active role:")} {activeRole}
            </span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
            {RBAC_ROLES.map((r) => (
              <button
                key={r.id}
                onClick={() => {
                  setActiveRole(r.id);
                  showToast(
                    tr(
                      language,
                      `Đã chuyển góc nhìn RBAC sang: ${r.nameVi}`,
                      `Switched RBAC view to: ${r.nameEn}`
                    )
                  );
                }}
                className={`p-3 rounded-[14px] border text-left transition-all cursor-pointer ${
                  activeRole === r.id
                    ? "bg-blue-50/90 border-[#0d6efd] ring-2 ring-[#0d6efd]/30"
                    : "bg-white/80 border-slate-200 hover:border-blue-300"
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold text-slate-500">ROLE {r.code}</span>
                  {activeRole === r.id && <CheckCircle2 className="w-3.5 h-3.5 text-[#0d6efd]" />}
                </div>
                <p className="text-xs font-bold text-slate-900 mt-1">
                  {language === "en" ? r.nameEn : r.nameVi}
                </p>
                <p className="text-[10px] text-slate-600 mt-0.5 line-clamp-2">{r.scope}</p>
              </button>
            ))}
          </div>
        </div>

        {/* User List Table */}
        <div className="glass-liquid-card p-4 sm:p-5 rounded-[14px] space-y-3 overflow-x-auto">
          <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <Users className="w-4 h-4 text-[#10b981]" />{" "}
            {tr(language, `Danh sách Tài khoản Hệ thống (${users.length})`, `System Accounts (${users.length})`)}
          </h3>
          <table className="w-full text-left text-xs min-w-[600px]">
            <thead>
              <tr className="border-b border-slate-200 text-slate-500">
                <th className="py-2.5">{tr(language, "Họ tên", "Full Name")}</th>
                <th className="py-2.5">{tr(language, "Mã NV / HV", "User Code")}</th>
                <th className="py-2.5">{tr(language, "Vai trò RBAC", "RBAC Role")}</th>
                <th className="py-2.5">{tr(language, "XP / Cấp", "XP / Level")}</th>
                <th className="py-2.5">{tr(language, "Trạng thái", "Status")}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {users.map((u) => (
                <tr key={u.uid} className="hover:bg-white/50">
                  <td className="py-2.5 font-bold text-slate-900 flex items-center gap-2">
                    <img src={u.avatar} alt={u.displayName} className="w-7 h-7 rounded-[14px] object-cover" />
                    <div>
                      <p>{u.displayName}</p>
                      <p className="text-[10px] text-slate-500 font-normal">{u.email}</p>
                    </div>
                  </td>
                  <td className="py-2.5 text-slate-600">{u.employeeCode || u.uid}</td>
                  <td className="py-2.5">
                    <select
                      disabled={!canEdit}
                      value={u.role}
                      onChange={(e) => updateUserRole(u.uid, e.target.value as LmsRoleId)}
                      className="px-2.5 py-1 rounded-[14px] bg-white border border-slate-200 text-xs font-bold"
                    >
                      {RBAC_ROLES.map((r) => (
                        <option key={r.id} value={r.id}>
                          {language === "en" ? r.nameEn : r.nameVi}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td className="py-2.5 font-bold text-[#0d6efd]">{u.xp} XP • Lv.{u.level}</td>
                  <td className="py-2.5">
                    <span className="px-2 py-0.5 rounded-[14px] bg-emerald-100 text-emerald-800 text-[10px] font-bold uppercase">
                      {u.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-5 pb-8">
      <div className="glass-liquid-card-emerald p-4 sm:p-5 rounded-[14px] flex items-center justify-between gap-3">
        <div>
          <h1 className="text-lg sm:text-xl font-bold text-slate-900">
            {tr(language, "Đơn vị, Công ty & Phòng ban (Multi-Tenant Hierarchy)", "Organizations & Departments (Multi-Tenant)")}
          </h1>
          <p className="text-xs text-slate-600 mt-0.5">
            {tr(
              language,
              "Quản lý cơ cấu tổ chức, phân bổ ngân sách đào tạo và trưởng bộ phận.",
              "Manage org hierarchy, training budgets, and department leads."
            )}
          </p>
        </div>
        <Building2 className="w-6 h-6 text-emerald-600 shrink-0" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <div className="glass-liquid-card p-4 sm:p-5 rounded-[14px] space-y-4">
          <h3 className="text-sm font-bold text-slate-900">
            {tr(language, `Tổ chức / Chi nhánh (${organizations.length})`, `Organizations / Branches (${organizations.length})`)}
          </h3>
          {canCreate && (
            <form
              onSubmit={async (e) => {
                e.preventDefault();
                if (!orgName.trim()) return;
                await createOrganization({
                  code: orgCode.trim() || `ORG-${Date.now().toString().slice(-4)}`,
                  name: orgName.trim(),
                  orgType: "enterprise",
                  status: "active",
                });
                setOrgName("");
                setOrgCode("");
              }}
              className="flex flex-col sm:flex-row gap-2"
            >
              <input
                type="text"
                required
                value={orgName}
                onChange={(e) => setOrgName(e.target.value)}
                placeholder={tr(language, "Tên đơn vị mới...", "New organization name...")}
                className="flex-1 px-3 py-2 rounded-[14px] bg-white border border-slate-200 text-xs"
              />
              <input
                type="text"
                value={orgCode}
                onChange={(e) => setOrgCode(e.target.value)}
                placeholder={tr(language, "Mã đơn vị", "Org Code")}
                className="sm:w-28 px-3 py-2 rounded-[14px] bg-white border border-slate-200 text-xs"
              />
              <button type="submit" className="px-3.5 py-2 rounded-[14px] bg-[#0d6efd] text-white text-xs font-bold flex items-center justify-center cursor-pointer">
                <Plus className="w-4 h-4" />
              </button>
            </form>
          )}
          <div className="space-y-2.5">
            {organizations.map((org) => (
              <div key={org.id} className="p-3.5 rounded-[14px] bg-white/85 border border-slate-200 flex items-center justify-between gap-2">
                <div>
                  <p className="text-xs font-bold text-slate-900">{org.name}</p>
                  <p className="text-[11px] text-slate-500">
                    {tr(language, "Mã:", "Code:")} {org.code} • {tr(language, "Loại:", "Type:")} {org.orgType}
                  </p>
                </div>
                <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-[14px] bg-emerald-100 text-emerald-800 uppercase shrink-0">
                  {org.status}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="glass-liquid-card p-4 sm:p-5 rounded-[14px] space-y-4">
          <h3 className="text-sm font-bold text-slate-900">
            {tr(language, `Phòng ban trực thuộc (${departments.length})`, `Departments (${departments.length})`)}
          </h3>
          {canCreate && (
            <form
              onSubmit={async (e) => {
                e.preventDefault();
                if (!deptName.trim()) return;
                await createDepartment({
                  orgId: deptOrgId || organizations[0]?.id || "org-edusmart",
                  name: deptName.trim(),
                  managerName: tr(language, "Quản lý mới", "New Manager"),
                  budget: 120000000,
                });
                setDeptName("");
              }}
              className="flex flex-col sm:flex-row gap-2"
            >
              <input
                type="text"
                required
                value={deptName}
                onChange={(e) => setDeptName(e.target.value)}
                placeholder={tr(language, "Tên phòng ban mới...", "New department name...")}
                className="flex-1 px-3 py-2 rounded-[14px] bg-white border border-slate-200 text-xs"
              />
              <select
                value={deptOrgId}
                onChange={(e) => setDeptOrgId(e.target.value)}
                className="sm:w-36 px-2.5 py-2 rounded-[14px] bg-white border border-slate-200 text-xs"
              >
                {organizations.map((o) => (
                  <option key={o.id} value={o.id}>{o.code}</option>
                ))}
              </select>
              <button type="submit" className="px-3.5 py-2 rounded-[14px] bg-[#10b981] text-white text-xs font-bold flex items-center justify-center cursor-pointer">
                <Plus className="w-4 h-4" />
              </button>
            </form>
          )}
          <div className="space-y-2.5">
            {departments.map((d) => (
              <div key={d.id} className="p-3.5 rounded-[14px] bg-white/85 border border-slate-200 flex items-center justify-between gap-2">
                <div>
                  <p className="text-xs font-bold text-slate-900">{d.name}</p>
                  <p className="text-[11px] text-slate-500">
                    {tr(language, "Quản lý:", "Lead:")} {d.managerName || tr(language, "Chưa gán", "Unassigned")}
                  </p>
                </div>
                <span className="text-xs font-bold text-[#0d6efd] shrink-0">
                  {(d.budget || 0).toLocaleString("vi-VN")}đ
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
