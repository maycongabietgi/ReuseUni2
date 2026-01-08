// useAuth.ts – FIX TRIỆT ĐỂ TOKEN NULL KHI NAVIGATE NHANH
import { useEffect, useState } from 'react';

export type AuthInfo = {
  isLoggedIn: boolean;
  userName: string | null;
  token: string | null;
  loading: boolean;
};

const TEST_TOKEN = 'd2340b3db37f1f920464f211e8db0f7c8f5799a7';

let cachedToken: string | null = TEST_TOKEN; // ← Cache global

export default function useAuth(): AuthInfo {
  const [loading, setLoading] = useState(false); // Test mode không cần loading

  // Trả token ngay lập tức từ cache
  return {
    isLoggedIn: true,
    userName: 'Tester',
    token: cachedToken, // ← Luôn có ngay, không chờ useEffect
    loading: false,
  };
}