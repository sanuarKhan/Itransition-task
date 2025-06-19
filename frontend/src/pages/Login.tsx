import { useMutation } from "@tanstack/react-query";
import { loginApi } from "../services/api/index";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema } from "../schemas/user";
import { useNavigate } from "react-router-dom";

import type { z } from "zod";

type LoginFormData = z.infer<typeof loginSchema>;
export default function Login() {
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const mutation = useMutation({
    mutationFn: loginApi,
    onSuccess: () => {
      navigate("/");
    },
    onError: (err) => {
      console.error(err);
    },
  });

  const onSubmit = (data: LoginFormData) => mutation.mutate(data);

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <input {...register("email")} placeholder="Email" />
      <p>{errors.email?.message}</p>

      <input type="password" {...register("pass")} placeholder="Password" />
      <p>{errors.pass?.message}</p>

      <button type="submit" disabled={mutation.isPending}>
        Login
      </button>
    </form>
  );
}
