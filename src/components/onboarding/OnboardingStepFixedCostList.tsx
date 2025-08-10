import { useAuth } from "@/contexts/AuthContext";
import { useSettings } from "@/contexts/SettingsContext";
import { useCategories } from "@/hooks/useCategories";
import { useOnboardingState } from "@/hooks/useOnboardingState";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Trash2 } from "lucide-react";

interface Props {
  state: ReturnType<typeof useOnboardingState>;
}

export function OnboardingStepFixedCostList({ state }: Props) {
  const { user } = useAuth();
  const { categories, addCategory } = useCategories(user?.id);
  const { formatCurrency } = useSettings();
  const { data, addFixedCostItem, updateFixedCostItem, removeFixedCostItem } = state;

  const items = data.fixedCosts || [];

  return (
    <div>
      <h3 className="text-lg font-medium text-foreground">Add your fixed monthly costs</h3>
      <p className="mt-1 text-sm text-muted-foreground">You can add multiple costs and assign each to a category. You can create new categories later in Settings too.</p>

      <div className="mt-4 space-y-3">
        {items.map((item, idx) => (
          <div key={idx} className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center bg-white/80 rounded-xl p-3 border">
            <div className="md:col-span-5">
              <label className="sr-only">Amount</label>
              <Input
                inputMode="decimal"
                placeholder="Amount"
                value={String(item.amount ?? "")}
                onChange={(e) => {
                  const num = Number(e.target.value.replace(/[^0-9.]/g, ''));
                  updateFixedCostItem(idx, { amount: Number.isNaN(num) ? 0 : num });
                }}
                className="h-11"
              />
            </div>
            <div className="md:col-span-5">
              <label className="sr-only">Category</label>
              <select
                value={item.categoryId}
                onChange={(e) => updateFixedCostItem(idx, { categoryId: e.target.value })}
                className="w-full h-11 px-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select a category…</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
              <div className="mt-1 text-xs">
                <button
                  type="button"
                  className="text-indigo-700 hover:underline"
                  onClick={async () => {
                    const name = window.prompt('New category name');
                    if (!name || !name.trim()) return;
                    try {
                      const created = await addCategory(name.trim(), 'tag', '#64748b');
                      if (created?.id) updateFixedCostItem(idx, { categoryId: created.id });
                    } catch {}
                  }}
                >
                  + Create new category
                </button>
              </div>
            </div>
            <div className="md:col-span-2 flex items-center gap-2 justify-end">
              <Button variant="outline" onClick={() => removeFixedCostItem(idx)} className="h-11 w-full md:w-auto">
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          </div>
        ))}

        <div className="flex items-center justify-between">
          <Button onClick={addFixedCostItem} variant="outline" className="rounded-xl">
            <Plus className="w-4 h-4 mr-2" /> Add another cost
          </Button>
          <div className="text-sm text-muted-foreground">
            {items.length > 0 && `Preview total: ${formatCurrency(items.reduce((s, i) => s + (i.amount || 0), 0))}`}
          </div>
        </div>
      </div>
    </div>
  );
}

export default OnboardingStepFixedCostList;


