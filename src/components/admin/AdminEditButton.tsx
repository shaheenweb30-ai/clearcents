import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Edit } from 'lucide-react';
import { useHomepageContent, HomepageContent } from '@/hooks/useHomepageContent';
import { toast } from 'sonner';

interface AdminEditButtonProps {
  sectionId: string;
  currentContent?: HomepageContent;
}

export function AdminEditButton({ sectionId, currentContent }: AdminEditButtonProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState({
    title: currentContent?.title || '',
    subtitle: currentContent?.subtitle || '',
    description: currentContent?.description || '',
    button_text: currentContent?.button_text || '',
    button_color: currentContent?.button_color || '#500CB0',
    button_text_color: currentContent?.button_text_color || '#FFFFFF',
    image_url: currentContent?.image_url || ''
  });
  const [saving, setSaving] = useState(false);
  const { updateContent } = useHomepageContent();

  const handleSave = async () => {
    setSaving(true);
    try {
      await updateContent(sectionId, formData);
      toast.success('Content updated successfully!');
      setIsOpen(false);
      window.location.reload(); // Refresh to show changes
    } catch (error) {
      toast.error('Failed to update content. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="absolute top-2 right-2 opacity-70 hover:opacity-100 z-10"
        >
          <Edit className="w-4 h-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit {sectionId} Section</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => handleInputChange('title', e.target.value)}
              placeholder="Section title"
            />
          </div>
          
          <div>
            <Label htmlFor="subtitle">Subtitle</Label>
            <Input
              id="subtitle"
              value={formData.subtitle}
              onChange={(e) => handleInputChange('subtitle', e.target.value)}
              placeholder="Section subtitle"
            />
          </div>
          
          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              placeholder="Section description"
              rows={3}
            />
          </div>
          
          <div>
            <Label htmlFor="button_text">Button Text</Label>
            <Input
              id="button_text"
              value={formData.button_text}
              onChange={(e) => handleInputChange('button_text', e.target.value)}
              placeholder="Button text"
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="button_color">Button Color</Label>
              <Input
                id="button_color"
                type="color"
                value={formData.button_color}
                onChange={(e) => handleInputChange('button_color', e.target.value)}
              />
            </div>
            
            <div>
              <Label htmlFor="button_text_color">Button Text Color</Label>
              <Input
                id="button_text_color"
                type="color"
                value={formData.button_text_color}
                onChange={(e) => handleInputChange('button_text_color', e.target.value)}
              />
            </div>
          </div>
          
          <div>
            <Label htmlFor="image_url">Image URL</Label>
            <Input
              id="image_url"
              value={formData.image_url}
              onChange={(e) => handleInputChange('image_url', e.target.value)}
              placeholder="Image URL"
            />
          </div>
          
          <div className="flex gap-2 pt-4">
            <Button onClick={handleSave} disabled={saving} className="flex-1">
              {saving ? 'Saving...' : 'Save Changes'}
            </Button>
            <Button variant="outline" onClick={() => setIsOpen(false)}>
              Cancel
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}