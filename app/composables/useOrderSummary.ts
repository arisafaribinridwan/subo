export type OrderPortion = '1 Porsi' | '1/2 Porsi'
export type OrderFilling = 'Lengkap' | 'Kostum'
export type OrderTopping = 'Kecap' | 'Kacang' | 'Bawang Goreng' | 'Daun Bawang'
export type SateKey = 'usus' | 'ati' | 'ampela' | 'puyuh'

export interface OrderSummary {
  customerName: string
  portion: OrderPortion
  filling: OrderFilling
  omittedToppings: OrderTopping[]
  crackersSeparated: boolean
  sambalLevel: number
  sate: Record<SateKey, number>
}

export function useOrderSummary() {
  return useState<OrderSummary | null>('order-summary', () => null)
}
