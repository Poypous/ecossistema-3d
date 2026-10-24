# Ecossistema 3D — projeto organizado

## Como executar
1. Extraia esta pasta inteira.
2. Abra `index.html` em um navegador moderno com conexão à internet (o Three.js e o OrbitControls são carregados por CDN).
3. Se o navegador bloquear algum recurso ao abrir o arquivo diretamente, execute um servidor local nesta pasta:
   - Se tiver Python: `python -m http.server 8000`
   - Depois abra `http://localhost:8000`

## Organização
- `index.html`, `style.css`, `main.js`, `controls.js`, `icons.js`: interface e inicialização.
- `core/`: registro, mundo 3D, peças reutilizáveis e simulação dos animais.
- `animais/`: definições e comportamentos das espécies.
- `plantas/`: definições das plantas.
- Os modelos `.glb` e demais arquivos de mídia foram preservados.

## Observação
O pacote foi montado a partir da versão mais completa enviada, preservando a estrutura de dependências e os arquivos de mídia. Foi feita uma verificação estática dos caminhos referenciados no `index.html`; isso não substitui um teste visual em navegador.
