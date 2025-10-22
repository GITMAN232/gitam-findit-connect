import { useEffect, useState } from 'react';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, XCircle } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface PendingItem {
  id: string;
  object_name: string;
  description: string;
  location: string;
  campus: string;
  image_url: string | null;
  created_at: string;
  type: 'lost' | 'found';
  date: string;
}

export default function PendingSubmissions() {
  const { user } = useAuth();
  const [items, setItems] = useState<PendingItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [adminNotes, setAdminNotes] = useState<Record<string, string>>({});

  useEffect(() => {
    loadPendingItems();
  }, []);

  async function loadPendingItems() {
    try {
      const [{ data: lostData }, { data: foundData }] = await Promise.all([
        supabase
          .from('lost_objects')
          .select('*')
          .eq('status', 'pending')
          .order('created_at', { ascending: false }),
        supabase
          .from('found_objects')
          .select('*')
          .eq('status', 'pending')
          .order('created_at', { ascending: false }),
      ]);

      const lost = (lostData || []).map(item => ({
        ...item,
        type: 'lost' as const,
        date: item.lost_date,
      }));

      const found = (foundData || []).map(item => ({
        ...item,
        type: 'found' as const,
        date: item.found_date,
      }));

      setItems([...lost, ...found].sort((a, b) => 
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      ));
    } catch (error) {
      console.error('Error loading pending items:', error);
      toast.error('Failed to load pending items');
    } finally {
      setIsLoading(false);
    }
  }

  async function handleApprove(item: PendingItem) {
    if (!user) return;

    const table = item.type === 'lost' ? 'lost_objects' : 'found_objects';
    
    try {
      const { error } = await supabase
        .from(table)
        .update({
          status: 'approved',
          approved_by: user.id,
          approved_at: new Date().toISOString(),
          admin_note: adminNotes[item.id] || null,
        })
        .eq('id', item.id);

      if (error) throw error;

      // Log activity
      await supabase.from('activity_logs').insert({
        admin_id: user.id,
        action: 'approved_submission',
        entity_type: item.type,
        entity_id: item.id,
        details: { item_name: item.object_name },
      });

      toast.success('Item approved and now live!');
      loadPendingItems();
    } catch (error) {
      console.error('Error approving item:', error);
      toast.error('Failed to approve item');
    }
  }

  async function handleReject(item: PendingItem) {
    if (!user) return;

    const table = item.type === 'lost' ? 'lost_objects' : 'found_objects';
    
    try {
      const { error } = await supabase
        .from(table)
        .update({
          status: 'rejected',
          approved_by: user.id,
          approved_at: new Date().toISOString(),
          admin_note: adminNotes[item.id] || 'Item rejected',
        })
        .eq('id', item.id);

      if (error) throw error;

      // Log activity
      await supabase.from('activity_logs').insert({
        admin_id: user.id,
        action: 'rejected_submission',
        entity_type: item.type,
        entity_id: item.id,
        details: { item_name: item.object_name, reason: adminNotes[item.id] },
      });

      toast.success('Item rejected');
      loadPendingItems();
    } catch (error) {
      console.error('Error rejecting item:', error);
      toast.error('Failed to reject item');
    }
  }

  const lostItems = items.filter(item => item.type === 'lost');
  const foundItems = items.filter(item => item.type === 'found');

  const ItemCard = ({ item }: { item: PendingItem }) => (
    <Card key={item.id}>
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-lg">{item.object_name}</CardTitle>
            <div className="flex gap-2 mt-2">
              <Badge variant={item.type === 'lost' ? 'destructive' : 'default'}>
                {item.type.toUpperCase()}
              </Badge>
              <Badge variant="outline">{item.campus}</Badge>
            </div>
          </div>
          {item.image_url && (
            <img
              src={item.image_url}
              alt={item.object_name}
              className="h-20 w-20 object-cover rounded"
            />
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <p className="text-sm text-gray-600"><strong>Description:</strong> {item.description}</p>
          <p className="text-sm text-gray-600"><strong>Location:</strong> {item.location}</p>
          <p className="text-sm text-gray-600"><strong>Date:</strong> {new Date(item.date).toLocaleDateString()}</p>
          <p className="text-xs text-gray-500 mt-2">Submitted: {new Date(item.created_at).toLocaleString()}</p>
        </div>

        <div>
          <label className="text-sm font-medium">Admin Note (optional)</label>
          <Textarea
            value={adminNotes[item.id] || ''}
            onChange={(e) => setAdminNotes(prev => ({ ...prev, [item.id]: e.target.value }))}
            placeholder="Add a note about this decision..."
            className="mt-1"
          />
        </div>

        <div className="flex gap-2">
          <Button
            onClick={() => handleApprove(item)}
            className="flex-1"
            variant="default"
          >
            <CheckCircle className="h-4 w-4 mr-2" />
            Approve
          </Button>
          <Button
            onClick={() => handleReject(item)}
            className="flex-1"
            variant="destructive"
          >
            <XCircle className="h-4 w-4 mr-2" />
            Reject
          </Button>
        </div>
      </CardContent>
    </Card>
  );

  if (isLoading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-maroon"></div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Pending Submissions</h2>
          <p className="text-muted-foreground">Review and approve new item submissions</p>
        </div>

        {items.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <p className="text-gray-500">No pending submissions</p>
            </CardContent>
          </Card>
        ) : (
          <Tabs defaultValue="all" className="space-y-4">
            <TabsList>
              <TabsTrigger value="all">All ({items.length})</TabsTrigger>
              <TabsTrigger value="lost">Lost ({lostItems.length})</TabsTrigger>
              <TabsTrigger value="found">Found ({foundItems.length})</TabsTrigger>
            </TabsList>

            <TabsContent value="all" className="space-y-4">
              {items.map(item => <ItemCard key={item.id} item={item} />)}
            </TabsContent>

            <TabsContent value="lost" className="space-y-4">
              {lostItems.map(item => <ItemCard key={item.id} item={item} />)}
            </TabsContent>

            <TabsContent value="found" className="space-y-4">
              {foundItems.map(item => <ItemCard key={item.id} item={item} />)}
            </TabsContent>
          </Tabs>
        )}
      </div>
    </AdminLayout>
  );
}
