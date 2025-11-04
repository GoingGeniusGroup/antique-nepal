"use client";

import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { AlertCircle, CheckCircle } from "lucide-react";

interface ConfirmationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
  title?: string;
  description?: string;
  confirmText?: string;
  cancelText?: string;
  variant?: "default" | "destructive";
}

export function ConfirmationDialog({
  open,
  onOpenChange,
  onConfirm,
  title = "Save Changes?",
  description = "Are you sure you want to save these changes?",
  confirmText = "Save Changes",
  cancelText = "Cancel",
  variant = "default",
}: ConfirmationDialogProps) {
  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [open]);

  const handleConfirm = () => {
    onConfirm();
    onOpenChange(false);
  };

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => onOpenChange(false)}
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
          />

          {/* Dialog */}
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ type: "spring", duration: 0.3 }}
              className="relative w-full max-w-md bg-background border border-border rounded-lg shadow-2xl"
            >
              {/* Header */}
              <div className="p-6 pb-4">
                <div className="flex items-start gap-4">
                  <div
                    className={`flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center ${
                      variant === "destructive"
                        ? "bg-destructive/10"
                        : "bg-primary/10"
                    }`}
                  >
                    {variant === "destructive" ? (
                      <AlertCircle className="w-6 h-6 text-destructive" />
                    ) : (
                      <CheckCircle className="w-6 h-6 text-primary" />
                    )}
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-foreground">
                      {title}
                    </h3>
                    <p className="mt-2 text-sm text-muted-foreground">
                      {description}
                    </p>
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="flex items-center justify-end gap-3 px-6 py-4 bg-muted/30 border-t border-border rounded-b-lg">
                <Button
                  variant="outline"
                  onClick={() => onOpenChange(false)}
                  className="min-w-[100px]"
                >
                  {cancelText}
                </Button>
                <Button
                  onClick={handleConfirm}
                  className={`min-w-[100px] ${
                    variant === "destructive"
                      ? "bg-destructive hover:bg-destructive/90"
                      : "bg-primary hover:bg-primary/90"
                  }`}
                >
                  {confirmText}
                </Button>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
