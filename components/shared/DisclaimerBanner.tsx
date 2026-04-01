import { Separator } from "@/components/ui/separator"

export function DisclaimerBanner() {
  return (
    <div className="mt-10 mb-2">
      <Separator className="mb-5" />
      <p className="text-center text-[11px] text-muted-foreground/70 leading-relaxed max-w-xs mx-auto">
        Onramp is for learning only. Nothing here is financial advice.
      </p>
    </div>
  )
}
