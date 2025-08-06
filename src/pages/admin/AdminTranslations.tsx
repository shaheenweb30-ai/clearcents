import { TranslationManager } from "@/components/admin/TranslationManager";
import { SettingsLayout } from "@/components/SettingsLayout";

const AdminTranslations = () => {
  return (
    <SettingsLayout>
      <div className="container mx-auto px-6 py-8 max-w-6xl">
        <div className="mb-8">
          <h1 className="text-3xl font-heading font-bold text-foreground mb-2">
            Translation Management
          </h1>
          <p className="text-muted-foreground">
            Manage dynamic content translations for all supported languages
          </p>
        </div>
        
        <TranslationManager />
      </div>
    </SettingsLayout>
  );
};

export default AdminTranslations; 