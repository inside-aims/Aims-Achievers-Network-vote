import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { PaymentMetadata } from "./types";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}


export function getProviderFromMsisdn(msisdn: string): 'mtn' | 'atl' | 'vod' | null {
  const sanitized = msisdn.replace(/^(\+233|233|0)/, '0'); // Normalize to local format (e.g., 055)
  const prefix = sanitized.substring(0, 3);

  const providerMap: Record<string, 'mtn' | 'atl' | 'vod'> = {
    '024': 'mtn',
    '025': 'mtn',
    '054': 'mtn',
    '055': 'mtn',
    '059': 'mtn',
    '027': 'atl',
    '057': 'atl',
    '020': 'vod',
    '026': 'vod',
    '050': 'vod',
  };

  return providerMap[prefix] ?? null;
}


export function mapNetworkToProvider(network: string): 'mtn' | 'atl' | 'vod' | null {
  const normalized = network.trim().toUpperCase();

  const providerMap: Record<string, 'mtn' | 'atl' | 'vod'> = {
    'MTN': 'mtn',
    'AIRTELTIGO': 'atl',
    'AIRTEL': 'atl', // In case it comes this way
    'TIGO': 'atl',   // Legacy support
    'VODAFONE': 'vod',
  };

  return providerMap[normalized] ?? null;
}

export function normalizeMsisdn(msisdn: string): string {
  const sanitized = msisdn.replace(/^(\+233|233|0)/, '0'); // Normalize to local format (e.g., 055)
  return sanitized.trim();
}

// 2. Helper function to extract fields
export function getMetadataFields(metadata: PaymentMetadata) {
  const fields: Record<string, string | number> = {};

  metadata.custom_fields?.forEach((field) => {
    fields[field.variable_name] = field.value;
  });

  return {
    nomineeId: fields.nominee_id as string | undefined,
    votesAmount: fields.votes_amount as number | undefined,
    phoneNumber: fields.phone_number as string | undefined,
    nomineeName: fields.nominee_name as string | undefined,
    // Add other fields here if needed
  };
}
