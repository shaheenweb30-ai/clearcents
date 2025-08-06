import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";

export const CategoryTest = () => {
  const [testing, setTesting] = useState(false);
  const { toast } = useToast();

  const testCategoriesTable = async () => {
    setTesting(true);
    try {
      // Test if table exists
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .limit(1);

      if (error) {
        if (error.code === '42P01') {
          toast({
            title: "Table Not Found",
            description: "The categories table does not exist. Please run the migration first.",
            variant: "destructive",
          });
        } else {
          toast({
            title: "Database Error",
            description: error.message,
            variant: "destructive",
          });
        }
        return;
      }

      toast({
        title: "Table Exists",
        description: "Categories table is accessible!",
      });

      // Try to add a test category
      const { data: insertData, error: insertError } = await supabase
        .from('categories')
        .insert({
          name: 'Test Category',
          icon: '🧪',
          color: '#FF6B6B',
          user_id: (await supabase.auth.getUser()).data.user?.id || ''
        })
        .select()
        .single();

      if (insertError) {
        toast({
          title: "Insert Error",
          description: insertError.message,
          variant: "destructive",
        });
        return;
      }

      toast({
        title: "Test Successful",
        description: "Categories table is working correctly!",
      });

    } catch (error) {
      console.error('Test error:', error);
      toast({
        title: "Test Failed",
        description: "An unexpected error occurred.",
        variant: "destructive",
      });
    } finally {
      setTesting(false);
    }
  };

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>Category Database Test</CardTitle>
      </CardHeader>
      <CardContent>
        <Button 
          onClick={testCategoriesTable} 
          disabled={testing}
          className="w-full"
        >
          {testing ? "Testing..." : "Test Categories Table"}
        </Button>
      </CardContent>
    </Card>
  );
}; 