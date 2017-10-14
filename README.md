# BitValor API

API RESTful que consome dados da [Bitvalor API](https://bitvalor.com/api).

## Pré-requisitos
  * [NodeJS](https://nodejs.org/) -> 6.x ou superior
  * [npm](https://www.npmjs.com/) -> 3.x ou superior (vem com o NodeJS)

## Instalando dependências
  * No diretório onde encontra-se o arquivo descritor de dependências (package.json), executar o comando:
 ```sh
 $ npm install
 ```

## Executando o projeto
  * No diretório onde encontra-se o arquivo descritor de dependências (package.json), executar o comando:
 ```sh
 $ npm start
 ```
  * A aplicação executa nos host e port definidos em /config/default.json (atualmente localhost:3030)

## Testando o projeto
    * No diretório onde encontra-se o arquivo descritor de dependências (package.json), executar o comando:
```sh
 $ npm test
```
## Requisições
* Todas as requisições utilizam somente o verbo GET.
* Demais requisições são rejeitadas com erro 405 (Method Not Allowed).
* Os parâmetros são inseridos na forma de [querystring](https://nodejs.org/api/querystring.html#querystring_querystring_parse_str_sep_eq_options)

```
Ex: /book=bids&price[$between]=[15000,18000]&exchange=loc
```

* Se nenhum parâmetro é passado, a API retorna todos os dados da última requisição.

## Endpoints
* Order Book: /order-book

### Parâmetros
* "book" (String): Tipo de ordem (asks ou bids)

```
Ex: /order-book?book=bids
```

* "exchange" (String): Nome ou a sigla de alguma das seguintes exchanges:

- ARN: Arena Bitcoin
- B2U: BitcoinToYou
- BAS: Basebit
- BIV: Bitinvest
- BSQ: Bitsquare
- FLW: flowBTC
- FOX: FoxBit
- LOC: LocalBitcoins
- MBT: Mercado Bitcoin
- NEG: Negocie Coins
- PAX: Paxful

** Os nomes das exchanges que são compostos devem ser separados por _ (underscore) na querystring.

```
Ex: 
/order-book?exchange=negocie_coins
/order-book?exchange=loc
```

* "price" (Array): Intervalo de preços mínimo e máximo, respectivamente, que é passado por um array de duas posições marcados com a flag $between.

```
Ex: /order-book?price[$between]=[20000,21000]
```

*  "volume" (Array):  Intervalo de volumes mínimo e máximo, respectivamente, que é passado por um array de duas posições marcados com a flag $between.

```
Ex: /order-book?volume[$between]=[0.3,0.6]
```

** Nos casos dos parâmetros "price" e "volume", caso não deseje estabelecer limites, basta colocar o valor 'null' na posição correspondente do array. Por exemplo, a requisição

```
Ex: /order-book?volume[$between]=[0.3,null]
```
retornará todos os volumes maiores que 0.3. 

** Se ambos os parâmetros forem 'null', então a API retorna todos os dados.


## Cache
* A API faz cache das requisições utilizando o [NeDB](https://github.com/louischatriot/nedb).
*  Os dados persistidos ficam no diretório /data do projeto.
* Esse cache é necessário para que não [exceda a quantidade de requisições permitidas](https://bitvalor.com/api).
* Se a última requisição foi feita há menos de 1 minuto, a resposta será a de cache, sendo marcada com a flag cache=true na resposta. O inverso também é verdadeiro.

