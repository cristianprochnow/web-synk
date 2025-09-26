import { Blocks, LayoutTemplate, Plus } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router'
import { toast } from 'react-toastify'
import { ActionButton } from '../../components/ActionButton'
import { PageTitle } from '../../components/PageTitle'
import '../../styles/screens/posts/list.css'

type PostItem = {
    post_id: number,
    post_name: string,
    template_name: string,
    int_profile_name: string,
    created_at: string,
    status: string
}

type FetchPostListResponse = {
    resource: {
        ok: boolean
        error: string
    }
    posts: PostItem[]
}

export function List() {
    const [posts, setPosts] = useState<PostItem[]>([])
    const [isLoading, setLoading] = useState(false)
    const navigate = useNavigate()

    useEffect(() => {
        loadCards()
    }, [])

    async function loadCards() {
        const url = import.meta.env.VITE_GATEWAY_ENDPOINT

        setLoading(true)

        const response = await fetch(url + '/post')
        const data = await response.json() as FetchPostListResponse

        if (!data.resource.ok) {
            toast.error(data.resource.error)
        }

        if (data.posts.length === 0) {
            toast.info('Nenhum post encontrado :(')
        }

        setPosts(data.posts)
        setLoading(false)
    }

    function goToAdd() {
        navigate('/posts/add')
    }

    return (
        <div id="screen-post-list">
            <header>
                <PageTitle>Publicações</PageTitle>

                <ActionButton label="Nova publicação" Icon={Plus} onClick={goToAdd} />
            </header>

            <div className={`loader ${!isLoading ? 'hidden' : ''}`}></div>

            <div className='post-list-container'>
                {posts.map((post, index) => (
                    <div className='post-item' key={index}>
                        <span className='post-item-name'>{post.post_name}</span>
                        <span className='post-item-status'>{post.status}</span>

                        <div className='post-item-info'>
                            <div className='info-title'>
                                <LayoutTemplate />
                                <span>Template</span>
                            </div>

                            <span className='info-description'>{post.template_name}</span>
                        </div>

                        <div className='post-item-info'>
                            <div className='info-title'>
                                <Blocks />
                                <span>Perfil</span>
                            </div>

                            <span className="info-description">{post.int_profile_name}</span>
                        </div>

                        <span className='post-item-created-at'>Criado em {post.created_at}</span>
                    </div>
                ))}
            </div>
        </div>
    )
}