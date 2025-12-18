import { useState } from 'react';
import { ShieldCheck, UserCircle } from 'lucide-react';
import '../styles/App.css';

export function LoginScreen({ onLogin }) {
    const [name, setName] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        if (name.trim()) {
            onLogin(name.trim().toUpperCase());
        }
    };

    return (
        <div className="container" style={{
            height: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            paddingBottom: '20vh'
        }}>
            <div className="card" style={{ width: '100%', maxWidth: '400px', textAlign: 'center' }}>
                <div style={{
                    display: 'flex',
                    justifyContent: 'center',
                    marginBottom: '1.5rem',
                    color: 'var(--accent-color)'
                }}>
                    <ShieldCheck size={64} />
                </div>

                <h1 style={{ marginBottom: '0.5rem', fontSize: '1.75rem' }}>Ronda Golden</h1>
                <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem' }}>
                    Identifique-se para iniciar a vistoria
                </p>

                <form onSubmit={handleSubmit}>
                    <div className="form-group" style={{ marginBottom: '1.5rem', textAlign: 'left' }}>
                        <label>Nome do Agente</label>
                        <div style={{ position: 'relative' }}>
                            <div style={{
                                position: 'absolute',
                                left: '12px',
                                top: '50%',
                                transform: 'translateY(-50%)',
                                color: 'var(--text-secondary)'
                            }}>
                                <UserCircle size={20} />
                            </div>
                            <input
                                type="text"
                                placeholder="Digite seu nome..."
                                value={name}
                                onChange={(e) => setName(e.target.value.toUpperCase())}
                                style={{ paddingLeft: '40px' }}
                                required
                                autoFocus
                            />
                        </div>
                    </div>

                    <button type="submit" className="btn btn-block">
                        Iniciar Turno
                    </button>
                </form>
            </div>
        </div>
    );
}
