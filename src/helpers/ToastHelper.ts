
import { ToastActionElement } from "@/components/ui/toast";
import { toast } from "@/hooks/use-toast";
import { ToastProps } from "@radix-ui/react-toast";

type ToastVariant = "default" | "destructive" | "success" | "info"

type ToasterToast = ToastProps & {
  id: string
  title?: React.ReactNode
  variant?: string
  description?: React.ReactNode
  action?: ToastActionElement
}

type Toast = Omit<ToasterToast, "id">

export class ToastHelper {
  static success(title: string, description?: string) {
    toast({
      title,
      description,
      variant: "success",
    })
  }

  static info(title: string, description?: string) {
    toast({
      title,
      description,
      variant: "info",
    })
  }

  static warning(title: string, description?: string) {
    toast({
      title,
      description,
      variant: "default",
    })
  }

  static error(defaultMessage: string = "Ocorreu um erro. Tente novamente.", error: unknown) {
    const message = this.getErrorMessage(error, defaultMessage)
    const variant = this.getErrorVariant(error)

    toast({
      title: this.getErrorTitle(variant),
      description: message,
      variant,
    })
  }

  private static getErrorMessage(error: unknown, defaultMessage: string): string {
    if (typeof error === "object" && error !== null) {
      return (error as any).response?.data?.message || defaultMessage
    }
    if (typeof error === "string") return error
    if (error instanceof Error) return error.message
    return defaultMessage
  }

  private static getErrorVariant(error: any): ToastVariant {
    if (!error?.response?.status) return "destructive"
    const status = error.response.status
    return status >= 400 ? "destructive" : "default"
  }

  private static getErrorTitle(variant: ToastVariant): string {
    return variant === "destructive" ? "Erro" : "Aviso"
  }
}
