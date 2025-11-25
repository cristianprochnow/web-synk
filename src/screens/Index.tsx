import { Blocks, Inbox, LayoutTemplate, Workflow } from 'lucide-react'
import { useCallback } from 'react'
import { Outlet, useLocation, useNavigate } from 'react-router'
import { toast } from 'react-toastify'
import { logout } from '../api/users'
import { MenuItem } from '../components/MenuItem'
import { useAuth } from '../contexts/Auth'
import '../styles/screens/index.css'

export function Index() {
    const navigate = useNavigate();
    const auth = useAuth();

    const location = useLocation();
    const getPaths = useCallback(() => {
        return location.pathname.split('/').map(path => path.trim())
    }, [location]);
    const checkActiveRoute = useCallback((route: string) => {
        const paths = getPaths()

        return paths.includes(route)
    }, [getPaths])

    const onHandleLogout = useCallback(async () => {
      if (!confirm('Tem certeza que deseja realizar o logout?')) return;

      const data = await logout();

      if (!data.resource.ok) {
        toast.error('Erro no logout: ' + data.resource.error);

        return;
      }

      auth.logOut();

      toast.success('Logout realizado com sucesso! Redirecionando...');

      setTimeout(() => {
        navigate('/');
      }, 1000);
    }, []);

    return (
        <div id="screen-index">
            <header className="wrapper">
                <img src="../src/assets/synk-white.svg" alt="Synk's branding" />

                <aside>
                    <span className="greetings">Olá, {auth.user?.name}! 👋</span>
                    <span className="avatar" onClick={onHandleLogout}>
                        <img src="/synk.svg" alt="User Avatar" />
                    </span>
                </aside>
            </header>

            <main className="wrapper">
                <Outlet />
            </main>

            <footer>
                <nav>
                  <MenuItem label="Publicações"
                      Icon={Inbox}
                      isActive={checkActiveRoute('posts')}
                      to="/posts" />
                  <MenuItem label="Templates"
                      Icon={LayoutTemplate}
                      isActive={checkActiveRoute('templates')}
                      to="/templates" />
                  <MenuItem label="Integrações"
                      Icon={Workflow}
                      isActive={checkActiveRoute('integrations')}
                      to="/integrations" />
                  <MenuItem label="Perfis"
                      Icon={Blocks}
                      isActive={checkActiveRoute('configs')}
                      to="/configs" />
                </nav>
            </footer>
        </div>
    )
}