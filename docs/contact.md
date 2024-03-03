# Contact API Spec

## Create Contact API

Endpoint: POST `/api/contacts`

Headers:

- Authorization: token

Request Body:

```json
{
  "first_name": "Otong",
  "last_name": "Surotong",
  "email": "otong@gmail.com",
  "phone": "081212121212"
}
```

Response Body Success:

```json
{
  "data": {
    "id": 1,
    "first_name": "Otong",
    "last_name": "Surotong",
    "email": "otong@gmail.com",
    "phone": "081212121212"
  }
}
```

Response Body Error:

```json
{
  "errors": "Email is not valid format"
}
```

## Update Contact API

Endpoint: PUT `/api/contacts/:id`

Headers:

- Authorization: token

Request Body:

```json
{
  "data": {
    "id": 1,
    "first_name": "Otong",
    "last_name": "Surotong Baru",
    "email": "otong@gmail.com",
    "phone": "081212121212"
  }
}
```

Response Body Success:

```json
{
  "data": {
    "id": 1,
    "first_name": "Otong",
    "last_name": "Surotong Baru",
    "email": "otong@gmail.com",
    "phone": "081212121212"
  }
}
```

Response Body Error:

```json
{
  "errors": "Email is not valid format"
}
```

## Get Contact API

Endpoint: GET `/api/contacts/:id`

Headers:

- Authorization: token

Response Body Success:

```json
{
  "data": {
    "id": 1,
    "first_name": "Otong",
    "last_name": "Surotong",
    "email": "otong@gmail.com",
    "phone": "081212121212"
  }
}
```

Response Body Error:

```json
{
  "errors": "Contact is not found"
}
```

## Search Contact API

Endpoint: GET `/api/contacts`

Headers:

- Authorization: token

Query Param:

- name : Search by first_name or last_name, using like, optional
- email : Search by email, using like, optional
- phone : Search by phone, using like, optional
- page : number of page, default 1
- size : size per page, default 10

Response Body Success:

```json
{
  "data": [
    {
      "id": 1,
      "first_name": "Otong",
      "last_name": "Surotong",
      "email": "otong@gmail.com",
      "phone": "081212121212"
    },
    {
      "id": 2,
      "first_name": "Ucup",
      "last_name": "Surucup",
      "email": "ucup@gmail.com",
      "phone": "081223232323"
    }
  ],
  "paging": {
    "page": 1,
    "total_page": 3,
    "total_item": 10
  }
}
```

Response Body Error:

## Remove Contact API

Endpoint: DELETE `/api/contacts/:id`

Headers:

- Authorization: token

Response Body Success:

```json
{
  "data": "OK"
}
```

Response Body Error:

```json
{
  "errors": "Contact is not found"
}
```
