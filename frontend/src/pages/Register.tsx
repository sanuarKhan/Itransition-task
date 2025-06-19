import { useMutation } from "@tanstack/react-query";
import { registerApi } from "../services/api/index";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { registerSchema } from "../schemas/user";
import { useNavigate } from "react-router-dom";

import type { z } from "zod";

type RegisterFormData = z.infer<typeof registerSchema>;

export default function Register() {
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  });

  const mutation = useMutation({
    mutationFn: registerApi,
    onSuccess: () => {
      navigate("/login");
    },
    onError: (err) => {
      console.error(err);
    },
  });

  const onSubmit = (data: RegisterFormData) => mutation.mutate(data);

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <input {...register("name")} placeholder="Name" />
      <p>{errors.name?.message}</p>

      <input {...register("email")} placeholder="Email" />
      <p>{errors.email?.message}</p>

      <input type="password" {...register("pass")} placeholder="Password" />
      <p>{errors.pass?.message}</p>

      <button type="submit" disabled={mutation.isPending}>
        Register
      </button>
    </form>
  );
}
