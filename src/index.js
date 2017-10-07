import EntitiesReducer from './EntitiesReducer';
import EntityReducer from './EntityReducer';
import {updateEntities, mergeEntities, replaceEntities} from './EntityActions';
import {MERGE_ENTITIES, UPDATE_ENTITIES, REPLACE_ENTITIES, REMOVE_ENTITIES, RESET_ENTITIES} from './EntitiesActionTypes';
export {
	EntityReducer,
	EntitiesReducer,
	updateEntities, mergeEntities, replaceEntities,
	MERGE_ENTITIES, UPDATE_ENTITIES, REPLACE_ENTITIES, REMOVE_ENTITIES, RESET_ENTITIES,
};