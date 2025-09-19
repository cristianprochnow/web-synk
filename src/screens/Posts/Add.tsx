import { ArrowLeft, Save } from 'lucide-react'
import { useNavigate } from 'react-router'
import { ActionButton } from '../../components/ActionButton'
import { OutlineButton } from '../../components/OutlineButton'
import { PageTitle } from '../../components/PageTitle'
import '../../styles/screens/posts/add.css'

export function Add() {
    const navigate = useNavigate()

    function goBack() {
        navigate(-1)
    }

    return (
        <div id="screen-post-add">
            <header>
                <OutlineButton label="Voltar" Icon={ArrowLeft} onClick={goBack} />
                <PageTitle>Nova publicação</PageTitle>
            </header>

            <form className="form-add-container">
                <div className="field-group">
                    <label htmlFor="post_name">Apelido</label>
                    <input type="text" name="post_name" id="post_name" />
                </div>

                <div className="col-2">
                    <div className="field-group">
                        <label htmlFor="template_id">Template</label>
                        <select name="template_id" id="template_id" defaultValue="">
                            <option value="" disabled>Selecione</option>
                            <option value="1">Template 1</option>
                            <option value="2">Template 2</option>
                        </select>
                    </div>

                    <div className="field-group">
                        <label htmlFor="int_profile_id">Perfil</label>
                        <select name="int_profile_id" id="int_profile_id" defaultValue="">
                            <option value="" disabled>Selecione</option>
                            <option value="1">Perfil 1</option>
                            <option value="2">Perfil 2</option>
                        </select>
                    </div>
                </div>

                <div className="field-group">
                    <label htmlFor="post_content">Conteúdo</label>
                    <textarea name="post_content" id="post_content"></textarea>
                </div>
            </form>

            <footer>
                <ActionButton label="Salvar" Icon={Save} />
            </footer>
        </div>
    )
}