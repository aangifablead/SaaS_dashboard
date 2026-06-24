"use client";
import { Button } from "@/components/ui/button";
import toast from "react-hot-toast";
import { useState } from "react";

export function ActionButton({ children, message, type = "success", variant, className, disabled, requireConfirm, action }: any) {
  const [loading, setLoading] = useState(false);
  
  const handleAction = async () => {
    if (!action) {
      if (type === "error") {
        toast.error(message, { style: { borderRadius: '10px', background: '#333', color: '#fff' } });
      } else {
        toast.success(message, { style: { borderRadius: '10px', background: '#333', color: '#fff' }, icon: '🚀' });
      }
      return;
    }
    
    setLoading(true);
    try {
      const res = await action();
      if (res?.error) {
        toast.error(res.error, { style: { borderRadius: '10px', background: '#333', color: '#fff' } });
      } else if (res?.url) {
        window.location.href = res.url;
        return; // Don't show toast, we are redirecting
      } else {
        if (type === "error") {
          toast.success(message, { style: { borderRadius: '10px', background: '#333', color: '#fff' } });
        } else {
          toast.success(message, { style: { borderRadius: '10px', background: '#333', color: '#fff' }, icon: '🚀' });
        }
      }
    } catch (e: any) {
      toast.error(e.message || "An error occurred", { style: { borderRadius: '10px', background: '#333', color: '#fff' } });
    } finally {
      setLoading(false);
    }
  };

  const handleClick = () => {
    if (requireConfirm) {
      toast((t) => (
        <div className="flex flex-col gap-4">
          <p className="text-sm font-medium text-foreground">{requireConfirm}</p>
          <div className="flex gap-2 justify-end">
            <Button variant="outline" size="sm" onClick={() => toast.dismiss(t.id)} disabled={loading}>Cancel</Button>
            <Button 
              size="sm" 
              disabled={loading}
              className={type === "error" ? "bg-destructive hover:bg-destructive/90 text-white" : "bg-primary hover:bg-primary/90 text-white"}
              onClick={async () => {
                toast.dismiss(t.id);
                await handleAction();
              }}
            >
              Confirm
            </Button>
          </div>
        </div>
      ), { duration: Infinity, style: { minWidth: '320px', borderRadius: '12px' } });
      return;
    }
    
    handleAction();
  };

  return (
    <Button 
      variant={variant} 
      className={className} 
      disabled={disabled || loading}
      onClick={handleClick}
    >
      {loading ? "Processing..." : children}
    </Button>
  );
}
