import { Bell } from "lucide-react"
import { Outlet } from "react-router"
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

            <footer className="wrapper"></footer>
        </div>
    )
}