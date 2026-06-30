import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Link } from "react-router-dom";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "../components/ui/form";
import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";
import { Toast } from "../components/ui/toast";

const registerSchema = z
  .object({
    name: z.string().min(1, "Full name is required"),
    email: z.string().min(1, "Email is required").email("Enter a valid email"),
    role: z.enum(["user", "therapist"], { required_error: "Please select a role" }),
    password: z.string().min(8, "Password must be at least 8 characters"),
    confirmPassword: z.string().min(1, "Please confirm your password"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export default function Register() {
  const [success, setSuccess] = useState(false);

  const form = useForm({
    resolver: zodResolver(registerSchema),
    defaultValues: { name: "", email: "", role: "user", password: "", confirmPassword: "" },
  });

  const onSubmit = (_data) => {
    // TODO: connect to backend
    setSuccess(true);
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-header">
          <h1 className="auth-title">Create an account</h1>
          <p className="auth-subtitle">Start your TherapySupport journey today</p>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} style={{ display: "flex", flexDirection: "column", gap: "16px" }} noValidate>

            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Full name</FormLabel>
                  <FormControl>
                    <Input type="text" placeholder="Jane Doe" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input type="email" placeholder="you@example.com" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Role selector */}
            <FormField
              control={form.control}
              name="role"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>I am signing up as a…</FormLabel>
                  <FormControl>
                    <div style={{ display: "flex", gap: "12px" }}>
                      {[
                        { value: "user", label: "User", desc: "Seeking support" },
                        { value: "therapist", label: "Therapist", desc: "Providing support" },
                      ].map(({ value, label, desc }) => {
                        const selected = field.value === value;
                        return (
                          <label
                            key={value}
                            style={{
                              flex: 1,
                              display: "flex",
                              flexDirection: "column",
                              alignItems: "center",
                              padding: "12px",
                              border: `2px solid ${selected ? "var(--accent)" : "var(--border)"}`,
                              borderRadius: "12px",
                              background: selected ? "var(--accent-bg)" : "transparent",
                              cursor: "pointer",
                              transition: "all 0.15s ease",
                              gap: "2px",
                            }}
                          >
                            <input
                              type="radio"
                              value={value}
                              checked={selected}
                              onChange={() => field.onChange(value)}
                              style={{ position: "absolute", opacity: 0, pointerEvents: "none" }}
                            />
                            <span style={{ fontWeight: 600, fontSize: 14, color: selected ? "var(--accent)" : "var(--text-h)" }}>
                              {label}
                            </span>
                            <span style={{ fontSize: 12, color: "var(--text)" }}>{desc}</span>
                          </label>
                        );
                      })}
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input type="password" placeholder="Min. 8 characters" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Confirm password</FormLabel>
                  <FormControl>
                    <Input type="password" placeholder="••••••••" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" size="lg" style={{ width: "100%", marginTop: "4px" }}>
              Create account
            </Button>
          </form>
        </Form>

        <Toast
          show={success}
          message="Thanks for creating an account! Welcome to TherapySupport 🎉"
          onClose={() => setSuccess(false)}
        />

        <div className="auth-footer">
          Already have an account? <Link to="/login">Sign in</Link>
        </div>
      </div>
    </div>
  );
}
