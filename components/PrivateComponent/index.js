
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';

export const PrivateComponent = ({ children }) => {
  const { data: session, loading } = useSession();
  const router = useRouter();

  if (!session && !loading) {
    const redirect = router.query?.redirect || '/';
    router.push(redirect);
    return null;
  }

  if (typeof window !== 'undefined' && loading) return null;

  if (!session) {
    return <p>Você não está autenticado</p>;
  }

  return children;
};