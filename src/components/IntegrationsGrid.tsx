import { FileText, FileSpreadsheet, Mail, Building, Webhook, Code } from "lucide-react";

const INTEGRATIONS = [
  {
    name: 'CSV Import',
    icon: FileSpreadsheet,
    tag: 'Available',
    tagColor: 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
  },
  {
    name: 'PDF Statement',
    icon: FileText,
    tag: 'Beta',
    tagColor: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400'
  },
  {
    name: 'Email Receipts',
    icon: Mail,
    tag: 'Coming soon',
    tagColor: 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400'
  },
  {
    name: 'Bank Sync',
    icon: Building,
    tag: 'Optional',
    tagColor: 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400'
  },
  {
    name: 'Webhooks',
    icon: Webhook,
    tag: 'Pro',
    tagColor: 'bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-400'
  },
  {
    name: 'API',
    icon: Code,
    tag: 'Pro',
    tagColor: 'bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-400'
  }
];

export function IntegrationsGrid() {
  return (
    <section id="currency" className="py-20 lg:py-32 bg-gradient-to-br from-white via-gray-50 to-blue-50/30 relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0">
        <div className="absolute top-20 right-20 w-32 h-32 bg-blue-200 rounded-full opacity-10 animate-pulse"></div>
        <div className="absolute bottom-20 left-20 w-24 h-24 bg-purple-200 rounded-full opacity-15 animate-bounce"></div>
        <div className="absolute top-1/2 right-1/4 w-16 h-16 bg-green-200 rounded-full opacity-20 animate-ping"></div>
        <div className="absolute top-1/4 left-1/4 w-12 h-12 bg-indigo-200 rounded-full opacity-15 animate-pulse"></div>
      </div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center mb-20">
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-2 rounded-full text-sm font-semibold shadow-lg mb-6">
            <span className="w-2 h-2 bg-white rounded-full animate-pulse"></span>
            Integrations
          </div>
          <h2 className="font-bold text-4xl md:text-5xl lg:text-6xl text-gray-900 mb-6">
            Works with your
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              workflow
            </span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Start manual, import CSVs, or add connections later. Flexible options for every user.
          </p>
        </div>
        
        {/* Integrations Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
          {INTEGRATIONS.map((integration) => {
            const IconComponent = integration.icon;
            return (
              <div
                key={integration.name}
                className="group bg-background rounded-xl p-6 border border-border hover:shadow-lg transition-all duration-300 hover:-translate-y-1 text-center"
              >
                {/* Icon */}
                <div className="w-12 h-12 bg-muted rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                  <IconComponent className="w-6 h-6 text-muted-foreground" />
                </div>
                
                {/* Name */}
                <h3 className="font-medium text-foreground mb-3 text-sm">
                  {integration.name}
                </h3>
                
                {/* Tag */}
                <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${integration.tagColor}`}>
                  {integration.tag}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
