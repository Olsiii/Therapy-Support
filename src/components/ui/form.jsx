import { createContext, useContext, useId, isValidElement, cloneElement } from "react";
import { Controller, FormProvider, useFormContext } from "react-hook-form";
import { cn } from "../../lib/utils";
import { Label } from "./label";

// Form wraps RHF's FormProvider
const Form = FormProvider;

// Context to pass field name down
const FormFieldContext = createContext({});

function FormField({ ...props }) {
  return (
    <FormFieldContext.Provider value={{ name: props.name }}>
      <Controller {...props} />
    </FormFieldContext.Provider>
  );
}

// Context to share a stable id across FormItem children
const FormItemContext = createContext({});

function FormItem({ className, ...props }) {
  const id = useId();
  return (
    <FormItemContext.Provider value={{ id }}>
      <div className={cn("form-item flex flex-col gap-1.5", className)} {...props} />
    </FormItemContext.Provider>
  );
}

// Hook used by FormLabel / FormControl / FormMessage
function useFormField() {
  const fieldCtx = useContext(FormFieldContext);
  const itemCtx = useContext(FormItemContext);
  const { getFieldState, formState } = useFormContext();
  const fieldState = getFieldState(fieldCtx.name, formState);
  return {
    id: itemCtx.id,
    name: fieldCtx.name,
    formItemId: `${itemCtx.id}-form-item`,
    formMessageId: `${itemCtx.id}-form-item-message`,
    ...fieldState,
  };
}

function FormLabel({ className, style, ...props }) {
  const { error, formItemId } = useFormField();
  return (
    <Label
      className={className}
      htmlFor={formItemId}
      style={{ ...(error ? { color: "#ef4444" } : {}), ...style }}
      {...props}
    />
  );
}

// Injects id + aria attributes into the immediate child input
function FormControl({ children }) {
  const { formItemId, error, formMessageId } = useFormField();
  if (!isValidElement(children)) return children;
  return cloneElement(children, {
    id: formItemId,
    "aria-invalid": !!error || undefined,
    "aria-describedby": error ? formMessageId : undefined,
  });
}

function FormMessage({ className, children, ...props }) {
  const { error, formMessageId } = useFormField();
  const body = error ? String(error.message) : children;
  if (!body) return null;
  return (
    <p
      id={formMessageId}
      className={cn("text-xs font-medium text-red-500", className)}
      style={{ margin: 0, fontSize: "13px", fontWeight: 500, color: "#ef4444" }}
      {...props}
    >
      {body}
    </p>
  );
}

export { Form, FormField, FormItem, FormLabel, FormControl, FormMessage };
