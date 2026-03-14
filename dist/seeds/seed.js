import { connectDb } from "../config/db.js";
import { Permission } from "../models/Permission.js";
import { Role } from "../models/Role.js";
import { User } from "../models/User.js";
import { Lead } from "../models/Lead.js";
import { Task } from "../models/Task.js";
import { AuditLog } from "../models/AuditLog.js";
import { hashPassword } from "../utils/password.js";
import { PermissionKeys } from "../utils/permissionKeys.js";
const permissionSeed = [
    { key: PermissionKeys.dashboardView, label: "View Dashboard", module: "Dashboard" },
    { key: PermissionKeys.usersView, label: "View Users", module: "Users" },
    { key: PermissionKeys.usersCreate, label: "Create Users", module: "Users" },
    { key: PermissionKeys.usersUpdate, label: "Update Users", module: "Users" },
    { key: PermissionKeys.usersDelete, label: "Delete Users", module: "Users" },
    { key: PermissionKeys.permissionsView, label: "View Permissions", module: "Permissions" },
    { key: PermissionKeys.leadsView, label: "View Leads", module: "Leads" },
    { key: PermissionKeys.leadsCreate, label: "Create Leads", module: "Leads" },
    { key: PermissionKeys.leadsUpdate, label: "Update Leads", module: "Leads" },
    { key: PermissionKeys.leadsDelete, label: "Delete Leads", module: "Leads" },
    { key: PermissionKeys.tasksView, label: "View Tasks", module: "Tasks" },
    { key: PermissionKeys.tasksCreate, label: "Create Tasks", module: "Tasks" },
    { key: PermissionKeys.tasksUpdate, label: "Update Tasks", module: "Tasks" },
    { key: PermissionKeys.tasksDelete, label: "Delete Tasks", module: "Tasks" },
    { key: PermissionKeys.reportsView, label: "View Reports", module: "Reports" },
    { key: PermissionKeys.auditView, label: "View Audit Logs", module: "Audit Logs" },
    { key: PermissionKeys.settingsView, label: "View Settings", module: "Settings" },
    { key: PermissionKeys.customerPortalView, label: "View Customer Portal", module: "Customer Portal" },
];
const adminPerms = permissionSeed.map((p) => p.key);
const managerPerms = [
    PermissionKeys.dashboardView,
    PermissionKeys.usersView,
    PermissionKeys.usersCreate,
    PermissionKeys.usersUpdate,
    PermissionKeys.permissionsView,
    PermissionKeys.leadsView,
    PermissionKeys.leadsCreate,
    PermissionKeys.leadsUpdate,
    PermissionKeys.tasksView,
    PermissionKeys.tasksCreate,
    PermissionKeys.tasksUpdate,
    PermissionKeys.reportsView,
    PermissionKeys.settingsView,
];
const agentPerms = [
    PermissionKeys.dashboardView,
    PermissionKeys.leadsView,
    PermissionKeys.leadsCreate,
    PermissionKeys.leadsUpdate,
    PermissionKeys.tasksView,
    PermissionKeys.tasksCreate,
    PermissionKeys.tasksUpdate,
];
const customerPerms = [PermissionKeys.customerPortalView];
async function seed() {
    await connectDb();
    await Promise.all([
        Permission.deleteMany({}),
        Role.deleteMany({}),
        User.deleteMany({}),
        Lead.deleteMany({}),
        Task.deleteMany({}),
        AuditLog.deleteMany({}),
    ]);
    await Permission.insertMany(permissionSeed);
    const [adminRole, managerRole, agentRole, customerRole] = await Role.insertMany([
        { name: "Admin", permissions: adminPerms },
        { name: "Manager", permissions: managerPerms },
        { name: "Agent", permissions: agentPerms },
        { name: "Customer", permissions: customerPerms },
    ]);
    const passwordHash = await hashPassword("Admin123!");
    const managerHash = await hashPassword("Manager123!");
    const agentHash = await hashPassword("Agent123!");
    const customerHash = await hashPassword("Customer123!");
    const admin = await User.create({
        name: "Aisha Rahman",
        email: "admin@rbac.local",
        passwordHash,
        roleIds: [adminRole._id],
        permissions: [],
    });
    const manager = await User.create({
        name: "Rafiq Hasan",
        email: "manager@rbac.local",
        passwordHash: managerHash,
        roleIds: [managerRole._id],
        permissions: [],
        managerId: admin._id,
    });
    const agent = await User.create({
        name: "Nila Farhan",
        email: "agent@rbac.local",
        passwordHash: agentHash,
        roleIds: [agentRole._id],
        permissions: [],
        managerId: manager._id,
    });
    const customer = await User.create({
        name: "Jamal Roy",
        email: "customer@rbac.local",
        passwordHash: customerHash,
        roleIds: [customerRole._id],
        permissions: [],
        managerId: agent._id,
    });
    await Lead.insertMany([
        { title: "Starter Plan Inquiry", status: "new", ownerId: manager._id, customerId: customer._id, value: 1200 },
        { title: "Enterprise Migration", status: "qualified", ownerId: agent._id, value: 20000 },
    ]);
    await Task.insertMany([
        { title: "Follow up with Jamal", status: "open", assigneeId: agent._id, priority: "high" },
        { title: "Prepare Q2 forecast", status: "in_progress", assigneeId: manager._id, priority: "medium" },
    ]);
    await AuditLog.insertMany([
        { actorId: admin._id, action: "seed.init", targetType: "system" },
        { actorId: manager._id, action: "lead.import", targetType: "lead" },
    ]);
    console.log("Seed completed");
    process.exit(0);
}
seed().catch((error) => {
    console.error(error);
    process.exit(1);
});
