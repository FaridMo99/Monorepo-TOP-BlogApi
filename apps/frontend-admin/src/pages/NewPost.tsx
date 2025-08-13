import { useMutation } from "@tanstack/react-query"
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
  Textarea,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Switch
} from "@monorepotopblogapi/ui";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { blogPostSchema } from "@monorepotopblogapi/schemas";

async function createPost(formData) {
}

function NewPost() {
    const form = useForm({
      resolver: zodResolver(blogPostSchema),
      defaultValues: {
        layout: "STANDARD",
        isPublic:false
      }
  });
  const { mutate, isError, isPending, error, isSuccess } = useMutation({
    mutationKey: ["create post"],
    mutationFn: createPost,
  });

  function submitHandler(formData) {
    mutate(formData, {
      onSuccess: () => {
        form.reset()
      },
    });
  }

  return (
    <section className="w-full ">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(submitHandler)}
          className="flex flex-col items-center justify-between w-full"
        >
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-primary dark:text-white">
                  Title
                </FormLabel>
                <FormControl>
                  <Input className="text-black dark:text-white" type="text" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="text"
            render={({ field }) => (
              <FormItem className="my-20">
                <FormLabel className="text-primary dark:text-white">
                  Text
                </FormLabel>
                <FormControl>
                  <Textarea {...field} className="h-40 overflow-scroll " />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="flex justify-evenly items-center w-full mb-20">
            <FormField
              control={form.control}
              name="layout"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-primary dark:text-white">
                    Layout
                  </FormLabel>
                  <FormControl>
                    <Select {...field}>
                      <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Layout" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="STANDARD">Standard</SelectItem>
                        <SelectItem value="FEATURED">Featured</SelectItem>
                        <SelectItem value="GALLERY">Gallery</SelectItem>
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="isPublic"
              render={({ field }) => (
                <FormItem className="flex flex-col items-end justify-end">
                  <FormLabel className="text-primary dark:text-white">
                    Public
                  </FormLabel>
                  <FormControl>
                    <Switch
                      checked={field.value === true}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <Button disabled={isPending || isSuccess} type="submit">
            {isPending && <Loader2 className="animate-spin" />}
            {isSuccess && (
              <Check
                className="text-green-500 animate-bounce"
                strokeWidth={3}
              />
            )}
            {!isPending && !isSuccess && "Post"}
          </Button>
          {isError && <p className="text-red-500">{error.message}</p>}
        </form>
      </Form>
    </section>
  );
}

export default NewPost
//changing layout doesnt work