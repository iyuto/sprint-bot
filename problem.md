# Bot Challenge Advanced

# Hack your own way
This challenge assumes you have successfully implemented beginner and intermediate bot challenge.

Here is the basic specification of the chat bot.

- Connection between chat bot will use WebSocket protocol(ws).
  - You can implement to enable wss also, but we will use ws in our test.
- Use plain text for send data to chat bot.
- For the message starts with "bot" will be treated as command for the bot.
- Response from chat bot will be in JSON format, and has "data" property which contains response text.
  - You could add any other properties if you want.
- Any message to the bot will be echoed to all connected user.

## STEP1. Choose the server or service to deploy
First, choose the service to deploy your bot server.

You can use any service that you want, such as Heroku, EngineYard, AWS, Azure, etc. URL will be fixed when you decide the service to deploy. Once your URL has fixed, please write your host name, port, and path to an endpoint in [app/config/account.json](app/config/account.json).  
We will run the test to the server written in this file.

Also, write your URL in [answer.md](answer.md) as well, so that reviewers could see the service whenever they want.

## STEP2. Implement required features
As next step, implement 2 features (with 4 bot commands) to check if the deployed server runs without error.

### `bot ping`: the status check command
Implement bot that returns `pong`, when the bot receive `bot ping` from client.
Response should be formatted with JSON like below.
```json
{
  "data": "pong"
}
```
[tests/ping.spec.js](tests/ping.spec.js) is the test file for this feature.

### `bot todo`: Add, delete, and list the ToDo
Implement 3 ToDo managing command `bot todo add`, `bot todo delete`, and `bot todo list`.

- `bot todo add`
  - This command would take at least two arguments.
  - First argument is a name for todo, and a detail for the rest.
  - When command succeed, return message `todo added` with format of JSON.
  ```json
  {
    "data": "todo added"
  }
  ```
- `bot todo delete`
  - This command would take one argument.
  - The argument is a name for todo.
  - When command succeed, return message `todo deleted` with format of JSON.
  ```json
  {
    "data": "todo deleted"
  }
  ```
- `bot todo list`
  - This command would need no argument.
  - When command succeed, return all the ToDos, joined with newline character `\n` with JSON format.
  - If ToDo list was empty, return `todo empty`.
  ```json
  {
    "data": "todo1 implement ping\ntodo2 implement todo add\ntodo3 implement todo delete\todo4 implement todo list"
  }
  ```

Tests for todo commands are implemented in [tests/todo.spec.js](tests/todo.spec.js)

#### Note:
- ToDo command might need to use some kind of storage like RDB or KV store. Please use anything you like.
- Every test requires `todo list` and `todo list` to be implemented correctly.
- This ToDo is for required for testing purpose. All ToDos will be removed for each tests.

## STEP3. Implement original command
Third step is implement original command.  
As long as you don't break following rules, it is free to implement any command you want. Using external API are also welcomed!

- Treat plain text starts with "bot" as bot command argument.
- Chat bot returns JSON format response and contains `data` property for its response.

Here are some ideas for the original command.

- `bot weather`, returns current weather
- The command to check exchange rate and returns exchanged value, `bot exchange dollar 1`
- `bot jojo`, the bot returns famous scene of Japanese comic randomly.
- `bot help` might be helpful for the reviewers to check what commands you've implemented.

 Please implement at least one command. Explore the Internet and bring some cool idea that surprise reviewers!

### Write your own test code
You may want to make your own test for your original commands. If so, please make folder other than `tests` and place your tests into that folder.

You can use any testing frameworks that you want to use, but please avoid using `tests` folder for placing tests since it is for automated test by codecheck.

## Extra 1. Extend the bot features
It is not required, but if you came up with some idea to improve the bot, it is welcome to extend the bot feature.

Here are some examples that might help to get new ideas.

- User authentication
  - You may required to authenticate to use external API  
  e.g. You will need OAuth to use GitHub API
- Command alias command
  - Command to make alias of another command


## Extra 2. Implement bot client
We provide simple client for checking purpose, but it's too simple that you might need to extend current client or re-create your own client.

## Test Results _before_ solving the challenge

Initially all the tests will fail with following output

codecheck: Finish with code 2
codecheck: tests  : 2
codecheck: success: 0
codecheck: failure: 2

## Test Results _after_ solving the challenge

Solve the challenge to pass the tests

codecheck: Finish with code 0
codecheck: tests  : 4
codecheck: success: 4
codecheck: failure: 0

--- --- --- --- ---

## Run Tests

To run tests locally install codecheck in local environment by running following command in terminal.

$ npm install codecheck -g

To run tests locally, run codecheck command in terminal in the root folder To run tests in web editor please click on RUN button on left side of web editor

## About answer.md
Reviewers will see [answer.md](answer.md) before look into your code.
URL for the deployed server is **required**, and also please list up commands that you've implemented.
Please write what you thought on your development, and show off your idea and experience to reviewers.

## Feedbacks for this challenge

If you found any unclear points, questions, or improvements of the challenge while you solve this,  
please contact us with our contact chat or email (sprint@code-check.io).
