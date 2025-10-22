import { useEffect, useState } from 'react';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { ClipboardList, CheckCircle, FileText, AlertCircle, Activity } from 'lucide-react';

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    pending: 0,
    live: 0,
    pendingClaims: 0,
    resolvedToday: 0,
  });

  async function loadStats() {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const [
      { count: pendingLost },
      { count: pendingFound },
      { count: approvedLost },
      { count: approvedFound },
      { count: pendingClaims },
      { count: resolvedLost },
      { count: resolvedFound },
    ] = await Promise.all([
      supabase.from('lost_objects').select('*', { count: 'exact', head: true }).eq('status', 'pending'),
      supabase.from('found_objects').select('*', { count: 'exact', head: true }).eq('status', 'pending'),
      supabase.from('lost_objects').select('*', { count: 'exact', head: true }).eq('status', 'approved'),
      supabase.from('found_objects').select('*', { count: 'exact', head: true }).eq('status', 'approved'),
      supabase.from('claims').select('*', { count: 'exact', head: true }).eq('status', 'pending'),
      supabase.from('lost_objects').select('*', { count: 'exact', head: true }).eq('status', 'resolved').gte('updated_at', today.toISOString()),
      supabase.from('found_objects').select('*', { count: 'exact', head: true }).eq('status', 'resolved').gte('updated_at', today.toISOString()),
    ]);

    setStats({
      pending: (pendingLost || 0) + (pendingFound || 0),
      live: (approvedLost || 0) + (approvedFound || 0),
      pendingClaims: pendingClaims || 0,
      resolvedToday: (resolvedLost || 0) + (resolvedFound || 0),
    });
  }

  useEffect(() => {
    loadStats();

    // Set up real-time subscriptions for live updates
    const channel = supabase
      .channel('admin-dashboard-updates')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'lost_objects'
        },
        () => loadStats()
      )
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'found_objects'
        },
        () => loadStats()
      )
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'claims'
        },
        () => loadStats()
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const cards = [
    {
      title: 'Pending Submissions',
      value: stats.pending,
      description: 'Items awaiting approval',
      icon: ClipboardList,
      color: 'text-yellow-600',
    },
    {
      title: 'Live Items',
      value: stats.live,
      description: 'Currently listed items',
      icon: CheckCircle,
      color: 'text-green-600',
    },
    {
      title: 'Pending Claims',
      value: stats.pendingClaims,
      description: 'Claims to review',
      icon: FileText,
      color: 'text-blue-600',
    },
    {
      title: 'Resolved Today',
      value: stats.resolvedToday,
      description: 'Successfully returned',
      icon: AlertCircle,
      color: 'text-purple-600',
    },
  ];

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
            <p className="text-muted-foreground">Overview of your Lost & Found platform</p>
          </div>
          <Badge variant="outline" className="gap-2">
            <Activity className="h-3 w-3 animate-pulse text-green-500" />
            Live Sync Active
          </Badge>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {cards.map((card) => (
            <Card key={card.title}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{card.title}</CardTitle>
                <card.icon className={`h-4 w-4 ${card.color}`} />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{card.value}</div>
                <p className="text-xs text-muted-foreground">{card.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </AdminLayout>
  );
}
