import type { Notification } from "./type";

//
export function select_exchange_message({ exchange_message }: Notification) {
  if (!exchange_message) return null;
  if (!exchange_message.message) return null;
  if (!exchange_message.exchange) return null;
  if (!exchange_message.exchange.id) return null;

  return {
    exchange_id: exchange_message.exchange.id,
    exchange: exchange_message.exchange,
    message: exchange_message.message,
  };
}
