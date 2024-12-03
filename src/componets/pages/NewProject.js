import { useNavigate } from 'react-router-dom';
import styles from './NewProject.module.css';
import ProjectForm from '../project/ProjectForm';

function NewProject() {
    const navigate = useNavigate();

    function createPost(project) {
        // Inicializa o custo e os serviços
        project.cost = 0;
        project.services = [];

        fetch("https://db-json-inky.vercel.app/projects", {
            method: 'POST',
            headers: {
                'Content-type': 'application/json',
            },
            body: JSON.stringify(project),
            redirect: 'follow',
        })
        .then((resp) => resp.json())
        .then((data) => {
            console.log(data);
            //redirect
            navigate('/projects', { state: { message: 'Projeto enviado com sucesso!' } }); 
        })
        .catch(err => console.log(err));
    }

    return (
        <div className={styles.newproject_container}>
            <h1>Criar Projeto</h1>
            <p>Crie seu projeto para depois adicionar os serviços!</p>
            <ProjectForm handleSubmit={createPost} btnText="Criar Projeto" />
        </div>
    );
}

export default NewProject;
