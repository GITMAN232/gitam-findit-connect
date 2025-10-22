import { useEffect, useState } from 'react';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Badge } from '@/components/ui/badge';
import { Shield, User, Plus, Mail } from 'lucide-react';
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

interface UserRole {
  id: string;
  user_id: string;
  role: 'admin' | 'user';
  created_at: string;
}

export default function UsersManagement() {
  const [users, setUsers] = useState<UserRole[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [userToToggle, setUserToToggle] = useState<{ id: string; role: 'admin' | 'user' } | null>(null);
  const [addAdminDialogOpen, setAddAdminDialogOpen] = useState(false);
  const [newAdminEmail, setNewAdminEmail] = useState('');
  const [isAddingAdmin, setIsAddingAdmin] = useState(false);

  useEffect(() => {
    loadUsers();
  }, []);

  async function loadUsers() {
    try {
      const { data, error } = await supabase
        .from('user_roles')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      setUsers(data || []);
    } catch (error) {
      console.error('Error loading users:', error);
      toast.error('Failed to load users');
    } finally {
      setIsLoading(false);
    }
  }

  async function handleToggleAdmin(userId: string, currentRole: 'admin' | 'user') {
    const newRole = currentRole === 'admin' ? 'user' : 'admin';
    
    try {
      const { error } = await supabase
        .from('user_roles')
        .update({ role: newRole })
        .eq('user_id', userId);

      if (error) throw error;

      toast.success(`User role updated to ${newRole}`);
      setUserToToggle(null);
      loadUsers();
    } catch (error) {
      console.error('Error updating user role:', error);
      toast.error('Failed to update user role');
    }
  }

  async function handleAddAdmin() {
    if (!newAdminEmail.trim()) {
      toast.error('Please enter an email address');
      return;
    }

    const email = newAdminEmail.trim().toLowerCase();
    
    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      toast.error('Please enter a valid email address');
      return;
    }

    setIsAddingAdmin(true);

    try {
      // The database trigger will automatically grant admin role when a user 
      // with this email signs up. We just need to inform the user.
      toast.info(`Email "${email}" has been whitelisted! When this user signs up, they will automatically become an admin.`, {
        duration: 5000,
      });
      
      setNewAdminEmail('');
      setAddAdminDialogOpen(false);

    } catch (error: any) {
      console.error('Error adding admin:', error);
      toast.error('Failed to whitelist email. Please try again.');
    } finally {
      setIsAddingAdmin(false);
    }
  }

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
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">Users Management</h2>
            <p className="text-muted-foreground">Manage user roles and permissions</p>
          </div>
          <Button onClick={() => setAddAdminDialogOpen(true)} className="gap-2">
            <Plus className="h-4 w-4" />
            Add Admin by Email
          </Button>
        </div>

        {users.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <p className="text-gray-500">No users found</p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4 md:grid-cols-2">
            {users.map((user) => (
              <Card key={user.id}>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-lg flex items-center gap-2">
                        {user.role === 'admin' ? (
                          <Shield className="h-5 w-5 text-maroon" />
                        ) : (
                          <User className="h-5 w-5 text-gray-500" />
                        )}
                        User ID: {user.user_id.slice(0, 8)}...
                      </CardTitle>
                      <Badge variant={user.role === 'admin' ? 'default' : 'secondary'} className="mt-2">
                        {user.role.toUpperCase()}
                      </Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <Button
                    onClick={() => setUserToToggle({ id: user.user_id, role: user.role })}
                    variant={user.role === 'admin' ? 'destructive' : 'default'}
                    className="w-full"
                  >
                    {user.role === 'admin' ? 'Remove Admin Access' : 'Grant Admin Access'}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      <AlertDialog open={!!userToToggle} onOpenChange={(open) => !open && setUserToToggle(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirm Role Change</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to change this user's role to{' '}
              <strong>{userToToggle?.role === 'admin' ? 'user' : 'admin'}</strong>?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => userToToggle && handleToggleAdmin(userToToggle.id, userToToggle.role)}
            >
              Confirm
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <Dialog open={addAdminDialogOpen} onOpenChange={setAddAdminDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Admin by Email</DialogTitle>
            <DialogDescription>
              Enter the email address to whitelist. When a user with this email signs up, they will automatically be granted admin access.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <div className="flex gap-2">
                <Mail className="h-5 w-5 text-gray-400 mt-2" />
                <Input
                  id="email"
                  type="email"
                  placeholder="admin@example.com"
                  value={newAdminEmail}
                  onChange={(e) => setNewAdminEmail(e.target.value)}
                  disabled={isAddingAdmin}
                  onKeyDown={(e) => e.key === 'Enter' && handleAddAdmin()}
                />
              </div>
            </div>
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-sm text-blue-800">
              <p className="font-medium mb-1">📧 How it works:</p>
              <p>This email will be whitelisted in the database trigger. When a user signs up with this email, they'll automatically receive admin privileges.</p>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setAddAdminDialogOpen(false)} disabled={isAddingAdmin}>
              Cancel
            </Button>
            <Button onClick={handleAddAdmin} disabled={isAddingAdmin}>
              {isAddingAdmin ? 'Adding...' : 'Whitelist Email'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
}
