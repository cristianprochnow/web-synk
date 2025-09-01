import { Outlet } from "react-router";

export function Index() {
    return (
        <>
            <div>Index</div>

            <Outlet />
        </>
    );
}