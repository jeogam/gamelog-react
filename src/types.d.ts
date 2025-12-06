// src/types.d.ts (Crie este arquivo)

// Declaração para arquivos de imagem
declare module '*.png' {
  const value: string;
  export default value;
}
declare module '*.jpg' {
  const value: string;
  export default value;
}

// Declaração para arquivos de áudio
declare module '*.mp3' {
  const src: string;
  export default src;
}