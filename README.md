# Talent Share API

This is a NodeJS API developed to provide a backend logic for interacting with a database. It provides the backend logic for an app that serves as a repository of users and their respective talents or skills.

### [Base Url](http://3.93.186.121)

# Usage

## All Auth operations: */auth*

### Sign-up for a user account

PUT:*/signup*

```
{
    email: "string",
    password:"string",   
    name:"string",    
    surname: "string",    
    memberId:"string",
    ward:  "string",    
    stake:  "string",
    age:  "string",
    whatsApp: "string"
}
```
Expected result - status:201

```
    {
        message:'User Created successfully!', 
        userId:userId
    }
```

### Login to existing account

POST:*/login*
```
{

    email: "string",
    password: "string"
    
}
```
Expected result - status:200
```
    {
        token:token,
        user:user
    }
```

## All Users operations: */users*

### Fetch all users

GET:*/*
```
{ 

}
```
Expected result: status:200
```
    {
        message:"Users retrieved!",
        users:users
    }
```

### Fetch user by id

GET:*/:userId*
```
{ 

}
```
Expected result - status:200
```
    {
        message:"User retrieved successfully!",
        user: user
    }
```

### Udate user details: *auth-token required*

PUT:*/:userId*
```
{ 

    email: "string",
    name:"string",    
    surname: "string",
    memberId:"string",
    ward:  "string",
    stake:  "string",
    age:  "string",
    whatsApp: "string"
    
}
```
Expected result - status:201
```
    {
        message:'User updated successfully!',
        user: updatedUser
    }
```

### Approve user: *auth-token required*

PATCH:*/:userId*
```
{ 

    approved: boolean
    
}
```
Expected result - status:201
```
    {
        message:'User approveded!',
        user: updatedUser
    }
```

### Change user admin: *auth-token required*

PATCH:*/admin/:userId*
```
{ 

    admin: boolean
    
}
```
Expected result - status:201
```
    {
        message:'User admin update!',
        user: updatedUser
    }
```


### Delete user: *auth-token required*

DELETE:*/:userId*
```
{ 
    
}
```
Expected result - status:200
```
    {
        message:'User deleted successfully',
        result: result
    }
```

### User Model:
```
{

    email: string,
    password: string,   
    name: string,     
    surname: string,
    memberId: string,
    ward: string,
    stake: string,
    age: string,    
    whatsApp: string
        
}
```

## All talent operations: */talent*

### Create talent. *Requirements {admin = true & auth-token}*

POST:*/*
```
{

    title: "string"
    
}
```
Expected result - status:201
```
    {
    
        message:'Talent created successfully!',
        Talent: Talent,
        result: result 
        
    }
```

### Fetch all talents

GET:*/*
```
{ 

}
```
Expected result - status:200
```
    {
        message: 'Fetched talents successfully', 
        Talents:talents
    }
```

### Fetch single talent

GET:*/:talentId*
```
{ 

}
```
Expected result - status:200
```
    {
        Talent: talent
    }
```

### Update a talent. *Requirements {admin = true & auth-token}*

PUT:*/:talentId*
```
{
    title: "string"
}
```
Expected result - status:201
```
    {
        massage:"Talent updated successfully", 
        talent:result
    }
```

### Add talent to user. *Auth-token*

PUT:*/:talentId*
```
{

}
```

Expected result - status:201
```
    {
        message:'Talent added successfully!',
        Talent: talent,
        result: result
    }
```

### Remove talent from user. *Auth-token*

PATCH:*/:talentId*
```
{

}
```

Expected result - status:201
```
    {
        message:'Talent removed successfully!',
        result: result
    }
```

### Delete talent. *Requirements {admin = true & auth-token}*

DELETE:*/:talentId*
```
{

}
```

Expected result - status:201
```
    {
        message:'Talent deleted successfully!',
        result: result
    }
```

### Talent Model:
```
{

    title: string

}
```
