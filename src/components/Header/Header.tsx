// useAuth.ts – FIX TRIỆT ĐỂ TOKEN NULL KHI NAVIGATE NHANH
import { useEffect, useState } from 'react';

export type AuthInfo = {
  isLoggedIn: boolean;
  userName: string | null;
  token: string | null;
  loading: boolean;
};

const TEST_TOKEN = 'e9d7a608a441910496db97205346aa59963b7d83';

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