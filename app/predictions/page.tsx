import { predictionMarkets } from "@/data/predictionMarkets"
import { PredictionHubContent } from "@/components/predictions/PredictionHubContent"

export default function PredictionsPage() {
  return <PredictionHubContent markets={predictionMarkets} />
}
