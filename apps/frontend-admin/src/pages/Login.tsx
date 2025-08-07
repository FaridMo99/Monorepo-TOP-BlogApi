import { loginSchema } from "@monorepotopblogapi/schemas";
import AuthForm from "@monorepotopblogapi/ui/components/AuthForm";

//fix this later so this component is the login component from users
//exported from packages
async function login(formData) {
  const res = await fetch("", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(formData),
  })
}

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
