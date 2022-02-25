import { getSession, signOut, useSession } from "next-auth/react";
import { useState } from "react";
import { PrivateComponent } from "../components/PrivateComponent";

export default function Home() {
    const { data: session, status } = useSession();
    
    const [ user, setUser ] = useState();

    //Função para deslogar da sessão
    async function handleSingOut(){
        signOut({
            callbackUrl: "/"
        });
    }

    if (status === "loading") return <p>Loading...</p>;
    
    if(status === "authenticated"){
        (async() => {
            const response = await fetch('http://localhost:3333/api/test/user', {
                headers: {
                    'X-Access-Token': `${session.accessToken}`,
                    'Content-Type': 'application/x-www-form-urlencoded'
                }
            });
            const data = await response.json();
            setUser(data.name); 
        })();   
    }

    return(
        <PrivateComponent>
            <h1>Pagina Teste</h1>
            <p>Usuario Autenticado: {user}</p>
            <button onClick={handleSingOut}>Sair</button>
        </PrivateComponent>
    );
}

//Server Side securing pages
export async function getServerSideProps(context) {
    const session = await getSession(context);

    if(!session){
        return{
            props: {},
            redirect: {
                destination: '/'
            }
        }
    }

    return{
        props: {},
    }
}