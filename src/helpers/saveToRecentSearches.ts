import { AsyncStorage } from 'react-native';
import LRUCache from '../helpers/LRUCache';

export const saveToRecentSearches = (searchType, searchInput) => (dispatch) => {
    console.log('Saving recent search item');

    dispatch({ type: SAVING_RECENT_SEARCHES });

    const newSearch = { searchType: searchType, searchInput: searchInput };

    AsyncStorage.getItem('recentSearchesCache')
        .then((storageSearches) => {
            if (!storageSearches) {
                storageSearches = new LRUCache();
            } else {
                storageSearches = JSON.parse(storageSearches);
                // give the LRU Cache class it's proto back
                storageSearches.__proto__ = new LRUCache();
            }
            storageSearches.put(newSearch);

            AsyncStorage.setItem(
                'recentSearchesCache',
                JSON.stringify(storageSearches)
            )
                .then((success) => {
                    console.log('Success saving recent search item');
                    dispatch({ type: STOP_SAVING_RECENT_SEARCHES });
                })
                .catch((error) => {
                    console.log('saving recent searches failed: ', error);
                });
        })
        .catch((error) => {
            console.log('SaveToRecentSearches Error: ', error);
            dispatch({ type: STOP_SAVING_RECENT_SEARCHES });
        });
};

export default saveToRecentSearches;
