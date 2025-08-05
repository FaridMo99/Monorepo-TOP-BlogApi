import { loginSchema } from "@monorepotopblogapi/schemas";
import { login } from "@/lib/authentication";
import AuthForm from "@/components/AuthForm";

function Login() {
  return (
    <main className="w-screen h-screen flex flex-col justify-center items-center bg-primary">
      <AuthForm
        mutationFn={login}
        mutationKeys={["login user"]}
        fields={[
          { name: "username", label: "Username" },
          { name: "password", label: "Password" },
        ]}
        link={{
          linkPath: "/signup",
          linkText: "Dont have a Account? Sign Up.",
        }}
        resolverSchema={loginSchema}
      />
    </main>
  );
}

export default Login;
