export interface FlattenedBenefit {
  id_benefit_list: string
  benefit_name: string
  subbenefit: string
  description: string
  qty: string
  qty2: string
  qty3: string
  pelaksanaan: string
  type: string
  redeemable: string
  keterangan: string
  packageId: string
  pk: PK
  subject_benefit: string
  subbenefit_group: string
  countable: number
  active_quota: ActiveQuota
}

export interface BenefitReportDataI {
  id_benefit_list: string
  benefit_name: string
  qty: string
  qty2: string
  qty3: string
  type: string
  packageId: string
  pk: PK
  subject_benefit: string
  subbenefit_group: string
  active_qty: number
  active_year: number
}

export interface PK {
  id: string
  benefit_id: string
  no_pk: string
  start_at: string
  expired_at: string
  program?: string
}

export interface BenefitGroup {
  benefit_id: string
  benefit_detail: BenefitDetailI[]
  related_pks: PK[]
}

export interface BenefitGroupV2 {
  benefit_id: string
  benefit_detail: FlattenedBenefit[]
  related_pks: PK[]
}

export interface EventByRedeemCodeI {
  date_start: string
  email: string
  event_name: string
  fullname: string
  phone: string
}

export interface QuotaPerYear {
  total: number;
  used: number;
  remaining: number;
}

export interface BenefitQuota {
  year1: QuotaPerYear;
  year2: QuotaPerYear;
  year3: QuotaPerYear;
}

export interface BenefitItem {
  id: string;
  id_draft: string;
  name: string;
  subbenefit: string;
  description: string;
  type: string;
  redeemable: boolean;
  quota: BenefitQuota;
  active_quota: ActiveQuota;
  countable: number;
}

export interface PKInfo {
  id: string;
  benefit_id: string;
  no_pk: string;
  start_at: string;
  expired_at: string;
  is_expired: boolean;
}

export interface SubbenefitInfo {
  id: string;
  group: string;
  name: string;
  benefit_name: string;
}

export interface UserInfo {
  id: string;
  name: string;
  email: string;
  institution_id: string;
}

export interface BenefitDetailItem {
  benefit: BenefitItem;
  pk: PKInfo;
  subbenefit_info: SubbenefitInfo;
}

export interface CheckBenefitByEventGroupResponse {
  hasBenefit: boolean;
  total_benefits?: number;
  user?: UserInfo;
  benefits?: BenefitDetailItem[];
  message?: string;
}

// Untuk service function
export type CheckBenefitByEventGroupResult = CheckBenefitByEventGroupResponse | null;

// types/benefit/benefit.type.ts

export interface UserBenefit {
  id: string;
  name: string;
  email: string;
  institution_id: string;
}

export interface QuotaYear {
  total: number;
  used: number;
  remaining: number;
}

export interface BenefitQuota {
  year1: QuotaYear;
  year2: QuotaYear;
  year3: QuotaYear;
}

export interface ActiveQuota {
  year: number;
  total: number;
  used: number;
  available: number;
  is_expired: boolean;
}

export interface BenefitDetailI {
  id_benefit_list: string;
  id_draft: string;
  id_template: string;
  benefit_name: string;
  subbenefit: string;
  description: string;
  keterangan: string;
  pelaksanaan: string;
  type: string;
  redeemable: string;
  subbenefit_group: string;
  subject_benefit: string;
  quota: BenefitQuota;
  active_quota: ActiveQuota;
  event_group_code: string;
  countable: number
}

export interface PKData {
  id: string;
  benefit_id: string;
  no_pk: string;
  start_at: string;
  expired_at: string;
  program?: string;
  active_quota: ActiveQuota
}

export interface UsageHistory {
  id: string;
  id_benefit_list: string;
  description: string;
  qty1: number;
  qty2: number;
  qty3: number;
  used_at: string;
  redeem_code: string;
  status: string;
  created_at: string;
  updated_at: string;
  event?: EventByRedeemCodeI | null

}

export interface GetBenefitByIdResponse {
  user: UserBenefit;
  benefit: BenefitDetailI;
  pk: PKData;
  usages: UsageHistory[];
}

// Untuk response API wrapper
export interface ApiResponse<T> {
  status: 'success' | 'error';
  message: string;
  data: T;
}

export interface ClaimBenefitParams {
  benefit_id: string
  benefit_draft_id: string
  pk_id: string
  event_id: string
  event_title: string
  qty: number
  year: number
  description: string
  email: string  // tambahin email
}

export interface ClaimBenefitResult {
  redeem_code: string
  success: boolean
}

export interface ReclaimBenefitParams {
  history_id: string
  old_event_id: string
  new_event_id: string
  qty: number
  benefit_id: string
  benefit_draft_id: string
  pk_id: string
  email: string
  usedQty: number
}

export interface ReclaimBenefitResult {
  message: string
  status: string
  data: any
}

// src/types/benefit/benefit.type.ts
export interface PKDocument {
  id: string
  name: string
  program_category: string
  pk: {
    no_pk: string
    id_draft: string
    start_at: string
    expired_at: string
    status: 'active' | 'expired'
  }
  pic: {
    name: string
    position: string
    email: string
    phone: string
  }
}
