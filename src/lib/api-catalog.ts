/* Auto-generated from voclio-backend/postman_collection.json — do not edit by hand */

export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

export interface ApiQueryParam {
  key: string;
  value: string;
  description?: string;
}

export interface ApiEndpoint {
  id: string;
  group: string;
  name: string;
  method: HttpMethod;
  path: string;
  auth: boolean;
  bodyExample?: unknown;
  query?: ApiQueryParam[];
}

export const API_ENDPOINTS: ApiEndpoint[] = [
  {
    "id": "GET:/admin/analytics/content:Get_Analytics_Content",
    "group": "Admin Control Panel",
    "name": "Get Analytics Content",
    "method": "GET",
    "path": "/admin/analytics/content",
    "auth": true,
    "query": []
  },
  {
    "id": "GET:/admin/analytics/system:Get_Analytics_System",
    "group": "Admin Control Panel",
    "name": "Get Analytics System",
    "method": "GET",
    "path": "/admin/analytics/system",
    "auth": true,
    "query": []
  },
  {
    "id": "GET:/admin/api-keys:Get_Api_Keys",
    "group": "Admin Control Panel",
    "name": "Get Api Keys",
    "method": "GET",
    "path": "/admin/api-keys",
    "auth": true,
    "query": []
  },
  {
    "id": "DELETE:/admin/api-keys/:id:Remove_Api_Keys_Id",
    "group": "Admin Control Panel",
    "name": "Remove Api Keys Id",
    "method": "DELETE",
    "path": "/admin/api-keys/:id",
    "auth": true,
    "query": []
  },
  {
    "id": "GET:/admin/api-usage:Get_Api_Usage",
    "group": "Admin Control Panel",
    "name": "Get Api Usage",
    "method": "GET",
    "path": "/admin/api-usage",
    "auth": true,
    "query": []
  },
  {
    "id": "GET:/admin/config:Get_Config",
    "group": "Admin Control Panel",
    "name": "Get Config",
    "method": "GET",
    "path": "/admin/config",
    "auth": true,
    "query": []
  },
  {
    "id": "PUT:/admin/config:Update_Config",
    "group": "Admin Control Panel",
    "name": "Update Config",
    "method": "PUT",
    "path": "/admin/config",
    "auth": true,
    "bodyExample": {},
    "query": []
  },
  {
    "id": "GET:/admin/dashboard/stats:Get_Dashboard_Stats",
    "group": "Admin Control Panel",
    "name": "Get Dashboard Stats",
    "method": "GET",
    "path": "/admin/dashboard/stats",
    "auth": true,
    "query": []
  },
  {
    "id": "GET:/admin/dashboard/traffic-sources:Get_Dashboard_Traffic_Sources",
    "group": "Admin Control Panel",
    "name": "Get Dashboard Traffic Sources",
    "method": "GET",
    "path": "/admin/dashboard/traffic-sources",
    "auth": true,
    "query": []
  },
  {
    "id": "GET:/admin/me:Get_Me",
    "group": "Admin Control Panel",
    "name": "Get Me",
    "method": "GET",
    "path": "/admin/me",
    "auth": true,
    "query": []
  },
  {
    "id": "GET:/admin/system/health:Get_System_Health",
    "group": "Admin Control Panel",
    "name": "Get System Health",
    "method": "GET",
    "path": "/admin/system/health",
    "auth": true,
    "query": []
  },
  {
    "id": "GET:/admin/users/:userId:Get_Users_UserId",
    "group": "Admin Control Panel",
    "name": "Get Users UserId",
    "method": "GET",
    "path": "/admin/users/:userId",
    "auth": true,
    "query": []
  },
  {
    "id": "DELETE:/admin/users/:userId:Remove_Users_UserId",
    "group": "Admin Control Panel",
    "name": "Remove Users UserId",
    "method": "DELETE",
    "path": "/admin/users/:userId",
    "auth": true,
    "query": []
  },
  {
    "id": "PUT:/admin/users/:userId/notes/:noteId:Update_Users_UserId_Notes_NoteId",
    "group": "Admin Control Panel",
    "name": "Update Users UserId Notes NoteId",
    "method": "PUT",
    "path": "/admin/users/:userId/notes/:noteId",
    "auth": true,
    "bodyExample": {},
    "query": []
  },
  {
    "id": "PUT:/admin/users/:userId/tasks/:taskId:Update_Users_UserId_Tasks_TaskId",
    "group": "Admin Control Panel",
    "name": "Update Users UserId Tasks TaskId",
    "method": "PUT",
    "path": "/admin/users/:userId/tasks/:taskId",
    "auth": true,
    "bodyExample": {},
    "query": []
  },
  {
    "id": "PUT:/auth/change-password:Update_Change_Password",
    "group": "Authentication",
    "name": "Update Change Password",
    "method": "PUT",
    "path": "/auth/change-password",
    "auth": false,
    "bodyExample": {},
    "query": []
  },
  {
    "id": "POST:/auth/facebook:Create/Submit_Facebook",
    "group": "Authentication",
    "name": "Create/Submit Facebook",
    "method": "POST",
    "path": "/auth/facebook",
    "auth": true,
    "bodyExample": {},
    "query": []
  },
  {
    "id": "POST:/auth/forgot-password:Create/Submit_Forgot_Password",
    "group": "Authentication",
    "name": "Create/Submit Forgot Password",
    "method": "POST",
    "path": "/auth/forgot-password",
    "auth": false,
    "bodyExample": {},
    "query": []
  },
  {
    "id": "POST:/auth/google:Create/Submit_Google",
    "group": "Authentication",
    "name": "Create/Submit Google",
    "method": "POST",
    "path": "/auth/google",
    "auth": true,
    "bodyExample": {},
    "query": []
  },
  {
    "id": "POST:/auth/login:Create/Submit_Login",
    "group": "Authentication",
    "name": "Create/Submit Login",
    "method": "POST",
    "path": "/auth/login",
    "auth": false,
    "bodyExample": {},
    "query": []
  },
  {
    "id": "POST:/auth/logout:Create/Submit_Logout",
    "group": "Authentication",
    "name": "Create/Submit Logout",
    "method": "POST",
    "path": "/auth/logout",
    "auth": true,
    "bodyExample": {},
    "query": []
  },
  {
    "id": "GET:/auth/profile:Get_Profile",
    "group": "Authentication",
    "name": "Get Profile",
    "method": "GET",
    "path": "/auth/profile",
    "auth": true,
    "query": []
  },
  {
    "id": "PUT:/auth/profile:Update_Profile",
    "group": "Authentication",
    "name": "Update Profile",
    "method": "PUT",
    "path": "/auth/profile",
    "auth": true,
    "bodyExample": {},
    "query": []
  },
  {
    "id": "POST:/auth/refresh-token:Create/Submit_Refresh_Token",
    "group": "Authentication",
    "name": "Create/Submit Refresh Token",
    "method": "POST",
    "path": "/auth/refresh-token",
    "auth": true,
    "bodyExample": {},
    "query": []
  },
  {
    "id": "POST:/auth/register:Create/Submit_Register",
    "group": "Authentication",
    "name": "Create/Submit Register",
    "method": "POST",
    "path": "/auth/register",
    "auth": false,
    "bodyExample": {},
    "query": []
  },
  {
    "id": "POST:/auth/resend-otp:Create/Submit_Resend_Otp",
    "group": "Authentication",
    "name": "Create/Submit Resend Otp",
    "method": "POST",
    "path": "/auth/resend-otp",
    "auth": false,
    "bodyExample": {},
    "query": []
  },
  {
    "id": "POST:/auth/reset-password:Create/Submit_Reset_Password",
    "group": "Authentication",
    "name": "Create/Submit Reset Password",
    "method": "POST",
    "path": "/auth/reset-password",
    "auth": false,
    "bodyExample": {},
    "query": []
  },
  {
    "id": "POST:/auth/send-otp:Create/Submit_Send_Otp",
    "group": "Authentication",
    "name": "Create/Submit Send Otp",
    "method": "POST",
    "path": "/auth/send-otp",
    "auth": false,
    "bodyExample": {},
    "query": []
  },
  {
    "id": "POST:/auth/verify-otp:Create/Submit_Verify_Otp",
    "group": "Authentication",
    "name": "Create/Submit Verify Otp",
    "method": "POST",
    "path": "/auth/verify-otp",
    "auth": false,
    "bodyExample": {},
    "query": []
  },
  {
    "id": "GET:/calendar/day/:date:Get_Day_Date",
    "group": "Calendar & Integrations",
    "name": "Get Day Date",
    "method": "GET",
    "path": "/calendar/day/:date",
    "auth": true,
    "query": []
  },
  {
    "id": "GET:/calendar/events:Get_Events",
    "group": "Calendar & Integrations",
    "name": "Get Events",
    "method": "GET",
    "path": "/calendar/events",
    "auth": true,
    "query": []
  },
  {
    "id": "GET:/calendar/google/callback:Get_Google_Callback",
    "group": "Calendar & Integrations",
    "name": "Get Google Callback",
    "method": "GET",
    "path": "/calendar/google/callback",
    "auth": true,
    "query": []
  },
  {
    "id": "POST:/calendar/google/callback/mobile:Create/Submit_Google_Callback_Mobile",
    "group": "Calendar & Integrations",
    "name": "Create/Submit Google Callback Mobile",
    "method": "POST",
    "path": "/calendar/google/callback/mobile",
    "auth": true,
    "bodyExample": {},
    "query": []
  },
  {
    "id": "GET:/calendar/google/connect:Get_Google_Connect",
    "group": "Calendar & Integrations",
    "name": "Get Google Connect",
    "method": "GET",
    "path": "/calendar/google/connect",
    "auth": true,
    "query": []
  },
  {
    "id": "GET:/calendar/google/connect/mobile:Get_Google_Connect_Mobile",
    "group": "Calendar & Integrations",
    "name": "Get Google Connect Mobile",
    "method": "GET",
    "path": "/calendar/google/connect/mobile",
    "auth": true,
    "query": []
  },
  {
    "id": "DELETE:/calendar/google/disconnect:Remove_Google_Disconnect",
    "group": "Calendar & Integrations",
    "name": "Remove Google Disconnect",
    "method": "DELETE",
    "path": "/calendar/google/disconnect",
    "auth": true,
    "query": []
  },
  {
    "id": "POST:/calendar/google/link-session:Create/Submit_Google_Link_Session",
    "group": "Calendar & Integrations",
    "name": "Create/Submit Google Link Session",
    "method": "POST",
    "path": "/calendar/google/link-session",
    "auth": true,
    "bodyExample": {},
    "query": []
  },
  {
    "id": "GET:/calendar/google/status:Get_Google_Status",
    "group": "Calendar & Integrations",
    "name": "Get Google Status",
    "method": "GET",
    "path": "/calendar/google/status",
    "auth": true,
    "query": []
  },
  {
    "id": "POST:/calendar/google/test-token:Create/Submit_Google_Test_Token",
    "group": "Calendar & Integrations",
    "name": "Create/Submit Google Test Token",
    "method": "POST",
    "path": "/calendar/google/test-token",
    "auth": true,
    "bodyExample": {},
    "query": []
  },
  {
    "id": "GET:/calendar/google/today:Get_Google_Today",
    "group": "Calendar & Integrations",
    "name": "Get Google Today",
    "method": "GET",
    "path": "/calendar/google/today",
    "auth": true,
    "query": []
  },
  {
    "id": "GET:/calendar/google/upcoming:Get_Google_Upcoming",
    "group": "Calendar & Integrations",
    "name": "Get Google Upcoming",
    "method": "GET",
    "path": "/calendar/google/upcoming",
    "auth": true,
    "query": []
  },
  {
    "id": "GET:/calendar/month/:year/:month:Get_Month_Year_Month",
    "group": "Calendar & Integrations",
    "name": "Get Month Year Month",
    "method": "GET",
    "path": "/calendar/month/:year/:month",
    "auth": true,
    "query": []
  },
  {
    "id": "GET:/category:Get_All_Categorys",
    "group": "Categories",
    "name": "Get All Categorys",
    "method": "GET",
    "path": "/category",
    "auth": true,
    "query": []
  },
  {
    "id": "POST:/category:Create_New_Category",
    "group": "Categories",
    "name": "Create New Category",
    "method": "POST",
    "path": "/category",
    "auth": true,
    "bodyExample": {},
    "query": []
  },
  {
    "id": "GET:/category/:id:Get_Category_by_ID",
    "group": "Categories",
    "name": "Get Category by ID",
    "method": "GET",
    "path": "/category/:id",
    "auth": true,
    "query": []
  },
  {
    "id": "PUT:/category/:id:Update_Category",
    "group": "Categories",
    "name": "Update Category",
    "method": "PUT",
    "path": "/category/:id",
    "auth": true,
    "bodyExample": {},
    "query": []
  },
  {
    "id": "DELETE:/category/:id:Delete_Category",
    "group": "Categories",
    "name": "Delete Category",
    "method": "DELETE",
    "path": "/category/:id",
    "auth": true,
    "query": []
  },
  {
    "id": "GET:/category/:id/stats:Get_Id_Stats",
    "group": "Categories",
    "name": "Get Id Stats",
    "method": "GET",
    "path": "/category/:id/stats",
    "auth": true,
    "query": []
  },
  {
    "id": "GET:/dashboard/quick-stats:Get_Quick_Stats",
    "group": "Dashboard",
    "name": "Get Quick Stats",
    "method": "GET",
    "path": "/dashboard/quick-stats",
    "auth": true,
    "query": []
  },
  {
    "id": "GET:/dashboard/stats:Get_Stats",
    "group": "Dashboard",
    "name": "Get Stats",
    "method": "GET",
    "path": "/dashboard/stats",
    "auth": true,
    "query": []
  },
  {
    "id": "GET:/queue/job/:jobId:Get_Job_JobId",
    "group": "Job Queue",
    "name": "Get Job JobId",
    "method": "GET",
    "path": "/queue/job/:jobId",
    "auth": true,
    "query": []
  },
  {
    "id": "GET:/queue/stats:Get_Stats",
    "group": "Job Queue",
    "name": "Get Stats",
    "method": "GET",
    "path": "/queue/stats",
    "auth": true,
    "query": []
  },
  {
    "id": "GET:/note:Get_All_Notes",
    "group": "Notes",
    "name": "Get All Notes",
    "method": "GET",
    "path": "/note",
    "auth": true,
    "query": []
  },
  {
    "id": "POST:/note:Create_New_Note",
    "group": "Notes",
    "name": "Create New Note",
    "method": "POST",
    "path": "/note",
    "auth": true,
    "bodyExample": {},
    "query": []
  },
  {
    "id": "GET:/note/:id:Get_Note_by_ID",
    "group": "Notes",
    "name": "Get Note by ID",
    "method": "GET",
    "path": "/note/:id",
    "auth": true,
    "query": []
  },
  {
    "id": "PUT:/note/:id:Update_Note",
    "group": "Notes",
    "name": "Update Note",
    "method": "PUT",
    "path": "/note/:id",
    "auth": true,
    "bodyExample": {},
    "query": []
  },
  {
    "id": "DELETE:/note/:id:Delete_Note",
    "group": "Notes",
    "name": "Delete Note",
    "method": "DELETE",
    "path": "/note/:id",
    "auth": true,
    "query": []
  },
  {
    "id": "POST:/note/:id/extract-tasks:Create/Submit_Id_Extract_Tasks",
    "group": "Notes",
    "name": "Create/Submit Id Extract Tasks",
    "method": "POST",
    "path": "/note/:id/extract-tasks",
    "auth": true,
    "bodyExample": {},
    "query": []
  },
  {
    "id": "POST:/note/:id/summarize:Create/Submit_Id_Summarize",
    "group": "Notes",
    "name": "Create/Submit Id Summarize",
    "method": "POST",
    "path": "/note/:id/summarize",
    "auth": true,
    "bodyExample": {},
    "query": []
  },
  {
    "id": "GET:/note/:id/tags:Get_Id_Tags",
    "group": "Notes",
    "name": "Get Id Tags",
    "method": "GET",
    "path": "/note/:id/tags",
    "auth": true,
    "query": []
  },
  {
    "id": "POST:/note/:id/tags:Create/Submit_Id_Tags",
    "group": "Notes",
    "name": "Create/Submit Id Tags",
    "method": "POST",
    "path": "/note/:id/tags",
    "auth": true,
    "bodyExample": {},
    "query": []
  },
  {
    "id": "DELETE:/note/:id/tags/:tagId:Remove_Id_Tags_TagId",
    "group": "Notes",
    "name": "Remove Id Tags TagId",
    "method": "DELETE",
    "path": "/note/:id/tags/:tagId",
    "auth": true,
    "query": []
  },
  {
    "id": "GET:/notification:Get_All_Notifications",
    "group": "Notifications",
    "name": "Get All Notifications",
    "method": "GET",
    "path": "/notification",
    "auth": true,
    "query": []
  },
  {
    "id": "DELETE:/notification:Delete_All_Notifications",
    "group": "Notifications",
    "name": "Delete All Notifications",
    "method": "DELETE",
    "path": "/notification",
    "auth": true,
    "query": []
  },
  {
    "id": "GET:/notification/:id:Get_Notification_by_ID",
    "group": "Notifications",
    "name": "Get Notification by ID",
    "method": "GET",
    "path": "/notification/:id",
    "auth": true,
    "query": []
  },
  {
    "id": "DELETE:/notification/:id:Delete_Notification",
    "group": "Notifications",
    "name": "Delete Notification",
    "method": "DELETE",
    "path": "/notification/:id",
    "auth": true,
    "query": []
  },
  {
    "id": "PUT:/notification/:id/read:Update_Id_Read",
    "group": "Notifications",
    "name": "Update Id Read",
    "method": "PUT",
    "path": "/notification/:id/read",
    "auth": true,
    "bodyExample": {},
    "query": []
  },
  {
    "id": "PUT:/notification/mark-all-read:Update_Mark_All_Read",
    "group": "Notifications",
    "name": "Update Mark All Read",
    "method": "PUT",
    "path": "/notification/mark-all-read",
    "auth": true,
    "bodyExample": {},
    "query": []
  },
  {
    "id": "GET:/notification/unread-count:Get_Unread_Count",
    "group": "Notifications",
    "name": "Get Unread Count",
    "method": "GET",
    "path": "/notification/unread-count",
    "auth": true,
    "query": []
  },
  {
    "id": "GET:/productivity/achievements:Get_Achievements",
    "group": "Productivity & Stats",
    "name": "Get Achievements",
    "method": "GET",
    "path": "/productivity/achievements",
    "auth": true,
    "query": []
  },
  {
    "id": "GET:/productivity/focus-sessions:Get_Focus_Sessions",
    "group": "Productivity & Stats",
    "name": "Get Focus Sessions",
    "method": "GET",
    "path": "/productivity/focus-sessions",
    "auth": true,
    "query": []
  },
  {
    "id": "DELETE:/productivity/focus-sessions/:id:Remove_Focus_Sessions_Id",
    "group": "Productivity & Stats",
    "name": "Remove Focus Sessions Id",
    "method": "DELETE",
    "path": "/productivity/focus-sessions/:id",
    "auth": true,
    "query": []
  },
  {
    "id": "GET:/productivity/streak:Get_Streak",
    "group": "Productivity & Stats",
    "name": "Get Streak",
    "method": "GET",
    "path": "/productivity/streak",
    "auth": true,
    "query": []
  },
  {
    "id": "GET:/productivity/summary:Get_Summary",
    "group": "Productivity & Stats",
    "name": "Get Summary",
    "method": "GET",
    "path": "/productivity/summary",
    "auth": true,
    "query": []
  },
  {
    "id": "GET:/reminder:Get_All_Reminders",
    "group": "Reminders",
    "name": "Get All Reminders",
    "method": "GET",
    "path": "/reminder",
    "auth": true,
    "query": []
  },
  {
    "id": "POST:/reminder:Create_New_Reminder",
    "group": "Reminders",
    "name": "Create New Reminder",
    "method": "POST",
    "path": "/reminder",
    "auth": true,
    "bodyExample": {},
    "query": []
  },
  {
    "id": "GET:/reminder/:id:Get_Reminder_by_ID",
    "group": "Reminders",
    "name": "Get Reminder by ID",
    "method": "GET",
    "path": "/reminder/:id",
    "auth": true,
    "query": []
  },
  {
    "id": "PUT:/reminder/:id:Update_Reminder",
    "group": "Reminders",
    "name": "Update Reminder",
    "method": "PUT",
    "path": "/reminder/:id",
    "auth": true,
    "bodyExample": {},
    "query": []
  },
  {
    "id": "DELETE:/reminder/:id:Delete_Reminder",
    "group": "Reminders",
    "name": "Delete Reminder",
    "method": "DELETE",
    "path": "/reminder/:id",
    "auth": true,
    "query": []
  },
  {
    "id": "PUT:/reminder/:id/dismiss:Update_Id_Dismiss",
    "group": "Reminders",
    "name": "Update Id Dismiss",
    "method": "PUT",
    "path": "/reminder/:id/dismiss",
    "auth": true,
    "bodyExample": {},
    "query": []
  },
  {
    "id": "PUT:/reminder/:id/snooze:Update_Id_Snooze",
    "group": "Reminders",
    "name": "Update Id Snooze",
    "method": "PUT",
    "path": "/reminder/:id/snooze",
    "auth": true,
    "bodyExample": {},
    "query": []
  },
  {
    "id": "GET:/reminder/upcoming:Get_Upcoming",
    "group": "Reminders",
    "name": "Get Upcoming",
    "method": "GET",
    "path": "/reminder/upcoming",
    "auth": true,
    "query": []
  },
  {
    "id": "GET:/:API_Root_Info",
    "group": "System Operations",
    "name": "API Root Info",
    "method": "GET",
    "path": "/",
    "auth": false,
    "query": []
  },
  {
    "id": "GET:/health:System_Health_Check",
    "group": "System Operations",
    "name": "System Health Check",
    "method": "GET",
    "path": "/health",
    "auth": false,
    "query": []
  },
  {
    "id": "GET:/tag:Get_All_Tags",
    "group": "Tags",
    "name": "Get All Tags",
    "method": "GET",
    "path": "/tag",
    "auth": true,
    "query": []
  },
  {
    "id": "POST:/tag:Create_New_Tag",
    "group": "Tags",
    "name": "Create New Tag",
    "method": "POST",
    "path": "/tag",
    "auth": true,
    "bodyExample": {},
    "query": []
  },
  {
    "id": "GET:/tag/:id:Get_Tag_by_ID",
    "group": "Tags",
    "name": "Get Tag by ID",
    "method": "GET",
    "path": "/tag/:id",
    "auth": true,
    "query": []
  },
  {
    "id": "PUT:/tag/:id:Update_Tag",
    "group": "Tags",
    "name": "Update Tag",
    "method": "PUT",
    "path": "/tag/:id",
    "auth": true,
    "bodyExample": {},
    "query": []
  },
  {
    "id": "DELETE:/tag/:id:Delete_Tag",
    "group": "Tags",
    "name": "Delete Tag",
    "method": "DELETE",
    "path": "/tag/:id",
    "auth": true,
    "query": []
  },
  {
    "id": "GET:/task:Get_All_Tasks",
    "group": "Tasks",
    "name": "Get All Tasks",
    "method": "GET",
    "path": "/task",
    "auth": true,
    "query": []
  },
  {
    "id": "POST:/task:Create_New_Task",
    "group": "Tasks",
    "name": "Create New Task",
    "method": "POST",
    "path": "/task",
    "auth": true,
    "bodyExample": {},
    "query": []
  },
  {
    "id": "GET:/task/:id:Get_Task_by_ID",
    "group": "Tasks",
    "name": "Get Task by ID",
    "method": "GET",
    "path": "/task/:id",
    "auth": true,
    "query": []
  },
  {
    "id": "PUT:/task/:id:Update_Task",
    "group": "Tasks",
    "name": "Update Task",
    "method": "PUT",
    "path": "/task/:id",
    "auth": true,
    "bodyExample": {},
    "query": []
  },
  {
    "id": "DELETE:/task/:id:Delete_Task",
    "group": "Tasks",
    "name": "Delete Task",
    "method": "DELETE",
    "path": "/task/:id",
    "auth": true,
    "query": []
  },
  {
    "id": "PUT:/task/:id/complete:Update_Id_Complete",
    "group": "Tasks",
    "name": "Update Id Complete",
    "method": "PUT",
    "path": "/task/:id/complete",
    "auth": true,
    "bodyExample": {},
    "query": []
  },
  {
    "id": "GET:/task/:id/subtasks:Get_Id_Subtasks",
    "group": "Tasks",
    "name": "Get Id Subtasks",
    "method": "GET",
    "path": "/task/:id/subtasks",
    "auth": true,
    "query": []
  },
  {
    "id": "POST:/task/:id/subtasks:Create/Submit_Id_Subtasks",
    "group": "Tasks",
    "name": "Create/Submit Id Subtasks",
    "method": "POST",
    "path": "/task/:id/subtasks",
    "auth": true,
    "bodyExample": {},
    "query": []
  },
  {
    "id": "GET:/task/:id/with-subtasks:Get_Id_With_Subtasks",
    "group": "Tasks",
    "name": "Get Id With Subtasks",
    "method": "GET",
    "path": "/task/:id/with-subtasks",
    "auth": true,
    "query": []
  },
  {
    "id": "POST:/task/bulk:Create/Submit_Bulk",
    "group": "Tasks",
    "name": "Create/Submit Bulk",
    "method": "POST",
    "path": "/task/bulk",
    "auth": true,
    "bodyExample": {},
    "query": []
  },
  {
    "id": "GET:/task/by-category:Get_By_Category",
    "group": "Tasks",
    "name": "Get By Category",
    "method": "GET",
    "path": "/task/by-category",
    "auth": true,
    "query": []
  },
  {
    "id": "GET:/task/by-date:Get_By_Date",
    "group": "Tasks",
    "name": "Get By Date",
    "method": "GET",
    "path": "/task/by-date",
    "auth": true,
    "query": []
  },
  {
    "id": "GET:/task/main:Get_Main",
    "group": "Tasks",
    "name": "Get Main",
    "method": "GET",
    "path": "/task/main",
    "auth": true,
    "query": []
  },
  {
    "id": "GET:/task/stats:Get_Stats",
    "group": "Tasks",
    "name": "Get Stats",
    "method": "GET",
    "path": "/task/stats",
    "auth": true,
    "query": []
  },
  {
    "id": "GET:/settings:Get_All_Settingss",
    "group": "User Settings",
    "name": "Get All Settingss",
    "method": "GET",
    "path": "/settings",
    "auth": true,
    "query": []
  },
  {
    "id": "PUT:/settings:PUT_settings",
    "group": "User Settings",
    "name": "PUT settings",
    "method": "PUT",
    "path": "/settings",
    "auth": true,
    "bodyExample": {},
    "query": []
  },
  {
    "id": "PUT:/settings/language:Update_Language",
    "group": "User Settings",
    "name": "Update Language",
    "method": "PUT",
    "path": "/settings/language",
    "auth": true,
    "bodyExample": {},
    "query": []
  },
  {
    "id": "GET:/settings/notifications:Get_Notifications",
    "group": "User Settings",
    "name": "Get Notifications",
    "method": "GET",
    "path": "/settings/notifications",
    "auth": true,
    "query": []
  },
  {
    "id": "PUT:/settings/theme:Update_Theme",
    "group": "User Settings",
    "name": "Update Theme",
    "method": "PUT",
    "path": "/settings/theme",
    "auth": true,
    "bodyExample": {},
    "query": []
  },
  {
    "id": "PUT:/settings/timezone:Update_Timezone",
    "group": "User Settings",
    "name": "Update Timezone",
    "method": "PUT",
    "path": "/settings/timezone",
    "auth": true,
    "bodyExample": {},
    "query": []
  },
  {
    "id": "GET:/voice:Get_All_Voices",
    "group": "Voice & Audio",
    "name": "Get All Voices",
    "method": "GET",
    "path": "/voice",
    "auth": true,
    "query": []
  },
  {
    "id": "GET:/voice/:id:Get_Voice_by_ID",
    "group": "Voice & Audio",
    "name": "Get Voice by ID",
    "method": "GET",
    "path": "/voice/:id",
    "auth": true,
    "query": []
  },
  {
    "id": "DELETE:/voice/:id:Delete_Voice",
    "group": "Voice & Audio",
    "name": "Delete Voice",
    "method": "DELETE",
    "path": "/voice/:id",
    "auth": true,
    "query": []
  },
  {
    "id": "GET:/voice/job-status/:jobId:Get_Job_Status_JobId",
    "group": "Voice & Audio",
    "name": "Get Job Status JobId",
    "method": "GET",
    "path": "/voice/job-status/:jobId",
    "auth": true,
    "query": []
  },
  {
    "id": "POST:/voice/transcribe:Create/Submit_Transcribe",
    "group": "Voice & Audio",
    "name": "Create/Submit Transcribe",
    "method": "POST",
    "path": "/voice/transcribe",
    "auth": true,
    "bodyExample": {},
    "query": []
  }
] as ApiEndpoint[];

export const API_GROUPS = [...new Set(API_ENDPOINTS.map((e) => e.group))].sort();
