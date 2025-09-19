import { Blocks, LayoutTemplate, Plus } from 'lucide-react'
import { useEffect, useState } from 'react'
import '../../styles/screens/posts/list.css'

type PostItem = {
    post_id: number,
    post_name: string,
    template: string,
    int_profile: string,
    created_at: string,
    status: string
}

export function List() {
    const [posts, setPosts] = useState<PostItem[]>([])

    useEffect(() => {
        setPosts([
            {
                post_id: 1,
                post_name: 'Post do LinkedIn top demais',
                template: 'templateC',
                int_profile: 'ProfileY',
                created_at: '14/03/2025 10:30:15',
                status: 'published'
            },
            {
                post_id: 2,
                post_name: 'Post do LinkedIn',
                template: 'templateA',
                int_profile: 'ProfileX',
                created_at: '29/11/2024 22:51:03',
                status: 'draft'
            }
        ])
    }, [])

    return (
        <div id="screen-post-list">
            <header>
                <h1>Publicações</h1>

                <button type="button">
                    <Plus />

                    <span>Nova publicação</span>
                </button>
            </header>

            <div className='post-list-container'>
                {posts.map(post => (
                    <div className='post-item'>
                        <span className='post-item-name'>{post.post_name}</span>
                        <span className='post-item-status'>{post.status}</span>

                        <div className='post-item-info'>
                            <div className='info-title'>
                                <LayoutTemplate />
                                <span>Template</span>
                            </div>

                            <span className='info-description'>{post.template}</span>
                        </div>

                        <div className='post-item-info'>
                            <div className='info-title'>
                                <Blocks />
                                <span>Perfil</span>
                            </div>

                            <span className="info-description">{post.int_profile}</span>
                        </div>

                        <span className='post-item-created-at'>Criado em {post.created_at}</span>
                    </div>
                ))}
            </div>
        </div>
    )
}