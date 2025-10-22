import { useEffect, useState } from 'react';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import { Badge } from '@/components/ui/badge';
import { Archive } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

interface LiveItem {
  id: string;
  object_name: string;
  description: string;
  location: string;
  campus: string;
  image_url: string | null;
  created_at: string;
  approved_at: string | null;
  type: 'lost' | 'found';
  date: string;
}

export default function LiveItems() {
  const { user } = useAuth();
  const [items, setItems] = useState<LiveItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [itemToArchive, setItemToArchive] = useState<LiveItem | null>(null);

  useEffect(() => {
    loadLiveItems();
  }, []);

  async function loadLiveItems() {
    try {
      const [{ data: lostData }, { data: foundData }] = await Promise.all([
        supabase
          .from('lost_objects')
          .select('*')
          .eq('status', 'approved')
          .order('approved_at', { ascending: false }),
        supabase
          .from('found_objects')
          .select('*')
          .eq('status', 'approved')
          .order('approved_at', { ascending: false }),
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
        new Date(b.approved_at || b.created_at).getTime() - 
        new Date(a.approved_at || a.created_at).getTime()
      ));
    } catch (error) {
      console.error('Error loading live items:', error);
      toast.error('Failed to load live items');
    } finally {
      setIsLoading(false);
    }
  }

  async function handleArchive(item: LiveItem) {
    if (!user) return;

    const table = item.type === 'lost' ? 'lost_objects' : 'found_objects';
    
    try {
      const { error } = await supabase
        .from(table)
        .update({ status: 'resolved' })
        .eq('id', item.id);

      if (error) throw error;

      await supabase.from('activity_logs').insert({
        admin_id: user.id,
        action: 'archived_item',
        entity_type: item.type,
        entity_id: item.id,
        details: { item_name: item.object_name },
      });

      toast.success('Item archived successfully');
      setItemToArchive(null);
      loadLiveItems();
    } catch (error) {
      console.error('Error archiving item:', error);
      toast.error('Failed to archive item');
    }
  }

  const lostItems = items.filter(item => item.type === 'lost');
  const foundItems = items.filter(item => item.type === 'found');

  const ItemCard = ({ item }: { item: LiveItem }) => (
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
          {item.approved_at && (
            <p className="text-xs text-gray-500 mt-2">
              Approved: {new Date(item.approved_at).toLocaleString()}
            </p>
          )}
        </div>

        <Button
          onClick={() => setItemToArchive(item)}
          variant="outline"
          className="w-full"
        >
          <Archive className="h-4 w-4 mr-2" />
          Mark as Resolved
        </Button>
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
          <h2 className="text-3xl font-bold tracking-tight">Live Items</h2>
          <p className="text-muted-foreground">Currently active listings</p>
        </div>

        {items.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <p className="text-gray-500">No live items</p>
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

      <AlertDialog open={!!itemToArchive} onOpenChange={(open) => !open && setItemToArchive(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Archive Item</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to mark "{itemToArchive?.object_name}" as resolved? 
              This will remove it from the live listings.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={() => itemToArchive && handleArchive(itemToArchive)}>
              Archive
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </AdminLayout>
  );
}
