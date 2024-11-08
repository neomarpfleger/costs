import {parse, v4 as uuidv4} from 'uuid'
import styles from './Project.module.css'
import { useParams } from 'react-router-dom'
import {useState,useEffect} from 'react'
import Loading from '../layout/Loading'
import Container from '../layout/Container'
import ProjectForm from '../project/ProjectForm'
import ServiceForm from '../service/ServiceForm'
import Message from '../layout/Message'
import ServiceCard from '../service/ServiceCard'

function Project() {
    const {id} = useParams()
    
    const [project, setProject] = useState([])
    const [services, setServices] = useState([])
    const [showProjectForm, setShowProjectForm] = useState(false)
    const [showServiceForm, setShowServiceForm] = useState(false)
    const [message, setMessage] = useState()
    const [type, setType] = useState()

    useEffect(() => {
        setTimeout(() => {
            fetch(`https://db-json-inky.vercel.app/projects/${id}`, {
                method:'GET',
                headers: {
                    'content-type':'application/json',
                },
            })
            .then((resp) =>resp.json())
            .then((data) => {
                setProject(data)
                setServices(data.services)
            })
        },500)
    }, [id])

    function editPost(project) {
        setMessage('')
        //buget Validation
        if(project.budget < project.cost) {
            setMessage('O orçamento não pode ser menor que o custo do projeto')
            setType('error')
            return false
        }

        fetch(`https://db-json-inky.vercel.app/projects/${id}`, {
            method:'PATCH',
            headers: {
                'content-type':'application/json',
            },
            body: JSON.stringify(project),
        })
        .then((resp) =>resp.json())
        .then((data) => {
            setProject(data)
            setShowProjectForm(false)
            setMessage('Projeto Atualizado Com Sucesso!')
            setType('success')
           
        })

    }

    function createService() {
        setMessage('')

        const lastService = project.services[project.services.length - 1]

        lastService.id = uuidv4()

        const lastServiceCost = lastService.cost

        const newCost = parseFloat(project.cost) + parseFloat(lastServiceCost)
        
        //Validação do valor maximo
        if(newCost > parseFloat(project.budget)) {
            setMessage('Orçamento ultrapassado, verifique o valor do serviço!')
            setType('error')
            project.services.pop()
            return false
        }

        //add service cost to project total cost
        project.cost = newCost

        fetch(`https://db-json-inky.vercel.app/projects/${project.id}`, {
            method:'PATCH',
            headers: {
                'content-type':'application/json',
            },
            body: JSON.stringify(project),
        })
        .then((resp) =>resp.json())
        .then((data) => {
            setShowServiceForm(false)
        }).catch((err) => console.log(err))
    }

    function removeService(id, cost){
        const serviceUpdated = project.services.filter(
        (service) => service.id !== id 
        )

        const projectUpdated = project

        projectUpdated.services = serviceUpdated
        projectUpdated.cost = parseFloat(projectUpdated.cost) - parseFloat(cost)
        
        fetch(`https://db-json-inky.vercel.app/projects/${projectUpdated.id}`, {
            method:'PATCH',
            headers: {
                'content-type':'application/json',
            },
            body: JSON.stringify(projectUpdated),
        })
        .then((resp) =>resp.json())
        .then((data) => {
            setProject(projectUpdated)
            setServices(serviceUpdated)
            setMessage('Serviço removido com sucesso!')
        })
        .catch((err) => console.log(err))
    }

    function toggleProjectForm() {
        setShowProjectForm(!showProjectForm)
    }

    function toggleServiceForm() {
        setShowServiceForm(!showServiceForm)
    }

    return (
        <>
            {project.name ? (
                <div className={styles.project_details}>
                    <Container customClass="column">
                        {message && <Message type={type} msg={message} />}
                        <div className={styles.details_container}>
                            <h1>Projeto: {project.name} </h1>
                            <button className={styles.btn} onClick={toggleProjectForm}>
                                {!showProjectForm ? 'Editar Projeto' : 'Fechar'}
                            </button>
                            {!showProjectForm ? (
                                <div className={styles.project_info}>
                                    <p>
                                        <span>Categoria:</span> {project.category.name}
                                    </p>
                                    <p>
                                        <span>Total de Orçamento:</span> {project.budget}
                                    </p>
                                    <p>
                                        <span>Total Utilizado:</span> {project.cost}
                                    </p>
                                </div>
                            ) : (
                                <div className={styles.project_info}>
                                    <ProjectForm
                                        handleSubmit={editPost} 
                                        btnText="Concluir Edição" 
                                        projectData={project} />
                                </div>
                            )}
                        </div>
                        <div className={styles.service_form_container}>
                            <h2>Adicione um serviço!</h2>
                            <button className={styles.btn} onClick={toggleServiceForm}>
                                {!showServiceForm ? 'Adicionar Serviço' : 'Fechar'}
                            </button>
                            <div className={styles.project_info}>
                                {showServiceForm && <ServiceForm
                                    handleSubmit={createService}
                                    btnText="Adicionar Serviço"
                                    projectData={project}
                                />}
                            </div>
                        </div>
                        <h2>Serviços</h2>
                        <Container customClass="start">
                            {services.length > 0 &&
                                services.map((service) => (
                                    <ServiceCard 
                                        id={service.id}
                                        name={service.name}
                                        cost={service.cost}
                                        description={service.description}
                                        key={service.id}
                                        id={service.id}
                                        handleRemove={removeService}
                                    />
                                ))
                            }
                            {services.length === 0 &&  <p>Não há serviços cadastrados</p>}
                        </Container>         
                    </Container>
                </div>
            ) : (
                <Loading />
            )}
        </>
    )
}

export default Project