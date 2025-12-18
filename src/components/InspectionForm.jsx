import { useState } from 'react';
import { PlusCircle, CheckCircle, AlertCircle } from 'lucide-react';
import '../styles/App.css';

export function InspectionForm({ onAddInspection }) {
    const [formData, setFormData] = useState({
        location: '',
        model: '',
        plate: '',
        hasSpare: 'yes' // 'yes' | 'no'
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!formData.location || !formData.model || !formData.plate) return;

        onAddInspection({
            ...formData,
            timestamp: new Date(),
            id: crypto.randomUUID()
        });

        setFormData({
            location: '',
            model: '',
            plate: '',
            hasSpare: 'yes'
        });
    };

    return (
        <div className="card">
            <h2 style={{ marginBottom: '1rem', fontSize: '1.25rem' }}>Nova Vistoria</h2>
            <form onSubmit={handleSubmit}>
                <div className="form-grid">
                    <div className="form-group">
                        <label>Local / Vaga</label>
                        <input
                            type="text"
                            placeholder="Ex: G1-45"
                            value={formData.location}
                            onChange={(e) => setFormData({ ...formData, location: e.target.value.toUpperCase() })}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label>Modelo do Carro</label>
                        <input
                            type="text"
                            placeholder="Ex: Fiat Uno Prata"
                            value={formData.model}
                            onChange={(e) => setFormData({ ...formData, model: e.target.value.toUpperCase() })}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label>Placa</label>
                        <input
                            type="text"
                            placeholder="ABC-1234"
                            value={formData.plate}
                            onChange={(e) => setFormData({ ...formData, plate: e.target.value.toUpperCase() })}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label>Possui Estepe?</label>
                        <div className="radio-group">
                            <label className="radio-label has-spare">
                                <input
                                    type="radio"
                                    name="hasSpare"
                                    value="yes"
                                    checked={formData.hasSpare === 'yes'}
                                    onChange={(e) => setFormData({ ...formData, hasSpare: e.target.value })}
                                />
                                <CheckCircle size={18} />
                                Sim
                            </label>
                            <label className="radio-label no-spare">
                                <input
                                    type="radio"
                                    name="hasSpare"
                                    value="no"
                                    checked={formData.hasSpare === 'no'}
                                    onChange={(e) => setFormData({ ...formData, hasSpare: e.target.value })}
                                />
                                <AlertCircle size={18} />
                                Não
                            </label>
                        </div>
                    </div>
                </div>

                <button type="submit" className="btn btn-block">
                    <PlusCircle size={20} />
                    Registrar Vistoria
                </button>
            </form>
        </div>
    );
}
