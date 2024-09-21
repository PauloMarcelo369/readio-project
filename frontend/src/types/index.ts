export type Livro = {
  id: number,
  nome: string   // Permitir undefined caso o dado não esteja presente
  autor: string
  genero: string
  sinopse: string
  capa: Capa    // O objeto Capa pode ser undefined se não estiver carregado
  nota?: number   // Pode ser undefined se ainda não tiver nota atribuída
  caps: number    // Pode ser undefined caso o número de capítulos não esteja definido
}

type Capa = {
  id: number,
  url: string
}

export type User = {
  id: number,
  username: string,
  role: Role,
  email: string
}

type Role = {
  name: string
}

export type Poste = {
  id: number,
  conteudo: string,
  dado: number,
  tipo: string,
  livro: Livro,
  user: User,
}
export type Estante = {
  id: number,
  livros: Livro[],
  user: User,
}


export interface ApplicationError {
  error: {
    name: string,
    message: string,
  }
}