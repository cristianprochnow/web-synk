import { Bell, Blocks, Inbox, LayoutTemplate, Workflow } from 'lucide-react'
import { useCallback } from 'react'
import { Outlet, useLocation } from 'react-router'
import { MenuItem } from '../components/MenuItem'
import '../styles/screens/index.css'

export function Index() {
    const location = useLocation();
    const getPaths = useCallback(() => {
        return location.pathname.split('/').map(path => path.trim())
    }, [location]);
    const checkActiveRoute = useCallback((route: string) => {
        const paths = getPaths()

        return paths.includes(route)
    }, [getPaths])

    return (
        <div id="screen-index">
            <header className="wrapper">
                <img src="../src/assets/synk-white.svg" alt="Synk's branding" />

                <aside>
                    <span className="greetings">Boa noite, Cristian!</span>
                    <span className="notification">
                        <Bell />
                    </span>
                    <span className="avatar">
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