import { Trash2, AlertTriangle } from 'lucide-react';

export function InspectionList({ inspections }) {
    if (inspections.length === 0) {
        return (
            <div className="card empty-state">
                <p>Nenhuma vistoria registrada nesta sessão.</p>
            </div>
        );
    }

    return (
        <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
            <div className="table-container">
                <table>
                    <thead>
                        <tr>
                            <th>Hora</th>
                            <th>Local</th>
                            <th>Modelo</th>
                            <th>Placa</th>
                            <th>Estepe</th>
                        </tr>
                    </thead>
                    <tbody>
                        {inspections.map((item) => (
                            <tr key={item.id} className={item.hasSpare === 'no' ? 'row-alert' : ''}>
                                <td>
                                    {item.timestamp.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                                </td>
                                <td>{item.location}</td>
                                <td>{item.model}</td>
                                <td>{item.plate}</td>
                                <td>
                                    {item.hasSpare === 'yes' ? (
                                        <span className="badge badge-success">OK</span>
                                    ) : (
                                        <span className="badge badge-danger">
                                            <AlertTriangle size={12} strokeWidth={3} />
                                            AUSENTE
                                        </span>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
