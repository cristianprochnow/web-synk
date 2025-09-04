import { Bell, Blocks, Inbox, LayoutTemplate, Workflow } from "lucide-react"
import { Link, Outlet } from "react-router"
import '../styles/screens/index.css'

export function Index() {
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
                    <Link to="/templates" className="menu-item active">
                        <div className="icon-container">
                            <span className="icon">
                                <LayoutTemplate />
                            </span>
                            <span className="description">Templates</span>
                        </div>
                        <span className="label">Templates</span>
                    </Link>
                    <Link to="/templates" className="menu-item">
                        <div className="icon-container">
                            <span className="icon">
                                <Workflow />
                            </span>
                            <span className="description">Integrações</span>
                        </div>
                        <span className="label">Integrações</span>
                    </Link>
                    <Link to="/templates" className="menu-item">
                        <div className="icon-container">
                            <span className="icon">
                                <Blocks />
                            </span>
                            <span className="description">Perfis</span>
                        </div>
                        <span className="label">Perfis</span>
                    </Link>
                    <Link to="/templates" className="menu-item">
                        <div className="icon-container">
                            <span className="icon">
                                <Inbox />
                            </span>
                            <span className="description">Publicações</span>
                        </div>
                        <span className="label">Publicações</span>
                    </Link>
                </nav>
            </footer>
        </div>
    )
}