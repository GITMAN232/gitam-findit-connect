import { ClipboardList, CheckCircle, FileText, Users, Activity, LayoutDashboard, Search } from 'lucide-react';
import { NavLink, useLocation } from 'react-router-dom';
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  useSidebar,
} from '@/components/ui/sidebar';

const items = [
  { title: 'Dashboard', url: '/admin', icon: LayoutDashboard },
  { title: 'Pending Submissions', url: '/admin/pending', icon: ClipboardList },
  { title: 'Live Items', url: '/admin/live', icon: CheckCircle },
  { title: 'Claims', url: '/admin/claims', icon: FileText },
  { title: 'Activity Logs', url: '/admin/activity', icon: Activity },
  { title: 'Users', url: '/admin/users', icon: Users },
];

export function AdminSidebar() {
  const { state } = useSidebar();
  const location = useLocation();
  const currentPath = location.pathname;
  const collapsed = state === 'collapsed';

  const isActive = (path: string) => {
    if (path === '/admin') {
      return currentPath === path;
    }
    return currentPath.startsWith(path);
  };

  return (
    <Sidebar className={collapsed ? 'w-14' : 'w-60'} collapsible="icon">
      <SidebarHeader className="border-b p-4">
        {!collapsed && (
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 bg-maroon rounded-lg flex items-center justify-center flex-shrink-0">
              <Search className="h-5 w-5 text-white" />
            </div>
            <div className="min-w-0">
              <h2 className="text-lg font-bold text-maroon truncate">G Lost & Found</h2>
              <p className="text-xs text-muted-foreground">Admin Portal</p>
            </div>
          </div>
        )}
        {collapsed && (
          <div className="h-10 w-10 bg-maroon rounded-lg flex items-center justify-center mx-auto">
            <Search className="h-5 w-5 text-white" />
          </div>
        )}
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => {
                const active = isActive(item.url);
                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild isActive={active}>
                      <NavLink to={item.url} end={item.url === '/admin'}>
                        <item.icon className="h-4 w-4" />
                        {!collapsed && <span>{item.title}</span>}
                      </NavLink>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
