// app/login/page.tsx

'use client'; 

import { useState } from 'react';
import { useRouter } from 'next/navigation'; // Importa useRouter para redirecionamento
import './login.css';


export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null); // Estado para mensagens de erro
  const router = useRouter();                              // Instância do router para navegação

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault(); // Previne o recarregamento da página

    setError(null); // Limpa erros anteriores

    // Simulação de chamada de API para autenticação
    try {
      // Aqui você faria uma chamada real para sua API de autenticação
      // Exemplo: const response = await fetch('/api/login', { /* ... */ });
      // const data = await response.json();





      // Lógica de autenticação simulada:
      if (email === 'user@example.com' && password === 'password123') {
        console.log('Login bem-sucedido!');
        // Redireciona para a página principal (ou dashboard) após o login
        router.push('/dashboard'); // Ou '/' para a página inicial
      } else {
        setError('E-mail ou senha inválidos.');
      }
    } catch (err) {
      setError('Ocorreu um erro durante o login. Tente novamente.');
      console.error('Erro de login:', err);
    }
  };

  return (
    <div className='container'>
      <h1 className='title'>Entrar</h1>
      <form onSubmit={handleSubmit} >
        <div className='inputGroup'>
          <label htmlFor="email" >E-mail:</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className='inputGroup'>
          <label htmlFor="password" >Senha:</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        {error && <p className='errorText'>{error}</p>}

        <button type="submit" className='button'>
          Login
        </button>
      </form>
    </div>
  );
}
