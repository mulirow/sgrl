"use client";

import { useState, FormEvent } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

interface ReservaFormData {
  numeroLaboratorio: number;
  reason: string;
  objectsToUse: string[];
  date: string;
  time: string;
}

interface RegisterReservaResponse {
  success: boolean;
  message: string;
  reservaId?: string;
}

const ReservaLaboratorioPage: React.FC = () => {
  const router = useRouter();

  const [reason, setReason] = useState<string>('');
  const [objectsToUse, setObjectsToUse] = useState<string[]>([]);
  const [date, setDate] = useState<string>('');
  const [time, setTime] = useState<string>('');
  const [numeroLaboratorio, setNumeroLaboratorio] = useState<string>('');

  const [message, setMessage] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const laboratoryOptions = [1, 2, 3, 4, 5, 7, 8, 9];

  const availableObjects = [
    'Computador',
    'Multímetro',
    'Kit de Robótica',
    'Impressora 3D',
    'Estação de Solda',
    'Osciloscópio',
    'Fonte de Alimentação',
    'Ferramentas Manuais',
    'Componentes Eletrônicos'
  ];

  const handleObjectToggle = (objectName: string) => {
    setObjectsToUse(prevObjects => {
      if (prevObjects.includes(objectName)) {
        return prevObjects.filter(obj => obj !== objectName);
      } else {
        return [...prevObjects, objectName];
      }
    });
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setMessage('');
    setIsLoading(true);

    const parsedNumeroLaboratorio = parseInt(numeroLaboratorio);

    const currentDateTime = new Date();
    const selectedDateTime = new Date(`${date}T${time}:00`);

    if (!reason || !date || !time || !numeroLaboratorio) {
      setMessage('Por favor, preencha todos os campos obrigatórios.');
      setIsLoading(false);
      return;
    }

    if (isNaN(parsedNumeroLaboratorio) || parsedNumeroLaboratorio < 1 || parsedNumeroLaboratorio > 9 || parsedNumeroLaboratorio === 6) {
      setMessage('Por favor, selecione um número de laboratório válido (1-9, exceto 6).');
      setIsLoading(false);
      return;
    }

    if (selectedDateTime < currentDateTime) {
      setMessage('A data e hora da reserva não podem ser no passado.');
      setIsLoading(false);
      return;
    }

    const currentYear = currentDateTime.getFullYear();
    const selectedYear = selectedDateTime.getFullYear();
    if (selectedYear !== currentYear) {
      setMessage(`A data da reserva deve ser para o ano atual (${currentYear}).`);
      setIsLoading(false);
      return;
    }

    if (objectsToUse.length === 0) {
      setMessage('Selecione pelo menos um objeto/equipamento a utilizar.');
      setIsLoading(false);
      return;
    }

    const reservaData: ReservaFormData = {
      numeroLaboratorio: parsedNumeroLaboratorio,
      reason,
      objectsToUse,
      date,
      time,
    };

    try {
      const response = await fetch('http://localhost:3001/api/reservas/laboratorio', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(reservaData),
      });

      if (!response.ok) {
        const errorData: RegisterReservaResponse = await response.json();
        throw new Error(errorData.message || 'Erro ao registrar a reserva.');
      }

      const data: RegisterReservaResponse = await response.json();

      if (data.success) {
        setMessage(`Reserva no Laboratório ${parsedNumeroLaboratorio} realizada com sucesso! ID: ${data.reservaId || 'N/A'}`);
        setReason('');
        setObjectsToUse([]);
        setDate('');
        setTime('');
        setNumeroLaboratorio('');
      } else {
        setMessage(data.message || 'Erro desconhecido ao registrar a reserva.');
      }
    } catch (error: any) {
      setMessage(error.message || 'Ocorreu um erro de conexão. Tente mais tarde.');
      console.error('Erro de registro de reserva:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 to-indigo-200 p-4 sm:p-6 lg:p-8">
      <Head>
        <title>Reservar Laboratório - Meu App PRO</title>
        <meta name="description" content="Página para reservar laboratórios." />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="bg-white p-8 rounded-xl shadow-2xl w-full max-w-lg transform transition-all duration-300 hover:scale-105">
        <h1 className="text-4xl font-extrabold text-center text-gray-900 mb-8">
          Reservar Laboratório
        </h1>

        <form onSubmit={handleSubmit} className="flex flex-col space-y-6">
          <div>
            <label htmlFor="laboratoryNumber" className="block text-gray-700 text-sm font-bold mb-2">
              Qual Laboratório:
            </label>
            <select
              id="laboratoryNumber"
              value={numeroLaboratorio}
              onChange={(e) => setNumeroLaboratorio(e.target.value)}
              required
              className="shadow-sm border rounded-lg w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
              aria-label="Selecionar Laboratório"
            >
              <option value="" disabled>Selecione um laboratório</option>
              {laboratoryOptions.map((num) => (
                <option key={num} value={num}>
                  Laboratório {num}
                </option>
              ))}
            </select>
          </div>

          <div className="flex space-x-4">
            <div className="flex-1">
              <label htmlFor="date" className="block text-gray-700 text-sm font-bold mb-2">
                Data:
              </label>
              <input
                type="date"
                id="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                required
                className="shadow-sm border rounded-lg w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
                aria-label="Data da Reserva"
              />
            </div>
            <div className="flex-1">
              <label htmlFor="time" className="block text-gray-700 text-sm font-bold mb-2">
                Horário:
              </label>
              <input
                type="time"
                id="time"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                required
                className="shadow-sm border rounded-lg w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
                aria-label="Horário da Reserva"
              />
            </div>
          </div>

          <div>
            <label htmlFor="reason" className="block text-gray-700 text-sm font-bold mb-2">
              Motivo da Reserva:
            </label>
            <textarea
              id="reason"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              required
              rows={3}
              className="shadow-sm border rounded-lg w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
              placeholder="Ex: Projeto de pesquisa sobre IA, Aula prática de robótica..."
              aria-label="Motivo da Reserva"
            />
          </div>

          <div className="mb-4">
            <label htmlFor="objectsToUse" className="block text-gray-700 text-sm font-bold mb-2">
              Objetos/Equipamentos a Utilizar:
            </label>
            <div className="flex flex-wrap gap-2">
              {availableObjects.map((object) => (
                <button
                  key={object}
                  type="button"
                  onClick={() => handleObjectToggle(object)}
                  className={`
                    py-2 px-4 rounded-full text-sm font-medium
                    ${objectsToUse.includes(object)
                      ? 'bg-black text-white'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                    }
                    transition duration-200 ease-in-out
                  `}
                >
                  {object}
                </button>
              ))}
            </div>
          </div>
          <button
            type="submit"
            className={`w-full py-3 px-4 rounded-lg font-bold text-white transition duration-300 ease-in-out ${isLoading
                ? 'bg-indigo-400 cursor-not-allowed'
                : 'bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-75'
              }`}
            disabled={isLoading}
          >
            {isLoading ? 'Registrando Reserva...' : 'Registrar Reserva'}
          </button>

          {message && (
            <p
              className={`text-center font-semibold mt-4 ${message.includes('sucesso') ? 'text-green-600' : 'text-red-600'
                }`}
              role="alert"
            >
              {message}
            </p>
          )}
        </form>

        <p className="mt-8 text-center text-gray-600 text-sm">
          <Link href="/" className="text-indigo-600 hover:text-indigo-800 font-bold transition duration-200">
            Voltar à página inicial
          </Link>
        </p>
      </main>
    </div>
  );
};

export default ReservaLaboratorioPage;