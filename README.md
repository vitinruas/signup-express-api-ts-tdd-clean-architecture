# EN: SignUp API with TDD, Clean Architecture, SOLID, AAA and more...

My SignUp project. it's a part of a big project that's coming.

# PT-BR: SignUp API com TDD, Clean Architecture, SOLID, AAA e outros...

Este é o meu projeto de Signup, é apenas uma parte de um projeto maior que está por vir.

> ## EN: Main Flow

1. API receives data and check if it was provided;
2. Check if email is valid and check passwords match;
3. Check if the email address already exists;
4. Criptography the password;
5. Add a new account;
6. Return API response status code 201 and body with new account data.

> ## PT-BR: Fluxo principal de funcionamento

1. API recebe dados do Cliente e verifica se foram fornecidos dados obrigatórios;
2. Verifique se o E-mail é válido e verifique se as senhas se coincidem;
3. Verifique se o E-mail já está sendo utilizado;
4. Faça a Criptografia da Senha;
5. Adicione ao Banco de Dados;
6. API retorna ao Cliente um código de status 201 e um objeto contendo os dados da conta recém criada.

# --------------------------------

> ### EN: For run the API

1. Run in your Terminal or CMD: [npm update] to install all necessary packages;
2. To run this project is required MongoDB;
3. There is already default a URI;
4. (if you want, optional): src/main/config/env.ts is where you must put your MONGO_URI.
5. Enter in your Terminal or CMD: [npm start] to run the API

> ### EN: For run the API

1. Run in your Terminal or CMD: [npm update] to install all necessary packages;
2. To run this project is required MongoDB;
3. There is already default a URI;
4. (if you want, optional): src/main/config/env.ts is where you must put your MongoDB URI;
5. Run in your Terminal or CMD: [npm start] to run the API;
6. You can use a GUI Client (Web, Mobile and others...), Postman or any Client to test that project;

> ## PT-BR: Para executar a API

1. Execute em seu Terminal ou CMD: [npm update] para instalar os pacotes necessários;
2. Para executar esse projeto é obrigatório o MongoDB;
3. Já está configurado a URI padrão do MongoDB;
4. (E se você quiser, Opcional): src/main/config/env.ts é onde você deve colocar a sua URL do MongoDB;
5. Execute em seu Terminal ou CMD: [npm start] para executar a API;
6. Você pode usar uma Interface Gráfica (Web, Mobile e etc...) ou Postman ou qualquer Cliente para testar esse projeto.
