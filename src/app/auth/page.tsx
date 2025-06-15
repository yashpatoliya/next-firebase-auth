import AuthForm from "@/components/auth/auth-form";

export default function AuthPage() {
  return (
    <div className="flex flex-col items-center justify-center py-12 min-h-[calc(100vh-10rem)]">
      <AuthForm />
    </div>
  );
}
