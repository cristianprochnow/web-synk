import { Route, Routes } from 'react-router'
import { Dashboard } from './screens/Dashboard'
import { Index } from './screens/Index'
import { NotFound } from './screens/NotFound'
import { Add as PostAdd } from './screens/Posts/Add'
import { List as PostList } from './screens/Posts/List'
import { Templates } from './screens/Templates'

export function Router() {
    return (
        <Routes>
            <Route path="/" errorElement={<NotFound />} element={<Index />}>
                <Route index element={<Dashboard />} />
                <Route path="templates">
                    <Route index element={<Templates />} />
                </Route>
                <Route path="posts">
                    <Route index element={<PostList />} />
                    <Route path="add" element={<PostAdd />} />
                </Route>
                <Route path="*" element={<NotFound />} />
            </Route>
        </Routes>
    )
}