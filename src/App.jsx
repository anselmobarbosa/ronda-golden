import { useState } from 'react';
import { ShieldCheck, FileText, Mail } from 'lucide-react';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import { useEffect } from 'react';
import { db } from './firebaseConfig';
import { collection, addDoc, onSnapshot, query, orderBy, deleteDoc, doc } from 'firebase/firestore';

import { InspectionForm } from './components/InspectionForm';
import { InspectionList } from './components/InspectionList';
import { LoginScreen } from './components/LoginScreen';
import './styles/App.css';

function App() {
  const [inspectorName, setInspectorName] = useState('');
  const [inspections, setInspections] = useState([]);

  // Listen for real-time updates from Firebase
  useEffect(() => {
    const q = query(collection(db, "inspections"), orderBy("timestamp", "desc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const inspectionsData = snapshot.docs.map(doc => {
        const data = doc.data();
        return {
          ...data, // Data first
          id: doc.id, // Real ID wins
          // Convert Firestore Timestamp to JS Date
          timestamp: data.timestamp?.toDate ? data.timestamp.toDate() : new Date(data.timestamp)
        };
      });
      setInspections(inspectionsData);
    });

    return () => unsubscribe();
  }, []);

  const addInspection = async (inspection) => {
    try {
      await addDoc(collection(db, "inspections"), {
        ...inspection,
        timestamp: inspection.timestamp // Firestore handles JS Date objects automatically
      });
    } catch (error) {
      console.error("Erro ao salvar no banco de dados:", error);
      // Show actual error to help debugging
      alert(`Erro Firebase: ${error.code || 'Desconhecido'}\n\n${error.message}`);
    }
  };

  const deleteInspection = async (id) => {
    if (window.confirm("Tem certeza que deseja excluir esta vistoria?")) {
      try {
        await deleteDoc(doc(db, "inspections", id));
      } catch (error) {
        console.error("Erro ao excluir:", error);
        alert(`Erro ao excluir: ${error.code || 'Desconhecido'}\n${error.message}`);
      }
    }
  };

  const generatePDF = () => {
    try {
      const doc = new jsPDF();

      // Header
      doc.setFontSize(20);
      doc.setTextColor(40, 40, 40);
      doc.text("Ronda Golden - Relatório de Vistoria", 14, 22);

      doc.setFontSize(10);
      doc.text(`Gerado em: ${new Date().toLocaleString('pt-BR')}`, 14, 30);
      doc.text(`Agente Responsável: ${inspectorName}`, 14, 35);

      // Table
      const tableColumn = ["Hora", "Local", "Modelo", "Placa", "Estepe"];
      const tableRows = [];

      inspections.forEach(inspection => {
        const inspectionData = [
          inspection.timestamp.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
          inspection.location,
          inspection.model,
          inspection.plate,
          inspection.hasSpare === 'yes' ? 'OK' : 'AUSENTE'
        ];
        tableRows.push(inspectionData);
      });

      // Using functional autoTable
      autoTable(doc, {
        head: [tableColumn],
        body: tableRows,
        startY: 40,
        styles: { fontSize: 10, cellPadding: 3 },
        headStyles: { fillColor: [59, 130, 246] }, // Blue header
        alternateRowStyles: { fillColor: [240, 240, 240] },
        didParseCell: function (data) {
          if (data.section === 'body' && data.row.raw[4] === 'AUSENTE') {
            // Row background (light red matching web view)
            data.cell.styles.fillColor = [254, 202, 202];

            // Specific styling for "AUSENTE" cell
            if (data.column.index === 4) {
              data.cell.styles.textColor = [220, 38, 38]; // Bright red (#dc2626)
              data.cell.styles.fontStyle = 'bold';
            }
          }
        }
      });

      doc.save(`ronda_${new Date().toISOString().slice(0, 10)}.pdf`);
    } catch (error) {
      console.error("Erro ao gerar PDF:", error);
      alert("Erro ao gerar PDF. Verifique o console para mais detalhes: " + error.message);
    }
  };



  if (!inspectorName) {
    return <LoginScreen onLogin={setInspectorName} />;
  }

  return (
    <div className="container">
      <header className="header">
        <div className="logo">
          <ShieldCheck size={32} />
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <span>Ronda Golden</span>
            <span style={{ fontSize: '0.8rem', fontWeight: 'normal', color: 'var(--text-secondary)' }}>
              Agente: {inspectorName}
            </span>
          </div>
        </div>
        <div style={{ display: 'flex', gap: '10px' }}>
          <button className="btn btn-secondary" onClick={generatePDF} disabled={inspections.length === 0}>
            <FileText size={18} />
            Baixar PDF
          </button>
        </div>
      </header>

      <main>
        <InspectionForm onAddInspection={addInspection} />

        <InspectionList inspections={inspections} onDelete={deleteInspection} />
      </main>
    </div>
  );
}

export default App;
