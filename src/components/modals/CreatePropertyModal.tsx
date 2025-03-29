
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { PropertyForm } from "@/components/forms/PropertyForm";

interface CreatePropertyModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CreatePropertyModal({ isOpen, onClose }: CreatePropertyModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-4xl p-0">
        <PropertyForm onCancel={onClose} />
      </DialogContent>
    </Dialog>
  );
}
