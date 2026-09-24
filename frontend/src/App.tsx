import { BrowserRouter, Routes, Route } from 'react-router-dom';
import LayoutBase from './componentes/LayoutBase';
import Painel from './paginas/Painel';
import PainelChamados from './paginas/PainelChamados';
import FormularioChamado from './paginas/FormularioChamado';
import DetalhesChamado from './paginas/DetalhesChamado';


export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={
            <LayoutBase>
              <Painel />
            </LayoutBase>
          }
        />
        <Route
          path="/chamados"
          element={
            <LayoutBase>
              <PainelChamados />
            </LayoutBase>
          }
        />
        <Route
          path="/chamados/:id"
          element={
            <LayoutBase>
              <DetalhesChamado />
            </LayoutBase>
          }
        />
        <Route
          path="/novo"
          element={
            <LayoutBase>
              <FormularioChamado />
            </LayoutBase>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}
