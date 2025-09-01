import { Route, Routes } from "react-router";
import { Dashboard } from "./screens/Dashboard";
import { Index } from "./screens/Index";
import { NotFound } from "./screens/NotFound";
import { Templates } from "./screens/Templates";

export function Router() {
    return (
        <Routes>
            <Route path="/" errorElement={<NotFound />} element={<Index />}>
                <Route index element={<Dashboard />} />
                <Route path="templates" element={<Templates />} />
                <Route path="*" element={<NotFound />} />
            </Route>
        </Routes>
    )
}