import {createNavigationContainerRef} from '@react-navigation/native';
import {RootStackParamList} from '../routes/types';

export const navigationRef = createNavigationContainerRef<RootStackParamList>();

export function resetToLogin() {
  if (navigationRef.isReady()) {
    navigationRef.resetRoot({index: 0, routes: [{name: 'Login'}]});
  }
}
