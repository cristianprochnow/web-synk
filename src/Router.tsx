import { Route, Routes } from 'react-router'
import { Dashboard } from './screens/Dashboard'
import { Index } from './screens/Index'
import { NotFound } from './screens/NotFound'
import { Add as PostAdd } from './screens/Posts/Add'
import { Edit as PostEdit } from './screens/Posts/Edit'
import { List as PostList } from './screens/Posts/List'
import { Add as TemplateAdd } from './screens/Templates/Add'
import { Edit as TemplateEdit } from './screens/Templates/Edit'
import { List as TemplateList } from './screens/Templates/List'

export function Router() {
    return (
        <Routes>
            <Route path="/" errorElement={<NotFound />} element={<Index />}>
                <Route index element={<Dashboard />} />
                <Route path="templates">
                    <Route index element={<TemplateList />} />
                    <Route path="add" element={<TemplateAdd />} />
                    <Route path="edit/:template_id" element={<TemplateEdit />} />
                </Route>
                <Route path="posts">
                    <Route index element={<PostList />} />
                    <Route path="add" element={<PostAdd />} />
                    <Route path="edit/:post_id" element={<PostEdit />} />
                </Route>
                <Route path="*" element={<NotFound />} />
            </Route>
        </Routes>
    )
}