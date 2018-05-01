# Redux Entities Reducer
Redux Entities Reducer provides a toolkit for creating, using and maintaining the client side store of entities. 

It is simply a collection of popular libraries with a light layer of abstraction to allow ease of use. 

Redux Entities Reducer provides:
 - A Reducer which can be used as a central store for entities. 
 - An actions creators which can update, merge, reset, replace and delete entities.
 - A Controller to easily register and define relationships for entities.
 - Helper methods to normalize and denormalize entities.
 
## Installation
To install the latest, stable version:
```bash
npm install redux-entities-reducer --save
```

```bash
yarn add redux-entities-reducer
```

This assumes you are using NPM or Yarn as your package manager.

## Getting Started
There are two main classes you can use:
 1. The Reducer - A reducer to manage client side store of entities.
 2. The Controller - A registry for entities, and a suit of methods to assist in using them
 
### The Reducer
The reducer handles the 5 main actions types
 - MERGE_ENTITIES 
 - UPDATE_ENTITIES 
 - RESET_ENTITIES 
 - REPLACE_ENTITIES 
 - REMOVE_ENTITIES 

It is not concerned with how they were created, so if you don't opt into the Controller, or you are already using normalizr, then you can create the reducer and start using the action creators.

The shape of an action is:
```javascript
const mergeAction = {
	type: 'MERGE_ENTITIES',
	entities: entitiesOutputFromNormalizr,
}
```
There is a range of action creators to assist with creating these action objects
```javascript
import {mergeEntities, updateEntities, resetEntities, replaceEntities, removeEntities} from 'redux-entities-reducer';
```
#### Example
```javascript

import {createReducer, mergeEntities} from 'redux-entities-reducer';

// Generate a reducer (With redux combineReducers)
export default combineReducers({
	entities: createReducer({users: {}, books: {}}),
	... // Other reducers
});

// Dispatch action to merge entities into the store
dispatch(mergeEntities({
    users: {
        1: {
            id: 1,
            name: 'Person 1',
            age: 30,
            books: [1]
        },
        
    },
    books: {
        1: {
            id: 1,
            title: 'Ready Player One'
        }
    }
}));
```

#### Data with Relationships
You must tell the reducer which entities there are, as well as what keys map to other entities:
```javascript
import {createReducer, createEntityReducer} from 'redux-entities-reducer';

// createReducer(reducers, defaultReducerCreator);

createReducer({
    books: createEntityReducer(),
    authors: null, // Use the default
});

// If you are using the controller, you can generate the reducers for each entity registered
createReducer(Controller.allReducers());

```


#### Advanced Reducer
For each entity provided, an `EntityReducer` will be used. By default, it will handle the 5 actions.

### The Controller
The controller provides a seamless way of setting up relationships, creating actions and normalizing/denormalizin data. 

For each entity, it simply provides various methods to assist in interacting with entities.
#### Creating the Entities Controller
```javascript
import {createController} from 'redux-entities-reducers';

// Create a controller for your entities
const Controller = createController();
```
#### Define and Register Entities
```javascript
// Register Entities
Controller.register('books', {
	authors: hasMany('authors'),
	publisher: hasOne('publishers'),
});

Controller.register('publishers');

Controller.register('authors');

// Initialize the controller
Controller.init();
```

#### Usage
```javascript

// Get the entity
const books = Controller.getEntity('books');

// Normalize and Denormalize
books.normalize(apiData);
books.denormalize(apiData);

// Normalize data, then create an action to merge
books.merge(denormalizedData);
```

### Advanced Controller

#### register [key, relations = {}, options = {}]
This API is very similar to normalizr's, the main difference is that with relations, you don't have to create the schemas, you simply provide the type of relationship

The Controller will then create `Entity` instances which is then used to apply the various methods to data.

You can provide `register` with your own `Entity` Class, where you can override how some of the actions behave

```javascript
import {Entity} from 'redux-entities-reducer';
class Book extends Entity {
	key = 'books';
	relationships = {
		authors: hasMany('authors'),
        publisher: hasOne('publishers'),
	};
	
	merge = () => {
		// Custom processing
		return data;
	}
}

Controller.register(Book);
```