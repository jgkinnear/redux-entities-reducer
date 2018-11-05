# Redux Entities Reducer
Redux Entities Reducer provides a toolkit for creating, using and maintaining the client side store of entities.  

Redux Entities Reducer provides:
 - A Reducer which can be used as a central slice in your redux store for entities. 
 - An suite of action creators which provide the ability to update, merge, reset, replace and remove entities.
 - A Controller to easily register and define relationships for entities.
 - An Entity class which provides exposes functions to normalize and denormalize entity data.
 
## Installation
To install the latest, stable version:
```bash
npm install redux-entities-reducer --save
```

```bash
yarn add redux-entities-reducer
```

This assumes you are using NPM or Yarn as your package manager.

## Quick Start


## Getting Started
There are two main classes you can use:
 1. The Reducer - A reducer to manage client side store of entities.
 2. The Controller - A registry for entities, and a suit of methods to assist in using them
 
### The Reducer
The reducer handles 5 actions types
 - MERGE_ENTITIES 
 - UPDATE_ENTITIES 
 - RESET_ENTITIES 
 - REPLACE_ENTITIES 
 - REMOVE_ENTITIES 

The reducer is not concerned with how the entities were generated, so if you choose not to use the Controller, or you 
are already using normalizr, then you can create the reducer and start dispatching your normalized entities via the action
creators

An example of the shape of an action:
```javascript
const mergeAction = {
	type: 'MERGE_ENTITIES',
	entities: entitiesOutputFromNormalizr,
}
```
There is a range of action creators to assist with creating these action objects.
```javascript
import {mergeEntities, updateEntities, resetEntities, replaceEntities, removeEntities} from 'redux-entities-reducer';
```

To create the reducer, you can use the following
```javascript
import {createReducer, createEntityReducer} from 'redux-entities-reducer';
createReducer({
    books: createEntityReducer(['authors']),
    author: customAuthorReducer, 
})
```

#### Entity Reducer
The Entities reducer manages grouping the entities together, however the real work is done in the EntityReducer (singular).
The slice of state the EntitiesReducer manages is as follows:
```json
{
  books: {},
  authors: {},
  users: {},
}
```

Every entity has its own Entity Reducer which handles how that entity is integrated into the store. You can generate a 
reducer by using the `createEntityReducer(relationshipKeys = [])` or create your own reducer, which handles all 5 of the
action types.

If you are using the `EntityController` (see below) you can generate this configuration
```javascript
import {createController, hasMany} from 'redux-entities-reducer';

const Controller = createController();
Controller.register('books', {authors: hasMany('authors')});
Controller.register('authors');

const reducer = Controller.createReducer();

// The above is the same as doing
createReducer({
    books: createEntityReducer(['authors']),
    authors: createEntityReducer(),
})
```

#### Example
```javascript

import {createReducer, mergeEntities} from 'redux-entities-reducer';

// Generate a reducer (With redux combineReducers)
export default combineReducers({
	entities: createReducer({books: createEntityReducer(['authors']), authors: createEntityReducer()}),
	... // Other reducers
});

// Dispatch action to merge entities into the store
dispatch(mergeEntities({
    authors: {
        1: {
            id: 1,
            name: 'Person 1',
            age: 30,
        },
        
    },
    books: {
        1: {
            id: 1,
            title: 'Ready Player One',
            authors: [1],
        }
    }
}));
```

#### Advanced Reducer
For each entity provided, an `EntityReducer` will be used. By default, it will handle the 5 actions.

### The Controller
The controller provides a seamless way of setting up relationships, creating actions and normalizing/denormalizing data. 

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

Controller.normalize('books', data).entities;
Controller.denormalize('books', state.entities);
Controller.denormalize('books', state.entities, [1, 2, 3]);

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