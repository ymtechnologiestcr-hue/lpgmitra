import { useState } from "react";
import {
  Check,
  CheckCircle2,
  Loader2,
  AlertCircle,
  AlertTriangle,
  RotateCcw,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Reveal } from "./Reveal";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface RegistrationFormData {
  agency_name: string;
  gst_number: string;
  phone_number: string;
  email_id: string;
  address: string;
  state: string;
  district: string;
  pin_code: string;
  subscription_plan: string;
  terms_accepted: boolean;
}

interface RegistrationSuccessData {
  agency_id?: number | string;
  message?: string;
  agency_name?: string;
}

interface ServerErrorState {
  type: "validation" | "conflict" | "error";
  message: string;
}

interface FieldErrors {
  agency_name?: string;
  gst_number?: string;
  phone_number?: string;
  email_id?: string;
  address?: string;
  state?: string;
  district?: string;
  pin_code?: string;
  subscription_plan?: string;
  terms_accepted?: string;
}

const trustPoints = [
  "Free Demo & Onboarding",
  "Quick 24-Hour Setup",
  "Staff Training Included",
  "Dedicated 24/7 Support",
  "Secure Cloud Platform",
  "No Technical Knowledge Required",
];

const initialFormData: RegistrationFormData = {
  agency_name: "",
  gst_number: "",
  phone_number: "",
  email_id: "",
  address: "",
  state: "",
  district: "",
  pin_code: "",
  subscription_plan: "Recommended - 6 Months",
  terms_accepted: false,
};

function getRegisterApiUrl(): string {
  const rawBase = (import.meta.env["VITE_API_BASE_URL"] || "").trim();
  if (!rawBase) {
    return "/api/agencies/register";
  }
  const cleanBase = rawBase.replace(/\/+$/, "");
  return cleanBase.endsWith("/api")
    ? `${cleanBase}/agencies/register`
    : `${cleanBase}/api/agencies/register`;
}

export function Register() {
  const [formData, setFormData] = useState<RegistrationFormData>(initialFormData);
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [serverError, setServerError] = useState<ServerErrorState | null>(null);
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [registrationSuccess, setRegistrationSuccess] =
    useState<RegistrationSuccessData | null>(null);

  const validateField = (
    name: keyof RegistrationFormData,
    value: any,
  ): string | null => {
    switch (name) {
      case "agency_name":
        if (!value || typeof value !== "string" || value.trim().length < 2) {
          return "Agency name is required (minimum 2 characters).";
        }
        return null;
      case "gst_number": {
        if (!value || typeof value !== "string" || !value.trim()) {
          return "GST Number is required.";
        }
        const cleaned = value.trim().toUpperCase();
        // Indian GSTIN format: 2 numbers + 5 letters + 4 numbers + 1 letter + 1 char + Z + 1 char
        const gstRegex = /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/i;
        if (cleaned.length !== 15 || !gstRegex.test(cleaned)) {
          return "Enter a valid 15-character GSTIN (e.g. 27ABCDE1234F1Z5).";
        }
        return null;
      }
      case "phone_number": {
        if (!value || typeof value !== "string" || !value.trim()) {
          return "Phone number is required.";
        }
        const digits = value.replace(/\D/g, "");
        if (digits.length !== 10 || !/^[6-9]\d{9}$/.test(digits)) {
          return "Enter a valid 10-digit mobile number (e.g. 9876543210).";
        }
        return null;
      }
      case "email_id": {
        if (!value || typeof value !== "string" || !value.trim()) {
          return "Email ID is required.";
        }
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value.trim())) {
          return "Enter a valid email address (e.g. name@domain.com).";
        }
        return null;
      }
      case "address":
        if (!value || typeof value !== "string" || value.trim().length < 5) {
          return "Address is required (minimum 5 characters).";
        }
        return null;
      case "state":
        if (!value || typeof value !== "string" || !value.trim()) {
          return "State is required.";
        }
        return null;
      case "district":
        if (!value || typeof value !== "string" || !value.trim()) {
          return "District is required.";
        }
        return null;
      case "pin_code": {
        if (!value || typeof value !== "string" || !value.trim()) {
          return "PIN Code is required.";
        }
        const pinDigits = value.replace(/\D/g, "");
        if (pinDigits.length !== 6) {
          return "Enter a valid 6-digit PIN code.";
        }
        return null;
      }
      case "terms_accepted":
        if (!value) {
          return "You must accept the Terms & Conditions to register.";
        }
        return null;
      default:
        return null;
    }
  };

  const validateAll = (): boolean => {
    const errors: FieldErrors = {};
    (Object.keys(formData) as Array<keyof RegistrationFormData>).forEach((key) => {
      const err = validateField(key, formData[key]);
      if (err) {
        errors[key] = err;
      }
    });

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleInputChange = (
    field: keyof RegistrationFormData,
    value: string | boolean,
  ) => {
    let formattedValue = value;

    if (field === "gst_number" && typeof value === "string") {
      formattedValue = value.toUpperCase().slice(0, 15);
    } else if (field === "phone_number" && typeof value === "string") {
      formattedValue = value.replace(/\D/g, "").slice(0, 10);
    } else if (field === "pin_code" && typeof value === "string") {
      formattedValue = value.replace(/\D/g, "").slice(0, 6);
    }

    setFormData((prev) => ({
      ...prev,
      [field]: formattedValue,
    }));

    // Clear field-specific error when user updates
    if (fieldErrors[field]) {
      setFieldErrors((prev) => {
        const next = { ...prev };
        delete next[field];
        return next;
      });
    }

    if (serverError) {
      setServerError(null);
    }
  };

  const handleResetForm = () => {
    setFormData(initialFormData);
    setFieldErrors({});
    setServerError(null);
    setRegistrationSuccess(null);
    setSubmitted(false);
  };

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (!validateAll()) {
      toast.error("Please correct the highlighted errors before submitting.");
      return;
    }

    setLoading(true);
    setServerError(null);

    const payload = {
      agency_name: formData.agency_name.trim(),
      gst_number: formData.gst_number.trim().toUpperCase(),
      phone_number: formData.phone_number.replace(/\D/g, ""),
      email_id: formData.email_id.trim().toLowerCase(),
      address: formData.address.trim(),
      state: formData.state.trim(),
      district: formData.district.trim(),
      pin_code: formData.pin_code.trim(),
      subscription_plan: formData.subscription_plan,
      terms_accepted: true,
    };

    try {
      const endpoint = getRegisterApiUrl();
      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json().catch(() => null);

      if (response.status === 201 || (response.ok && data?.success)) {
        const agencyId = data?.agency_id || data?.agencyId || data?.id;
        const msg = data?.message || "Agency registered successfully!";
        setRegistrationSuccess({
          agency_id: agencyId,
          message: msg,
          agency_name: payload.agency_name,
        });
        setSubmitted(true);
        toast.success(msg);
      } else if (response.status === 400) {
        const errorMsg =
          data?.message ||
          data?.error ||
          "Validation failed. Please verify the submitted information.";

        if (data?.errors && typeof data.errors === "object") {
          setFieldErrors((prev) => ({ ...prev, ...data.errors }));
        }

        setServerError({
          type: "validation",
          message: errorMsg,
        });
        toast.error(errorMsg);
      } else if (response.status === 409) {
        const conflictMsg =
          data?.message ||
          data?.error ||
          "An account with this email ID or phone number already exists.";

        setServerError({
          type: "conflict",
          message: conflictMsg,
        });
        toast.warning(conflictMsg);
      } else {
        const fallbackMsg =
          data?.message ||
          data?.error ||
          `Registration failed (Status: ${response.status}). Please try again later.`;

        setServerError({
          type: "error",
          message: fallbackMsg,
        });
        toast.error(fallbackMsg);
      }
    } catch (error: any) {
      const networkMsg =
        error?.message ||
        "Unable to connect to registration service. Please verify your connection.";

      setServerError({
        type: "error",
        message: networkMsg,
      });
      toast.error(networkMsg);
    } finally {
      setLoading(false);
    }
  }

  return (
    <section id="register" className="section-pad border-t border-border bg-secondary/40">
      <div className="mx-auto max-w-7xl px-5 lg:px-8">
        <div className="grid items-start gap-12 lg:grid-cols-2">
          <Reveal>
            <div className="lg:sticky lg:top-28">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-primary/20 bg-primary/10 px-3.5 py-1 text-xs font-semibold text-primary">
                <Sparkles className="size-3.5" /> Fast-Track Onboarding
              </span>
              <h2 className="mt-4 text-3xl font-extrabold leading-tight text-foreground sm:text-4xl md:text-5xl">
                Register Your <span className="gradient-text">LPG Agency</span> Today
              </h2>
              <p className="mt-6 text-base leading-relaxed text-muted-foreground md:text-lg">
                Start your digital transformation with our complete LPG Agency Management Platform.
                We'll help you onboard your agency, migrate your customer database, train your
                staff, and get you running smoothly in under 24 hours.
              </p>
              <ul className="mt-8 grid gap-3 sm:grid-cols-2">
                {trustPoints.map((t) => (
                  <li
                    key={t}
                    className="flex items-center gap-2.5 rounded-xl border border-border bg-card px-4 py-3 text-sm font-semibold text-foreground shadow-xs"
                  >
                    <Check className="size-4 shrink-0 text-primary" />
                    {t}
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>

          <Reveal delay={120}>
            <div className="glass-card p-7 md:p-9 shadow-lg">
              {submitted && registrationSuccess ? (
                <div className="py-10 text-center animate-fade-in">
                  <div className="mx-auto flex size-16 items-center justify-center rounded-full bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 ring-8 ring-emerald-500/10">
                    <CheckCircle2 className="size-9" />
                  </div>
                  <h3 className="mt-6 text-2xl font-extrabold text-foreground">
                    Registration Submitted Successfully!
                  </h3>

                  {registrationSuccess.agency_id && (
                    <div className="mt-4 inline-flex items-center gap-2 rounded-full border border-primary/25 bg-primary/10 px-4 py-1.5 text-xs font-bold text-primary">
                      <span>Agency ID:</span>
                      <span className="font-mono tracking-wider">
                        #{registrationSuccess.agency_id}
                      </span>
                    </div>
                  )}

                  <p className="mt-4 text-sm leading-relaxed text-muted-foreground max-w-md mx-auto">
                    {registrationSuccess.message ||
                      "Thank you for registering your agency. Our onboarding team will contact you shortly to schedule your demo and complete the setup."}
                  </p>

                  <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
                    <Button
                      variant="brand"
                      size="lg"
                      className="w-full sm:w-auto"
                      onClick={() => {
                        window.location.href = "/";
                      }}
                    >
                      Go to Home
                    </Button>
                    <Button
                      variant="soft"
                      size="lg"
                      className="w-full sm:w-auto"
                      onClick={handleResetForm}
                    >
                      <RotateCcw className="mr-2 size-4" />
                      Register Another Agency
                    </Button>
                  </div>
                </div>
              ) : (
                <form className="grid gap-5 sm:grid-cols-2" onSubmit={handleSubmit} noValidate>
                  <div className="sm:col-span-2">
                    <h3 className="text-xl font-extrabold text-foreground">Agency Registration</h3>
                    <p className="mt-1 text-xs text-muted-foreground">
                      Fill in your agency details to initiate your digital onboarding.
                    </p>
                  </div>

                  {/* Server error / conflict / fallback alert banner */}
                  {serverError && (
                    <div
                      className={cn(
                        "sm:col-span-2 rounded-xl border p-4 text-sm transition-all",
                        serverError.type === "conflict"
                          ? "border-amber-500/30 bg-amber-500/10 text-amber-700 dark:text-amber-400"
                          : serverError.type === "validation"
                            ? "border-destructive/30 bg-destructive/10 text-destructive"
                            : "border-destructive/30 bg-destructive/10 text-destructive",
                      )}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-start gap-3">
                          {serverError.type === "conflict" ? (
                            <AlertTriangle className="size-5 shrink-0 mt-0.5 text-amber-600 dark:text-amber-400" />
                          ) : (
                            <AlertCircle className="size-5 shrink-0 mt-0.5 text-destructive" />
                          )}
                          <div>
                            <p className="font-semibold text-xs uppercase tracking-wide">
                              {serverError.type === "conflict"
                                ? "Account Already Exists"
                                : serverError.type === "validation"
                                  ? "Validation Error"
                                  : "Registration Error"}
                            </p>
                            <p className="mt-1 text-xs leading-relaxed">{serverError.message}</p>
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={() => setServerError(null)}
                          className="text-xs font-semibold hover:opacity-75"
                        >
                          Dismiss
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Agency Name */}
                  <div className="sm:col-span-1">
                    <Label htmlFor="agency_name" className="text-xs font-semibold text-foreground">
                      Agency Name <span className="text-destructive">*</span>
                    </Label>
                    <Input
                      id="agency_name"
                      name="agency_name"
                      value={formData.agency_name}
                      onChange={(e) => handleInputChange("agency_name", e.target.value)}
                      placeholder="Sai Bharat Gas Agency"
                      disabled={loading}
                      className={cn(
                        "mt-2 h-11 rounded-xl bg-card",
                        fieldErrors.agency_name &&
                          "border-destructive focus-visible:ring-destructive",
                      )}
                    />
                    {fieldErrors.agency_name && (
                      <p className="mt-1.5 flex items-center gap-1 text-[11px] font-medium text-destructive">
                        <AlertCircle className="size-3 shrink-0" />
                        {fieldErrors.agency_name}
                      </p>
                    )}
                  </div>

                  {/* GST Number */}
                  <div className="sm:col-span-1">
                    <Label htmlFor="gst_number" className="text-xs font-semibold text-foreground">
                      GST Number <span className="text-destructive">*</span>
                    </Label>
                    <Input
                      id="gst_number"
                      name="gst_number"
                      value={formData.gst_number}
                      onChange={(e) => handleInputChange("gst_number", e.target.value)}
                      placeholder="27ABCDE1234F1Z5"
                      maxLength={15}
                      disabled={loading}
                      className={cn(
                        "mt-2 h-11 rounded-xl bg-card uppercase font-mono text-xs tracking-wider",
                        fieldErrors.gst_number &&
                          "border-destructive focus-visible:ring-destructive",
                      )}
                    />
                    {fieldErrors.gst_number && (
                      <p className="mt-1.5 flex items-center gap-1 text-[11px] font-medium text-destructive">
                        <AlertCircle className="size-3 shrink-0" />
                        {fieldErrors.gst_number}
                      </p>
                    )}
                  </div>

                  {/* Phone Number */}
                  <div className="sm:col-span-1">
                    <Label htmlFor="phone_number" className="text-xs font-semibold text-foreground">
                      Phone Number (10 Digits) <span className="text-destructive">*</span>
                    </Label>
                    <Input
                      id="phone_number"
                      name="phone_number"
                      type="tel"
                      value={formData.phone_number}
                      onChange={(e) => handleInputChange("phone_number", e.target.value)}
                      placeholder="9876543210"
                      maxLength={10}
                      disabled={loading}
                      className={cn(
                        "mt-2 h-11 rounded-xl bg-card",
                        fieldErrors.phone_number &&
                          "border-destructive focus-visible:ring-destructive",
                      )}
                    />
                    {fieldErrors.phone_number && (
                      <p className="mt-1.5 flex items-center gap-1 text-[11px] font-medium text-destructive">
                        <AlertCircle className="size-3 shrink-0" />
                        {fieldErrors.phone_number}
                      </p>
                    )}
                  </div>

                  {/* Email ID */}
                  <div className="sm:col-span-1">
                    <Label htmlFor="email_id" className="text-xs font-semibold text-foreground">
                      Email ID <span className="text-destructive">*</span>
                    </Label>
                    <Input
                      id="email_id"
                      name="email_id"
                      type="email"
                      value={formData.email_id}
                      onChange={(e) => handleInputChange("email_id", e.target.value)}
                      placeholder="owner@agency.com"
                      disabled={loading}
                      className={cn(
                        "mt-2 h-11 rounded-xl bg-card",
                        fieldErrors.email_id &&
                          "border-destructive focus-visible:ring-destructive",
                      )}
                    />
                    {fieldErrors.email_id && (
                      <p className="mt-1.5 flex items-center gap-1 text-[11px] font-medium text-destructive">
                        <AlertCircle className="size-3 shrink-0" />
                        {fieldErrors.email_id}
                      </p>
                    )}
                  </div>

                  {/* Address (Full Width) */}
                  <div className="sm:col-span-2">
                    <Label htmlFor="address" className="text-xs font-semibold text-foreground">
                      Agency Address <span className="text-destructive">*</span>
                    </Label>
                    <Input
                      id="address"
                      name="address"
                      value={formData.address}
                      onChange={(e) => handleInputChange("address", e.target.value)}
                      placeholder="Shop 12, Main Market Road, Near City Bus Stand"
                      disabled={loading}
                      className={cn(
                        "mt-2 h-11 rounded-xl bg-card",
                        fieldErrors.address &&
                          "border-destructive focus-visible:ring-destructive",
                      )}
                    />
                    {fieldErrors.address && (
                      <p className="mt-1.5 flex items-center gap-1 text-[11px] font-medium text-destructive">
                        <AlertCircle className="size-3 shrink-0" />
                        {fieldErrors.address}
                      </p>
                    )}
                  </div>

                  {/* State */}
                  <div className="sm:col-span-1">
                    <Label htmlFor="state" className="text-xs font-semibold text-foreground">
                      State <span className="text-destructive">*</span>
                    </Label>
                    <Input
                      id="state"
                      name="state"
                      value={formData.state}
                      onChange={(e) => handleInputChange("state", e.target.value)}
                      placeholder="Maharashtra"
                      disabled={loading}
                      className={cn(
                        "mt-2 h-11 rounded-xl bg-card",
                        fieldErrors.state && "border-destructive focus-visible:ring-destructive",
                      )}
                    />
                    {fieldErrors.state && (
                      <p className="mt-1.5 flex items-center gap-1 text-[11px] font-medium text-destructive">
                        <AlertCircle className="size-3 shrink-0" />
                        {fieldErrors.state}
                      </p>
                    )}
                  </div>

                  {/* District */}
                  <div className="sm:col-span-1">
                    <Label htmlFor="district" className="text-xs font-semibold text-foreground">
                      District <span className="text-destructive">*</span>
                    </Label>
                    <Input
                      id="district"
                      name="district"
                      value={formData.district}
                      onChange={(e) => handleInputChange("district", e.target.value)}
                      placeholder="Pune"
                      disabled={loading}
                      className={cn(
                        "mt-2 h-11 rounded-xl bg-card",
                        fieldErrors.district &&
                          "border-destructive focus-visible:ring-destructive",
                      )}
                    />
                    {fieldErrors.district && (
                      <p className="mt-1.5 flex items-center gap-1 text-[11px] font-medium text-destructive">
                        <AlertCircle className="size-3 shrink-0" />
                        {fieldErrors.district}
                      </p>
                    )}
                  </div>

                  {/* PIN Code */}
                  <div className="sm:col-span-1">
                    <Label htmlFor="pin_code" className="text-xs font-semibold text-foreground">
                      PIN Code (6 Digits) <span className="text-destructive">*</span>
                    </Label>
                    <Input
                      id="pin_code"
                      name="pin_code"
                      value={formData.pin_code}
                      onChange={(e) => handleInputChange("pin_code", e.target.value)}
                      placeholder="411001"
                      maxLength={6}
                      disabled={loading}
                      className={cn(
                        "mt-2 h-11 rounded-xl bg-card font-mono text-sm",
                        fieldErrors.pin_code &&
                          "border-destructive focus-visible:ring-destructive",
                      )}
                    />
                    {fieldErrors.pin_code && (
                      <p className="mt-1.5 flex items-center gap-1 text-[11px] font-medium text-destructive">
                        <AlertCircle className="size-3 shrink-0" />
                        {fieldErrors.pin_code}
                      </p>
                    )}
                  </div>

                  {/* Subscription Plan */}
                  <div className="sm:col-span-1">
                    <Label
                      htmlFor="subscription_plan"
                      className="text-xs font-semibold text-foreground"
                    >
                      Subscription Plan
                    </Label>
                    <select
                      id="subscription_plan"
                      name="subscription_plan"
                      value={formData.subscription_plan}
                      onChange={(e) => handleInputChange("subscription_plan", e.target.value)}
                      disabled={loading}
                      className="mt-2 h-11 w-full rounded-xl border border-input bg-card px-3 text-sm text-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:opacity-50"
                    >
                      <option value="3 Months">3 Months</option>
                      <option value="Recommended - 6 Months">⭐ Recommended – 6 Months</option>
                      <option value="12 Months (10% OFF)">12 Months (10% OFF)</option>
                    </select>
                  </div>

                  {/* Terms & Conditions Checkbox */}
                  <div className="sm:col-span-2">
                    <div className="flex items-start gap-3">
                      <Checkbox
                        id="terms_accepted"
                        checked={formData.terms_accepted}
                        onCheckedChange={(checked) =>
                          handleInputChange("terms_accepted", checked === true)
                        }
                        disabled={loading}
                        className={cn(
                          "mt-0.5",
                          fieldErrors.terms_accepted && "border-destructive",
                        )}
                      />
                      <div className="grid gap-1.5 leading-none">
                        <Label
                          htmlFor="terms_accepted"
                          className="text-xs leading-relaxed text-muted-foreground cursor-pointer"
                        >
                          I agree to the{" "}
                          <span className="text-foreground underline underline-offset-2">
                            Terms &amp; Conditions
                          </span>{" "}
                          and{" "}
                          <span className="text-foreground underline underline-offset-2">
                            Privacy Policy
                          </span>
                          .
                        </Label>
                        {fieldErrors.terms_accepted && (
                          <p className="flex items-center gap-1 text-[11px] font-medium text-destructive">
                            <AlertCircle className="size-3 shrink-0" />
                            {fieldErrors.terms_accepted}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Submit Button */}
                  <Button
                    type="submit"
                    variant="brand"
                    size="xl"
                    disabled={!formData.terms_accepted || loading}
                    className="w-full sm:col-span-2"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                        Registering Agency...
                      </>
                    ) : (
                      "Register Agency"
                    )}
                  </Button>

                  <Button
                    type="button"
                    variant="soft"
                    size="xl"
                    className="w-full sm:col-span-2"
                    onClick={() => {
                      const element = document.getElementById("register");
                      if (element) {
                        element.scrollIntoView({ behavior: "smooth" });
                      }
                      const firstInput = document.getElementById("agency_name");
                      if (firstInput) {
                        firstInput.focus();
                      }
                    }}
                  >
                    Book Free Demo
                  </Button>
                </form>
              )}
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
