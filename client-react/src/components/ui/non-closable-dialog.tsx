"use client";

import * as React from "react";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { X } from "lucide-react";

import { cn } from "@/lib/utils";

const NonClosableDialog = DialogPrimitive.Root;

interface NonClosableDialogTriggerProps {
  children: React.ReactNode;
  asChild?: boolean;
}

const NonClosableDialogTrigger = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Trigger>,
  NonClosableDialogTriggerProps
>(({ children, asChild = false, ...props }, ref) => (
  <DialogPrimitive.Trigger ref={ref} asChild={asChild} {...props}>
    {children}
  </DialogPrimitive.Trigger>
));
NonClosableDialogTrigger.displayName = "NonClosableDialogTrigger";

const NonClosableDialogPortal = DialogPrimitive.Portal;

const NonClosableDialogOverlay = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Overlay>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Overlay>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Overlay
    ref={ref}
    className={cn(
      "fixed inset-0 z-50 bg-black/80 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
      className
    )}
    {...props}
  />
));
NonClosableDialogOverlay.displayName = "NonClosableDialogOverlay";

interface NonClosableDialogContentProps
  extends React.ComponentPropsWithoutRef<typeof DialogPrimitive.Content> {
  showCloseButton?: boolean;
  allowClosing?: boolean;
}

const NonClosableDialogContent = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Content>,
  NonClosableDialogContentProps
>(
  (
    {
      className,
      children,
      showCloseButton = false,
      allowClosing = false,
      ...props
    },
    ref
  ) => (
    <NonClosableDialogPortal>
      <NonClosableDialogOverlay />
      <DialogPrimitive.Content
        ref={ref}
        onPointerDownOutside={(e) =>
          allowClosing ? undefined : e.preventDefault()
        }
        onEscapeKeyDown={(e) => (allowClosing ? undefined : e.preventDefault())}
        className={cn(
          "fixed left-[50%] top-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border bg-background p-6 shadow-lg duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%] sm:rounded-lg",
          className
        )}
        {...props}
      >
        {children}
        {showCloseButton && (
          <DialogPrimitive.Close className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground">
            <X className="h-4 w-4" />
            <span className="sr-only">Close</span>
          </DialogPrimitive.Close>
        )}
      </DialogPrimitive.Content>
    </NonClosableDialogPortal>
  )
);
NonClosableDialogContent.displayName = "NonClosableDialogContent";

const NonClosableDialogHeader = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn(
      "flex flex-col space-y-1.5 text-center sm:text-left",
      className
    )}
    {...props}
  />
);
NonClosableDialogHeader.displayName = "NonClosableDialogHeader";

const NonClosableDialogFooter = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn(
      "flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2",
      className
    )}
    {...props}
  />
);
NonClosableDialogFooter.displayName = "NonClosableDialogFooter";

const NonClosableDialogTitle = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Title>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Title>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Title
    ref={ref}
    className={cn(
      "text-lg font-semibold leading-none tracking-tight",
      className
    )}
    {...props}
  />
));
NonClosableDialogTitle.displayName = "NonClosableDialogTitle";

const NonClosableDialogDescription = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Description>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Description>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Description
    ref={ref}
    className={cn("text-sm text-muted-foreground", className)}
    {...props}
  />
));
NonClosableDialogDescription.displayName = "NonClosableDialogDescription";

export {
  NonClosableDialog,
  NonClosableDialogTrigger,
  NonClosableDialogContent,
  NonClosableDialogHeader,
  NonClosableDialogFooter,
  NonClosableDialogTitle,
  NonClosableDialogDescription,
};
