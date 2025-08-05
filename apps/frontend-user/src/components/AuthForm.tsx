import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Button,
  Form,
  Input,
  Loader2,
  Check,
} from "@monorepotopblogapi/ui";
import { useForm, type FieldValues, type Path } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { type AuthFunctionReturn } from "@/lib/authentication";
import type { ZodType } from "zod";

type AuthFormProps<T extends FieldValues> = {
  mutationFn: (formData: T) => AuthFunctionReturn;
  mutationKeys: string[];
  fields: { name: Path<T>; label: string; type?: string }[];
  link: {
    linkText: string;
    linkPath: `/${string}`;
  };
  resolverSchema: ZodType<T, T>;
};

function AuthForm<T extends FieldValues>({
  mutationFn,
  mutationKeys,
  fields,
  link,
  resolverSchema,
}: AuthFormProps<T>) {
  const form = useForm<T>({
    resolver: zodResolver(resolverSchema),
  });
  const navigate = useNavigate();
  const { mutate, isError, isPending, error, isSuccess } = useMutation({
    mutationKey: [...mutationKeys],
    mutationFn: mutationFn,
  });

  function submitHandler(formData: T) {
    mutate(formData, {
      onSuccess: () => {
        form.reset();
        setTimeout(() => {
          navigate("/", { replace: true });
        }, 300);
      },
    });
  }

  return (
    <main className="w-screen h-screen flex flex-col justify-center items-center bg-primary">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(submitHandler)}
          className="flex flex-col items-center justify-evenly w-1/2 h-2/3 bg-primary-foreground rounded-lg text-white px-10 border border-primary-foreground/150 dark:border-black"
        >
          {fields.map((singleField) => (
            <FormField
              key={singleField.name}
              control={form.control}
              name={singleField.name}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{singleField.label}</FormLabel>
                  <FormControl>
                    <Input
                      type={singleField.type ? singleField.type : "text"}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          ))}
          <Button disabled={isPending || isSuccess} type="submit">
            {isPending && <Loader2 className="animate-spin" />}
            {isSuccess && (
              <Check
                className="text-green-500 animate-bounce"
                strokeWidth={3}
              />
            )}
            {!isPending && !isSuccess && "Submit"}
          </Button>
          {isError && <p className="text-red-500">{error.message}</p>}
        </form>
      </Form>
      <Link to={link.linkPath} className="text-blue-500 mt-4 hover:underline">
        {link.linkText}
      </Link>
    </main>
  );
}

export default AuthForm;
