# Banco de Ideias - Meninas Digitais

Este repositório contém o código-fonte do sistema de Banco de Ideias, desenvolvido para o projeto **Meninas Digitais**. A aplicação tem como objetivo incentivar a participação de meninas e mulheres nas áreas de Computação e STEM por meio do envio, organização e gerenciamento de ideias inovadoras.

## Ferramentas Utilizadas

### Desenvolvimento
- **Visual Studio Code**  
  - Versão mais recente  
  - [https://code.visualstudio.com/](https://code.visualstudio.com/)

- **Node.js**  
  - Versão mais recente  
  - [https://nodejs.org/en/](https://nodejs.org/en/)<br>


### Banco de Dados
- **Firebase**  
  - Versão mais recente  
  - [https://firebase.google.com/?hl=pt-br](https://firebase.google.com/?hl=pt-br)

### Bibliotecas e Ferramentas Complementares
- As dependências necessárias estão especificadas no arquivo `package.json`.  
  Para instalá-las, execute o comando:  
  ```bash
  npm install

## Funcionalidades Desenvolvidas
- **Registro de Ideias**
  - Usuários podem submeter propostas de forma simples e intuitiva, armazenando as submissões no banco de dados para avaliação.

- **Votação de Ideias**
  - Usuários podem votar nas propostas mais interessantes, destacando as mais relevantes.

- **Organização por Votos**
  - Ideias são organizadas automaticamente pelo número de votos recebidos.

- **Exclusão de Ideias**
  - Apenas moderadores podem remover propostas inadequadas ou desatualizadas do sistema.

## Objetivo do Sistema
Criar um ambiente colaborativo e acessível para estimular o interesse feminino em tecnologia e ciências, promovendo a inclusão e a diversidade por meio de propostas inovadoras.

## Instruções para Configuração e Execução
- **Banco de Dados**
  - Acesse o console do Firebase e crie um projeto.
  - Configure as regras de acesso ao banco de dados de acordo com as permissões desejadas.
  - Exporte as credenciais do Firebase e salve-as no arquivo firebase-config.js no projeto.
  - Certifique-se de que as APIs necessárias para autenticação e armazenamento estejam ativadas.

- **Executar o Sistema**
  - Clone este repositório:
  ```bash
  git clone https://github.com/felipekaua/cert3
  ```
  - Acesse o diretório do projeto:
  ```bash
  cd banco-de-ideias
  ```
  - Instale as dependências:
  ```bash
  npm install
  ```
  - Execute a aplicação:
  ```bash
  npm start
  ```
- **Vídeo de Instrução**
  - [https://drive.google.com/file/d/1V7rSuXcAPHSxZb0Ya5sWzn_ZRb2ih2jR/view?usp=drive_link](https://drive.google.com/file/d/1V7rSuXcAPHSxZb0Ya5sWzn_ZRb2ih2jR/view?usp=drive_link)
 
## Testar o Sistema
- **Cadastro de Usuário**
  - Cadastre uma nova conta na tela inicial ou use uma conta já existente.
    
- **Registro de Ideias**
  - Submeta uma proposta e confira o armazenamento no banco de dados.
    
- **Votação e Organização**
  - Vote em ideias e observe a ordenação automática por popularidade.
    
- **Exclusão (Apenas Moderadores)**
  - Faça login como moderador para excluir propostas.

## Contas de Acesso
Usuários podem se cadastrar diretamente no sistema para acessar suas funcionalidades.
Para simular ações de moderadores, será necessário configurar permissões específicas no Firebase para um usuário.

## Equipe
- **Equipe 7**

  - Breno Rodrigues Lobo de Araújo (2312999)
  - Felipe Kauã de Lima (2268183)
  - Jhonatan Bruno Viza Atahuichy (2349752)

## Contribuições
Contribuições são bem-vindas!
Sinta-se à vontade para abrir issues ou enviar pull requests.

---

Agradecemos sua visita e colaboração com o projeto Meninas Digitais! 💻✨
