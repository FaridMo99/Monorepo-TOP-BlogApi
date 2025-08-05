import { signupSchema } from "@monorepotopblogapi/schemas";
import { signup } from "@/lib/authentication";
import AuthForm from "@/components/AuthForm";

function Signup() {
  return (
    <main className="w-screen h-screen flex flex-col justify-center items-center bg-primary">
      <AuthForm
        mutationFn={signup}
        mutationKeys={["signup user"]}
        fields={[
          { name: "username", label: "Username" },
          { name: "email", label: "E-Mail" },
          { name: "password", label: "Password" },
        ]}
        link={{
          linkPath: "/login",
          linkText: "Already have a account? Log In.",
        }}
        resolverSchema={signupSchema}
      />
    </main>
  );
}

export default Signup;
