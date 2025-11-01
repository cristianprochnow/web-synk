import { useEffect } from 'react';
import { useNavigate } from 'react-router';

export function Dashboard() {
  const navigate = useNavigate();

  useEffect(() => {
    navigate('/posts', {
      replace: true
    });
  }, []);

  return (
    <div>Dashboard</div>
  )
}