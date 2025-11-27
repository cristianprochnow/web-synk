import { Blocks, LayoutTemplate, Plus } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router';
import { toast } from 'react-toastify';
import { hasPosts, listPosts, type FetchPostListResponse, type PostItem } from '../../api/post.ts';
import { ActionButton } from '../../components/ActionButton';
import { PageTitle } from '../../components/PageTitle';
import { useAuth } from '../../contexts/Auth.tsx';
import '../../styles/screens/posts/list.css';

export function List() {
  const navigate = useNavigate();
  const auth = useAuth();

  const [posts, setPosts] = useState<PostItem[]>([]);
  const [isEmpty, setIsEmpty] = useState(false);
  const [isLoading, setLoading] = useState(false);

  useEffect(() => {
    loadCards();
  }, []);

  async function loadCards() {
    setLoading(true);

    const data = await auth.request(async (token) => {
      return await listPosts(null, token);
    }) as FetchPostListResponse;
    const hasData = hasPosts(data);

    if (!data.resource.ok) {
      toast.error(data.resource.error);
    }

    if (!hasData) {
      toast.info('Nenhum post encontrado :(');
    }

    setPosts(hasData ? data.posts : []);
    setIsEmpty(!hasData);
    setLoading(false);
  }

  function goToAdd() {
    navigate('/posts/add');
  }

  return (
    <div id="screen-post-list">
      <header>
        <PageTitle>Publicações</PageTitle>

        <ActionButton label="Nova publicação" Icon={Plus} onClick={goToAdd}/>
      </header>

      <div className={`loader ${!isLoading ? 'hidden' : ''}`}></div>
      <div className={`empty ${isLoading || !isEmpty ? 'hidden' : ''}`}>
        <div className="empty-avatar">
          <img src="/empty.svg" alt="Nenhum resultado encontrado!"/>
        </div>

        <p>
          Ooops... Nenhum resultado encontrado. Que tal começar <Link
          to="/posts/add">criando um novo?</Link>
        </p>
      </div>

      <div className="post-list-container">
        {posts.map((post, index) => (
          <div className="post-item" key={index}>
            <Link to={`/posts/edit/${post.post_id}`} className="post-item-name">{post.post_name}</Link>
            <span className="post-item-status">{post.status}</span>

            <div className="post-item-info">
              <div className="info-title">
                <LayoutTemplate/>
                <span>Template</span>
              </div>

              <span className="info-description">{post.template_name}</span>
            </div>

            <div className="post-item-info">
              <div className="info-title">
                <Blocks/>
                <span>Perfil</span>
              </div>

              <span className="info-description">{post.int_profile_name}</span>
            </div>

            <span
              className="post-item-created-at">Criado em {post.created_at}</span>
          </div>
        ))}
      </div>
    </div>
  );
}