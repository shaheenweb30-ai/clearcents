import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";

export const TransactionDebug = () => {
  const [results, setResults] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const addLog = (message: string) => {
    const timestamp = new Date().toLocaleTimeString();
    setResults(prev => [`${timestamp}: ${message}`, ...prev.slice(0, 9)]);
  };

  const testTransactionsTable = async () => {
    setLoading(true);
    addLog("Starting transaction table test...");

    try {
      // Test 1: Check if user is authenticated
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        addLog(`✅ User authenticated: ${user.email}`);
      } else {
        addLog("❌ User not authenticated");
        return;
      }

      // Test 2: Check if transactions table exists
      const { error: tableError } = await supabase
        .from('transactions')
        .select('count')
        .limit(1);

      if (tableError) {
        addLog(`❌ Database error: ${tableError.message}`);
        if (tableError.code === '42P01') {
          addLog("❌ Transactions table does not exist. Please create it first.");
        }
        return;
      } else {
        addLog("✅ Transactions table exists");
      }

      // Test 3: Get a category ID first
      addLog("🔄 Getting a category ID for testing...");
      const { data: categoriesData, error: categoriesError } = await supabase
        .from('categories')
        .select('id')
        .eq('user_id', user.id)
        .limit(1);

      if (categoriesError) {
        addLog(`❌ Error fetching categories: ${categoriesError.message}`);
        return;
      }

      if (!categoriesData || categoriesData.length === 0) {
        addLog("❌ No categories found. Please create categories first.");
        return;
      }

      const categoryId = categoriesData[0].id;
      addLog(`✅ Using category ID: ${categoryId}`);

      // Test 4: Try to insert a test transaction
      const testTransaction = {
        user_id: user.id,
        amount: -10.50,
        category_id: categoryId,
        description: 'Test transaction for debugging',
        transaction_date: new Date().toISOString().split('T')[0]
      };

      addLog("🔄 Attempting to insert test transaction...");
      const { data: insertData, error: insertError } = await supabase
        .from('transactions')
        .insert(testTransaction)
        .select();

      if (insertError) {
        addLog(`❌ Insert error: ${insertError.message}`);
        addLog(`❌ Error details: ${JSON.stringify(insertError)}`);
      } else {
        addLog(`✅ Insert successful: ${insertData?.[0]?.id}`);
      }

      // Test 5: Try to fetch transactions
      addLog("🔄 Attempting to fetch transactions...");
      const { data: fetchData, error: fetchError } = await supabase
        .from('transactions')
        .select(`
          *,
          categories (
            id,
            name,
            icon,
            color
          )
        `)
        .eq('user_id', user.id)
        .limit(5);

      if (fetchError) {
        addLog(`❌ Fetch error: ${fetchError.message}`);
      } else {
        addLog(`✅ Fetch successful: Found ${fetchData?.length || 0} transactions`);
        if (fetchData && fetchData.length > 0) {
          addLog(`📋 Sample transaction: ${JSON.stringify(fetchData[0], null, 2)}`);
        }
      }

      // Test 6: Try to update a transaction
      if (fetchData && fetchData.length > 0) {
        const firstTransaction = fetchData[0];
        addLog("🔄 Attempting to update transaction...");
        const { error: updateError } = await supabase
          .from('transactions')
          .update({ description: 'Updated test transaction' })
          .eq('id', firstTransaction.id);

        if (updateError) {
          addLog(`❌ Update error: ${updateError.message}`);
        } else {
          addLog("✅ Update successful");
        }
      }

      // Test 7: Try to delete the test transaction
      if (insertData && insertData.length > 0) {
        addLog("🔄 Attempting to delete test transaction...");
        const { error: deleteError } = await supabase
          .from('transactions')
          .delete()
          .eq('id', insertData[0].id);

        if (deleteError) {
          addLog(`❌ Delete error: ${deleteError.message}`);
        } else {
          addLog("✅ Delete successful");
        }
      }

    } catch (error) {
      addLog(`❌ Unexpected error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setLoading(false);
    }
  };

  const clearResults = () => {
    setResults([]);
  };

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Transaction Table Debug</span>
          <div className="flex gap-2">
            <Button 
              onClick={testTransactionsTable} 
              disabled={loading}
              size="sm"
            >
              {loading ? "Testing..." : "Run Transaction Tests"}
            </Button>
            <Button 
              onClick={clearResults} 
              variant="outline" 
              size="sm"
            >
              Clear
            </Button>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {results.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              Click "Run Transaction Tests" to check the transactions table connectivity and CRUD operations.
            </p>
          ) : (
            <div className="space-y-1">
              {results.map((result, index) => (
                <div key={index} className="text-sm font-mono bg-muted p-2 rounded">
                  {result}
                </div>
              ))}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}; 