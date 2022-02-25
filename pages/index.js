import { useForm } from "react-hook-form";
import { signIn  } from "next-auth/react"
import { useRouter } from "next/router";

export default function Home() {

  const { register, handleSubmit } = useForm();
  const router = useRouter();

  async function handleSinIn(data){
    const { username, password } = data;

    const response = await signIn('credentials', {
      username,
      password,
      redirect: false
    });
    
    if(response.ok == false){
      console.log('Usuarion e senha invalidos!');
      return;
    }

    const redirect = router.query?.redirect || '/home';

    router.push(redirect);
  }

  return (
    <div>
      <h1>Pagina inicial</h1>
      <form onSubmit={handleSubmit(handleSinIn)}>
        <label htmlFor="user">Informe o nome de usuario</label>
        <br/>
        <input { ...register('username') } type="text" name="username" id="username" placeholder="Nome de usuario" />
        <br/><br/>
        <label htmlFor="password">Informe a senha</label>
        <br/>
        <input { ...register('password') } type="password" name="password" id="password" placeholder="Informe sua senha" />
        <br/><br/>
        <button type="submit">Entrar</button> 
      </form>
    </div>
  )
}