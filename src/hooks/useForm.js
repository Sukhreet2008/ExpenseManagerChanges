import { useState, useCallback } from "react";

// useForm: Custom React Hook for robust, controlled form handling.
// Demonstrates industry-standard controlled inputs, live touch tracking,
// per-field validation, and dirty-state management.
export function useForm({ initialValues = {}, validate, onSubmit }) {
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Updates a field value and re-validates if already touched
  const handleChange = useCallback((field, value) => {
    setValues((prev) => {
      const updated = { ...prev, [field]: value };
      if (validate) {
        const validationErrors = validate(updated);
        setErrors(validationErrors);
      }
      return updated;
    });
  }, [validate]);

  // Marks a field as touched on blur, triggering error display
  const handleBlur = useCallback((field) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
    if (validate) {
      const validationErrors = validate(values);
      setErrors(validationErrors);
    }
  }, [validate, values]);

  // Direct setter for complex controls (e.g. TypeSwitch)
  const setFieldValue = useCallback((field, value) => {
    handleChange(field, value);
  }, [handleChange]);

  // Reset form back to initial or new values
  const resetForm = useCallback((nextValues = initialValues) => {
    setValues(nextValues);
    setErrors({});
    setTouched({});
    setIsSubmitting(false);
  }, [initialValues]);

  // Form submit handler with validation guard
  const handleSubmit = useCallback(async (event) => {
    if (event && event.preventDefault) {
      event.preventDefault();
    }

    // Mark all fields as touched
    const allTouched = Object.keys(values).reduce((acc, key) => {
      acc[key] = true;
      return acc;
    }, {});
    setTouched(allTouched);

    if (validate) {
      const validationErrors = validate(values);
      setErrors(validationErrors);

      if (Object.keys(validationErrors).length > 0) {
        return false;
      }
    }

    setIsSubmitting(true);
    try {
      if (onSubmit) {
        await onSubmit(values);
      }
      return true;
    } finally {
      setIsSubmitting(false);
    }
  }, [onSubmit, validate, values]);

  const hasErrors = Object.keys(errors).length > 0;
  const isDirty = JSON.stringify(values) !== JSON.stringify(initialValues);

  return {
    values,
    errors,
    touched,
    isSubmitting,
    isDirty,
    isValid: !hasErrors,
    handleChange,
    handleBlur,
    setFieldValue,
    resetForm,
    handleSubmit,
  };
}

export default useForm;

