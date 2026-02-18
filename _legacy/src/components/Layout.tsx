import { ReactNode } from "react";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { Badge } from "@/components/ui/badge";
import { Clock } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

interface LayoutProps {
  children: ReactNode;
  currentUsageHours?: number;
  maxUsageHours?: number;
  userProfile?: any;
}

export default function Layout({ 
  children, 
  currentUsageHours = 0, 
  maxUsageHours = 100, 
  userProfile 
}: LayoutProps) {
  const { user } = useAuth();

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <AppSidebar />
        
        <div className="flex-1 flex flex-col">
          <header className="h-16 flex items-center justify-between border-b bg-background px-6">
            <div className="flex items-center gap-4">
              <SidebarTrigger />
              <h1 className="text-xl font-semibold">Executive Comms Ninja</h1>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Clock className="h-4 w-4" />
                Remaining Time: {Math.floor((maxUsageHours - currentUsageHours)).toString().padStart(2, '0')}:{Math.floor(((maxUsageHours - currentUsageHours) % 1) * 60).toString().padStart(2, '0')}
              </div>
              <Badge variant="secondary" className="px-3 py-1">
                {userProfile?.name || user?.email}
              </Badge>
            </div>
          </header>
          
          <main className="flex-1">
            {children}
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}