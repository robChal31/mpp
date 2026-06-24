// types/event/event.types.ts

import { LucideIcon } from "lucide-react";

// types/event/event.types.ts
export interface EventI {
  id_event: string
  title: string
  title_url: string
  event_code: string
  event_group: string
  category: string
  subject: string
  description: string
  photoevent: string
  date_start: string
  date_end: string
  date_start_formatted?: string
  date_end_formatted?: string
  time_start: string
  time_end: string
  timezone: string
  location_place?: string
  location_address?: string
  location_detail?: string
  city?: string
  province?: string
  lat?: string
  lng?: string
  organizer: string
  lowest_price: string
  benefit_type: string
  mpp_list?: string
  order_link?: string
  sales_active: string
  is_completed_ticket: string
  is_completed_info: string
  is_completed_guest: string
  is_completed_promo: string
  is_publish: string
  is_hidden: string
  is_stream: string
  is_request_royalti: string
  is_eduhub: string
}

// Ini type yang sesuai dengan response API lo
export interface EventsApiResponse {
  total_data: number;      // Total semua data (29)
  total_pages: number;     // Total halaman (3)
  current_page: number;    // Halaman saat ini (1)
  limit: number;          // Limit per page (10)
  events: EventI[];       // Array events-nya (bukan "data")
}

// Atau bikin generic version kalo mau reusable
export interface ApiPaginatedResponse<T> {
  total_data: number;
  total_pages: number;
  current_page: number;
  limit: number;
  data: T[];  // Ini bisa diganti nama sesuai API
}

export type EventCategory = 'competition' | 'festival' | 'workshop' | 'certification' | 'conference'

export interface EventTypeConfig {
  type: EventCategory
  label: string
  icon: LucideIcon
  color: string
  bgColor: string
  borderColor?: string
  description?: string
}