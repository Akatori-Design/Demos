// src/App.tsx
import type React from "react";
import { useState } from "react";
import { Button } from "../components/ui/Button";
import { TextField } from "../components/ui/TextField";

type FormValues = {
  firstName: string;
  email: string;
};

export default function App() {
  // This holds the user’s input values.
  const [values, setValues] = useState<FormValues>({ firstName: "", email: "" });

  // This tracks which step the user is on.
  const [step, setStep] = useState<1 | 2>(1);

  // This holds field-level errors (empty string means “no error”).
  const [errors, setErrors] = useState<{ firstName?: string; email?: string }>({});

  // This updates a single field and clears its error as the user types.
  function updateField<K extends keyof FormValues>(key: K, value: FormValues[K]) {
    setValues((v) => ({ ...v, [key]: value }));
    setErrors((e) => ({ ...e, [key]: undefined }));
  }

  // This validates the current step only.
  function validateCurrentStep() {
    const nextErrors: typeof errors = {};

    if (step === 1) {
      if (!values.firstName.trim()) nextErrors.firstName = "First name is required.";
    }

    if (step === 2) {
      if (!values.email.trim()) nextErrors.email = "Email is required.";
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  }

  function onContinue() {
    if (!validateCurrentStep()) return;
    setStep(2);
  }

  function onSubmit() {
    if (!validateCurrentStep()) return;

    // For now, just show the result.
    alert(`Submitted:\nName: ${values.firstName}\nEmail: ${values.email}`);
  }

  return (
    <div style={{ padding: 24, maxWidth: 420 }}>
      <h2 style={{ marginBottom: 6 }}>Two-step form</h2>
      <p style={{ opacity: 0.7, marginTop: 0 }}>Step {step} of 2</p>

      {step === 1 ? (
        <div style={{ display: "grid", gap: 12 }}>
          <TextField
            label="First name"
            placeholder="Hiro"
            value={values.firstName}
           onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
  updateField("firstName", e.target.value)
}
            error={errors.firstName}
            hint={!errors.firstName ? "This shows on your profile." : undefined}
          />

          <div style={{ display: "flex", gap: 10 }}>
            <Button variant="primary" onClick={onContinue}>
              Continue
            </Button>
          </div>
        </div>
      ) : (
        <div style={{ display: "grid", gap: 12 }}>
          <TextField
            label="Email"
            placeholder="hiro@example.com"
            value={values.email}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
  updateField("email", e.target.value)
}
            error={errors.email}
            hint={!errors.email ? "We’ll send a confirmation." : undefined}
          />

          <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
            <Button variant="secondary" onClick={() => setStep(1)}>
              Back
            </Button>
            <Button variant="primary" onClick={onSubmit}>
              Submit
            </Button>
          </div>
        </div>
      )}
    </div>
  );
} 