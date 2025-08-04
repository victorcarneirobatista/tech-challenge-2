"use client"

import WidgetMetaEconomia from "./WidgetMetaEconomia"
import WidgetAlertaGastos from "./WidgetAlertaGastos"

export default function DashboardWidgets() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <WidgetMetaEconomia />
      <WidgetAlertaGastos />
    </div>
  )
}
