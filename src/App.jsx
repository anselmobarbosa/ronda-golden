import { useState } from 'react';
import { ShieldCheck, FileText, Mail } from 'lucide-react';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';

import { InspectionForm } from './components/InspectionForm';
import { InspectionList } from './components/InspectionList';
import { LoginScreen } from './components/LoginScreen';
import './styles/App.css';

function App() {
  const [inspectorName, setInspectorName] = useState('');
  const [inspections, setInspections] = useState([]);

  const addInspection = (inspection) => {
    setInspections([inspection, ...inspections]);
  };

  const generatePDF = () => {
    try {
      const doc = new jsPDF();

      // Header
      doc.setFontSize(20);
      doc.setTextColor(40, 40, 40);
      doc.text("Relatório de Ronda - Vistoria de Garagem", 14, 22);

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

  const handleEmail = () => {
    const subject = encodeURIComponent(`Relatório de Ronda - ${new Date().toLocaleDateString('pt-BR')}`);
    const body = encodeURIComponent(`Segue anexo o relatório da ronda realizada em ${new Date().toLocaleString('pt-BR')}.\n\nTotal de veículos vistoriados: ${inspections.length}\n\nAtenciosamente,\nRonda Golden`);

    // Gmail Web Compose URL
    const gmailUrl = `https://mail.google.com/mail/?view=cm&fs=1&su=${subject}&body=${body}`;

    window.open(gmailUrl, '_blank');

    // Provide feedback and download
    setTimeout(() => {
      alert("⚠️ ATENÇÃO:\n\n1. O Gmail foi aberto em uma nova aba.\n2. O PDF será baixado agora.\n3. ARRASTE o arquivo PDF para o e-mail aberto para anexá-lo.");
      generatePDF();
    }, 1000);
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
          <button className="btn" onClick={handleEmail} disabled={inspections.length === 0}>
            <Mail size={18} />
            Enviar E-mail
          </button>
        </div>
      </header>

      <main>
        <InspectionForm onAddInspection={addInspection} />

        <InspectionList inspections={inspections} />
      </main>
    </div>
  );
}

export default App;
