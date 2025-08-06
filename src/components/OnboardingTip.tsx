import { OnboardingStep } from '@/hooks/useOnboarding';

interface OnboardingTipProps {
  tip: OnboardingStep;
  onComplete: (tipId: string) => void;
  onDismiss: (tipId: string) => void;
  isCompleted?: boolean;
}

export function OnboardingTip({ tip, onComplete, onDismiss, isCompleted = false }: OnboardingTipProps) {
  const handleComplete = () => {
    console.log('Checkbox clicked for tip: ' + tip.id);
    onComplete(tip.id);
  };

  const handleDismiss = () => {
    console.log('Skip clicked for tip: ' + tip.id);
    onDismiss(tip.id);
  };

  return (
    <div 
      style={{
        position: 'fixed',
        top: '80px',
        right: '24px',
        zIndex: 9999,
        width: '320px',
        backgroundColor: '#f8fafc',
        border: '1px solid #e2e8f0',
        borderRadius: '8px',
        padding: '16px',
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
        fontFamily: 'system-ui, sans-serif'
      }}
    >
      <div style={{ marginBottom: '12px' }}>
        <h3 style={{ margin: '0 0 8px 0', fontSize: '16px', fontWeight: '600', color: '#1e293b' }}>
          Getting Started Checklist
        </h3>
        <p style={{ margin: '0 0 12px 0', fontSize: '14px', color: '#64748b', lineHeight: '1.5' }}>
          Complete these steps to set up your financial tracking:
        </p>
      </div>
      
      <div style={{ marginBottom: '16px' }}>
        <div style={{ 
          display: 'flex', 
          alignItems: 'flex-start', 
          gap: '8px',
          padding: '8px',
          backgroundColor: isCompleted ? '#f0fdf4' : '#f1f5f9',
          borderRadius: '6px',
          border: isCompleted ? '1px solid #bbf7d0' : '1px solid #cbd5e1',
          opacity: isCompleted ? 0.7 : 1
        }}>
          <input
            type="checkbox"
            checked={isCompleted}
            onChange={handleComplete}
            style={{
              marginTop: '2px',
              width: '16px',
              height: '16px',
              cursor: 'pointer',
              accentColor: '#10b981'
            }}
          />
          <div>
            <div style={{ 
              fontSize: '14px', 
              fontWeight: '500', 
              color: isCompleted ? '#059669' : '#1e293b', 
              marginBottom: '4px',
              textDecoration: isCompleted ? 'line-through' : 'none'
            }}>
              {tip.title}
            </div>
            <div style={{ 
              fontSize: '13px', 
              color: isCompleted ? '#059669' : '#64748b', 
              lineHeight: '1.4',
              textDecoration: isCompleted ? 'line-through' : 'none'
            }}>
              {tip.description}
            </div>
          </div>
        </div>
      </div>
      
      <div style={{ display: 'flex', gap: '8px' }}>
        <button
          type="button"
          onClick={handleDismiss}
          style={{
            padding: '6px 12px',
            backgroundColor: '#f1f5f9',
            color: '#64748b',
            border: '1px solid #cbd5e1',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '12px',
            fontWeight: '500'
          }}
        >
          Skip All
        </button>
      </div>
      
      {/* Debug info */}
      <div style={{ 
        marginTop: '8px', 
        padding: '4px', 
        backgroundColor: '#fef3c7', 
        fontSize: '10px', 
        color: '#92400e',
        borderRadius: '4px'
      }}>
        Debug: {tip.id} → {tip.action} → {tip.target} → Completed: {isCompleted ? 'Yes' : 'No'}
      </div>
    </div>
  );
}
