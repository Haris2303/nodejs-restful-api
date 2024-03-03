# User API Spec

## Register User API

Endpoint: POST `/api/users`

Request Body :

```json
{
  "username": "yourusername",
  "password": "rahasia",
  "name": "Your Name"
}
```

Response Body Success :

```json
{
  "data": {
    "username": "yourusername",
    "name": "Your Name"
  }
}
```

Response Body Error :

```json
{
  "errors": "Username already registered"
}
```

## Login User API

Endpoint: POST `/api/users/login`

Request Body:

```json
{
  "username": "yourusername",
  "password": "rahasia"
}
```

Response Body Success:

```json
{
  "data": {
    "token": "unique-token"
  }
}
```

Response Body Error:

```json
{
  "errors": "Username or password wrong"
}
```

## Update User API

Endpoint: PATCH `/api/users/current`

Headers:

- Authorization: token

Request Body:

```json
{
  "name": "New Your Name", // Optional
  "password": "New Password" // Optional
}
```

Response Body Success:

```json
{
  "data": {
    "username": "yourname",
    "name": "New Your Name"
  }
}
```

Response Body Error:

```json
{
  "errors": "Name length max 100"
}
```

## Get User API

Endpoint: `GET /api/users/current`

Headers:

- Authorization: token

Response Body Success:

```json
{
  "data": {
    "username": "yourusername",
    "name": "Your Name"
  }
}
```

Response Body Error:

```json
{
  "errors": "Unauthorized"
}
```

## Logout User API

Endpoint: Delete `/api/users/logout`

Headers:

- Authorization: token

Response Body Success :

```json
{
  "data": "OK"
}
```

Response Body Error:

```json
{
  "errors": "Unauthorized"
}
```
