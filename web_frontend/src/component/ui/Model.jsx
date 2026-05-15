import React, { useEffect } from "react";
import { X } from "lucide-react";

const Model = ({
  isOpen,
  onClose,
  title,
  showCloseButton = true,
  closeOnBackdropClick = true,
  showBackdrop = true,
  children,
}) => {
  // Prevent scrolling on the body when the modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget && closeOnBackdropClick) {
      if (onClose) onClose();
    }
  };

  return (
    <div
      className={`fixed inset-0 z-[200] flex items-center justify-center p-4 transition-all ${
        showBackdrop ? "bg-black/80 backdrop-blur-md" : "bg-transparent pointer-events-none"
      }`}
      onClick={handleBackdropClick}
    >
      <div
        className="pointer-events-auto relative flex w-full max-w-2xl flex-col overflow-hidden rounded-[2.5rem] border border-white/10 bg-[#121212] shadow-2xl max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
        data-aos="zoom-in"
        data-aos-duration="300"
      >
        {/* Header */}
        {(title || showCloseButton) && (
          <div className="flex items-center justify-between border-b border-white/5 bg-white/5 px-8 py-6">
            <div className="flex-1 text-xl font-black text-white">
              {title}
            </div>
            {showCloseButton && (
              <button
                onClick={onClose}
                className="ms-4 rounded-xl p-2 text-slate-500 transition-all hover:bg-white/5 hover:text-white"
                aria-label="Close modal"
              >
                <X size={20} />
              </button>
            )}
          </div>
        )}

        {/* Content Body */}
        <div className="custom-scrollbar flex-1 overflow-y-auto p-8">{children}</div>
      </div>
    </div>
  );
};

export default Model;
