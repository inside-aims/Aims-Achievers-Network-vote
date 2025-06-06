import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

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
