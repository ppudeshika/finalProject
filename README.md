# db api request template

## Resgister New User to Database
```
POST http://localhost:3000/register

{
  "email": "user@example.com",
  "password": "secretpassword"
}
```

## To authenticate a user with database
```
POST http://localhost:3000/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "secretpassword"
}
```

## Push User Informations to Database

```
POST http://localhost:3000/push
Content-Type: application/json

{
  "email": "user@example.com",
  "job_title": "Senior Developer",
  "skill_level": "Advanced",
  "age": 32,
  "height": 180,
  "weight": 75
}
```

## Grab All user Informations
```
GET http://localhost:3000/users/user@example.com

```
